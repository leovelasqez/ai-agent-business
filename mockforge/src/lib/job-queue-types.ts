import type { GenerationVariant } from "@/lib/image-provider";
import type { PresetId } from "@/lib/presets";
import type { KnownRegion } from "@/lib/region";

export interface GenerationJobInput {
  preset: PresetId;
  category?: string;
  format?: string;
  productName?: string;
  sourceImageUrl?: string;
  variant: GenerationVariant;
  customModel?: string;
  customPrompt?: string;
  bgColor?: string;
  bgTexture?: string;
  sessionId?: string;
  region?: KnownRegion;
}

export interface GenerationJobState {
  id: string;
  status: "queued" | "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
  error?: string;
  result?: {
    generationId: string;
    preset: PresetId;
    category?: string;
    format?: string;
    productName?: string;
    sourceImageUrl: string | null;
    status: "completed";
    provider: string;
    model: string;
    variant: GenerationVariant;
    variantLabel: string;
    prompt: string;
    previewUrls: string[];
  };
}
