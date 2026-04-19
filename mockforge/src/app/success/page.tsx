"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/lib/language-context";
import { track } from "@/lib/analytics";

function SuccessContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    track("checkout_complete", { sessionId: sessionId ?? undefined });
  }, [sessionId]);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
      {/* Check mark */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-lime-400/20 bg-lime-400/[0.07]">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M10 18l6 6 10-12" stroke="#a3e635" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-lime-400">
        <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
        {t.success.badge}
      </div>
      <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
        {t.success.title}
      </h1>
      <p className="mt-5 max-w-xl text-base text-white/40">
        {t.success.description}
      </p>

      {sessionId && (
        <p className="mt-3 font-mono text-[11px] text-white/15">
          ref: {sessionId.slice(0, 24)}…
        </p>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/results"
          className="inline-flex items-center justify-center rounded-xl border border-white/[0.1] px-6 py-3 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
        >
          {t.success.viewResults}
        </Link>
        <Link
          href="/upload"
          className="inline-flex items-center justify-center rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-lime-300"
        >
          {t.success.generateMore}
        </Link>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <Suspense
        fallback={
          <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <span className="text-sm text-white/30">{t.success.title}</span>
          </main>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
