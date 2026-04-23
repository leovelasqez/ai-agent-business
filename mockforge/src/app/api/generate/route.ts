import { checkRateLimit } from "@/lib/rate-limiter";
import { mapProviderError } from "@/lib/errors";
import { enqueueGenerationJob, type GenerationJobInput } from "@/lib/job-queue";
import { getRequestId, jsonWithRequestId, log } from "@/lib/logger";
import { runGeneration, assertImageProviderReady } from "@/lib/image-provider";
import { insertGeneration } from "@/lib/db/generations";
import { detectRegion, resolveEffectiveRegion, recordGenerationLatency } from "@/lib/region";
import { isBudgetExceeded, recordGenerationCost } from "@/lib/cost-control";
import { maybeGrantFreeTrial, deductCredits, refundCreditsAmount, CREDIT_COST } from "@/lib/credits";
import { getTrustedSessionIdFromRequest } from "@/lib/session";
import { getServerUser } from "@/lib/supabase-server";
import { withSpan, getTraceId } from "@/lib/tracing";
import type { PresetId } from "@/lib/presets";

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  // Prefer authenticated user ID (Supabase) over anonymous cookie session.
  const authedUser = await getServerUser();
  const sessionId = authedUser?.id ?? getTrustedSessionIdFromRequest(request);
  if (!sessionId) {
    return jsonWithRequestId(
      { ok: false, error: "SESSION_REQUIRED", message: "A trusted session is required." },
      requestId,
      { status: 401 },
    );
  }
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
  const asyncRequested = body?.async === true;
  const region = resolveEffectiveRegion(detectRegion(request));
  const bgColor: string | undefined = body?.bgColor;
  const bgTexture: string | undefined = body?.bgTexture;
  let provider: string;

  // Kill switch: reject if daily/monthly budget is exceeded
  const budget = isBudgetExceeded();
  if (budget.exceeded) {
    return jsonWithRequestId(
      { ok: false, error: "BUDGET_EXCEEDED", message: budget.reason },
      requestId,
      { status: 503 },
    );
  }

  try {
    provider = assertImageProviderReady();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image provider is not ready.";
    return jsonWithRequestId(
      {
        ok: false,
        error: "PROVIDER_NOT_READY",
        message: message === "FAL_KEY is missing" ? "Add FAL_KEY to run live generations with fal.ai." : message,
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
    bgColor,
    bgTexture,
    sessionId,
    region,
  };

  const traceId = getTraceId();
  log("info", "generation request accepted", {
    requestId,
    route: "/api/generate",
    method: "POST",
    extra: { preset, variant, asyncRequested, provider, traceId },
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

  await maybeGrantFreeTrial(sessionId);
  const cost = CREDIT_COST[variant] ?? 1;
  const { ok: hasCredits, balance: currentBalance } = await deductCredits(sessionId, variant);
  if (!hasCredits) {
    return jsonWithRequestId(
      {
        ok: false,
        error: "INSUFFICIENT_CREDITS",
        message: "You have no credits left. Purchase a pack to continue generating.",
        data: { balance: currentBalance, cost },
      },
      requestId,
      { status: 402 },
    );
  }

  try {
    const generationStart = Date.now();
    const result = await withSpan("generate.sync", () => runGeneration({ ...generationInput, region }), {
      preset,
      variant,
      provider,
      region,
    });
    recordGenerationLatency(region, Date.now() - generationStart);
    recordGenerationCost(variant);
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
    await refundCreditsAmount(sessionId, cost, "refund_generate_failed");
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
