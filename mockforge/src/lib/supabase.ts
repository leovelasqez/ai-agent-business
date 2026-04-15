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

// Lazy singleton — created once per process, not per request.
let _serviceClient: SupabaseClient | null = null;

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
 * Check that Supabase env vars are present without throwing.
 * Useful for health-check endpoints.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
