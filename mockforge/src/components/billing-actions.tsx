"use client";

import { useState } from "react";

const PACKS = [
  { id: "single", label: "$9 · Unlock 1 HD pack", description: "Best for testing one product angle." },
  { id: "bundle", label: "$19 · Buy 3 HD packs", description: "Best value for a short creative sprint." },
] as const;

export function BillingActions() {
  const [loading, setLoading] = useState<(typeof PACKS)[number]["id"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(pkg: (typeof PACKS)[number]["id"]) {
    setLoading(pkg);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package: pkg }),
      });
      const json = await response.json() as { ok: boolean; data?: { checkoutUrl?: string }; message?: string };

      if (json.ok && json.data?.checkoutUrl) {
        window.location.href = json.data.checkoutUrl;
        return;
      }

      setError(json.message ?? "Could not start checkout. Please try again.");
    } catch {
      setError("Could not connect to the payment server. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {PACKS.map((pack) => (
          <button
            key={pack.id}
            type="button"
            onClick={() => startCheckout(pack.id)}
            disabled={loading !== null}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-cyan-300/50 hover:bg-cyan-300/10 disabled:cursor-wait disabled:opacity-60"
          >
            <div className="text-sm font-bold text-white">
              {loading === pack.id ? "Redirecting…" : pack.label}
            </div>
            <p className="mt-2 text-sm text-white/55">{pack.description}</p>
          </button>
        ))}
      </div>
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
