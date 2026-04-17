import { mkdir, writeFile, readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

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

export async function downloadImageToLocal(url: string, fileNamePrefix = "generated") {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download generated image: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/jpeg";
  const extension = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";

  return saveBufferToLocal(Buffer.from(arrayBuffer), `${fileNamePrefix}.${extension}`);
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
