import { NextResponse } from "next/server";
import { saveInputUpload } from "@/lib/storage-provider";
import { checkRateLimit } from "@/lib/rate-limiter";
import { getTrustedSessionIdFromRequest } from "@/lib/session";
import { validateUploadedImage } from "@/lib/upload-validation";

const MAX_MULTIPART_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_MULTIPART_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        error: "FILE_TOO_LARGE",
        message: "File exceeds the 10 MB limit. Please compress or resize the image.",
      },
      { status: 413 },
    );
  }

  const sessionId = getTrustedSessionIdFromRequest(request);
  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: "SESSION_REQUIRED", message: "A trusted session is required." },
      { status: 401 },
    );
  }
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

    const buffer = await validateUploadedImage(file);

    const saved = await saveInputUpload(new File([Buffer.from(buffer)], file.name, { type: file.type }));

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
    const status =
      message.includes("Unsupported image format") ||
      message.includes("too small") ||
      message.includes("does not match")
        ? 400
        : message.includes("10 MB limit")
          ? 413
          : 500;

    return NextResponse.json(
      {
        ok: false,
        error: "UPLOAD_FAILED",
        message,
      },
      { status },
    );
  }
}
