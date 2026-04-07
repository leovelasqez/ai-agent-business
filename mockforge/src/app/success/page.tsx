"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/lib/language-context";

export default function SuccessPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
        <SiteHeader />

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
            {t.success.badge}
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">{t.success.title}</h1>
          <p className="mt-4 max-w-xl text-base text-neutral-400">
            {t.success.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/results"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              {t.success.viewResults}
            </Link>
            <Link
              href="/upload"
              className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-medium text-white hover:border-white/30"
            >
              {t.success.generateMore}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
