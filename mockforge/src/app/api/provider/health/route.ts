import { getMetrics } from "@/lib/metrics";
import { isSentryConfigured } from "@/lib/sentry";
import { getStorageBackend, isSupabaseStorageReady } from "@/lib/storage-provider";
import { jsonWithRequestId, getRequestId } from "@/lib/logger";

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const provider = process.env.IMAGE_PROVIDER || "fal";
  const falConfigured = provider === "fal" ? Boolean(process.env.FAL_KEY) : false;

  const checks = {
    provider: {
      name: provider,
      configured: falConfigured,
      reachable: falConfigured,
    },
    storage: {
      backend: getStorageBackend(),
      supabaseReady: isSupabaseStorageReady(),
    },
    observability: {
      sentryConfigured: isSentryConfigured(),
    },
    queue: {
      mode: "in-memory",
    },
  };

  const ok = checks.provider.configured;

  return jsonWithRequestId(
    {
      ok,
      requestId,
      checks,
      metrics: getMetrics(),
    },
    requestId,
    { status: ok ? 200 : 503 },
  );
}
