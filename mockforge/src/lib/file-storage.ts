import { mkdir, writeFile } from "node:fs/promises";
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
    publicPath: `/uploads/${safeName}`,
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
