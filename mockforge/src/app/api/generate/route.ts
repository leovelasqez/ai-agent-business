import { NextResponse } from "next/server";
import { runGeneration } from "@/lib/image-provider";
import { insertGeneration } from "@/lib/db/generations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import type { PresetId } from "@/lib/presets";

export async function POST(request: Request) {
  const sessionId =
    request.headers.get("cookie")?.match(/mf_session=([^;]+)/)?.[1] ?? getClientIp(request);
  const rl = checkRateLimit(`generate:${sessionId}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMITED", message: "Too many generation requests. Please wait a moment." },
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

  if (provider === "fal" && !process.env.FAL_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error: "FAL_KEY is missing",
        message: "Add FAL_KEY to run live generations with fal.ai.",
      },
      { status: 500 },
    );
  }

  try {
    const result = await runGeneration({
      preset,
      category,
      format,
      productName,
      sourceImageUrl,
      variant,
      customModel: body?.customModel,
      customPrompt: body?.customPrompt,
    });

    // Record to DB if Supabase is configured (non-fatal if it fails)
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

    return NextResponse.json({
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
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown provider error";
    const friendlyMessage = message.includes("ENOENT")
      ? "The source image was not found on the server. Upload it again and retry."
      : message.includes("Load failed") || message.includes("Failed to fetch")
        ? "The generation request could not reach the server cleanly. Retry in a normal browser like Chrome or Safari."
        : "Image generation failed.";

    console.error("[generate] generation failed", {
      preset,
      variant,
      sourceImageUrl,
      message,
    });

    return NextResponse.json(
      {
        ok: false,
        error: "IMAGE_GENERATION_FAILED",
        message: friendlyMessage,
      },
      { status: 500 },
    );
  }
}
