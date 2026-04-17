interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup to prevent unbounded memory growth
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now - entry.windowStart > 300_000) store.delete(key);
    }
  },
  60_000,
);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * Sliding-window rate limiter backed by in-process memory.
 * Suitable for single-instance deployments; does not coordinate across replicas.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (entry.count >= limit) {
    const retryAfterMs = windowMs - (now - entry.windowStart);
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, retryAfterMs: 0 };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
