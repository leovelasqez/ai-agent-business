import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";
import { isBudgetExceeded, recordGenerationCost } from "@/lib/cost-control";
import { maybeGrantFreeTrial, deductCredits, refundCreditsAmount, CREDIT_COST } from "@/lib/credits";
import { runGeneration, assertImageProviderReady } from "@/lib/image-provider";
import { insertGeneration } from "@/lib/db/generations";
import { getTrustedSessionIdFromRequest } from "@/lib/session";
import { captureException } from "@/lib/sentry";
import type { PresetId } from "@/lib/presets";
import type { GenerationVariant } from "@/lib/image-provider";

function getSessionId(request: Request): string {
  const sessionId = getTrustedSessionIdFromRequest(request);
  if (!sessionId) {
    throw new Error("SESSION_REQUIRED");
  }
  return sessionId;
}

export async function POST(request: Request) {
  let sessionId: string;
  try {
    sessionId = getSessionId(request);
  } catch {
    return NextResponse.json({ ok: false, error: "SESSION_REQUIRED", message: "A trusted session is required." }, { status: 401 });
  }

  const rl = checkRateLimit(`variation:${sessionId}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMITED", message: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  const budget = isBudgetExceeded();
  if (budget.exceeded) {
    return NextResponse.json({ ok: false, error: "BUDGET_EXCEEDED", message: budget.reason }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const {
    sourceImageUrl,
    preset = "clean_studio",
    category,
    format,
    productName,
    variant = "a",
    customModel,
    customPrompt,
    bgColor,
    bgTexture,
    variationHint,
  } = body as {
    sourceImageUrl?: string;
    preset?: string;
    category?: string;
    format?: string;
    productName?: string;
    variant?: string;
    customModel?: string;
    customPrompt?: string;
    bgColor?: string;
    bgTexture?: string;
    variationHint?: string;
  };

  if (!sourceImageUrl) {
    return NextResponse.json({ ok: false, message: "sourceImageUrl is required" }, { status: 400 });
  }

  const v: GenerationVariant = variant === "b" ? "b" : variant === "c" ? "c" : variant === "d" ? "d" : "a";

  try {
    assertImageProviderReady();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image provider is not ready.";
    return NextResponse.json(
      {
        ok: false,
        error: "PROVIDER_NOT_READY",
        message: message === "FAL_KEY is missing" ? "Add FAL_KEY to run live generations." : message,
      },
      { status: 500 },
    );
  }

  const cost = CREDIT_COST[v] ?? 1;
  try {
    await maybeGrantFreeTrial(sessionId);
    const { ok: hasCredits, balance } = await deductCredits(sessionId, v);
    if (!hasCredits) {
      return NextResponse.json(
        { ok: false, error: "INSUFFICIENT_CREDITS", message: "No credits left.", data: { balance, cost } },
        { status: 402 },
      );
    }
  } catch (error) {
    captureException(error, { route: "/api/generate/variation", stage: "credits", preset, variant: v });
    return NextResponse.json(
      { ok: false, error: "CREDIT_SYSTEM_UNAVAILABLE", message: "Credit system unavailable. Try again shortly." },
      { status: 503 },
    );
  }

  // Append variation hint to prompt for diversity
  const finalCustomPrompt = variationHint
    ? (customPrompt ? `${customPrompt} Variation: ${variationHint}.` : `Variation: ${variationHint}.`)
    : customPrompt;

  try {
    const result = await runGeneration({
      preset: preset as PresetId,
      category,
      format,
      productName,
      sourceImageUrl,
      variant: v,
      customModel,
      customPrompt: finalCustomPrompt,
      bgColor,
      bgTexture,
    });

    recordGenerationCost(v);

    const generationId = await insertGeneration({
      preset,
      category,
      format,
      product_name: productName,
      variant: result.variant,
      model: result.model,
      prompt: result.prompt,
      source_image_url: result.sourceImageUrl ?? undefined,
      preview_urls: result.previewUrls,
      provider: result.provider,
      status: "completed",
      kind: "image",
    });

    return NextResponse.json({
      ok: true,
      data: {
        generationId: generationId ?? "",
        previewUrls: result.previewUrls,
        prompt: result.prompt,
      },
    });
  } catch (err) {
    await refundCreditsAmount(sessionId, cost, "refund_variation_failed");
    captureException(err, { route: "/api/generate/variation", preset, variant: v });
    const message = err instanceof Error ? err.message : "Variation generation failed";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
