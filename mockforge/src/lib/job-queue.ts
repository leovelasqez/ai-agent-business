import { insertGeneration } from "@/lib/db/generations";
import { runGeneration, type GenerationVariant } from "@/lib/image-provider";
import { incrementMetric } from "@/lib/metrics";
import { recordGenerationLatency, type KnownRegion } from "@/lib/region";
import type { PresetId } from "@/lib/presets";

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

const jobs = new Map<string, GenerationJobState>();

function setJob(job: GenerationJobState) {
  jobs.set(job.id, job);
}

export function getGenerationJob(jobId: string) {
  return jobs.get(jobId) ?? null;
}

export function enqueueGenerationJob(input: GenerationJobInput) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const initial: GenerationJobState = {
    id,
    status: "queued",
    createdAt: now,
    updatedAt: now,
  };

  setJob(initial);
  incrementMetric("generationQueued");

  queueMicrotask(async () => {
    const current = getGenerationJob(id);
    if (!current) return;

    setJob({ ...current, status: "processing", updatedAt: new Date().toISOString() });
    const startMs = Date.now();

    try {
      const result = await runGeneration(input);
      recordGenerationLatency(input.region ?? "global", Date.now() - startMs);
      const generationId =
        (await insertGeneration({
          preset: input.preset,
          category: input.category,
          format: input.format,
          product_name: input.productName,
          variant: result.variant,
          model: result.model,
          prompt: result.prompt,
          source_image_url: input.sourceImageUrl ?? undefined,
          preview_urls: result.previewUrls,
          provider: result.provider,
          status: result.status,
          session_id: input.sessionId?.length && input.sessionId.length < 100 ? input.sessionId : undefined,
        })) ?? crypto.randomUUID();

      setJob({
        id,
        status: "completed",
        createdAt: initial.createdAt,
        updatedAt: new Date().toISOString(),
        result: {
          generationId,
          preset: input.preset,
          category: input.category,
          format: input.format,
          productName: input.productName,
          sourceImageUrl: input.sourceImageUrl ?? null,
          status: result.status,
          provider: result.provider,
          model: result.model,
          variant: result.variant,
          variantLabel: result.variantLabel,
          prompt: result.prompt,
          previewUrls: result.previewUrls,
        },
      });
      incrementMetric("generationCompleted");
    } catch (error) {
      setJob({
        id,
        status: "failed",
        createdAt: initial.createdAt,
        updatedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown provider error",
      });
      incrementMetric("generationFailed");
    }
  });

  return initial;
}
