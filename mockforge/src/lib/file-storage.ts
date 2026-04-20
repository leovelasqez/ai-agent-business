import { lookup } from "node:dns/promises";
import { mkdir, writeFile, readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";

const uploadsDir = path.join(process.cwd(), "public", "uploads");
const MAX_REMOTE_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_REMOTE_VIDEO_BYTES = 100 * 1024 * 1024;

function buildSafeName(fileName: string) {
  return `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
}

async function ensureUploadsDir() {
  await mkdir(uploadsDir, { recursive: true });
}

export async function saveBufferToLocal(buffer: Buffer, fileName: string) {
  const safeName = buildSafeName(fileName);

  await ensureUploadsDir();

  const absolutePath = path.join(uploadsDir, safeName);
  await writeFile(absolutePath, buffer);

  return {
    fileName: safeName,
    absolutePath,
    publicPath: `/api/uploads/${safeName}`,
  };
}

export async function saveUploadToLocal(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  return saveBufferToLocal(bytes, file.name);
}

export async function saveBase64ImageToLocal(dataUrlOrBase64: string, fileNamePrefix = "generated") {
  const match = dataUrlOrBase64.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/i);

  if (match) {
    const mimeType = match[1].toLowerCase();
    const extension = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
    const buffer = Buffer.from(match[3], "base64");
    return saveBufferToLocal(buffer, `${fileNamePrefix}.${extension}`);
  }

  const buffer = Buffer.from(dataUrlOrBase64, "base64");
  return saveBufferToLocal(buffer, `${fileNamePrefix}.jpg`);
}

function isPrivateIPv4(ip: string): boolean {
  const octets = ip.split(".").map((value) => Number(value));
  if (octets.length !== 4 || octets.some(Number.isNaN)) return false;
  if (octets[0] === 10 || octets[0] === 127) return true;
  if (octets[0] === 169 && octets[1] === 254) return true;
  if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;
  if (octets[0] === 192 && octets[1] === 168) return true;
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  return (
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:")
  );
}

async function assertSafeRemoteHost(hostname: string): Promise<void> {
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    throw new Error("Refusing to fetch from localhost.");
  }

  const resolved = await lookup(hostname, { all: true });
  for (const entry of resolved) {
    if (
      (entry.family === 4 && isPrivateIPv4(entry.address)) ||
      (entry.family === 6 && isPrivateIPv6(entry.address))
    ) {
      throw new Error("Refusing to fetch from a private network address.");
    }
  }
}

function extensionFromContentType(contentType: string): string {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("mp4")) return "mp4";
  return "jpg";
}

async function readResponseBufferWithLimit(response: Response, maxBytes: number): Promise<Buffer> {
  const reader = response.body?.getReader();
  if (!reader) {
    return Buffer.from(await response.arrayBuffer());
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      throw new Error(`Remote file exceeds the ${Math.floor(maxBytes / (1024 * 1024))} MB limit.`);
    }
    chunks.push(value);
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

export async function fetchValidatedRemoteAsset(
  inputUrl: string,
  maxRedirects = 2,
): Promise<{ buffer: Buffer; contentType: string }> {
  const parsedUrl = new URL(inputUrl);
  if (parsedUrl.protocol !== "https:") {
    throw new Error("Only HTTPS remote assets are allowed.");
  }
  if (parsedUrl.username || parsedUrl.password) {
    throw new Error("Refusing credentialed remote URLs.");
  }

  await assertSafeRemoteHost(parsedUrl.hostname);

  const response = await fetch(parsedUrl, {
    redirect: "manual",
    headers: { Accept: "image/*,video/*" },
  });

  if (!response.ok) {
    if (
      response.status >= 300 &&
      response.status < 400 &&
      response.headers.get("location") &&
      maxRedirects > 0
    ) {
      const redirectUrl = new URL(response.headers.get("location")!, parsedUrl).toString();
      return fetchValidatedRemoteAsset(redirectUrl, maxRedirects - 1);
    }
    throw new Error(`Failed to download generated image: ${response.status} ${response.statusText}`);
  }

  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  if (!contentType.startsWith("image/") && !contentType.startsWith("video/")) {
    throw new Error(`Unsupported remote content-type: ${contentType || "unknown"}`);
  }

  const contentLength = Number(response.headers.get("content-length") || "0");
  const maxBytes = contentType.startsWith("video/") ? MAX_REMOTE_VIDEO_BYTES : MAX_REMOTE_IMAGE_BYTES;
  if (contentLength > maxBytes) {
    throw new Error(`Remote file exceeds the ${Math.floor(maxBytes / (1024 * 1024))} MB limit.`);
  }

  const buffer = await readResponseBufferWithLimit(response, maxBytes);
  return { buffer, contentType };
}

export async function downloadImageToLocal(url: string, fileNamePrefix = "generated") {
  const { buffer, contentType } = await fetchValidatedRemoteAsset(url);
  const extension = extensionFromContentType(contentType);
  return saveBufferToLocal(buffer, `${fileNamePrefix}.${extension}`);
}

/**
 * Delete files in public/uploads/ that are older than maxAgeMs milliseconds.
 * Returns the number of files deleted.
 */
export async function cleanOldUploads(maxAgeMs: number): Promise<number> {
  await ensureUploadsDir();

  const entries = await readdir(uploadsDir);
  const cutoff = Date.now() - maxAgeMs;
  let deleted = 0;

  for (const name of entries) {
    const filePath = path.join(uploadsDir, name);
    try {
      const info = await stat(filePath);
      if (info.isFile() && info.mtimeMs < cutoff) {
        await unlink(filePath);
        deleted++;
      }
    } catch {
      // Skip files that disappeared between readdir and stat
    }
  }

  return deleted;
}
