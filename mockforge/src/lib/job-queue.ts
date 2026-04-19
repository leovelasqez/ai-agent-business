import { insertGeneration } from "@/lib/db/generations";
import { dbCreateJob, dbUpdateJob, dbGetJob } from "@/lib/db/jobs";
import { runGeneration } from "@/lib/image-provider";
import { incrementMetric } from "@/lib/metrics";
import { recordGenerationLatency } from "@/lib/region";
import { withSpan } from "@/lib/tracing";
import type { GenerationJobInput, GenerationJobState } from "@/lib/job-queue-types";

export type { GenerationJobInput, GenerationJobState };

// In-memory cache: authoritative for jobs running in this process.
// Falls back to DB for jobs from other instances or previous restarts.
const jobs = new Map<string, GenerationJobState>();

function setJob(job: GenerationJobState) {
  jobs.set(job.id, job);
  // Persist to DB asynchronously — don't await so we never block the caller.
  dbUpdateJob(job.id, {
    status: job.status,
    resultJson: job.result,
    error: job.error,
  }).catch(() => {/* non-fatal */});
}

export async function getGenerationJob(jobId: string): Promise<GenerationJobState | null> {
  const cached = jobs.get(jobId);
  if (cached) return cached;
  // Not in memory (different instance or server restart) — try DB.
  return dbGetJob(jobId);
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

  jobs.set(id, initial);
  incrementMetric("generationQueued");

  // Persist job creation to DB (fire-and-forget).
  dbCreateJob(id, input, input.region).catch(() => {/* non-fatal */});

  queueMicrotask(async () => {
    const current = jobs.get(id);
    if (!current) return;

    const processing: GenerationJobState = { ...current, status: "processing", updatedAt: new Date().toISOString() };
    setJob(processing);
    const startMs = Date.now();

    try {
      const result = await withSpan("generation.job.run", () => runGeneration(input), {
        "job.id": id,
        "job.preset": input.preset,
        "job.variant": input.variant,
        "job.region": input.region ?? "global",
      });
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
