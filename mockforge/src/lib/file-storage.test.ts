import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { saveUploadToLocal } from "@/lib/file-storage";

async function run() {
  const file = new File(["hello world"], "test-image.png", { type: "image/png" });
  const result = await saveUploadToLocal(file);

  assert.ok(result.fileName.includes("test-image.png"));
  assert.ok(result.publicPath.startsWith("/api/uploads/"));
  assert.ok(existsSync(result.absolutePath));

  await unlink(result.absolutePath);

  console.log("file-storage test passed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
