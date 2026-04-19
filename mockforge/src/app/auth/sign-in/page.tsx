"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();

    if (json.ok) {
      setStatus("sent");
      setMessage(json.message);
    } else {
      setStatus("error");
      setMessage(json.message ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
        <h1 className="mb-1 text-xl font-bold text-white">Sign in to MockForge</h1>
        <p className="mb-7 text-sm text-white/40">
          Enter your email and we&apos;ll send you a magic link.
        </p>

        {errorParam && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
            {decodeURIComponent(errorParam)}
          </div>
        )}

        {status === "sent" ? (
          <div className="rounded-xl border border-[#05DF72]/20 bg-[#05DF72]/[0.06] px-4 py-4 text-sm text-lime-200">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#05DF72]/40 focus:ring-1 focus:ring-lime-400/15"
            />
            {status === "error" && (
              <p className="text-sm text-red-400">{message}</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#05DF72] px-5 py-3.5 text-sm font-bold text-black transition hover:bg-[#34e58a] disabled:opacity-40"
            >
              {status === "loading" ? "Sending…" : "Send magic link"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
