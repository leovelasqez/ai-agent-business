import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { mapProviderError } from "@/lib/errors";
import { getRequestId, jsonWithRequestId, log } from "@/lib/logger";
import { runGeneration } from "@/lib/image-provider";
import { insertGeneration } from "@/lib/db/generations";
import type { PresetId } from "@/lib/presets";
import type { GenerationVariant } from "@/lib/image-provider";

const BATCH_VARIANTS: GenerationVariant[] = ["a", "b", "c"];

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const sessionId =
    request.headers.get("cookie")?.match(/mf_session=([^;]+)/)?.[1] ?? getClientIp(request);

  // Batch counts as 3 generations — use a tighter limit (2 batches / 60 s)
  const rl = checkRateLimit(`generate-batch:${sessionId}`, 2, 60_000);
  if (!rl.allowed) {
    return jsonWithRequestId(
      {
        ok: false,
        error: "RATE_LIMITED",
        message: "Too many batch requests. Please wait a moment.",
      },
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
  const variants: GenerationVariant[] = Array.isArray(body?.variants)
    ? (body.variants as string[]).filter((v): v is GenerationVariant =>
        ["a", "b", "c"].includes(v),
      )
    : BATCH_VARIANTS;

  if (!sourceImageUrl) {
    return jsonWithRequestId(
      { ok: false, error: "MISSING_SOURCE_IMAGE", message: "sourceImageUrl is required" },
      requestId,
      { status: 400 },
    );
  }

  if (!process.env.FAL_KEY) {
    return jsonWithRequestId(
      { ok: false, error: "FAL_KEY is missing", message: "Add FAL_KEY to run live generations." },
      requestId,
      { status: 500 },
    );
  }

  log("info", "batch generation request accepted", {
    requestId,
    route: "/api/generate/batch",
    method: "POST",
    extra: { preset, variants, sourceImageUrl },
  });

  const results = await Promise.allSettled(
    variants.map(async (variant) => {
      const result = await runGeneration({
        preset,
        category,
        format,
        productName,
        sourceImageUrl,
        variant,
      });

      const generationId =
        (await insertGeneration({
          preset,
          category,
          format,
          product_name: productName,
          variant: result.variant,
          model: result.model,
          prompt: result.prompt,
          source_image_url: sourceImageUrl,
          preview_urls: result.previewUrls,
          provider: result.provider,
          status: result.status,
          session_id: sessionId.length < 100 ? sessionId : undefined,
        })) ?? crypto.randomUUID();

      return {
        variant,
        generationId,
        preset,
        category,
        format,
        productName,
        sourceImageUrl,
        status: result.status,
        provider: result.provider,
        model: result.model,
        variantLabel: result.variantLabel,
        prompt: result.prompt,
        previewUrls: result.previewUrls,
      };
    }),
  );

  const succeeded = results
    .filter((r): r is PromiseFulfilledResult<(typeof results)[number] extends PromiseFulfilledResult<infer T> ? T : never> => r.status === "fulfilled")
    .map((r) => r.value);

  const failed = results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r, i) => ({
      variant: variants[i],
      error: mapProviderError(r.reason instanceof Error ? r.reason.message : String(r.reason)),
    }));

  if (succeeded.length === 0) {
    log("error", "batch generation: all variants failed", {
      requestId,
      route: "/api/generate/batch",
      method: "POST",
      extra: { preset, variants, errors: failed.map((f) => f.error) },
    });
    return jsonWithRequestId(
      {
        ok: false,
        error: "BATCH_GENERATION_FAILED",
        message: "All variants failed to generate.",
        data: { failed },
      },
      requestId,
      { status: 500 },
    );
  }

  return jsonWithRequestId(
    {
      ok: true,
      message: `Batch complete: ${succeeded.length}/${variants.length} variants succeeded`,
      data: {
        results: succeeded,
        failed,
        isBatch: true,
        pricing: { type: "batch", discount: "20%" },
      },
    },
    requestId,
  );
}
