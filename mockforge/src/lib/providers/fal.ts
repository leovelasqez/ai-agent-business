import { readFile } from "node:fs/promises";
import path from "node:path";
import { fal } from "@fal-ai/client";
import { downloadImageToLocal, saveBase64ImageToLocal } from "@/lib/file-storage";
import { buildPrompt } from "@/lib/prompt-builder";
import { DEFAULT_MODEL_D, mapFormatToGptImageSize, mapFormatToNanoBananaAspectRatio, mapFormatToResolutionMode, presetModelConfig } from "@/lib/model-config";
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

export async function runFalGeneration(input: RunGenerationInput): Promise<RunGenerationResult> {
  fal.config({
    credentials: getFalKey(),
  });

  const prompt = buildPrompt({
    preset: input.preset,
    category: input.category,
    productName: input.productName,
    format: input.format,
  });

  const variant = input.variant === "d" ? "d" : input.variant === "c" ? "c" : input.variant === "b" ? "b" : "a";
  const config =
    variant === "d"
      ? {
          model: DEFAULT_MODEL_D,
          defaults: {
            output_format: "jpeg",
            num_images: 1,
            resolution: "1K",
          },
        }
      : variant === "c"
        ? {
            model: process.env.FAL_MODEL_C || "fal-ai/gpt-image-1/edit-image",
            defaults: {
              output_format: "jpeg",
              num_images: 1,
              quality: "high",
            },
          }
        : presetModelConfig[input.preset][variant];
  const resolvedImageUrl = await resolveFalImageUrl(input.sourceImageUrl);

  if (!resolvedImageUrl) {
    throw new Error("sourceImageUrl is required for fal image editing");
  }

  let result;

  try {
    result = await fal.subscribe(config.model, {
      input:
        variant === "d"
          ? {
              prompt,
              image_url: resolvedImageUrl,
              output_format: String(config.defaults.output_format),
              num_images: Number(config.defaults.num_images),
              aspect_ratio: mapFormatToNanoBananaAspectRatio(input.format),
              resolution: String(config.defaults.resolution),
            }
          : variant === "c"
            ? {
                prompt,
                image_urls: [resolvedImageUrl],
                input_fidelity: "high",
                output_format: String(config.defaults.output_format),
                num_images: Number(config.defaults.num_images),
                quality: String(config.defaults.quality),
                image_size: mapFormatToGptImageSize(input.format),
              }
            : {
                prompt,
                image_url: resolvedImageUrl,
                output_format: String(config.defaults.output_format),
                resolution_mode: mapFormatToResolutionMode(input.format) ?? String(config.defaults.resolution_mode),
                guidance_scale: Number(config.defaults.guidance_scale),
                num_inference_steps: Number(config.defaults.num_inference_steps),
                num_images: Number(config.defaults.num_images),
                enable_safety_checker: Boolean(config.defaults.enable_safety_checker),
                acceleration: String(config.defaults.acceleration),
              },
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
        const saved = await downloadImageToLocal(image.url, `generated-${variant}-${index + 1}`);
        return saved.publicPath;
      }

      if (image.b64_json) {
        const saved = await saveBase64ImageToLocal(image.b64_json, `generated-${variant}-${index + 1}`);
        return saved.publicPath;
      }

      return null;
    }),
  );

  const normalizedPreviewUrls = previewUrls.filter((value): value is string => Boolean(value));

  if (!normalizedPreviewUrls.length) {
    throw new Error("fal returned no output images");
  }

  return {
    provider: "fal",
    mode: "live",
    prompt: data.prompt || prompt,
    sourceImageUrl: resolvedImageUrl,
    previewUrls: normalizedPreviewUrls,
    status: "completed",
    rawOutput: data,
    model: config.model,
    variant,
    variantLabel:
      variant === "d"
        ? "D · Nano Banana 2"
        : variant === "c"
          ? "C · GPT Image 1 via fal"
          : variant === "b"
            ? "B · FLUX Kontext Pro"
            : "A · FLUX Kontext Dev",
  };
}
