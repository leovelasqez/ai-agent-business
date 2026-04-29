import * as Sentry from "@sentry/nextjs";
import { registerOTel } from "@vercel/otel";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }

  registerOTel({
    serviceName: "mockforge",
    // OTEL_EXPORTER_OTLP_ENDPOINT env var is picked up automatically if set.
    // In dev, spans are logged to console. In prod, point to any OTel collector.
  });
}

export const onRequestError = Sentry.captureRequestError;
