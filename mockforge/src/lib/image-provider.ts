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
  bgColor?: string;
  bgTexture?: string;
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

// Safe filename: no path separators, no dots leading a segment
const SAFE_UPLOAD_FILENAME = /^[a-zA-Z0-9][\w.-]*$/;

function validateSourceImageUrl(url: string): void {
  // Local upload path
  if (url.startsWith("/api/uploads/")) {
    const fileName = url.slice("/api/uploads/".length);
    if (!SAFE_UPLOAD_FILENAME.test(fileName) || fileName.includes("..")) {
      throw new Error("Invalid sourceImageUrl: unsafe local path.");
    }
    return;
  }

  // External URL: must be HTTPS to prevent MITM and HTTP-downgrade abuse
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid sourceImageUrl: not a valid URL.");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("Invalid sourceImageUrl: only HTTPS external URLs are allowed.");
  }
}

export async function runGeneration(input: RunGenerationInput): Promise<RunGenerationResult> {
  if (input.sourceImageUrl) {
    validateSourceImageUrl(input.sourceImageUrl);
  }

  const provider = process.env.IMAGE_PROVIDER || "fal";

  if (provider === "fal") {
    const { runFalGeneration } = await import("@/lib/providers/fal");
    return runFalGeneration(input);
  }

  throw new Error(`Unsupported IMAGE_PROVIDER: ${provider}`);
}
