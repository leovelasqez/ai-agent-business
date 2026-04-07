import { NextResponse } from "next/server";
import { getGenerationById } from "@/lib/db/generations";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const generation = await getGenerationById(id);

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
