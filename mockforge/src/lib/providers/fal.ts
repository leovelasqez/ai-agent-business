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
  VARIANT_LABELS,
  mapFormatToSize,
} from "@/lib/model-config";
import { withSpan } from "@/lib/tracing";
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

export async function resolveFalImageUrl(sourceImageUrl?: string) {
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

/**
 * Calls fal-ai/imageutils/rembg to remove the background from an image and
 * returns a PNG URL where the product is opaque and the background is transparent.
 * That PNG can be passed as mask_url to edit endpoints: transparent areas are edited
 * (background replacement), opaque areas are preserved (product).
 * Returns null on any failure so callers can fall back to unmasked editing.
 */
async function getRembgMaskUrl(imageUrl: string): Promise<string | null> {
  try {
    const result = await fal.subscribe("fal-ai/imageutils/rembg", {
      input: { image_url: imageUrl },
      logs: false,
    });
    const url = (result.data as { image?: { url?: string } }).image?.url;
    return url ?? null;
  } catch (err) {
    console.warn(
      "[fal] rembg failed, proceeding without mask:",
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

/**
 * Uses fal-ai/any-llm/vision to detect whether the product image contains
 * visible text on its packaging (label, brand name, ingredients, etc.).
 * Returns true if text is detected so callers can apply masking to preserve it.
 * Returns false on any failure to avoid blocking generation.
 */
async function hasPackagingText(imageUrl: string): Promise<boolean> {
  try {
    const result = await fal.subscribe("fal-ai/any-llm/vision", {
      input: {
        model: "google/gemini-flash-1-5-8b",
        prompt:
          "Does this product image contain visible text on the packaging, label, or product itself? " +
          "Answer with only 'yes' or 'no'.",
        image_url: imageUrl,
      },
      logs: false,
    });
    const output = (result.data as { output?: string }).output ?? "";
    return output.trim().toLowerCase().startsWith("yes");
  } catch (err) {
    console.warn(
      "[fal] OCR text detection failed, skipping mask:",
      err instanceof Error ? err.message : err,
    );
    return false;
  }
}

function buildFalInput(
  effectiveVariant: "a" | "b" | "c",
  prompt: string,
  resolvedImageUrl: string,
  format: string | undefined,
  maskUrl?: string | null,
) {
  if (effectiveVariant === "b") {
    const base: Record<string, unknown> = {
      prompt,
      image_urls: [resolvedImageUrl],
      input_fidelity: "high",
      output_format: "jpeg",
      num_images: 1,
      quality: "high",
      image_size: mapFormatToSize(format, "b"),
    };
    if (maskUrl) base.mask_url = maskUrl;
    return base;
  }

  if (effectiveVariant === "c") {
    const base: Record<string, unknown> = {
      prompt,
      image_urls: [resolvedImageUrl],
      output_format: "jpeg",
      image_size: mapFormatToSize(format, "c"),
      enable_safety_checker: true,
    };
    if (maskUrl) base.mask_url = maskUrl;
    return base;
  }

  // variant "a" — Nano Banana 2
  const base: Record<string, unknown> = {
    prompt,
    image_urls: [resolvedImageUrl],
    output_format: "jpeg",
    num_images: 1,
    aspect_ratio: mapFormatToSize(format, "a"),
    resolution: "1K",
  };
  if (maskUrl) base.mask_url = maskUrl;
  return base;
}

// Maps our region names to fal.ai runner type hints.
// fal.ai uses the x-fal-runner-type header to prefer regional runners.
const REGION_TO_FAL_RUNNER: Record<string, string> = {
  "us-east": "SSD",          // fal US runners tagged SSD
  "eu-west": "SSD_EU",       // fal EU runners
  "ap-southeast": "SSD_APAC", // fal APAC runners
  global: "",                // no hint — fal picks the least-loaded runner
};

export async function runFalGeneration(input: RunGenerationInput): Promise<RunGenerationResult> {
  const runnerHint = input.region ? (REGION_TO_FAL_RUNNER[input.region] ?? "") : "";

  fal.config({
    credentials: getFalKey(),
    ...(runnerHint
      ? {
          requestMiddleware: async (req) => ({
            ...req,
            headers: {
              ...req.headers,
              "x-fal-runner-type": runnerHint,
            },
          }),
        }
      : {}),
  });

  const variant = input.variant === "d" ? "d" : input.variant === "c" ? "c" : input.variant === "b" ? "b" : "a";

  const prompt = buildPrompt({
    preset: input.preset,
    category: input.category,
    productName: input.productName,
    format: input.format,
    customPrompt: input.customPrompt,
    bgColor: input.bgColor,
    bgTexture: input.bgTexture,
  });

  const model = resolveVariantModel(variant, input.customModel);
  const effectiveVariant = getEffectiveVariantForModel(variant, input.customModel);
  const resolvedImageUrl = await resolveFalImageUrl(input.sourceImageUrl);

  if (!resolvedImageUrl) {
    throw new Error("sourceImageUrl is required for fal image editing");
  }

  // Detect packaging text via OCR; if present, apply rembg mask to preserve product
  // text across all edit variants. Falls back to unmasked if either step fails.
  let maskUrl: string | null = null;
  const shouldMask = effectiveVariant === "b" || (await hasPackagingText(resolvedImageUrl));
  if (shouldMask) {
    maskUrl = await getRembgMaskUrl(resolvedImageUrl);
  }

  const falInput = buildFalInput(effectiveVariant, prompt, resolvedImageUrl, input.format, maskUrl);

  let result;

  try {
    result = await withSpan("fal.subscribe", () => fal.subscribe(model, {
      input: falInput,
      logs: true,
    }), { model, variant: effectiveVariant });
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

  const variantLabel = VARIANT_LABELS[variant] ?? variant;

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
