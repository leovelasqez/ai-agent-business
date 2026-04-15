import type { PresetId } from "@/lib/presets";

export type GenerationVariant = "a" | "b" | "c" | "d";

export interface RunGenerationInput {
  preset: PresetId;
  category?: string;
  productName?: string;
  format?: string;
  sourceImageUrl?: string;
  variant?: GenerationVariant;
  customModel?: string;
  customPrompt?: string;
}

export interface RunGenerationResult {
  provider: string;
  mode: "live";
  prompt: string;
  sourceImageUrl: string | null;
  previewUrls: string[];
  status: "completed";
  rawOutput: unknown;
  model: string;
  variant: GenerationVariant;
  variantLabel: string;
}

export async function runGeneration(input: RunGenerationInput): Promise<RunGenerationResult> {
  const provider = process.env.IMAGE_PROVIDER || "fal";

  if (provider === "fal") {
    const { runFalGeneration } = await import("@/lib/providers/fal");
    return runFalGeneration(input);
  }

  throw new Error(`Unsupported IMAGE_PROVIDER: ${provider}`);
}
