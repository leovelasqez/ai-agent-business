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

async function dbDeduct(sessionId: string, amount: number, generationId?: string): Promise<boolean> {
  const sb = getSupabaseServiceClient();

  const account = await dbGetOrCreateAccount(sessionId);
  if (!account || account.balance < amount) return false;

  const { error } = await sb
    .from("credit_accounts")
    .update({ balance: account.balance - amount })
    .eq("session_id", sessionId);

  if (error) return false;

  await sb.from("credit_transactions").insert({
    session_id: sessionId,
    amount: -amount,
    reason: "generation",
    generation_id: generationId ?? null,
  });

  return true;
}

async function dbCredit(sessionId: string, amount: number, reason: string, stripeSession?: string) {
  const sb = getSupabaseServiceClient();

  const account = await dbGetOrCreateAccount(sessionId);
  if (!account) return;

  await sb
    .from("credit_accounts")
    .update({ balance: account.balance + amount })
    .eq("session_id", sessionId);

  await sb.from("credit_transactions").insert({
    session_id: sessionId,
    amount,
    reason,
    stripe_session: stripeSession ?? null,
  });
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
  const cost = CREDIT_COST[variant] ?? 1;

  if (!isSupabaseConfigured()) {
    const ok = memDeduct(sessionId, cost);
    return { ok, balance: memGetBalance(sessionId), cost };
  }

  try {
    const ok = await dbDeduct(sessionId, cost, generationId);
    const balance = await dbGetBalance(sessionId);
    return { ok, balance, cost };
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
    await dbCredit(sessionId, amount, tier, stripeSession);
    return await dbGetBalance(sessionId);
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
