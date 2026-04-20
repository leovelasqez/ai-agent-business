import { NextResponse } from "next/server";
import { saveInputUpload } from "@/lib/storage-provider";
import { runGeneration } from "@/lib/image-provider";
import type { PresetId } from "@/lib/presets";
import { validateUploadedImage } from "@/lib/upload-validation";

export async function POST(request: Request) {
  const debugSecret = process.env.DEBUG_UPLOAD_SECRET;
  if (process.env.NODE_ENV === "production" || debugSecret) {
    const provided = request.headers.get("x-debug-upload-secret") ?? "";
    if (!debugSecret || provided !== debugSecret) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
  }

  try {
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > 12 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "FILE_TOO_LARGE", message: "Payload too large" }, { status: 413 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ ok: false, error: "FILE_MISSING", message: "No file uploaded" }, { status: 400 });
    }

    const buffer = await validateUploadedImage(file);
    const saved = await saveInputUpload(new File([Buffer.from(buffer)], file.name, { type: file.type }));
    const preset = (String(formData.get("preset") || "clean_studio")) as PresetId;
    const category = String(formData.get("category") || "unspecified");
    const format = String(formData.get("format") || "1:1 square");
    const productName = String(formData.get("productName") || "Untitled product");

    const result = await runGeneration({
      preset,
      category,
      format,
      productName,
      sourceImageUrl: saved.publicPath,
    });

    return NextResponse.json({
      ok: true,
      upload: {
        fileName: saved.fileName,
        sourceImageUrl: saved.publicPath,
      },
      generation: {
        provider: result.provider,
        model: result.model,
        previewUrls: result.previewUrls,
        prompt: result.prompt,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown debug upload error";

    return NextResponse.json({ ok: false, error: "DEBUG_UPLOAD_FAILED", message }, { status: 500 });
  }
}
