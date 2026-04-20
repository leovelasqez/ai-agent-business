import { NextResponse } from "next/server";
import { maybeGrantFreeTrial } from "@/lib/credits";
import { getTrustedSessionIdFromRequest } from "@/lib/session";

export async function GET(request: Request) {
  const sessionId = getTrustedSessionIdFromRequest(request);
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "SESSION_REQUIRED" }, { status: 401 });
  }
  const balance = await maybeGrantFreeTrial(sessionId);
  return NextResponse.json({ ok: true, data: { balance } });
}
