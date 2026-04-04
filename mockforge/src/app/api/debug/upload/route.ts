import { NextResponse } from "next/server";
import { saveUploadToLocal } from "@/lib/file-storage";
import { runGeneration } from "@/lib/image-provider";
import type { PresetId } from "@/lib/presets";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ ok: false, error: "FILE_MISSING", message: "No file uploaded" }, { status: 400 });
    }

    const saved = await saveUploadToLocal(file);
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
