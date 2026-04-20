import { fal } from "@fal-ai/client";
import { checkRateLimit } from "@/lib/rate-limiter";
import { mapProviderError } from "@/lib/errors";
import { getRequestId, jsonWithRequestId, log } from "@/lib/logger";
import { insertGeneration } from "@/lib/db/generations";
import { downloadAndSaveOutput } from "@/lib/storage-provider";
import { isBudgetExceeded, recordGenerationCost } from "@/lib/cost-control";
import { maybeGrantFreeTrial, deductCredits, CREDIT_COST } from "@/lib/credits";
import { validateSourceImageUrl } from "@/lib/image-provider";
import { getTrustedSessionIdFromRequest } from "@/lib/session";

const KLING_MODEL = "fal-ai/kling-video/v2/master/image-to-video";

// Prompt for a subtle product showcase motion
const MOTION_PROMPT =
  "Slow cinematic pan across the product, gentle zoom-in to details, " +
  "professional studio lighting, smooth camera movement, 4K quality";

interface KlingVideoOutput {
  video?: { url?: string };
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const sessionId = getTrustedSessionIdFromRequest(request);
  if (!sessionId) {
    return jsonWithRequestId(
      { ok: false, error: "SESSION_REQUIRED", message: "A trusted session is required." },
      requestId,
      { status: 401 },
    );
  }

  // Video generation is expensive — limit to 1 per 60 s per session
  const rl = checkRateLimit(`generate-video:${sessionId}`, 1, 60_000);
  if (!rl.allowed) {
    return jsonWithRequestId(
      {
        ok: false,
        error: "RATE_LIMITED",
        message: "Please wait before generating another video.",
      },
      requestId,
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return jsonWithRequestId(
      { ok: false, error: "FAL_KEY is missing", message: "FAL_KEY is not configured." },
      requestId,
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const imageUrl: string | undefined = body?.imageUrl;
  const preset: string = body?.preset ?? "clean_studio";
  const productName: string = body?.productName ?? "Product";
  const category: string = body?.category ?? "";
  const customPrompt: string | undefined = body?.customPrompt;

  if (!imageUrl) {
    return jsonWithRequestId(
      { ok: false, error: "MISSING_IMAGE_URL", message: "imageUrl is required" },
      requestId,
      { status: 400 },
    );
  }

  try {
    validateSourceImageUrl(imageUrl);
  } catch (error) {
    return jsonWithRequestId(
      { ok: false, error: "INVALID_IMAGE_URL", message: error instanceof Error ? error.message : "Invalid image URL" },
      requestId,
      { status: 400 },
    );
  }

  const budget = isBudgetExceeded();
  if (budget.exceeded) {
    return jsonWithRequestId(
      { ok: false, error: "BUDGET_EXCEEDED", message: budget.reason },
      requestId,
      { status: 503 },
    );
  }

  await maybeGrantFreeTrial(sessionId);
  const { ok: hasCredits, balance } = await deductCredits(sessionId, "video");
  if (!hasCredits) {
    return jsonWithRequestId(
      {
        ok: false,
        error: "INSUFFICIENT_CREDITS",
        message: "No credits left.",
        data: { balance, cost: CREDIT_COST.video },
      },
      requestId,
      { status: 402 },
    );
  }

  fal.config({ credentials: falKey });

  log("info", "video generation request accepted", {
    requestId,
    route: "/api/generate/video",
    method: "POST",
    extra: { preset, productName, imageUrl },
  });

  try {
    const result = await fal.subscribe(KLING_MODEL, {
      input: {
        image_url: imageUrl,
        prompt: customPrompt ?? MOTION_PROMPT,
        duration: "5",
      },
      logs: true,
    });

    const data = result.data as KlingVideoOutput;
    const videoUrl = data.video?.url;

    if (!videoUrl) {
      throw new Error("Kling video returned no output URL");
    }

    const saved = await downloadAndSaveOutput(videoUrl, `video-${Date.now()}`);
    recordGenerationCost("video");

    const generationId =
      (await insertGeneration({
        preset,
        category,
        product_name: productName,
        variant: "video",
        model: KLING_MODEL,
        prompt: customPrompt ?? MOTION_PROMPT,
        source_image_url: imageUrl,
        preview_urls: [saved.publicPath],
        provider: "fal",
        status: "completed",
        session_id: sessionId.length < 100 ? sessionId : undefined,
        kind: "video",
      })) ?? crypto.randomUUID();

    return jsonWithRequestId(
      {
        ok: true,
        message: "Video generation completed",
        data: {
          generationId,
          videoUrl: saved.publicPath,
          sourceImageUrl: imageUrl,
          kind: "video",
          model: KLING_MODEL,
          duration: "5s",
        },
      },
      requestId,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const friendly = mapProviderError(message);

    log("error", "video generation failed", {
      requestId,
      route: "/api/generate/video",
      method: "POST",
      extra: { imageUrl, error: message },
    });

    return jsonWithRequestId(
      { ok: false, error: "VIDEO_GENERATION_FAILED", message: friendly },
      requestId,
      { status: 500 },
    );
  }
}
