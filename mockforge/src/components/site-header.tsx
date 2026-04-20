"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { CreditsBadge } from "@/components/credits-badge";
import type { Language } from "@/lib/i18n";

const LANGUAGE_CYCLE: Language[] = ["en", "es", "fr", "pt", "de"];
const LANGUAGE_LABELS: Record<Language, string> = {
  en: "EN", es: "ES", fr: "FR", pt: "PT", de: "DE",
};

export function SiteHeader() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cycleLanguage = () => {
    const idx = LANGUAGE_CYCLE.indexOf(language);
    setLanguage(LANGUAGE_CYCLE[(idx + 1) % LANGUAGE_CYCLE.length]);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--header-bg)] backdrop-blur-2xl">
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
          <span className="text-[15px] font-black tracking-tight text-[color:var(--foreground)]">
            Mock<span className="text-[#05DF72]">Forge</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          <Link
            href="/#how-it-works"
            className="rounded-lg px-3.5 py-2 text-sm text-[color:var(--muted)] transition hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--foreground)]"
          >
            {t.nav.howItWorks}
          </Link>
          <Link
            href="/#templates"
            className="rounded-lg px-3.5 py-2 text-sm text-[color:var(--muted)] transition hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--foreground)]"
          >
            {t.nav.templates}
          </Link>
          <Link
            href="/history"
            className="rounded-lg px-3.5 py-2 text-sm text-[color:var(--muted)] transition hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--foreground)]"
          >
            {t.nav.history}
          </Link>
          <Link
            href="/gallery"
            className="rounded-lg px-3.5 py-2 text-sm text-[color:var(--muted)] transition hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--foreground)]"
          >
            Gallery
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <CreditsBadge />
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--muted)] transition hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--foreground)]"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={cycleLanguage}
            className="hidden rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[color:var(--muted)] transition hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--foreground)] md:block"
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
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--muted)] transition hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--foreground)] md:hidden"
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
        <div className="border-t border-[color:var(--border)] bg-[color:var(--header-bg)] px-5 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-[var(--muted)] transition hover:bg-[color:var(--surface)] hover:text-[color:var(--foreground)]"
            >
              {t.nav.howItWorks}
            </Link>
            <Link
              href="/#templates"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-[var(--muted)] transition hover:bg-[color:var(--surface)] hover:text-[color:var(--foreground)]"
            >
              {t.nav.templates}
            </Link>
            <Link
              href="/history"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-[var(--muted)] transition hover:bg-[color:var(--surface)] hover:text-[color:var(--foreground)]"
            >
              {t.nav.history}
            </Link>
            <div className="mt-3 border-t border-[color:var(--border)] pt-3">
              <div className="flex flex-wrap gap-2 px-4 py-3">
                {LANGUAGE_CYCLE.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => { setLanguage(lang); setMobileOpen(false); }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      lang === language
                        ? "bg-[#05DF72]/20 text-[#05DF72]"
                        : "text-[var(--muted)] hover:bg-[color:var(--surface)] hover:text-[color:var(--foreground)]"
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
