/**
 * Storage abstraction for MockForge.
 *
 * STORAGE_PROVIDER=local (default) — local filesystem via file-storage.ts
 * STORAGE_PROVIDER=supabase       — Supabase Storage (requires SUPABASE env vars)
 *
 * Fallback: if STORAGE_PROVIDER=supabase but env vars are absent, or if a
 * Supabase call fails at runtime, the operation falls back to local automatically.
 *
 * Bucket names (create these in Supabase dashboard or via CLI):
 *   mockforge-inputs  — user-uploaded source images (public)
 *   mockforge-outputs — AI-generated output images  (public)
 */

import {
  saveUploadToLocal,
  saveBufferToLocal,
  saveBase64ImageToLocal,
  downloadImageToLocal,
} from "@/lib/file-storage";
import { getSupabaseServiceClient } from "@/lib/supabase";

// ---- Bucket names ----

export const STORAGE_BUCKETS = {
  inputs: "mockforge-inputs",
  outputs: "mockforge-outputs",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];
export type StorageBackend = "local" | "supabase";

export interface StorageSaveResult {
  fileName: string;
  /** Public URL or app-relative path — use directly in <img> or API responses */
  publicPath: string;
  backend: StorageBackend;
}

/**
 * Returns true when Supabase Storage is both selected and fully configured.
 * Falls back to local if env vars are missing even when STORAGE_PROVIDER=supabase.
 */
export function isSupabaseStorageReady(): boolean {
  return (
    process.env.STORAGE_PROVIDER === "supabase" &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

export function getStorageBackend(): StorageBackend {
  return isSupabaseStorageReady() ? "supabase" : "local";
}

// ---- Local backend (thin wrappers around file-storage.ts) ----

async function localSaveUpload(file: File): Promise<StorageSaveResult> {
  const r = await saveUploadToLocal(file);
  return { fileName: r.fileName, publicPath: r.publicPath, backend: "local" };
}

async function localSaveBuffer(buffer: Buffer, fileName: string): Promise<StorageSaveResult> {
  const r = await saveBufferToLocal(buffer, fileName);
  return { fileName: r.fileName, publicPath: r.publicPath, backend: "local" };
}

async function localSaveBase64(dataUrlOrBase64: string, prefix: string): Promise<StorageSaveResult> {
  const r = await saveBase64ImageToLocal(dataUrlOrBase64, prefix);
  return { fileName: r.fileName, publicPath: r.publicPath, backend: "local" };
}

async function localDownloadAndSave(url: string, prefix: string): Promise<StorageSaveResult> {
  const r = await downloadImageToLocal(url, prefix);
  return { fileName: r.fileName, publicPath: r.publicPath, backend: "local" };
}

// ---- Supabase Storage backend ----

function buildStoragePath(rawName: string): string {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const safeName = rawName.replace(/[^a-zA-Z0-9.-]/g, "-");
  return `${date}/${Date.now()}-${safeName}`;
}

function extensionToMime(ext: string): string {
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

async function supabaseSaveBuffer(
  buffer: Buffer,
  rawName: string,
  bucket: StorageBucket,
): Promise<StorageSaveResult> {
  const supabase = getSupabaseServiceClient();
  const storagePath = buildStoragePath(rawName);
  const ext = rawName.split(".").pop()?.toLowerCase() ?? "jpg";
  const contentType = extensionToMime(ext);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, { contentType, upsert: false });

  if (error) {
    throw new Error(`Supabase Storage upload failed (${bucket}/${storagePath}): ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return { fileName: storagePath, publicPath: data.publicUrl, backend: "supabase" };
}

async function supabaseSaveUpload(file: File): Promise<StorageSaveResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return supabaseSaveBuffer(buffer, file.name, STORAGE_BUCKETS.inputs);
}

async function supabaseSaveBase64(
  dataUrlOrBase64: string,
  prefix: string,
): Promise<StorageSaveResult> {
  const match = dataUrlOrBase64.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/i);
  let buffer: Buffer;
  let extension = "jpg";

  if (match) {
    const mimeType = match[1].toLowerCase();
    extension = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
    buffer = Buffer.from(match[3], "base64");
  } else {
    buffer = Buffer.from(dataUrlOrBase64, "base64");
  }

  return supabaseSaveBuffer(buffer, `${prefix}.${extension}`, STORAGE_BUCKETS.outputs);
}

async function supabaseDownloadAndSave(url: string, prefix: string): Promise<StorageSaveResult> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to download image for Supabase upload: ${response.status} ${response.statusText}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const extension = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : "jpg";

  return supabaseSaveBuffer(Buffer.from(arrayBuffer), `${prefix}.${extension}`, STORAGE_BUCKETS.outputs);
}

// ---- Routing with local fallback ----

async function withLocalFallback<T extends StorageSaveResult>(
  supabaseFn: () => Promise<T>,
  localFn: () => Promise<T>,
  label: string,
): Promise<T> {
  if (!isSupabaseStorageReady()) return localFn();

  try {
    return await supabaseFn();
  } catch (err) {
    console.warn(
      `[storage] Supabase ${label} failed, falling back to local:`,
      err instanceof Error ? err.message : err,
    );
    return localFn();
  }
}

// ---- Public API ----

/** Save a user-uploaded source image. */
export async function saveInputUpload(file: File): Promise<StorageSaveResult> {
  return withLocalFallback(
    () => supabaseSaveUpload(file),
    () => localSaveUpload(file),
    "saveInputUpload",
  );
}

/** Save a raw buffer as a generated output image. */
export async function saveOutputBuffer(buffer: Buffer, fileName: string): Promise<StorageSaveResult> {
  return withLocalFallback(
    () => supabaseSaveBuffer(buffer, fileName, STORAGE_BUCKETS.outputs),
    () => localSaveBuffer(buffer, fileName),
    "saveOutputBuffer",
  );
}

/** Save a base64 or data-URL image as a generated output. */
export async function saveOutputBase64(
  dataUrlOrBase64: string,
  prefix = "generated",
): Promise<StorageSaveResult> {
  return withLocalFallback(
    () => supabaseSaveBase64(dataUrlOrBase64, prefix),
    () => localSaveBase64(dataUrlOrBase64, prefix),
    "saveOutputBase64",
  );
}

/** Download a remote URL and save it as a generated output. */
export async function downloadAndSaveOutput(
  url: string,
  prefix = "generated",
): Promise<StorageSaveResult> {
  return withLocalFallback(
    () => supabaseDownloadAndSave(url, prefix),
    () => localDownloadAndSave(url, prefix),
    "downloadAndSaveOutput",
  );
}
