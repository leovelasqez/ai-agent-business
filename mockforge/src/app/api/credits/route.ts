import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/rate-limiter";
import { maybeGrantFreeTrial, getBalance } from "@/lib/credits";

function getSessionId(request: Request): string {
  return request.headers.get("cookie")?.match(/mf_session=([^;]+)/)?.[1] ?? getClientIp(request);
}

export async function GET(request: Request) {
  const sessionId = getSessionId(request);
  const balance = await maybeGrantFreeTrial(sessionId);
  return NextResponse.json({ ok: true, data: { balance, sessionId } });
}
