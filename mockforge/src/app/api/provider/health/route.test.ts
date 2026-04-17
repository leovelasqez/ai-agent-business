import assert from "node:assert/strict";
import { GET } from "./route";

async function main() {
  delete process.env.FAL_KEY;
  const response = await GET(new Request("http://localhost/api/provider/health"));
  assert.equal(response.status, 503);

  process.env.FAL_KEY = "test-key";
  const okResponse = await GET(new Request("http://localhost/api/provider/health", {
    headers: { "x-request-id": "health-test" },
  }));
  assert.equal(okResponse.status, 200);

  const json = await okResponse.json();
  assert.equal(json.requestId, "health-test");
  assert.equal(json.checks.provider.configured, true);
  assert.ok(json.metrics);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
