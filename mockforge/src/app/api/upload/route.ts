import { NextResponse } from "next/server";
import { saveInputUpload } from "@/lib/storage-provider";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MIN_FILE_SIZE_BYTES = 1024;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// Magic byte signatures for each allowed MIME type
const MAGIC_SIGNATURES: Record<string, Array<{ offset: number; bytes: number[] }>> = {
  "image/jpeg": [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }],
  "image/png":  [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47] }],
  "image/webp": [
    { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF
    { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }, // WEBP
  ],
};

function validateMagicBytes(buffer: Uint8Array, mimeType: string): boolean {
  const sigs = MAGIC_SIGNATURES[mimeType];
  if (!sigs) return false;
  return sigs.every(({ offset, bytes }) =>
    bytes.every((b, i) => buffer[offset + i] === b),
  );
}

export async function POST(request: Request) {
  const sessionId =
    request.headers.get("cookie")?.match(/mf_session=([^;]+)/)?.[1] ?? getClientIp(request);
  const rl = checkRateLimit(`upload:${sessionId}`, 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMITED", message: "Too many uploads. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          ok: false,
          error: "FILE_MISSING",
          message: "Upload requires a file field.",
        },
        { status: 400 },
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          ok: false,
          error: "UNSUPPORTED_FILE_TYPE",
          message: "Unsupported image format. Use JPG, PNG, or WEBP.",
        },
        { status: 400 },
      );
    }

    if (file.size < MIN_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "FILE_TOO_SMALL",
          message: "The image looks invalid or too small. Please upload a real JPG, PNG, or WEBP image.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "FILE_TOO_LARGE",
          message: "File exceeds the 10 MB limit. Please compress or resize the image.",
        },
        { status: 413 },
      );
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    if (!validateMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        {
          ok: false,
          error: "INVALID_FILE_CONTENT",
          message: "File content does not match the declared image type.",
        },
        { status: 400 },
      );
    }

    const saved = await saveInputUpload(new File([buffer], file.name, { type: file.type }));

    return NextResponse.json({
      ok: true,
      message: "File uploaded locally",
      data: {
        uploadId: saved.fileName,
        sourceImageUrl: saved.publicPath,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown upload error";

    return NextResponse.json(
      {
        ok: false,
        error: "UPLOAD_FAILED",
        message,
      },
      { status: 500 },
    );
  }
}
