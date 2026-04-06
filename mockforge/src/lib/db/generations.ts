/**
 * DB helpers for the `generations` table.
 *
 * All functions are no-ops when Supabase is not configured, so the app works
 * without a database connection (local-only mode).
 */

import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export interface NewGeneration {
  preset: string;
  category?: string;
  format?: string;
  product_name?: string;
  variant: string;
  model: string;
  prompt?: string;
  source_image_url?: string;
  preview_urls: string[];
  provider?: string;
  status?: string;
}

/**
 * Insert a generation record. Returns the new UUID, or null if Supabase is
 * not configured or the insert fails (non-fatal — never throws).
 */
export async function insertGeneration(record: NewGeneration): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("generations")
      .insert({
        preset: record.preset,
        category: record.category ?? null,
        format: record.format ?? null,
        product_name: record.product_name ?? null,
        variant: record.variant,
        model: record.model,
        prompt: record.prompt ?? null,
        source_image_url: record.source_image_url ?? null,
        preview_urls: record.preview_urls,
        provider: record.provider ?? "fal",
        status: record.status ?? "completed",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[db] insertGeneration failed:", error.message);
      return null;
    }

    return (data as { id: string }).id;
  } catch (err) {
    console.error("[db] insertGeneration unexpected error:", err instanceof Error ? err.message : err);
    return null;
  }
}
