import assert from "node:assert/strict";
import { unlink } from "node:fs/promises";
import { GET as getUploadFile } from "@/app/api/uploads/[file]/route";
import { GET as getAdminCosts } from "@/app/api/admin/costs/route";
import { GET as getProviderHealth } from "@/app/api/provider/health/route";
import { POST as postDebugUpload } from "@/app/api/debug/upload/route";
import {
  saveInputUpload,
  getStorageBackend,
} from "@/lib/storage-provider";
import {
  assertImageProviderReady,
  getConfiguredImageProvider,
} from "@/lib/image-provider";
import {
  deductCredits,
  getBalance,
  refundCreditsAmount,
} from "@/lib/credits";

const ORIGINAL_ENV = { ...process.env };
const ORIGINAL_FETCH = global.fetch;

async function cleanupUpload(fileName: string) {
  await unlink(`${process.cwd()}/public/uploads/${fileName.replace(/.*\//, "")}`).catch(() => {});
}

async function main() {
  process.env = { ...ORIGINAL_ENV };

  const localUpload = await saveInputUpload(
    new File([Buffer.from("fake-png-bytes")], "launch-check.png", { type: "image/png" }),
  );
  assert.equal(localUpload.backend, "local");
  assert.ok(localUpload.publicPath.startsWith("/api/uploads/"));

  const routeResponse = await getUploadFile(new Request("http://localhost/api/uploads/test"), {
    params: Promise.resolve({ file: localUpload.fileName }),
  });
  assert.equal(routeResponse.status, 200);
  assert.equal(routeResponse.headers.get("content-type"), "image/png");

  const traversalResponse = await getUploadFile(new Request("http://localhost/api/uploads/test"), {
    params: Promise.resolve({ file: "../secret.txt" }),
  });
  assert.equal(traversalResponse.status, 404);
  await cleanupUpload(localUpload.fileName);

  process.env.STORAGE_PROVIDER = "cdn";
  process.env.BUNNY_STORAGE_API_KEY = "test-key";
  process.env.BUNNY_STORAGE_ZONE = "test-zone";
  process.env.BUNNY_CDN_URL = "https://cdn.example.com";
  global.fetch = (async () => {
    throw new Error("simulated bunny outage");
  }) as typeof fetch;

  const fallbackUpload = await saveInputUpload(
    new File([Buffer.from("fallback-bytes")], "fallback.png", { type: "image/png" }),
  );
  assert.equal(getStorageBackend(), "cdn");
  assert.equal(fallbackUpload.backend, "local");
  assert.ok(fallbackUpload.publicPath.startsWith("/api/uploads/"));
  await cleanupUpload(fallbackUpload.fileName);

  process.env = { ...ORIGINAL_ENV };
  global.fetch = ORIGINAL_FETCH;

  delete process.env.FAL_KEY;
  process.env.IMAGE_PROVIDER = "fal";
  assert.throws(() => assertImageProviderReady(getConfiguredImageProvider()), /FAL_KEY is missing/);
  process.env.IMAGE_PROVIDER = "unsupported";
  assert.throws(
    () => assertImageProviderReady(getConfiguredImageProvider()),
    /Unsupported IMAGE_PROVIDER/,
  );

  delete process.env.ADMIN_SECRET;
  const closedResponse = await getAdminCosts(new Request("http://localhost/api/admin/costs"));
  assert.equal(closedResponse.status, 403);

  process.env.ADMIN_SECRET = "top-secret";
  const unauthorizedResponse = await getAdminCosts(
    new Request("http://localhost/api/admin/costs", {
      headers: { "x-admin-secret": "wrong" },
    }),
  );
  assert.equal(unauthorizedResponse.status, 401);

  const authorizedResponse = await getAdminCosts(
    new Request("http://localhost/api/admin/costs", {
      headers: { "x-admin-secret": "top-secret" },
    }),
  );
  assert.equal(authorizedResponse.status, 200);

  const originalNodeEnv = process.env.NODE_ENV;
  // @ts-expect-error -- NODE_ENV is read-only in type but writable at runtime in Node.js
  process.env.NODE_ENV = "production";
  delete process.env.DEBUG_UPLOAD_SECRET;
  const debugBlocked = await postDebugUpload(new Request("http://localhost/api/debug/upload", { method: "POST" }));
  assert.equal(debugBlocked.status, 404);
  // @ts-expect-error -- restoring NODE_ENV
  process.env.NODE_ENV = originalNodeEnv;

  process.env.PROVIDER_HEALTH_SECRET = "health-secret";
  process.env.IMAGE_PROVIDER = "fal";
  process.env.FAL_KEY = "test-key";
  const hiddenMetricsResponse = await getProviderHealth(
    new Request("http://localhost/api/provider/health"),
  );
  const hiddenMetricsJson = await hiddenMetricsResponse.json();
  assert.equal(hiddenMetricsJson.metrics, undefined);

  const visibleMetricsResponse = await getProviderHealth(
    new Request("http://localhost/api/provider/health", {
      headers: { "x-provider-health-secret": "health-secret" },
    }),
  );
  const visibleMetricsJson = await visibleMetricsResponse.json();
  assert.ok(visibleMetricsJson.metrics);

  const sessionId = "launch-test-session";
  await refundCreditsAmount(sessionId, 3, "manual_seed");
  const charge = await deductCredits(sessionId, "b");
  assert.equal(charge.ok, true);
  assert.equal(charge.cost, 2);
  await refundCreditsAmount(sessionId, charge.cost, "refund_test");
  assert.equal(await getBalance(sessionId), 3);

  console.log("launch-readiness tests passed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    process.env = ORIGINAL_ENV;
    global.fetch = ORIGINAL_FETCH;
  });
