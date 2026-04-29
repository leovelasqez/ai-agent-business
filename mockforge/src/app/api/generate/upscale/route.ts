import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { checkRateLimit } from "@/lib/rate-limiter";
import { downloadAndSaveOutput } from "@/lib/storage-provider";
import { isBudgetExceeded, recordGenerationCost } from "@/lib/cost-control";
import { maybeGrantFreeTrial, deductCredits, refundCreditsAmount, CREDIT_COST } from "@/lib/credits";
import { validateSourceImageUrl } from "@/lib/image-provider";
import { getTrustedSessionIdFromRequest } from "@/lib/session";
import { resolveFalImageUrl } from "@/lib/providers/fal";
import { captureException } from "@/lib/sentry";

function getFalKey() {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY is not configured.");
  return key;
}

export async function POST(request: Request) {
  const sessionId = getTrustedSessionIdFromRequest(request);
  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: "SESSION_REQUIRED", message: "A trusted session is required." },
      { status: 401 },
    );
  }
  const rl = checkRateLimit(`upscale:${sessionId}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMITED", message: "Too many upscale requests." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  const body = await request.json().catch(() => ({}));
  const { imageUrl } = body as { imageUrl?: string };

  if (!imageUrl || typeof imageUrl !== "string") {
    return NextResponse.json({ ok: false, message: "imageUrl is required" }, { status: 400 });
  }

  try {
    validateSourceImageUrl(imageUrl);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "INVALID_IMAGE_URL", message: error instanceof Error ? error.message : "Invalid image URL" },
      { status: 400 },
    );
  }

  const budget = isBudgetExceeded();
  if (budget.exceeded) {
    return NextResponse.json({ ok: false, error: "BUDGET_EXCEEDED", message: budget.reason }, { status: 503 });
  }

  if (!process.env.FAL_KEY) {
    return NextResponse.json({ ok: false, message: "FAL_KEY not configured." }, { status: 503 });
  }

  const cost = CREDIT_COST.upscale;
  try {
    await maybeGrantFreeTrial(sessionId);
    const { ok: hasCredits, balance } = await deductCredits(sessionId, "upscale");
    if (!hasCredits) {
      return NextResponse.json(
        { ok: false, error: "INSUFFICIENT_CREDITS", message: "No credits left.", data: { balance, cost } },
        { status: 402 },
      );
    }
  } catch (error) {
    captureException(error, { route: "/api/generate/upscale", stage: "credits" });
    return NextResponse.json(
      { ok: false, error: "CREDIT_SYSTEM_UNAVAILABLE", message: "Credit system unavailable. Try again shortly." },
      { status: 503 },
    );
  }

  try {
    fal.config({ credentials: getFalKey() });

    const absoluteUrl = await resolveFalImageUrl(imageUrl);
    if (!absoluteUrl) {
      throw new Error("Could not resolve image URL for upscaling.");
    }

    const result = await fal.subscribe("fal-ai/clarity-upscaler", {
      input: {
        image_url: absoluteUrl,
        upscale_factor: 2,
        creativity: 0.35,
        resemblance: 0.6,
        guidance_scale: 4,
        num_inference_steps: 18,
      },
    }) as { data?: { image?: { url: string } } };

    const outputUrl: string | undefined = result?.data?.image?.url;
    if (!outputUrl) throw new Error("Upscaler did not return an image URL.");

    const saved = await downloadAndSaveOutput(outputUrl, "upscaled");
    recordGenerationCost("upscale");
    return NextResponse.json({ ok: true, data: { url: saved.publicPath } });
  } catch (err) {
    await refundCreditsAmount(sessionId, cost, "refund_upscale_failed");
    captureException(err, { route: "/api/generate/upscale" });
    const message = err instanceof Error ? err.message : "Upscale failed";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
