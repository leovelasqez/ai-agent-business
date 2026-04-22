/**
 * Credit system for MockForge.
 *
 * Tiers:
 *  - Free trial: 3 credits on first use
 *  - Single pack ($X): 10 credits
 *  - Bundle ($Y): 35 credits
 *
 * Cost per generation:
 *  - Variant A (FLUX Kontext Dev): 1 credit
 *  - Variant B (FLUX Kontext Pro): 2 credits
 *  - Variant C (GPT Image 1):      2 credits
 *  - Video generation:             3 credits
 *
 * When Supabase is not configured the app falls back to an in-memory store
 * (credits reset on server restart) so the MVP still works locally.
 */

import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export const CREDIT_TIERS = {
  free_trial: 3,
  purchase_single: 10,
  purchase_bundle: 35,
} as const;

export type CreditTier = keyof typeof CREDIT_TIERS;

export const CREDIT_COST: Record<string, number> = {
  a: 1,
  b: 2,
  c: 2,
  d: 1,
  video: 3,
  upscale: 1,
};

// ---------- In-memory fallback (no DB) ----------

const _memStore: Map<string, number> = new Map();

function memGetBalance(sessionId: string): number {
  return _memStore.get(sessionId) ?? 0;
}

function memDeduct(sessionId: string, amount: number): boolean {
  const balance = memGetBalance(sessionId);
  if (balance < amount) return false;
  _memStore.set(sessionId, balance - amount);
  return true;
}

function memCredit(sessionId: string, amount: number) {
  _memStore.set(sessionId, memGetBalance(sessionId) + amount);
}

// ---------- Supabase-backed implementation ----------

async function dbGetOrCreateAccount(sessionId: string) {
  const sb = getSupabaseServiceClient();

  const { data: existing } = await sb
    .from("credit_accounts")
    .select("id, balance")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (existing) return existing;

  const { data: created } = await sb
    .from("credit_accounts")
    .insert({ session_id: sessionId, balance: 0 })
    .select("id, balance")
    .single();

  return created;
}

async function dbGetBalance(sessionId: string): Promise<number> {
  const sb = getSupabaseServiceClient();
  const { data } = await sb
    .from("credit_accounts")
    .select("balance")
    .eq("session_id", sessionId)
    .maybeSingle();
  return data?.balance ?? 0;
}

async function dbDeduct(
  sessionId: string,
  amount: number,
  generationId?: string,
): Promise<{ ok: boolean; balance: number }> {
  const sb = getSupabaseServiceClient();

  const { data, error } = await sb.rpc("deduct_credits_atomic", {
    p_session_id: sessionId,
    p_amount: amount,
    p_generation_id: generationId ?? null,
  });

  if (error) {
    throw new Error(`deduct_credits_atomic failed: ${error.message}`);
  }

  const row = Array.isArray(data) ? data[0] : data;
  return {
    ok: Boolean(row?.ok),
    balance: Number(row?.balance ?? 0),
  };
}

async function dbCredit(
  sessionId: string,
  amount: number,
  reason: string,
  stripeSession?: string,
): Promise<{ balance: number; applied: boolean }> {
  const sb = getSupabaseServiceClient();

  if (!stripeSession) {
    const account = await dbGetOrCreateAccount(sessionId);
    if (!account) {
      return { balance: 0, applied: false };
    }

    const { error } = await sb
      .from("credit_accounts")
      .update({ balance: account.balance + amount })
      .eq("session_id", sessionId);

    if (error) {
      throw new Error(`dbCredit update failed: ${error.message}`);
    }

    await sb.from("credit_transactions").insert({
      session_id: sessionId,
      amount,
      reason,
      stripe_session: null,
    });

    return { balance: await dbGetBalance(sessionId), applied: true };
  }

  const { data, error } = await sb.rpc("grant_credits_once", {
    p_session_id: sessionId,
    p_amount: amount,
    p_reason: reason,
    p_stripe_session: stripeSession,
  });

  if (error) {
    throw new Error(`grant_credits_once failed: ${error.message}`);
  }

  const row = Array.isArray(data) ? data[0] : data;
  return {
    balance: Number(row?.balance ?? 0),
    applied: Boolean(row?.applied),
  };
}

// ---------- Public API ----------

export async function getBalance(sessionId: string): Promise<number> {
  if (!isSupabaseConfigured()) return memGetBalance(sessionId);
  try {
    return await dbGetBalance(sessionId);
  } catch {
    return memGetBalance(sessionId);
  }
}

/**
 * Deduct credits for a generation. Returns false if insufficient balance.
 */
export async function deductCredits(
  sessionId: string,
  variant: string,
  generationId?: string,
): Promise<{ ok: boolean; balance: number; cost: number }> {
  return deductCreditsAmount(sessionId, CREDIT_COST[variant] ?? 1, generationId);
}

export async function deductCreditsAmount(
  sessionId: string,
  cost: number,
  generationId?: string,
): Promise<{ ok: boolean; balance: number; cost: number }> {
  if (!isSupabaseConfigured()) {
    const ok = memDeduct(sessionId, cost);
    return { ok, balance: memGetBalance(sessionId), cost };
  }

  try {
    const result = await dbDeduct(sessionId, cost, generationId);
    return { ok: result.ok, balance: result.balance, cost };
  } catch {
    const ok = memDeduct(sessionId, cost);
    return { ok, balance: memGetBalance(sessionId), cost };
  }
}

/**
 * Grant credits (free trial or after purchase).
 */
export async function grantCredits(
  sessionId: string,
  tier: CreditTier,
  stripeSession?: string,
): Promise<number> {
  const amount = CREDIT_TIERS[tier];

  if (!isSupabaseConfigured()) {
    memCredit(sessionId, amount);
    return memGetBalance(sessionId);
  }

  try {
    const result = await dbCredit(sessionId, amount, tier, stripeSession);
    return result.balance;
  } catch {
    memCredit(sessionId, amount);
    return memGetBalance(sessionId);
  }
}

/**
 * Grant free trial credits if the session has never had any.
 * Safe to call on every first visit.
 */
export async function maybeGrantFreeTrial(sessionId: string): Promise<number> {
  const balance = await getBalance(sessionId);
  if (balance > 0) return balance;

  // Check if they've ever had a transaction (used all credits)
  if (isSupabaseConfigured()) {
    try {
      const sb = getSupabaseServiceClient();
      const { count } = await sb
        .from("credit_transactions")
        .select("id", { count: "exact", head: true })
        .eq("session_id", sessionId);
      if ((count ?? 0) > 0) return 0; // Already received free trial
    } catch {
      // fall through to grant
    }
  }

  return grantCredits(sessionId, "free_trial");
}

/**
 * Refund arbitrary credits after an internal/provider failure.
 * This is intentionally separate from purchase grants and free-trial grants.
 */
export async function refundCreditsAmount(
  sessionId: string,
  amount: number,
  reason = "refund_internal_failure",
): Promise<number> {
  if (amount <= 0) {
    return getBalance(sessionId);
  }

  if (!isSupabaseConfigured()) {
    memCredit(sessionId, amount);
    return memGetBalance(sessionId);
  }

  try {
    const result = await dbCredit(sessionId, amount, reason);
    return result.balance;
  } catch {
    memCredit(sessionId, amount);
    return memGetBalance(sessionId);
  }
}
