import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { mapProviderError } from "@/lib/errors";
import { enqueueGenerationJob, type GenerationJobInput } from "@/lib/job-queue";
import { getRequestId, jsonWithRequestId, log } from "@/lib/logger";
import { runGeneration } from "@/lib/image-provider";
import { insertGeneration } from "@/lib/db/generations";
import type { PresetId } from "@/lib/presets";

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const sessionId =
    request.headers.get("cookie")?.match(/mf_session=([^;]+)/)?.[1] ?? getClientIp(request);
  const rl = checkRateLimit(`generate:${sessionId}`, 5, 60_000);
  if (!rl.allowed) {
    return jsonWithRequestId(
      { ok: false, error: "RATE_LIMITED", message: "Too many generation requests. Please wait a moment." },
      requestId,
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  const body = await request.json().catch(() => ({}));

  const preset = (body?.preset ?? "clean_studio") as PresetId;
  const category = body?.category;
  const format = body?.format;
  const productName = body?.productName;
  const sourceImageUrl = body?.sourceImageUrl;
  const variantRaw = body?.variant;
  const variant: "a" | "b" | "c" | "d" =
    variantRaw === "b" ? "b" : variantRaw === "c" ? "c" : variantRaw === "d" ? "d" : "a";
  const provider = process.env.IMAGE_PROVIDER || "fal";
  const asyncRequested = body?.async === true;

  if (provider === "fal" && !process.env.FAL_KEY) {
    return jsonWithRequestId(
      {
        ok: false,
        error: "FAL_KEY is missing",
        message: "Add FAL_KEY to run live generations with fal.ai.",
      },
      requestId,
      { status: 500 },
    );
  }

  const generationInput: GenerationJobInput = {
    preset,
    category,
    format,
    productName,
    sourceImageUrl,
    variant,
    customModel: body?.customModel,
    customPrompt: body?.customPrompt,
    sessionId,
  };

  log("info", "generation request accepted", {
    requestId,
    route: "/api/generate",
    method: "POST",
    extra: { preset, variant, asyncRequested, provider },
  });

  if (asyncRequested) {
    const job = enqueueGenerationJob(generationInput);
    return jsonWithRequestId(
      {
        ok: true,
        message: "Generation queued",
        data: {
          jobId: job.id,
          status: job.status,
          pollUrl: `/api/jobs/${job.id}`,
        },
      },
      requestId,
      { status: 202 },
    );
  }

  try {
    const result = await runGeneration(generationInput);
    const generationId =
      (await insertGeneration({
        preset,
        category,
        format,
        product_name: productName,
        variant: result.variant,
        model: result.model,
        prompt: result.prompt,
        source_image_url: sourceImageUrl ?? undefined,
        preview_urls: result.previewUrls,
        provider: result.provider,
        status: result.status,
        session_id: sessionId.length < 100 ? sessionId : undefined,
      })) ?? crypto.randomUUID();

    return jsonWithRequestId(
      {
        ok: true,
        message: `${result.provider} generation completed`,
        data: {
          generationId,
          preset,
          category,
          format,
          productName,
          sourceImageUrl: sourceImageUrl ?? null,
          status: result.status,
          provider: result.provider,
          model: result.model,
          variant: result.variant,
          variantLabel: result.variantLabel,
          prompt: result.prompt,
          previewUrls: result.previewUrls,
        },
      },
      requestId,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown provider error";
    const friendlyMessage = mapProviderError(message);

    log("error", "generation failed", {
      requestId,
      route: "/api/generate",
      method: "POST",
      extra: { preset, variant, sourceImageUrl, error: message },
    });

    return jsonWithRequestId(
      {
        ok: false,
        error: "IMAGE_GENERATION_FAILED",
        message: friendlyMessage,
      },
      requestId,
      { status: 500 },
    );
  }
}
