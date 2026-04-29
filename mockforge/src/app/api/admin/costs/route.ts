/**
 * GET /api/admin/costs
 *
 * Returns current cost tracking snapshot. Protected by ADMIN_SECRET header.
 * Used for internal dashboards and alerting.
 */

import { NextResponse } from "next/server";
import { getCostSnapshot } from "@/lib/cost-control";
import { getRegionStats } from "@/lib/region";
import { getMetrics } from "@/lib/metrics";
import { isAuthorizedSecret } from "@/lib/admin-auth";

export function GET(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json({ ok: false, error: "ADMIN_SECRET_NOT_CONFIGURED" }, { status: 403 });
  }

  if (!isAuthorizedSecret(request, adminSecret, "x-admin-secret")) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const costs = getCostSnapshot();
  const regionStats = getRegionStats();
  const metrics = getMetrics();

  return NextResponse.json({
    ok: true,
    data: {
      costs,
      regionStats,
      metrics,
      timestamp: new Date().toISOString(),
    },
  });
}
