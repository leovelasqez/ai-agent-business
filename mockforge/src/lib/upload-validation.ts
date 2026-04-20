const ALLOWED_UPLOAD_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MIN_FILE_SIZE_BYTES = 1024;
const MAX_UPLOAD_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const MAGIC_SIGNATURES: Record<string, Array<{ offset: number; bytes: number[] }>> = {
  "image/jpeg": [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }],
  "image/png": [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47] }],
  "image/webp": [
    { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }],
};

MAGIC_SIGNATURES["image/webp"].push({ offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] });

function validateMagicBytes(buffer: Uint8Array, mimeType: string): boolean {
  const sigs = MAGIC_SIGNATURES[mimeType];
  if (!sigs) return false;

  return sigs.every(({ offset, bytes }) =>
    bytes.every((byte, index) => buffer[offset + index] === byte),
  );
}

export async function validateUploadedImage(file: File): Promise<Uint8Array> {
  if (!ALLOWED_UPLOAD_MIME_TYPES.has(file.type)) {
    throw new Error("Unsupported image format. Use JPG, PNG, or WEBP.");
  }

  if (file.size < MIN_FILE_SIZE_BYTES) {
    throw new Error(
      "The image looks invalid or too small. Please upload a real JPG, PNG, or WEBP image.",
    );
  }

  if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
    throw new Error("File exceeds the 10 MB limit. Please compress or resize the image.");
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  if (!validateMagicBytes(buffer, file.type)) {
    throw new Error("File content does not match the declared image type.");
  }

  return buffer;
}

export function isAllowedUploadMimeType(value: string): boolean {
  return ALLOWED_UPLOAD_MIME_TYPES.has(value);
}
