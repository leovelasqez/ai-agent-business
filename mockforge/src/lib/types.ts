export type GenerationStatus = "idle" | "processing" | "completed" | "failed";

export interface MockupGeneration {
  id: string;
  preset: string;
  sourceImageUrl?: string;
  previewUrls: string[];
  finalUrls?: string[];
  status: GenerationStatus;
  createdAt: string;
  category?: string;
  format?: string;
  productName?: string;
  prompt?: string;
  provider?: string;
}
