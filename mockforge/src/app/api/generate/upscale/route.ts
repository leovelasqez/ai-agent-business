import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { downloadAndSaveOutput } from "@/lib/storage-provider";

function getFalKey() {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY is not configured.");
  return key;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(`upscale:${ip}`, 5, 60_000);
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

  if (!process.env.FAL_KEY) {
    return NextResponse.json({ ok: false, message: "FAL_KEY not configured." }, { status: 503 });
  }

  try {
    fal.config({ credentials: getFalKey() });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const absoluteUrl = imageUrl.startsWith("http") ? imageUrl : `${appUrl}${imageUrl}`;

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
    return NextResponse.json({ ok: true, data: { url: saved.publicPath } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upscale failed";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
