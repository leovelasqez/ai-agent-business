import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import {
  getStorageBackend,
  isSupabaseStorageReady,
  STORAGE_BUCKETS,
  saveInputUpload,
  saveOutputBase64,
} from "@/lib/storage-provider";

async function run() {
  // Backend defaults to local when STORAGE_PROVIDER is unset
  assert.equal(getStorageBackend(), "local", "default backend is local");
  assert.equal(isSupabaseStorageReady(), false, "supabase not ready without env vars");

  // Bucket name constants
  assert.equal(STORAGE_BUCKETS.inputs, "mockforge-inputs");
  assert.equal(STORAGE_BUCKETS.outputs, "mockforge-outputs");

  // saveInputUpload — local backend
  const file = new File(["fake-png-bytes"], "test-input.png", { type: "image/png" });
  const inputResult = await saveInputUpload(file);
  assert.equal(inputResult.backend, "local");
  assert.ok(inputResult.publicPath.startsWith("/api/uploads/"));
  assert.ok(existsSync(inputResult.fileName.startsWith("/") ? inputResult.fileName : `${process.cwd()}/public/uploads/${inputResult.fileName.replace(/.*\//, "")}`));
  await unlink(`${process.cwd()}/public/uploads/${inputResult.fileName.replace(/.*\//, "")}`).catch(() => {});

  // saveOutputBase64 — local backend, raw base64 (no data-URL prefix)
  const fakeBase64 = Buffer.from("fake-image-bytes").toString("base64");
  const base64Result = await saveOutputBase64(fakeBase64, "test-output");
  assert.equal(base64Result.backend, "local");
  assert.ok(base64Result.publicPath.startsWith("/api/uploads/"));
  await unlink(`${process.cwd()}/public/uploads/${base64Result.fileName}`).catch(() => {});

  // STORAGE_PROVIDER=supabase without Supabase env vars → falls back to local
  const originalProvider = process.env.STORAGE_PROVIDER;
  process.env.STORAGE_PROVIDER = "supabase";
  try {
    // isSupabaseStorageReady() should be false (env vars absent in test)
    assert.equal(isSupabaseStorageReady(), false, "supabase not ready without URL/key env vars");
    assert.equal(getStorageBackend(), "local", "backend is local when supabase vars missing");

    const fallbackResult = await saveInputUpload(new File(["x"], "x.png", { type: "image/png" }));
    assert.equal(fallbackResult.backend, "local", "falls back to local when supabase vars missing");
    assert.ok(fallbackResult.publicPath.startsWith("/api/uploads/"));
    await unlink(`${process.cwd()}/public/uploads/${fallbackResult.fileName.replace(/.*\//, "")}`).catch(() => {});
  } finally {
    process.env.STORAGE_PROVIDER = originalProvider;
  }

  console.log("storage-provider tests passed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
