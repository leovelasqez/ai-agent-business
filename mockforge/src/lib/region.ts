/**
 * Region detection and per-region latency tracking for multi-region generation.
 *
 * Region routing strategy:
 *   1. Detect user region from CF-IPCountry / x-vercel-ip-country headers.
 *   2. Route jobs to the preferred FAL.ai endpoint for that region.
 *   3. If the primary region is slow (p95 > threshold), fall back to global.
 *   4. Record latency samples so operators can observe p95 per region.
 *
 * FAL.ai supports region hints via the `x-fal-runner-type` header and
 * the `hints.runner_type` field. This module manages routing metadata only;
 * actual FAL calls still go through fal.ts.
 */

// Known regions and their FAL routing hints
export type KnownRegion = "us-east" | "eu-west" | "ap-southeast" | "global";

const COUNTRY_TO_REGION: Record<string, KnownRegion> = {
  // North America
  US: "us-east",
  CA: "us-east",
  MX: "us-east",
  // Europe
  GB: "eu-west",
  DE: "eu-west",
  FR: "eu-west",
  ES: "eu-west",
  IT: "eu-west",
  NL: "eu-west",
  PT: "eu-west",
  SE: "eu-west",
  NO: "eu-west",
  // Asia-Pacific
  JP: "ap-southeast",
  KR: "ap-southeast",
  SG: "ap-southeast",
  AU: "ap-southeast",
  IN: "ap-southeast",
  CN: "ap-southeast",
};

export function detectRegion(request: Request): KnownRegion {
  const country =
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-vercel-ip-country") ??
    "";
  return COUNTRY_TO_REGION[country.toUpperCase()] ?? "global";
}

// ── Per-region latency tracking (in-memory, rolling 100 samples) ──────────────

const latencySamples: Record<KnownRegion, number[]> = {
  "us-east": [],
  "eu-west": [],
  "ap-southeast": [],
  global: [],
};

const MAX_SAMPLES = 100;
const P95_FALLBACK_THRESHOLD_MS = 45_000; // 45 seconds

/** Flush stats to Supabase every N samples so multiple instances share observations. */
const FLUSH_EVERY = 10;
let _samplesSinceFlush = 0;

export function recordGenerationLatency(region: KnownRegion, durationMs: number): void {
  const samples = latencySamples[region];
  samples.push(durationMs);
  if (samples.length > MAX_SAMPLES) samples.shift();

  _samplesSinceFlush++;
  if (_samplesSinceFlush >= FLUSH_EVERY) {
    _samplesSinceFlush = 0;
    flushRegionStats().catch(() => {/* non-fatal */});
  }
}

async function flushRegionStats(): Promise<void> {
  const { isSupabaseConfigured, getSupabaseServiceClient } = await import("@/lib/supabase");
  if (!isSupabaseConfigured()) return;

  const regions: KnownRegion[] = ["us-east", "eu-west", "ap-southeast", "global"];
  const sb = getSupabaseServiceClient();

  await Promise.allSettled(
    regions.map((region) => {
      const sorted = [...latencySamples[region]].sort((a, b) => a - b);
      if (sorted.length === 0) return Promise.resolve();
      return sb
        .from("region_latency_stats")
        .upsert({
          region,
          sample_count: sorted.length,
          p50_ms: percentile(sorted, 50),
          p95_ms: percentile(sorted, 95),
          updated_at: new Date().toISOString(),
        }, { onConflict: "region" });
    }),
  );
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

export function getRegionP95(region: KnownRegion): number {
  const sorted = [...latencySamples[region]].sort((a, b) => a - b);
  return percentile(sorted, 95);
}

/**
 * Returns the effective region for a request. If the detected region's p95
 * latency exceeds the threshold, falls back to "global" so FAL uses its
 * default (least-loaded) runner.
 */
export function resolveEffectiveRegion(detectedRegion: KnownRegion): KnownRegion {
  if (detectedRegion === "global") return "global";
  const p95 = getRegionP95(detectedRegion);
  if (p95 > P95_FALLBACK_THRESHOLD_MS) {
    console.warn(
      `[region] ${detectedRegion} p95=${p95}ms exceeds threshold, falling back to global`,
    );
    return "global";
  }
  return detectedRegion;
}

/** Get a snapshot of all region latency stats (for observability endpoints). */
export function getRegionStats(): Record<KnownRegion, { sampleCount: number; p50: number; p95: number }> {
  const regions: KnownRegion[] = ["us-east", "eu-west", "ap-southeast", "global"];
  return Object.fromEntries(
    regions.map((region) => {
      const sorted = [...latencySamples[region]].sort((a, b) => a - b);
      return [
        region,
        {
          sampleCount: sorted.length,
          p50: percentile(sorted, 50),
          p95: percentile(sorted, 95),
        },
      ];
    }),
  ) as Record<KnownRegion, { sampleCount: number; p50: number; p95: number }>;
}
