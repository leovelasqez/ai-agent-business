/**
 * GET /api/region
 *
 * Returns per-region latency stats (p50, p95) and current region detection
 * for observability. Useful for debugging routing and monitoring degradation.
 */

import { NextResponse } from "next/server";
import { detectRegion, resolveEffectiveRegion, getRegionStats } from "@/lib/region";

export function GET(request: Request) {
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
