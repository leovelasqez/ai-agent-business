import { NextResponse } from "next/server";
import { updateRating } from "@/lib/db/generations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(`rate:${ip}`, 20, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMITED", message: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  const body = await request.json().catch(() => ({}));

  const { generationId, rating } = body as { generationId?: string; rating?: unknown };

  if (!generationId || typeof generationId !== "string") {
    return NextResponse.json({ ok: false, message: "generationId is required" }, { status: 400 });
  }

  if (rating !== 1 && rating !== -1) {
    return NextResponse.json({ ok: false, message: "rating must be 1 or -1" }, { status: 400 });
  }

  const success = await updateRating(generationId, rating);

  if (!success) {
    console.error("[rate] updateRating failed for", generationId);
  }

  return NextResponse.json({ ok: success });
}
