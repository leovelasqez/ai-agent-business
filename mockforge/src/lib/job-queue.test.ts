import assert from "node:assert/strict";
import { enqueueGenerationJob, getGenerationJob } from "./job-queue";

async function main() {
  const job = enqueueGenerationJob({
    preset: "clean_studio",
    category: "bottle",
    format: "1:1",
    productName: "Test",
    sourceImageUrl: "http://invalid-url",
    variant: "a",
    sessionId: "test-session",
  });

  assert.equal(job.status, "queued");

  await new Promise((resolve) => setTimeout(resolve, 20));

  const stored = await getGenerationJob(job.id);
  assert.ok(stored);
  assert.ok(stored?.status === "failed" || stored?.status === "processing" || stored?.status === "completed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
