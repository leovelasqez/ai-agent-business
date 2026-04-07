"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export function SiteHeader() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-300 transition hover:text-white">
        MockForge
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/history" className="text-sm text-neutral-400 transition hover:text-white">
          {t.nav.history}
        </Link>
        <button
          type="button"
          onClick={() => setLanguage(language === "en" ? "es" : "en")}
          className="text-xs text-neutral-500 transition hover:text-neutral-300"
          aria-label="Toggle language"
        >
          {language === "en" ? "ES" : "EN"}
        </button>
        <Link
          href="/upload"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/5"
        >
          {t.nav.generate}
        </Link>
      </nav>
    </header>
  );
}
