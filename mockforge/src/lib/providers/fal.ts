import { readFile } from "node:fs/promises";
import path from "node:path";
import { fal } from "@fal-ai/client";
import { downloadAndSaveOutput, saveOutputBase64 } from "@/lib/storage-provider";
import { buildPrompt } from "@/lib/prompt-builder";
import {
  MODEL_A,
  MODEL_B,
  MODEL_C,
  CURATED_MODELS,
  mapFormatToFlux2ProImageSize,
  mapFormatToGptImageSize,
  mapFormatToNanoBananaAspectRatio,
} from "@/lib/model-config";
import type { RunGenerationInput, RunGenerationResult } from "@/lib/image-provider";

interface FalImageOutput {
  url?: string;
  b64_json?: string;
  width?: number;
  height?: number;
  content_type?: string;
}

interface FalGenerationOutput {
  images?: FalImageOutput[];
  prompt?: string;
}

function getFalKey() {
  const key = process.env.FAL_KEY;

  if (!key) {
    throw new Error("FAL_KEY is not configured");
  }

  return key;
}

async function resolveFalImageUrl(sourceImageUrl?: string) {
  if (!sourceImageUrl) return undefined;

  if (sourceImageUrl.startsWith("http://") || sourceImageUrl.startsWith("https://")) {
    return sourceImageUrl;
  }

  if (sourceImageUrl.startsWith("/api/uploads/")) {
    const fileName = sourceImageUrl.replace(/^\/api\/uploads\//, "");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const absolutePath = path.join(uploadsDir, fileName);

    if (!absolutePath.startsWith(uploadsDir + path.sep) && absolutePath !== uploadsDir) {
      throw new Error("Invalid image path: path traversal detected");
    }

    const buffer = await readFile(absolutePath);
    const extension = path.extname(fileName).toLowerCase();
    const mimeType = extension === ".png" ? "image/png" : extension === ".webp" ? "image/webp" : "image/jpeg";
    const file = new File([buffer], fileName, { type: mimeType });

    return await fal.storage.upload(file);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is required to send uploaded images to fal");
  }

  return new URL(sourceImageUrl, baseUrl).toString();
}

function resolveVariantModel(variant: "a" | "b" | "c" | "d", customModel?: string): string {
  if (variant === "d") {
    if (customModel) return customModel;
    return MODEL_A;
  }
  if (variant === "b") return MODEL_B;
  if (variant === "c") return MODEL_C;
  return MODEL_A;
}

function getEffectiveVariantForModel(variant: "a" | "b" | "c" | "d", customModel?: string): "a" | "b" | "c" {
  if (variant === "d" && customModel) {
    const found = CURATED_MODELS.find((m) => m.id === customModel);
    return (found?.variant ?? "a") as "a" | "b" | "c";
  }
  if (variant === "b") return "b";
  if (variant === "c") return "c";
  return "a";
}

function buildFalInput(
  effectiveVariant: "a" | "b" | "c",
  prompt: string,
  resolvedImageUrl: string,
  format: string | undefined,
) {
  if (effectiveVariant === "b") {
    return {
      prompt,
      image_urls: [resolvedImageUrl],
      input_fidelity: "high",
      output_format: "jpeg",
      num_images: 1,
      quality: "high",
      image_size: mapFormatToGptImageSize(format),
    };
  }

  if (effectiveVariant === "c") {
    return {
      prompt,
      image_urls: [resolvedImageUrl],
      output_format: "jpeg",
      image_size: mapFormatToFlux2ProImageSize(format),
      enable_safety_checker: true,
    };
  }

  // variant "a" — Nano Banana 2
  return {
    prompt,
    image_urls: [resolvedImageUrl],
    output_format: "jpeg",
    num_images: 1,
    aspect_ratio: mapFormatToNanoBananaAspectRatio(format),
    resolution: "1K",
  };
}

export async function runFalGeneration(input: RunGenerationInput): Promise<RunGenerationResult> {
  fal.config({
    credentials: getFalKey(),
  });

  const variant = input.variant === "d" ? "d" : input.variant === "c" ? "c" : input.variant === "b" ? "b" : "a";

  const prompt = buildPrompt({
    preset: input.preset,
    category: input.category,
    productName: input.productName,
    format: input.format,
    customPrompt: input.customPrompt,
  });

  const model = resolveVariantModel(variant, input.customModel);
  const effectiveVariant = getEffectiveVariantForModel(variant, input.customModel);
  const resolvedImageUrl = await resolveFalImageUrl(input.sourceImageUrl);

  if (!resolvedImageUrl) {
    throw new Error("sourceImageUrl is required for fal image editing");
  }

  const falInput = buildFalInput(effectiveVariant, prompt, resolvedImageUrl, input.format);

  let result;

  try {
    result = await fal.subscribe(model, {
      input: falInput,
      logs: true,
    });
  } catch (error) {
    const detail = error && typeof error === "object" && "body" in error ? (error as { body?: unknown }).body : undefined;
    const message = error instanceof Error ? error.message : "Unknown fal error";
    throw new Error(detail ? `${message} :: ${JSON.stringify(detail)}` : message);
  }

  const data = result.data as FalGenerationOutput;
  const previewUrls = await Promise.all(
    (data.images || []).map(async (image, index) => {
      if (image.url) {
        const saved = await downloadAndSaveOutput(image.url, `generated-${variant}-${index + 1}`);
        return saved.publicPath;
      }

      if (image.b64_json) {
        const saved = await saveOutputBase64(image.b64_json, `generated-${variant}-${index + 1}`);
        return saved.publicPath;
      }

      return null;
    }),
  );

  const normalizedPreviewUrls = previewUrls.filter((value): value is string => Boolean(value));

  if (!normalizedPreviewUrls.length) {
    throw new Error("fal returned no output images");
  }

  const variantLabel =
    variant === "d"
      ? "D · Personalizado"
      : variant === "c"
        ? "C · FLUX.2 Pro"
        : variant === "b"
          ? "B · GPT Image"
          : "A · Nano Banana 2";

  return {
    provider: "fal",
    mode: "live",
    prompt: data.prompt || prompt,
    sourceImageUrl: resolvedImageUrl,
    previewUrls: normalizedPreviewUrls,
    status: "completed",
    rawOutput: data,
    model,
    variant,
    variantLabel,
  };
}
