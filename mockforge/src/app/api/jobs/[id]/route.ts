import { NextResponse } from "next/server";
import { getGenerationJob } from "@/lib/job-queue";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const job = await getGenerationJob(id);

  if (!job) {
    return NextResponse.json(
      {
        ok: false,
        error: "JOB_NOT_FOUND",
        message: "No se encontró ese job.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    data: job,
  });
}
