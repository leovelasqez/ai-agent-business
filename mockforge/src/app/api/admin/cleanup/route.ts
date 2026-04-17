import { NextResponse } from "next/server";
import { cleanOldUploads } from "@/lib/file-storage";

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function POST(request: Request) {
  const secret = process.env.CLEANUP_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CLEANUP_SECRET is not configured on this server." },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await cleanOldUploads(MAX_AGE_MS);

  return NextResponse.json({
    ok: true,
    message: `Deleted ${deleted} file(s) older than 7 days from public/uploads/.`,
    deleted,
  });
}
