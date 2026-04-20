/**
 * DB helpers for the `generations` table.
 *
 * All functions are no-ops when Supabase is not configured, so the app works
 * without a database connection (local-only mode).
 */

import { getSupabaseServiceClient, getSupabaseReadClient, isSupabaseConfigured } from "@/lib/supabase";
import type { MockupGeneration, OutputKind } from "@/lib/types";

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
  session_id?: string;
  kind?: OutputKind;
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
  kind: OutputKind | null;
  is_public: boolean | null;
  session_id: string | null;
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
    kind: row.kind ?? "image",
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
        session_id: record.session_id ?? null,
        kind: record.kind ?? "image",
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
  limit = 24,
  offset = 0,
): Promise<(MockupGeneration & { model: string; variant: string })[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = getSupabaseReadClient();
    const { data, error } = await supabase
      .from("generations")
      .select(
        "id, preset, category, format, product_name, variant, model, prompt, source_image_url, preview_urls, provider, status, created_at, rating, kind, is_public, session_id",
      )
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

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
    const supabase = getSupabaseReadClient();
    const { data, error } = await supabase
      .from("generations")
      .select(
        "id, preset, category, format, product_name, variant, model, prompt, source_image_url, preview_urls, provider, status, created_at, rating, kind, is_public, session_id",
      )
      .eq("id", id)
      .is("deleted_at", null)
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

export async function getRecentGenerationsForOwner(
  ownerSessionId: string,
  limit = 24,
  offset = 0,
): Promise<(MockupGeneration & { model: string; variant: string })[]> {
  if (!isSupabaseConfigured() || !ownerSessionId) return [];

  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("generations")
      .select(
        "id, preset, category, format, product_name, variant, model, prompt, source_image_url, preview_urls, provider, status, created_at, rating, kind, is_public, session_id",
      )
      .eq("session_id", ownerSessionId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[db] getRecentGenerationsForOwner failed:", error.message);
      return [];
    }

    return (data as GenerationRow[]).map(mapGenerationRow);
  } catch (err) {
    console.error(
      "[db] getRecentGenerationsForOwner unexpected error:",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
}

export async function getGenerationByIdForViewer(
  id: string,
  viewerSessionId?: string | null,
): Promise<(MockupGeneration & { model: string; variant: string }) | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("generations")
      .select(
        "id, preset, category, format, product_name, variant, model, prompt, source_image_url, preview_urls, provider, status, created_at, rating, kind, is_public, session_id",
      )
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("[db] getGenerationByIdForViewer failed:", error.message);
      return null;
    }

    const row = data as GenerationRow;
    if (!row.is_public && (!viewerSessionId || row.session_id !== viewerSessionId)) {
      return null;
    }

    return mapGenerationRow(row);
  } catch (err) {
    console.error(
      "[db] getGenerationByIdForViewer unexpected error:",
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

export async function updateGenerationVisibilityForOwner(
  generationId: string,
  isPublic: boolean,
  ownerSessionId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured() || !ownerSessionId) return false;

  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("generations")
      .update({ is_public: isPublic })
      .eq("id", generationId)
      .eq("session_id", ownerSessionId)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[db] updateGenerationVisibilityForOwner failed:", error.message);
      return false;
    }

    return Boolean(data);
  } catch (err) {
    console.error(
      "[db] updateGenerationVisibilityForOwner unexpected error:",
      err instanceof Error ? err.message : err,
    );
    return false;
  }
}

/**
 * Soft-delete a generation (GDPR right to erasure).
 * Sets deleted_at so the row is excluded from reads without destroying data.
 * Non-fatal: returns false if Supabase is not configured or the update fails.
 */
export async function softDeleteGeneration(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase
      .from("generations")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("[db] softDeleteGeneration failed:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[db] softDeleteGeneration unexpected error:", err instanceof Error ? err.message : err);
    return false;
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
