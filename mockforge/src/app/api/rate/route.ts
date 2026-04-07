import { NextResponse } from "next/server";
import { updateRating } from "@/lib/db/generations";

export async function POST(request: Request) {
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
