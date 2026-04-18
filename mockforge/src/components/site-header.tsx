"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import type { Language } from "@/lib/i18n";

const LANGUAGE_CYCLE: Language[] = ["en", "es", "fr", "pt", "de"];
const LANGUAGE_LABELS: Record<Language, string> = {
  en: "EN", es: "ES", fr: "FR", pt: "PT", de: "DE",
};

export function SiteHeader() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cycleLanguage = () => {
    const idx = LANGUAGE_CYCLE.indexOf(language);
    setLanguage(LANGUAGE_CYCLE[(idx + 1) % LANGUAGE_CYCLE.length]);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#05DF72]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" fill="black" opacity="0.8"/>
              <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" fill="black" opacity="0.8"/>
              <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" fill="black" opacity="0.8"/>
              <rect x="9" y="9" width="5.5" height="5.5" rx="2.75" fill="black" opacity="0.5"/>
            </svg>
          </div>
          <span className="text-[15px] font-black tracking-tight text-white">
            Mock<span className="text-[#05DF72]">Forge</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          <Link
            href="/#how-it-works"
            className="rounded-lg px-3.5 py-2 text-sm text-white/45 transition hover:bg-white/[0.05] hover:text-white"
          >
            {t.nav.howItWorks}
          </Link>
          <Link
            href="/#templates"
            className="rounded-lg px-3.5 py-2 text-sm text-white/45 transition hover:bg-white/[0.05] hover:text-white"
          >
            {t.nav.templates}
          </Link>
          <Link
            href="/history"
            className="rounded-lg px-3.5 py-2 text-sm text-white/45 transition hover:bg-white/[0.05] hover:text-white"
          >
            {t.nav.history}
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cycleLanguage}
            className="hidden rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white/25 transition hover:bg-white/[0.05] hover:text-white/60 md:block"
            aria-label="Switch language"
            title={`Current: ${LANGUAGE_LABELS[language]} — click to cycle`}
          >
            {LANGUAGE_LABELS[language]}
          </button>

          <Link
            href="/upload"
            className="rounded-full bg-[#05DF72] px-5 py-2 text-sm font-bold text-black transition hover:bg-[#34e58a] active:scale-95"
          >
            {t.nav.startFree}
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.05] hover:text-white md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M4 4l10 10M14 4L4 14" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M3 5h12M3 9h12M3 13h12" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/[0.06] bg-black/95 px-5 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/[0.04] hover:text-white"
            >
              {t.nav.howItWorks}
            </Link>
            <Link
              href="/#templates"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/[0.04] hover:text-white"
            >
              {t.nav.templates}
            </Link>
            <Link
              href="/history"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/[0.04] hover:text-white"
            >
              {t.nav.history}
            </Link>
            <div className="mt-3 border-t border-white/[0.06] pt-3">
              <div className="flex flex-wrap gap-2 px-4 py-3">
                {LANGUAGE_CYCLE.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => { setLanguage(lang); setMobileOpen(false); }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      lang === language
                        ? "bg-[#05DF72]/20 text-[#05DF72]"
                        : "text-white/35 hover:bg-white/[0.04] hover:text-white/60"
                    }`}
                  >
                    {LANGUAGE_LABELS[lang]}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
