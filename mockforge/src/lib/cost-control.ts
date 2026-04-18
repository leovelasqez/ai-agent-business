/**
 * Cost controls for fal.ai generation spend.
 *
 * Tracks estimated daily and monthly spend per variant.
 * Provides an automatic kill switch when budgets are exceeded.
 *
 * All costs are approximate estimates — actual billing is on fal.ai's dashboard.
 *
 * Configure via env vars:
 *   COST_LIMIT_DAILY_USD   — daily spend limit in USD (default: 20)
 *   COST_LIMIT_MONTHLY_USD — monthly spend limit in USD (default: 200)
 *
 * When a limit is hit, generation endpoints return 503 with BUDGET_EXCEEDED.
 * Reset is automatic at midnight UTC (daily) / start of month (monthly).
 */

// Estimated cost per generation by variant (USD)
export const VARIANT_COST_USD: Record<string, number> = {
  a: 0.003, // Nano Banana 2 — cheap
  b: 0.04,  // GPT Image 1 — moderate
  c: 0.08,  // FLUX.2 Pro  — expensive
  video: 0.15, // Kling video — most expensive
  batch: 0.12, // 3-variant batch (avg weighted)
};

interface DailySpend {
  date: string; // YYYY-MM-DD
  totalUsd: number;
  byVariant: Record<string, number>;
  generationCount: number;
}

interface MonthlySpend {
  month: string; // YYYY-MM
  totalUsd: number;
  byVariant: Record<string, number>;
}

// In-memory spend tracking (resets on server restart)
let daily: DailySpend = { date: "", totalUsd: 0, byVariant: {}, generationCount: 0 };
let monthly: MonthlySpend = { month: "", totalUsd: 0, byVariant: {} };

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function thisMonthStr(): string {
  return new Date().toISOString().slice(0, 7);
}

function ensureCurrentPeriods(): void {
  const today = todayStr();
  const month = thisMonthStr();
  if (daily.date !== today) daily = { date: today, totalUsd: 0, byVariant: {}, generationCount: 0 };
  if (monthly.month !== month) monthly = { month, totalUsd: 0, byVariant: {} };
}

/**
 * Record a generation and add its estimated cost to the trackers.
 * Call this AFTER a successful generation.
 */
export function recordGenerationCost(variant: string): void {
  const cost = VARIANT_COST_USD[variant] ?? VARIANT_COST_USD.a;
  ensureCurrentPeriods();

  daily.totalUsd += cost;
  daily.byVariant[variant] = (daily.byVariant[variant] ?? 0) + cost;
  daily.generationCount += 1;

  monthly.totalUsd += cost;
  monthly.byVariant[variant] = (monthly.byVariant[variant] ?? 0) + cost;
}

/**
 * Returns true if the daily or monthly spend limit has been exceeded.
 * Call this BEFORE starting a generation.
 */
export function isBudgetExceeded(): { exceeded: boolean; reason?: string } {
  ensureCurrentPeriods();

  const dailyLimit = Number(process.env.COST_LIMIT_DAILY_USD ?? 20);
  const monthlyLimit = Number(process.env.COST_LIMIT_MONTHLY_USD ?? 200);

  if (daily.totalUsd >= dailyLimit) {
    return {
      exceeded: true,
      reason: `Daily spend limit of $${dailyLimit} reached ($${daily.totalUsd.toFixed(2)} used today). Resets at midnight UTC.`,
    };
  }

  if (monthly.totalUsd >= monthlyLimit) {
    return {
      exceeded: true,
      reason: `Monthly spend limit of $${monthlyLimit} reached ($${monthly.totalUsd.toFixed(2)} used this month).`,
    };
  }

  return { exceeded: false };
}

/** Returns a dashboard snapshot of current spend. */
export function getCostSnapshot(): {
  daily: DailySpend;
  monthly: MonthlySpend;
  limits: { dailyUsd: number; monthlyUsd: number };
  killSwitchActive: boolean;
} {
  ensureCurrentPeriods();
  const dailyLimit = Number(process.env.COST_LIMIT_DAILY_USD ?? 20);
  const monthlyLimit = Number(process.env.COST_LIMIT_MONTHLY_USD ?? 200);
  return {
    daily: { ...daily },
    monthly: { ...monthly },
    limits: { dailyUsd: dailyLimit, monthlyUsd: monthlyLimit },
    killSwitchActive: isBudgetExceeded().exceeded,
  };
}
