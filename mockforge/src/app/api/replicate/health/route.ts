import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: Boolean(process.env.REPLICATE_API_TOKEN),
    provider: "replicate",
  });
}
