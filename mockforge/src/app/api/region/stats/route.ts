import { NextResponse } from "next/server";
import { getRegionStats } from "@/lib/region";
import { isSupabaseConfigured, getSupabaseServiceClient } from "@/lib/supabase";
import { isAuthorizedSecret } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    !isAuthorizedSecret(request, process.env.ADMIN_SECRET, "x-admin-secret")
  ) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const inMemory = getRegionStats();

  // Enrich with persisted stats from DB when available.
  let persisted: Record<string, unknown> | null = null;
  if (isSupabaseConfigured()) {
    try {
      const { data } = await getSupabaseServiceClient()
        .from("region_latency_stats")
        .select("region, sample_count, p50_ms, p95_ms, updated_at");
      if (data) {
        persisted = Object.fromEntries(
          (data as { region: string; sample_count: number; p50_ms: number; p95_ms: number; updated_at: string }[])
            .map((r) => [r.region, { sampleCount: r.sample_count, p50: r.p50_ms, p95: r.p95_ms, updatedAt: r.updated_at }]),
        );
      }
    } catch {
      // non-fatal
    }
  }

  return NextResponse.json({
    ok: true,
    data: {
      inMemory,
      persisted,
    },
  });
}
