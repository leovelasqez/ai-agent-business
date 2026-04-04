import { NextResponse } from "next/server";

export async function GET() {
  const provider = process.env.IMAGE_PROVIDER || "fal";
  const configured = provider === "fal" ? Boolean(process.env.FAL_KEY) : false;

  return NextResponse.json({
    ok: true,
    provider,
    configured,
  });
}
