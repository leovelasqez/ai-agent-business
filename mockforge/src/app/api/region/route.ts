/**
 * GET /api/region
 *
 * Returns per-region latency stats (p50, p95) and current region detection
 * for observability. Useful for debugging routing and monitoring degradation.
 */

import { NextResponse } from "next/server";
import { detectRegion, resolveEffectiveRegion, getRegionStats } from "@/lib/region";
import { isAuthorizedSecret } from "@/lib/admin-auth";

export function GET(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    !isAuthorizedSecret(request, process.env.ADMIN_SECRET, "x-admin-secret")
  ) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const detectedRegion = detectRegion(request);
  const effectiveRegion = resolveEffectiveRegion(detectedRegion);
  const stats = getRegionStats();

  return NextResponse.json({
    detectedRegion,
    effectiveRegion,
    fallbackActive: detectedRegion !== effectiveRegion,
    stats,
  });
}
