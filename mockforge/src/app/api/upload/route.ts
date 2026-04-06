import { NextResponse } from "next/server";
import { saveInputUpload } from "@/lib/storage-provider";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MIN_FILE_SIZE_BYTES = 1024;

export async function POST(request: Request) {
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

    const saved = await saveInputUpload(file);

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
