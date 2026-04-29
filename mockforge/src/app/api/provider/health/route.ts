import { getMetrics } from "@/lib/metrics";
import { isSentryConfigured } from "@/lib/sentry";
import { getStorageBackend, isSupabaseStorageReady } from "@/lib/storage-provider";
import { jsonWithRequestId, getRequestId } from "@/lib/logger";
import { isAuthorizedSecret } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const healthSecret = process.env.PROVIDER_HEALTH_SECRET;
  const isProduction = process.env.NODE_ENV === "production";
  const isAuthorized = healthSecret
    ? isAuthorizedSecret(request, healthSecret, "x-provider-health-secret")
    : !isProduction;
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

  if (!isAuthorized) {
    return jsonWithRequestId({ ok, requestId }, requestId, { status: ok ? 200 : 503 });
  }

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
