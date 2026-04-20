import { createHmac, timingSafeEqual } from "node:crypto";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const SESSION_COOKIE = "mf_session";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const LEGACY_SESSION_ID = /^[a-z0-9-]{16,128}$/i;

function getSessionSecret(): string {
  const secret =
    process.env.SESSION_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.STRIPE_SECRET_KEY ??
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error(
      "Missing session signing secret. Configure SESSION_SECRET or another server-side secret.",
    );
  }

  return secret;
}

function signSessionId(sessionId: string): string {
  return createHmac("sha256", getSessionSecret()).update(sessionId).digest("base64url");
}

export function createSignedSessionValue(sessionId: string): string {
  return `${sessionId}.${signSessionId(sessionId)}`;
}

export function verifySignedSessionValue(value: string | null | undefined): string | null {
  if (!value) return null;

  const dotIndex = value.lastIndexOf(".");
  if (dotIndex <= 0) return null;

  const sessionId = value.slice(0, dotIndex);
  const providedSignature = value.slice(dotIndex + 1);
  if (!LEGACY_SESSION_ID.test(sessionId) || !providedSignature) return null;

  const expectedSignature = signSessionId(sessionId);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  return sessionId;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: ONE_YEAR_SECONDS,
    path: "/",
  };
}

export function createAnonymousSession(): { sessionId: string; cookieValue: string } {
  const sessionId = crypto.randomUUID();
  return {
    sessionId,
    cookieValue: createSignedSessionValue(sessionId),
  };
}

export function getTrustedSessionIdFromCookieValue(value: string | null | undefined): string | null {
  const trusted = verifySignedSessionValue(value);
  if (trusted) return trusted;

  // Graceful one-time upgrade path for legacy unsigned UUID cookies. These are
  // no longer trusted by application code, but proxy can re-sign them.
  if (value && LEGACY_SESSION_ID.test(value)) {
    return value;
  }

  return null;
}

export function getTrustedSessionIdFromCookies(
  cookieStore: Pick<ReadonlyRequestCookies, "get">,
): string | null {
  return verifySignedSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
}

export function getTrustedSessionIdFromRequest(request: Request): string | null {
  const rawCookieHeader = request.headers.get("cookie");
  if (!rawCookieHeader) return null;

  const rawValue = rawCookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(`${SESSION_COOKIE}=`.length);

  return verifySignedSessionValue(rawValue);
}

export { SESSION_COOKIE };
