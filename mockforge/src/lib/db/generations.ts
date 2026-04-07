/**
 * DB helpers for the `generations` table.
 *
 * All functions are no-ops when Supabase is not configured, so the app works
 * without a database connection (local-only mode).
 */

import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import type { MockupGeneration } from "@/lib/types";

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

interface GenerationRow {
  id: string;
  preset: string;
  category: string | null;
  format: string | null;
  product_name: string | null;
  variant: string;
  model: string;
  prompt: string | null;
  source_image_url: string | null;
  preview_urls: string[];
  provider: string | null;
  status: "completed" | "failed" | "processing" | "idle";
  created_at: string;
  rating: number | null;
}

function mapGenerationRow(row: GenerationRow): MockupGeneration & {
  model: string;
  variant: string;
} {
  return {
    id: row.id,
    preset: row.preset,
    sourceImageUrl: row.source_image_url ?? undefined,
    previewUrls: row.preview_urls ?? [],
    finalUrls: [],
    status: row.status,
    createdAt: row.created_at,
    category: row.category ?? undefined,
    format: row.format ?? undefined,
    productName: row.product_name ?? undefined,
    prompt: row.prompt ?? undefined,
    provider: row.provider ?? undefined,
    model: row.model,
    variant: row.variant,
    rating: row.rating ?? null,
  };
}

/**
 * Insert a generation record. Returns the new UUID, or null if Supabase is
 * not configured or the insert fails (non-fatal, never throws).
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

/**
 * Fetch the most recent generations, ordered by created_at descending.
 * Returns an empty array when Supabase is not configured or the query fails.
 */
export async function getRecentGenerations(
  limit = 30,
): Promise<(MockupGeneration & { model: string; variant: string })[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("generations")
      .select(
        "id, preset, category, format, product_name, variant, model, prompt, source_image_url, preview_urls, provider, status, created_at, rating",
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[db] getRecentGenerations failed:", error.message);
      return [];
    }

    return (data as GenerationRow[]).map(mapGenerationRow);
  } catch (err) {
    console.error("[db] getRecentGenerations unexpected error:", err instanceof Error ? err.message : err);
    return [];
  }
}

/**
 * Fetch a generation by id. Returns null when Supabase is not configured,
 * the record does not exist, or the query fails.
 */
export async function getGenerationById(id: string): Promise<(MockupGeneration & { model: string; variant: string }) | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("generations")
      .select(
        "id, preset, category, format, product_name, variant, model, prompt, source_image_url, preview_urls, provider, status, created_at, rating",
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[db] getGenerationById failed:", error.message);
      return null;
    }

    if (!data) return null;
    return mapGenerationRow(data as GenerationRow);
  } catch (err) {
    console.error("[db] getGenerationById unexpected error:", err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Update the rating for a generation (1 = thumbs up, -1 = thumbs down).
 * Non-fatal: returns false if Supabase is not configured or the update fails.
 */
export async function updateRating(id: string, rating: 1 | -1): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase
      .from("generations")
      .update({ rating })
      .eq("id", id);

    if (error) {
      console.error("[db] updateRating failed:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[db] updateRating unexpected error:", err instanceof Error ? err.message : err);
    return false;
  }
}
