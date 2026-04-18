/**
 * API key validation for the public /api/v1 endpoints.
 *
 * Keys are stored in Supabase (table: api_keys). When Supabase is not
 * configured, falls back to the MOCKFORGE_ADMIN_API_KEY env var so the
 * feature is usable in local/dev mode without a DB.
 */

import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export interface ApiKeyRecord {
  id: string;
  userId: string;
  label: string;
  dailyLimit: number;
  usedToday: number;
  active: boolean;
}

interface ApiKeyRow {
  id: string;
  user_id: string;
  label: string | null;
  daily_limit: number;
  used_today: number;
  active: boolean;
}

/**
 * Validate a Bearer token from the Authorization header.
 * Returns the key record if valid, or null if invalid/not found.
 */
export async function validateApiKey(rawKey: string): Promise<ApiKeyRecord | null> {
  if (!rawKey) return null;

  // Dev/admin fallback: single static key from env
  const adminKey = process.env.MOCKFORGE_ADMIN_API_KEY;
  if (adminKey && rawKey === adminKey) {
    return {
      id: "admin",
      userId: "admin",
      label: "Admin key",
      dailyLimit: 1000,
      usedToday: 0,
      active: true,
    };
  }

  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, user_id, label, daily_limit, used_today, active")
      .eq("key_hash", hashKey(rawKey))
      .eq("active", true)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as ApiKeyRow;
    return {
      id: row.id,
      userId: row.user_id,
      label: row.label ?? "",
      dailyLimit: row.daily_limit,
      usedToday: row.used_today,
      active: row.active,
    };
  } catch {
    return null;
  }
}

/**
 * Increment the daily usage counter for a key (best-effort, non-fatal).
 */
export async function incrementApiKeyUsage(keyId: string): Promise<void> {
  if (keyId === "admin" || !isSupabaseConfigured()) return;

  try {
    const supabase = getSupabaseServiceClient();
    await supabase.rpc("increment_api_key_usage", { key_id: keyId });
  } catch {
    // non-fatal
  }
}

/**
 * Simple deterministic hash for storing key identifiers in the DB
 * without storing plaintext keys. Uses Web Crypto when available.
 */
async function hashKey(key: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(key),
    );
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback: Node.js crypto
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(key).digest("hex");
}
