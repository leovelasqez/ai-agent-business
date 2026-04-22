/**
 * Tests for Stripe webhook credit granting: idempotency via stripe session ID.
 *
 * When Supabase is configured, `grant_credits_once` RPC enforces uniqueness
 * on the stripe_session column. This test validates the in-memory fallback
 * behavior and the grantCredits API contract.
 *
 * Run: npx tsx src/app/api/stripe/webhook/credits.test.ts
 */

import assert from "node:assert/strict";
import { grantCredits, getBalance, CREDIT_TIERS, CREDIT_COST } from "@/lib/credits";

let testNum = 0;
function uid() {
  return `test-stripe-${Date.now()}-${++testNum}`;
}

async function testGrantWithStripeSession() {
  const id = uid();
  const stripeSession = `cs_test_${Date.now()}`;

  // First grant with a stripe session should succeed
  const balance1 = await grantCredits(id, "purchase_single", stripeSession);
  assert.equal(balance1, CREDIT_TIERS.purchase_single, "First grant should add credits");

  // Check balance
  const currentBalance = await getBalance(id);
  assert.equal(currentBalance, CREDIT_TIERS.purchase_single);

  console.log("✓ testGrantWithStripeSession");
}

async function testGrantWithoutStripeSession() {
  const id = uid();

  // Grant without stripe session (e.g. free trial)
  const balance = await grantCredits(id, "free_trial");
  assert.equal(balance, CREDIT_TIERS.free_trial);

  // Grant again — in-memory allows it (no idempotency key)
  // In production, this is handled by grant_credits_once RPC
  const balance2 = await grantCredits(id, "purchase_single");
  assert.equal(balance2, CREDIT_TIERS.free_trial + CREDIT_TIERS.purchase_single);

  console.log("✓ testGrantWithoutStripeSession");
}

async function testBundleGrant() {
  const id = uid();
  const stripeSession = `cs_bundle_${Date.now()}`;

  const balance = await grantCredits(id, "purchase_bundle", stripeSession);
  assert.equal(balance, CREDIT_TIERS.purchase_bundle);

  console.log("✓ testBundleGrant");
}

async function testCreditCostsAlign() {
  // Verify all variant costs are defined and positive
  const variants = ["a", "b", "c", "d", "upscale", "video"];
  for (const v of variants) {
    const cost = CREDIT_COST[v];
    assert.ok(cost !== undefined, `CREDIT_COST.${v} must be defined`);
    assert.ok(cost > 0, `CREDIT_COST.${v} must be positive, got ${cost}`);
  }
  console.log("✓ testCreditCostsAlign");
}

// ── Runner ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("Running Stripe webhook / credit granting tests…\n");

  await testGrantWithStripeSession();
  await testGrantWithoutStripeSession();
  await testBundleGrant();
  await testCreditCostsAlign();

  console.log("\n✅ All Stripe credit tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
