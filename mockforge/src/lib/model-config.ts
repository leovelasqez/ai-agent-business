import type { GenerationVariant } from "@/lib/image-provider";
import type { PresetId } from "@/lib/presets";

export interface ImageModelConfig {
  model: string;
  defaults: Record<string, string | number | boolean>;
}

const DEFAULT_MODEL_A = process.env.FAL_MODEL_A || process.env.FAL_MODEL || "fal-ai/flux-kontext/dev";
const DEFAULT_MODEL_B = process.env.FAL_MODEL_B || "fal-ai/flux-pro/kontext";
export const DEFAULT_MODEL_D = process.env.FAL_MODEL_D || "fal-ai/nano-banana-2/edit";

function getModelForVariant(variant: GenerationVariant = "a") {
  return variant === "b" ? DEFAULT_MODEL_B : DEFAULT_MODEL_A;
}

export const presetModelConfig: Record<PresetId, Record<"a" | "b", ImageModelConfig>> = {
  clean_studio: {
    a: {
      model: getModelForVariant("a"),
      defaults: {
        output_format: "jpeg",
        resolution_mode: "1:1",
        guidance_scale: 2.5,
        num_inference_steps: 28,
        num_images: 1,
        enable_safety_checker: true,
        acceleration: "regular",
      },
    },
    b: {
      model: getModelForVariant("b"),
      defaults: {
        output_format: "jpeg",
        resolution_mode: "1:1",
        guidance_scale: 2.5,
        num_inference_steps: 28,
        num_images: 1,
        enable_safety_checker: true,
        acceleration: "regular",
      },
    },
  },
  lifestyle_scene: {
    a: {
      model: getModelForVariant("a"),
      defaults: {
        output_format: "jpeg",
        resolution_mode: "4:5",
        guidance_scale: 2.5,
        num_inference_steps: 28,
        num_images: 1,
        enable_safety_checker: true,
        acceleration: "regular",
      },
    },
    b: {
      model: getModelForVariant("b"),
      defaults: {
        output_format: "jpeg",
        resolution_mode: "4:5",
        guidance_scale: 2.5,
        num_inference_steps: 28,
        num_images: 1,
        enable_safety_checker: true,
        acceleration: "regular",
      },
    },
  },
  ad_creative: {
    a: {
      model: getModelForVariant("a"),
      defaults: {
        output_format: "jpeg",
        resolution_mode: "4:5",
        guidance_scale: 2.75,
        num_inference_steps: 28,
        num_images: 1,
        enable_safety_checker: true,
        acceleration: "regular",
      },
    },
    b: {
      model: getModelForVariant("b"),
      defaults: {
        output_format: "jpeg",
        resolution_mode: "4:5",
        guidance_scale: 2.75,
        num_inference_steps: 28,
        num_images: 1,
        enable_safety_checker: true,
        acceleration: "regular",
      },
    },
  },
};

export function mapFormatToResolutionMode(format?: string) {
  if (!format) return "match_input";
  const normalized = format.toLowerCase();
  if (normalized.includes("9:16") || normalized.includes("story")) return "9:16";
  if (normalized.includes("4:5")) return "4:5";
  return "1:1";
}

export function mapFormatToNanoBananaAspectRatio(format?: string): string {
  if (!format) return "1:1";
  const normalized = format.toLowerCase();
  if (normalized.includes("9:16") || normalized.includes("story")) return "9:16";
  if (normalized.includes("4:5")) return "4:5";
  return "1:1";
}

export function mapFormatToGptImageSize(format?: string): string {
  if (!format) return "1024x1024";
  const normalized = format.toLowerCase();
  if (normalized.includes("9:16") || normalized.includes("story")) return "1024x1536";
  if (normalized.includes("4:5")) return "1024x1536";
  return "1024x1024";
}
