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

export const VARIANT_LABELS: Record<string, string> = {
  a: "A · Nano Banana 2",
  b: "B · GPT Image",
  c: "C · FLUX.2 Pro",
  d: "D · Personalizado",
};

type FormatKey = "9:16" | "4:5" | "1:1" | "16:9";

const FORMAT_SIZE_TABLE: Record<FormatKey, Record<"a" | "b" | "c", string>> = {
  "9:16": { a: "9:16", b: "1024x1536", c: "portrait_16_9" },
  "4:5":  { a: "4:5",  b: "1024x1536", c: "portrait_4_3" },
  "1:1":  { a: "1:1",  b: "1024x1024", c: "square_hd" },
  "16:9": { a: "16:9", b: "1536x1024", c: "landscape_16_9" },
};

const FORMAT_DEFAULTS: Record<"a" | "b" | "c", string> = {
  a: "1:1",
  b: "1024x1024",
  c: "auto",
};

export function mapFormatToSize(format: string | undefined, variant: "a" | "b" | "c"): string {
  if (!format) return FORMAT_DEFAULTS[variant];
  const n = format.toLowerCase();
  const key: FormatKey | null =
    n.includes("9:16") || n.includes("story") ? "9:16" :
    n.includes("4:5") ? "4:5" :
    n.includes("16:9") || n.includes("landscape") ? "16:9" :
    n.includes("1:1") ? "1:1" :
    null;
  return key ? FORMAT_SIZE_TABLE[key][variant] : FORMAT_DEFAULTS[variant];
}

// Legacy wrappers kept for existing call sites and tests
export function mapFormatToNanoBananaAspectRatio(format?: string): string {
  return mapFormatToSize(format, "a");
}

export function mapFormatToGptImageSize(format?: string): string {
  return mapFormatToSize(format, "b");
}

export function mapFormatToFlux2ProImageSize(format?: string): string {
  return mapFormatToSize(format, "c");
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
