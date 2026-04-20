import { NextResponse } from "next/server";
import { getGenerationByIdForViewer } from "@/lib/db/generations";
import { getTrustedSessionIdFromRequest } from "@/lib/session";
import { getServerUser } from "@/lib/supabase-server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const authedUser = await getServerUser();
  const viewerSessionId = authedUser?.id ?? getTrustedSessionIdFromRequest(_request);
  const generation = await getGenerationByIdForViewer(id, viewerSessionId);

  if (!generation) {
    return NextResponse.json(
      {
        ok: false,
        error: "GENERATION_NOT_FOUND",
        message: "No se encontró esa generación.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    data: generation,
  });
}
