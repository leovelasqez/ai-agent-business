/**
 * POST /api/v1/generate
 *
 * Public API endpoint for programmatic access to MockForge image generation.
 * Requires a Bearer API key in the Authorization header.
 *
 * Request body (JSON):
 *   preset         string   "clean_studio" | "lifestyle_scene" | "ad_creative" | "custom"
 *   sourceImageUrl string   URL or /api/uploads/<file> path of the product image
 *   variant        string?  "a" | "b" | "c"  (default: "a")
 *   category       string?  Product category
 *   format         string?  "1:1" | "4:5" | "9:16" | "16:9"
 *   productName    string?
 *   customPrompt   string?  Only used when preset = "custom"
 *
 * Response (200):
 *   { ok: true, data: { generationId, previewUrls, model, variant, prompt } }
 *
 * Errors:
 *   401 — missing or invalid API key
 *   429 — rate limited (daily limit or per-minute limit)
 *   400 — invalid request body
 *   500 — generation failed
 */

import { validateApiKey, incrementApiKeyUsage } from "@/lib/api-keys";
import { checkRateLimit } from "@/lib/rate-limiter";
import { mapProviderError } from "@/lib/errors";
import { getRequestId, jsonWithRequestId, log } from "@/lib/logger";
import { runGeneration } from "@/lib/image-provider";
import { insertGeneration } from "@/lib/db/generations";
import type { PresetId } from "@/lib/presets";
import type { GenerationVariant } from "@/lib/image-provider";

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  if (process.env.MOCKFORGE_PUBLIC_API_ENABLED !== "true") {
    return jsonWithRequestId(
      {
        ok: false,
        error: "API_DISABLED",
        message: "The public API is currently in private beta.",
      },
      requestId,
      { status: 404 },
    );
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const authorization = request.headers.get("authorization") ?? "";
  const rawKey = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";

  const apiKey = await validateApiKey(rawKey);
  if (!apiKey) {
    return jsonWithRequestId(
      {
        ok: false,
        error: "UNAUTHORIZED",
        message: "Invalid or missing API key. Pass: Authorization: Bearer <your-key>",
      },
      requestId,
      { status: 401 },
    );
  }

  // ── Rate limiting (per-key, per-minute) ──────────────────────────────────
  const rl = checkRateLimit(`v1:${apiKey.id}`, 10, 60_000);
  if (!rl.allowed) {
    return jsonWithRequestId(
      {
        ok: false,
        error: "RATE_LIMITED",
        message: "Rate limit exceeded. Max 10 requests per minute per API key.",
      },
      requestId,
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  // ── Daily limit ───────────────────────────────────────────────────────────
  if (apiKey.usedToday >= apiKey.dailyLimit) {
    return jsonWithRequestId(
      {
        ok: false,
        error: "DAILY_LIMIT_EXCEEDED",
        message: `Daily generation limit of ${apiKey.dailyLimit} reached for this key.`,
      },
      requestId,
      { status: 429 },
    );
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  const body = await request.json().catch(() => ({}));
  const preset = (body?.preset ?? "clean_studio") as PresetId;
  const sourceImageUrl: string | undefined = body?.sourceImageUrl;
  const variantRaw = body?.variant;
  const variant: GenerationVariant =
    variantRaw === "b" ? "b" : variantRaw === "c" ? "c" : "a";
  const category: string | undefined = body?.category;
  const format: string | undefined = body?.format;
  const productName: string | undefined = body?.productName;
  const customPrompt: string | undefined = body?.customPrompt;

  if (!sourceImageUrl) {
    return jsonWithRequestId(
      { ok: false, error: "MISSING_SOURCE_IMAGE", message: "sourceImageUrl is required" },
      requestId,
      { status: 400 },
    );
  }

  if (!process.env.FAL_KEY) {
    return jsonWithRequestId(
      { ok: false, error: "FAL_KEY is missing", message: "Server is not configured for generation." },
      requestId,
      { status: 500 },
    );
  }

  log("info", "v1 API generation request", {
    requestId,
    route: "/api/v1/generate",
    method: "POST",
    extra: { keyId: apiKey.id, userId: apiKey.userId, preset, variant },
  });

  // ── Generate ──────────────────────────────────────────────────────────────
  try {
    const result = await runGeneration({
      preset,
      category,
      format,
      productName,
      sourceImageUrl,
      variant,
      customPrompt,
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
        session_id: `apikey:${apiKey.id}`,
      })) ?? crypto.randomUUID();

    // Best-effort usage tracking
    await incrementApiKeyUsage(apiKey.id);

    return jsonWithRequestId(
      {
        ok: true,
        data: {
          generationId,
          previewUrls: result.previewUrls,
          model: result.model,
          variant: result.variant,
          variantLabel: result.variantLabel,
          prompt: result.prompt,
          preset,
          sourceImageUrl,
        },
      },
      requestId,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown provider error";
    const friendly = mapProviderError(message);

    log("error", "v1 API generation failed", {
      requestId,
      route: "/api/v1/generate",
      method: "POST",
      extra: { keyId: apiKey.id, preset, variant, error: message },
    });

    return jsonWithRequestId(
      { ok: false, error: "GENERATION_FAILED", message: friendly },
      requestId,
      { status: 500 },
    );
  }
}
