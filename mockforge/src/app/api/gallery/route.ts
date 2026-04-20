import { NextResponse } from "next/server";
import { getSupabaseReadClient, isSupabaseConfigured } from "@/lib/supabase";
import { updateGenerationVisibilityForOwner } from "@/lib/db/generations";
import { getTrustedSessionIdFromRequest } from "@/lib/session";
import { getServerUser } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? "24"), 48);
  const cursor = searchParams.get("cursor");

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, data: { items: [], nextCursor: null } });
  }

  const sb = getSupabaseReadClient();

  let query = sb
    .from("generations")
    .select("id, preset, category, preview_urls, created_at")
    .eq("is_public", true)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const items = (data ?? []).slice(0, limit);
  const nextCursor = (data ?? []).length > limit ? items[items.length - 1].created_at : null;

  return NextResponse.json({ ok: true, data: { items, nextCursor } });
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true });
  }

  const authedUser = await getServerUser();
  const viewerSessionId = authedUser?.id ?? getTrustedSessionIdFromRequest(request);
  if (!viewerSessionId) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { generationId, isPublic } = body as { generationId?: string; isPublic?: boolean };

  if (!generationId || typeof isPublic !== "boolean") {
    return NextResponse.json({ ok: false, message: "generationId and isPublic required" }, { status: 400 });
  }

  const updated = await updateGenerationVisibilityForOwner(generationId, isPublic, viewerSessionId);
  if (!updated) {
    return NextResponse.json({ ok: false, error: "NOT_FOUND_OR_FORBIDDEN" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
