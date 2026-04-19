/**
 * Thin tracing helpers for MockForge.
 *
 * Wraps key operations in OpenTelemetry spans so the full
 * upload → generate → provider → DB pipeline appears in a single trace.
 *
 * Usage:
 *   import { withSpan } from "@/lib/tracing";
 *   const result = await withSpan("fal.subscribe", async (span) => {
 *     span.setAttribute("model", model);
 *     return fal.subscribe(model, { input });
 *   });
 */

import { trace, SpanStatusCode, type Span } from "@opentelemetry/api";

const tracer = trace.getTracer("mockforge", "1.0.0");

export async function withSpan<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  attributes?: Record<string, string | number | boolean>,
): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    if (attributes) {
      for (const [k, v] of Object.entries(attributes)) {
        span.setAttribute(k, v);
      }
    }
    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err instanceof Error ? err.message : String(err),
      });
      span.recordException(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      span.end();
    }
  });
}

/** Adds the current trace ID to a log context object. */
export function getTraceId(): string {
  const span = trace.getActiveSpan();
  if (!span) return "";
  return span.spanContext().traceId;
}
