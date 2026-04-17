import { NextResponse } from "next/server";

export type LogLevel = "info" | "warn" | "error";

export interface RequestLogContext {
  requestId: string;
  route?: string;
  method?: string;
  extra?: Record<string, unknown>;
}

function serializeError(value: unknown) {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }
  return value;
}

export function getRequestId(request: Request): string {
  return request.headers.get("x-request-id") ?? crypto.randomUUID();
}

export function log(level: LogLevel, message: string, context: RequestLogContext): void {
  const payload = {
    level,
    message,
    requestId: context.requestId,
    route: context.route,
    method: context.method,
    ...context.extra,
  };

  if (level === "error") {
    console.error(JSON.stringify(payload, (_k, value) => serializeError(value)));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(payload, (_k, value) => serializeError(value)));
    return;
  }

  console.log(JSON.stringify(payload, (_k, value) => serializeError(value)));
}

export function jsonWithRequestId<T>(body: T, requestId: string, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("x-request-id", requestId);
  return response;
}
