/**
 * DB helpers for the `generation_jobs` table.
 * No-ops when Supabase is not configured.
 */

import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import type { GenerationJobState } from "@/lib/job-queue-types";

export async function dbCreateJob(
  id: string,
  inputJson: unknown,
  region?: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await getSupabaseServiceClient()
      .from("generation_jobs")
      .insert({
        id,
        status: "queued",
        input_json: inputJson,
        region: region ?? null,
        updated_at: new Date().toISOString(),
      });
    if (error) console.error("[db/jobs] createJob failed:", error.message);
    return !error;
  } catch (err) {
    console.error("[db/jobs] createJob unexpected error:", err instanceof Error ? err.message : err);
    return false;
  }
}

export async function dbUpdateJob(
  id: string,
  patch: {
    status: GenerationJobState["status"];
    resultJson?: unknown;
    error?: string;
  },
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await getSupabaseServiceClient()
      .from("generation_jobs")
      .update({
        status: patch.status,
        result_json: patch.resultJson ?? null,
        error: patch.error ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) console.error("[db/jobs] updateJob failed:", error.message);
  } catch (err) {
    console.error("[db/jobs] updateJob unexpected error:", err instanceof Error ? err.message : err);
  }
}

export async function dbGetJob(id: string): Promise<GenerationJobState | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await getSupabaseServiceClient()
      .from("generation_jobs")
      .select("id, status, result_json, error, created_at, updated_at")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as {
      id: string;
      status: GenerationJobState["status"];
      result_json: GenerationJobState["result"] | null;
      error: string | null;
      created_at: string;
      updated_at: string;
    };
    return {
      id: row.id,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      error: row.error ?? undefined,
      result: row.result_json ?? undefined,
    };
  } catch (err) {
    console.error("[db/jobs] getJob unexpected error:", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Reset jobs stuck in 'processing' for more than 10 minutes back to 'queued'. */
export async function dbRecoverStalledJobs(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  try {
    const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data, error } = await getSupabaseServiceClient()
      .from("generation_jobs")
      .update({ status: "queued", updated_at: new Date().toISOString() })
      .eq("status", "processing")
      .lt("updated_at", cutoff)
      .select("id");
    if (error) {
      console.error("[db/jobs] recoverStalledJobs failed:", error.message);
      return 0;
    }
    return (data as { id: string }[]).length;
  } catch {
    return 0;
  }
}
