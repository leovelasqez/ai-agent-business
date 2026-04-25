import { getMetrics } from "@/lib/metrics";
import { isSentryConfigured } from "@/lib/sentry";
import { getStorageBackend, isSupabaseStorageReady } from "@/lib/storage-provider";
import { jsonWithRequestId, getRequestId } from "@/lib/logger";

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const healthSecret = process.env.PROVIDER_HEALTH_SECRET;
  const isAuthorized = !healthSecret || request.headers.get("x-provider-health-secret") === healthSecret;
  const provider = process.env.IMAGE_PROVIDER || "fal";
  const falConfigured = provider === "fal" ? Boolean(process.env.FAL_KEY) : false;

  const stripeSecretConfigured = Boolean(process.env.STRIPE_SECRET_KEY);
  const stripeWebhookConfigured = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
  const stripePricesConfigured = Boolean(
    process.env.STRIPE_PRICE_SINGLE_PACK && process.env.STRIPE_PRICE_BUNDLE,
  );

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
    payments: {
      stripeConfigured: stripeSecretConfigured,
      webhookConfigured: stripeWebhookConfigured,
      pricesConfigured: stripePricesConfigured,
      enabled: stripeSecretConfigured && stripeWebhookConfigured && stripePricesConfigured,
    },
    observability: {
      sentryConfigured: isSentryConfigured(),
      posthogConfigured: Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY),
    },
    queue: {
      mode: "db-backed-with-in-process-worker",
    },
  };

  const ok = checks.provider.configured;

  return jsonWithRequestId(
    {
      ok,
      requestId,
      checks,
      metrics: isAuthorized ? getMetrics() : undefined,
    },
    requestId,
    { status: ok ? 200 : 503 },
  );
}
