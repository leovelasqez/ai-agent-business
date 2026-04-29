/**
 * Tests for the credit system: no-charge on provider failure, refund on error,
 * and idempotent grant behavior.
 *
 * Run: npx tsx src/lib/credits.test.ts
 * (Uses in-memory fallback when Supabase is not configured)
 */

import assert from "node:assert/strict";
import {
  getBalance,
  deductCredits,
  deductCreditsAmount,
  grantCredits,
  refundCreditsAmount,
  maybeGrantFreeTrial,
  CREDIT_COST,
  CREDIT_TIERS,
} from "./credits";

// ── Helpers ──────────────────────────────────────────────────────────────────

let testNum = 0;
function uid() {
  return `test-session-${Date.now()}-${++testNum}`;
}

// ── Tests ────────────────────────────────────────────────────────────────────

async function testFreeTrial() {
  const id = uid();
  const balance = await maybeGrantFreeTrial(id);
  assert.ok(balance > 0, `Expected positive balance after free trial, got ${balance}`);
  assert.equal(balance, CREDIT_TIERS.free_trial);

  // Second call should NOT grant again
  const balance2 = await maybeGrantFreeTrial(id);
  assert.equal(balance2, balance, "Free trial should not be granted twice");
  console.log("✓ testFreeTrial");
}

async function testDeductAndRefund() {
  const id = uid();
  await grantCredits(id, "purchase_single");

  const initial = await getBalance(id);
  assert.equal(initial, CREDIT_TIERS.purchase_single);

  // Deduct 1 credit (variant A)
  const cost = CREDIT_COST.a;
  const result = await deductCredits(id, "a");
  assert.ok(result.ok, "Deduction should succeed");
  assert.equal(result.balance, initial - cost);

  // Refund
  const afterRefund = await refundCreditsAmount(id, cost, "test_refund");
  assert.equal(afterRefund, initial, "Balance should be restored after refund");
  console.log("✓ testDeductAndRefund");
}

async function testNoChargeOnInsufficientBalance() {
  const id = uid();
  // No credits granted — balance is 0
  const result = await deductCredits(id, "a");
  assert.ok(!result.ok, "Deduction should fail with 0 balance");
  assert.equal(result.balance, 0);
  console.log("✓ testNoChargeOnInsufficientBalance");
}

async function testRefundOnlyPositive() {
  const id = uid();
  const before = await getBalance(id);
  // Refund with 0 or negative should be a no-op
  const after = await refundCreditsAmount(id, 0, "noop");
  assert.equal(after, before, "Refund of 0 should be a no-op");
  console.log("✓ testRefundOnlyPositive");
}

async function testBatchPartialRefund() {
  const id = uid();
  await grantCredits(id, "purchase_bundle");

  const initial = await getBalance(id);
  const totalCost = CREDIT_COST.a + CREDIT_COST.b + CREDIT_COST.c; // 1 + 2 + 2 = 5

  // Simulate batch: deduct total upfront
  const dedResult = await deductCreditsAmount(id, totalCost);
  assert.ok(dedResult.ok, "Batch deduction should succeed");
  assert.equal(dedResult.balance, initial - totalCost);

  // Simulate: variant B failed, refund its cost
  const refundAmount = CREDIT_COST.b; // 2
  const afterRefund = await refundCreditsAmount(id, refundAmount, "refund_batch_failed_variants");
  assert.equal(afterRefund, initial - totalCost + refundAmount);
  console.log("✓ testBatchPartialRefund");
}

async function testUpscaleCost() {
  const id = uid();
  await grantCredits(id, "purchase_single");

  const initial = await getBalance(id);
  const result = await deductCredits(id, "upscale");
  assert.ok(result.ok);
  assert.equal(result.balance, initial - CREDIT_COST.upscale);
  console.log("✓ testUpscaleCost");
}

async function testVideoCost() {
  const id = uid();
  await grantCredits(id, "purchase_bundle");

  const initial = await getBalance(id);
  const result = await deductCredits(id, "video");
  assert.ok(result.ok);
  assert.equal(result.balance, initial - CREDIT_COST.video);
  console.log("✓ testVideoCost");
}

async function testVariantDCost() {
  const id = uid();
  await grantCredits(id, "purchase_single");

  const initial = await getBalance(id);
  const result = await deductCredits(id, "d");
  assert.ok(result.ok);
  assert.equal(result.balance, initial - CREDIT_COST.d);
  console.log("✓ testVariantDCost");
}


async function withEnv<T>(env: Record<string, string | undefined>, fn: () => Promise<T>): Promise<T> {
  const previous: Record<string, string | undefined> = {};
  for (const key of Object.keys(env)) {
    previous[key] = process.env[key];
    const value = env[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    return await fn();
  } finally {
    for (const key of Object.keys(previous)) {
      const value = previous[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

async function testSupabaseDbErrorFallsBackOutsideProduction() {
  await withEnv(
    {
      NODE_ENV: "test",
      NEXT_PUBLIC_SUPABASE_URL: "not-a-valid-url",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
    },
    async () => {
      const id = uid();
      const balance = await getBalance(id);
      assert.equal(balance, 0, "DB errors should still fall back to memory outside production");
    },
  );
  console.log("✓ testSupabaseDbErrorFallsBackOutsideProduction");
}

async function testSupabaseDbErrorFailsClosedInProduction() {
  await withEnv(
    {
      NODE_ENV: "production",
      NEXT_PUBLIC_SUPABASE_URL: "not-a-valid-url",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
    },
    async () => {
      const id = uid();
      await assert.rejects(
        () => getBalance(id),
        /Invalid URL|supabase/i,
        "DB errors must not fall back to memory in production when Supabase is configured",
      );
    },
  );
  console.log("✓ testSupabaseDbErrorFailsClosedInProduction");
}

// ── Runner ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("Running credit system tests (in-memory fallback)…\n");

  await testFreeTrial();
  await testDeductAndRefund();
  await testNoChargeOnInsufficientBalance();
  await testRefundOnlyPositive();
  await testBatchPartialRefund();
  await testUpscaleCost();
  await testVideoCost();
  await testVariantDCost();
  await testSupabaseDbErrorFallsBackOutsideProduction();
  await testSupabaseDbErrorFailsClosedInProduction();

  console.log("\n✅ All credit tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
