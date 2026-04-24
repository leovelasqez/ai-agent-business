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
  fetchValidatedRemoteAsset,
} from "@/lib/file-storage";
import { incrementMetric } from "@/lib/metrics";
import { getSupabaseServiceClient } from "@/lib/supabase";

// ---- Bucket names ----

export const STORAGE_BUCKETS = {
  inputs: "mockforge-inputs",
  outputs: "mockforge-outputs",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];
export type StorageBackend = "local" | "supabase" | "cdn";

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

/**
 * Returns true when Bunny CDN storage is selected and fully configured.
 * Required env vars: BUNNY_STORAGE_API_KEY, BUNNY_STORAGE_ZONE, BUNNY_CDN_URL
 */
export function isCdnStorageReady(): boolean {
  return (
    process.env.STORAGE_PROVIDER === "cdn" &&
    Boolean(process.env.BUNNY_STORAGE_API_KEY) &&
    Boolean(process.env.BUNNY_STORAGE_ZONE) &&
    Boolean(process.env.BUNNY_CDN_URL)
  );
}

export function getStorageBackend(): StorageBackend {
  if (isCdnStorageReady()) return "cdn";
  if (isSupabaseStorageReady()) return "supabase";
  return "local";
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
  if (ext === "mp4") return "video/mp4";
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
  const { buffer, contentType } = await fetchValidatedRemoteAsset(url);
  const extension = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : contentType.includes("mp4")
        ? "mp4"
      : "jpg";

  return supabaseSaveBuffer(buffer, `${prefix}.${extension}`, STORAGE_BUCKETS.outputs);
}

// ---- Bunny CDN backend ----

function bunnyStoragePath(prefix: string, extension: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `mockforge/${date}/${Date.now()}-${prefix.replace(/[^a-zA-Z0-9.-]/g, "-")}.${extension}`;
}

async function bunnySaveBuffer(
  buffer: Buffer,
  prefix: string,
  extension: string,
): Promise<StorageSaveResult> {
  const apiKey = process.env.BUNNY_STORAGE_API_KEY!;
  const zone = process.env.BUNNY_STORAGE_ZONE!;
  const cdnBase = process.env.BUNNY_CDN_URL!.replace(/\/$/, "");

  const storagePath = bunnyStoragePath(prefix, extension);
  const uploadUrl = `https://storage.bunnycdn.com/${zone}/${storagePath}`;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      AccessKey: apiKey,
      "Content-Type": "application/octet-stream",
    },
    body: buffer as unknown as BodyInit,
  });

  if (!response.ok) {
    throw new Error(`Bunny CDN upload failed: ${response.status} ${response.statusText}`);
  }

  const publicPath = `${cdnBase}/${storagePath}`;
  return { fileName: storagePath, publicPath, backend: "cdn" };
}

async function bunnySaveUpload(file: File): Promise<StorageSaveResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  return bunnySaveBuffer(buffer, `input-${file.name}`, ext);
}

async function bunnySaveBase64(dataUrlOrBase64: string, prefix: string): Promise<StorageSaveResult> {
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

  return bunnySaveBuffer(buffer, prefix, extension);
}

async function bunnyDownloadAndSave(url: string, prefix: string): Promise<StorageSaveResult> {
  const { buffer, contentType } = await fetchValidatedRemoteAsset(url);
  const extension = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : contentType.includes("mp4")
        ? "mp4"
        : "jpg";
  return bunnySaveBuffer(buffer, prefix, extension);
}

// ---- Routing with local fallback ----

async function withLocalFallback<T extends StorageSaveResult>(
  remoteFn: () => Promise<T>,
  localFn: () => Promise<T>,
  label: string,
): Promise<T> {
  if (!isCdnStorageReady() && !isSupabaseStorageReady()) return localFn();

  try {
    return await remoteFn();
  } catch (err) {
    incrementMetric("storageFallbackToLocal");
    console.warn(
      `[storage] Remote ${label} failed, falling back to local:`,
      err instanceof Error ? err.message : err,
    );
    return localFn();
  }
}

// ---- Cleanup helpers ----

interface StorageListEntry {
  name: string;
  id?: string | null;
  metadata?: { size?: number } | null;
}

async function listSupabasePaths(bucket: StorageBucket, prefix = ""): Promise<string[]> {
  const supabase = getSupabaseServiceClient();
  const paths: string[] = [];
  const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });

  if (error) {
    throw new Error(`Supabase Storage list failed (${bucket}/${prefix}): ${error.message}`);
  }

  for (const entry of (data ?? []) as StorageListEntry[]) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    const looksLikeFolder = !entry.id && !entry.metadata?.size;

    if (looksLikeFolder) {
      paths.push(...await listSupabasePaths(bucket, path));
    } else {
      paths.push(path);
    }
  }

  return paths;
}

function isDatedStoragePathOlderThan(path: string, cutoffMs: number): boolean {
  const match = path.match(/^(\d{4}-\d{2}-\d{2})\//);
  if (!match) return false;
  return new Date(`${match[1]}T00:00:00.000Z`).getTime() < cutoffMs;
}

/** Delete dated Supabase Storage objects older than maxAgeMs from both MockForge buckets. */
export async function cleanOldSupabaseStorageObjects(maxAgeMs: number): Promise<number> {
  if (!isSupabaseStorageReady()) return 0;

  const cutoffMs = Date.now() - maxAgeMs;
  let deleted = 0;

  for (const bucket of Object.values(STORAGE_BUCKETS)) {
    const paths = (await listSupabasePaths(bucket)).filter((path) =>
      isDatedStoragePathOlderThan(path, cutoffMs),
    );

    for (let i = 0; i < paths.length; i += 100) {
      const batch = paths.slice(i, i + 100);
      if (batch.length === 0) continue;
      const { error } = await getSupabaseServiceClient().storage.from(bucket).remove(batch);
      if (error) {
        throw new Error(`Supabase Storage delete failed (${bucket}): ${error.message}`);
      }
      deleted += batch.length;
    }
  }

  return deleted;
}

// ---- Public API ----

/** Save a user-uploaded source image. */
export async function saveInputUpload(file: File): Promise<StorageSaveResult> {
  const remoteFn = isCdnStorageReady()
    ? () => bunnySaveUpload(file)
    : () => supabaseSaveUpload(file);
  return withLocalFallback(remoteFn, () => localSaveUpload(file), "saveInputUpload");
}

/** Save a raw buffer as a generated output image. */
export async function saveOutputBuffer(buffer: Buffer, fileName: string): Promise<StorageSaveResult> {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const remoteFn = isCdnStorageReady()
    ? () => bunnySaveBuffer(buffer, fileName, ext)
    : () => supabaseSaveBuffer(buffer, fileName, STORAGE_BUCKETS.outputs);
  return withLocalFallback(remoteFn, () => localSaveBuffer(buffer, fileName), "saveOutputBuffer");
}

/** Save a base64 or data-URL image as a generated output. */
export async function saveOutputBase64(
  dataUrlOrBase64: string,
  prefix = "generated",
): Promise<StorageSaveResult> {
  const remoteFn = isCdnStorageReady()
    ? () => bunnySaveBase64(dataUrlOrBase64, prefix)
    : () => supabaseSaveBase64(dataUrlOrBase64, prefix);
  return withLocalFallback(remoteFn, () => localSaveBase64(dataUrlOrBase64, prefix), "saveOutputBase64");
}

/** Download a remote URL and save it as a generated output. */
export async function downloadAndSaveOutput(
  url: string,
  prefix = "generated",
): Promise<StorageSaveResult> {
  const remoteFn = isCdnStorageReady()
    ? () => bunnyDownloadAndSave(url, prefix)
    : () => supabaseDownloadAndSave(url, prefix);
  return withLocalFallback(remoteFn, () => localDownloadAndSave(url, prefix), "downloadAndSaveOutput");
}
