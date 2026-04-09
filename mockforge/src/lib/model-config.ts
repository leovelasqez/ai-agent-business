export interface ImageModelConfig {
  model: string;
  defaults: Record<string, string | number | boolean>;
}

export const MODEL_A = "fal-ai/nano-banana-2/edit";
export const MODEL_B = "fal-ai/gpt-image-1/edit-image";
export const MODEL_C = "fal-ai/flux-2-pro/edit";

export const CURATED_MODELS = [
  { id: "fal-ai/nano-banana-2/edit", label: "Nano Banana 2", variant: "a" },
  { id: "fal-ai/gpt-image-1/edit-image", label: "GPT Image", variant: "b" },
  { id: "fal-ai/flux-2-pro/edit", label: "FLUX.2 Pro", variant: "c" },
] as const;

export type CuratedModelId = (typeof CURATED_MODELS)[number]["id"];

export function mapFormatToNanoBananaAspectRatio(format?: string): string {
  if (!format) return "1:1";
  const normalized = format.toLowerCase();
  if (normalized.includes("9:16") || normalized.includes("story")) return "9:16";
  if (normalized.includes("4:5")) return "4:5";
  if (normalized.includes("16:9") || normalized.includes("landscape")) return "16:9";
  return "1:1";
}

export function mapFormatToGptImageSize(format?: string): string {
  if (!format) return "1024x1024";
  const normalized = format.toLowerCase();
  if (normalized.includes("9:16") || normalized.includes("story")) return "1024x1536";
  if (normalized.includes("4:5")) return "1024x1536";
  if (normalized.includes("16:9") || normalized.includes("landscape")) return "1536x1024";
  return "1024x1024";
}

export function mapFormatToFlux2ProImageSize(format?: string): string {
  if (!format) return "auto";
  const normalized = format.toLowerCase();
  if (normalized.includes("9:16") || normalized.includes("story")) return "portrait_16_9";
  if (normalized.includes("4:5")) return "portrait_4_3";
  if (normalized.includes("1:1")) return "square_hd";
  if (normalized.includes("16:9") || normalized.includes("landscape")) return "landscape_16_9";
  return "auto";
}

// Legacy alias kept for any code that may still reference it
export function mapFormatToResolutionMode(format?: string) {
  if (!format) return "match_input";
  const normalized = format.toLowerCase();
  if (normalized.includes("9:16") || normalized.includes("story")) return "9:16";
  if (normalized.includes("4:5")) return "4:5";
  if (normalized.includes("16:9") || normalized.includes("landscape")) return "16:9";
  return "1:1";
}
