import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "mockforge",
    // OTEL_EXPORTER_OTLP_ENDPOINT env var is picked up automatically if set.
    // In dev, spans are logged to console. In prod, point to any OTel collector.
  });
}
