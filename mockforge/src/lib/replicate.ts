import Replicate from "replicate";
import { buildPrompt } from "@/lib/prompt-builder";
import { mapFormatToAspectRatio, replicatePresetConfig } from "@/lib/replicate-config";
import type { PresetId } from "@/lib/presets";

interface RunGenerationInput {
  preset: PresetId;
  category?: string;
  productName?: string;
  format?: string;
  sourceImageUrl?: string;
}

interface RunGenerationResult {
  provider: "replicate";
  mode: "live";
  prompt: string;
  sourceImageUrl: string | null;
  previewUrls: string[];
  status: "completed";
  rawOutput: unknown;
  model: string;
}

function getReplicateClient() {
  const auth = process.env.REPLICATE_API_TOKEN;

  if (!auth) {
    throw new Error("REPLICATE_API_TOKEN is not configured");
  }

  return new Replicate({ auth });
}

function normalizeReplicateOutput(output: unknown): string[] {
  if (Array.isArray(output)) {
    return output
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "url" in item && typeof item.url === "function") {
          return item.url();
        }
        return null;
      })
      .filter((value): value is string => Boolean(value));
  }

  if (typeof output === "string") {
    return [output];
  }

  if (output && typeof output === "object" && "url" in output && typeof output.url === "function") {
    return [output.url()];
  }

  return [];
}

function resolvePublicImageUrl(sourceImageUrl?: string) {
  if (!sourceImageUrl) return undefined;
  if (sourceImageUrl.startsWith("http://") || sourceImageUrl.startsWith("https://")) {
    return sourceImageUrl;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is required to send uploaded images to Replicate");
  }

  return new URL(sourceImageUrl, baseUrl).toString();
}

export async function runGeneration(input: RunGenerationInput): Promise<RunGenerationResult> {
  const prompt = buildPrompt({
    preset: input.preset,
    category: input.category,
    productName: input.productName,
    format: input.format,
  });

  const config = replicatePresetConfig[input.preset];
  const replicate = getReplicateClient();
  const resolvedImageUrl = resolvePublicImageUrl(input.sourceImageUrl);

  const replicateInput: Record<string, string | number | boolean> = {
    prompt,
    aspect_ratio: mapFormatToAspectRatio(input.format) ?? config.defaults.aspect_ratio,
    output_format: config.defaults.output_format,
    safety_tolerance: config.defaults.safety_tolerance,
  };

  if (resolvedImageUrl) {
    replicateInput.input_image = resolvedImageUrl;
  }

  const output = await replicate.run(config.model, {
    input: replicateInput,
  });

  const previewUrls = normalizeReplicateOutput(output);

  if (!previewUrls.length) {
    throw new Error("Replicate returned no output images");
  }

  return {
    provider: "replicate",
    mode: "live",
    prompt,
    sourceImageUrl: resolvedImageUrl ?? input.sourceImageUrl ?? null,
    previewUrls,
    status: "completed",
    rawOutput: output,
    model: config.model,
  };
}
