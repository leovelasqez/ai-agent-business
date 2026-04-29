import { NextResponse } from "next/server";
import { cleanOldUploads } from "@/lib/file-storage";
import { cleanOldSupabaseStorageObjects } from "@/lib/storage-provider";
import { isAuthorizedBearer } from "@/lib/admin-auth";

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function POST(request: Request) {
  const secret = process.env.CLEANUP_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CLEANUP_SECRET is not configured on this server." },
      { status: 500 },
    );
  }

  if (!isAuthorizedBearer(request, secret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const localDeleted = await cleanOldUploads(MAX_AGE_MS);
  const remoteDeleted = await cleanOldSupabaseStorageObjects(MAX_AGE_MS);
  const deleted = localDeleted + remoteDeleted;

  return NextResponse.json({
    ok: true,
    message: `Deleted ${deleted} file(s) older than 7 days.`,
    deleted,
    localDeleted,
    remoteDeleted,
  });
}
