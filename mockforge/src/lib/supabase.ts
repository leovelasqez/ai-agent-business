/**
 * Supabase server-side client.
 *
 * Usage:
 *   import { getSupabaseServiceClient } from "@/lib/supabase";
 *   const supabase = getSupabaseServiceClient();
 *   const { data, error } = await supabase.from("generations").insert({ ... });
 *
 * The service-role client bypasses Row Level Security — only use on the server.
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
}

// Lazy singletons — created once per process, not per request.
let _serviceClient: SupabaseClient | null = null;
let _readClient: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient {
  if (_serviceClient) return _serviceClient;

  _serviceClient = createClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  return _serviceClient;
}

/**
 * Returns a read-optimized client.
 * When SUPABASE_READ_REPLICA_URL is set, queries are sent to the read replica
 * so the primary DB handles writes only. Falls back to the primary if unset.
 */
export function getSupabaseReadClient(): SupabaseClient {
  if (_readClient) return _readClient;

  const replicaUrl = process.env.SUPABASE_READ_REPLICA_URL;
  if (replicaUrl) {
    _readClient = createClient(replicaUrl, getEnv("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } else {
    _readClient = getSupabaseServiceClient();
  }

  return _readClient;
}

/**
 * Check that Supabase env vars are present without throwing.
 * Useful for health-check endpoints.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
