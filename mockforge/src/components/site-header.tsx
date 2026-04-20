"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { CreditsBadge } from "@/components/credits-badge";
import type { Language } from "@/lib/i18n";

const LANGUAGE_CYCLE: Language[] = ["en", "es", "fr", "pt", "de"];
const LANGUAGE_LABELS: Record<Language, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  es: { short: "ES", name: "Espanol" },
  fr: { short: "FR", name: "Francais" },
  pt: { short: "PT", name: "Portugues" },
  de: { short: "DE", name: "Deutsch" },
};

export function SiteHeader() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!languageMenuOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLanguageMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [languageMenuOpen]);

  const currentLanguage = LANGUAGE_LABELS[language];

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setLanguageMenuOpen(false);
    setMobileOpen(false);
  };

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen((open) => !open);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--header-bg)] backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => {
            setMobileOpen(false);
            setLanguageMenuOpen(false);
          }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#05DF72]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" fill="black" opacity="0.8" />
              <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" fill="black" opacity="0.8" />
              <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" fill="black" opacity="0.8" />
              <rect x="9" y="9" width="5.5" height="5.5" rx="2.75" fill="black" opacity="0.5" />
            </svg>
          </div>
          <span className="text-[15px] font-black tracking-tight text-[color:var(--foreground)]">
            Mock<span className="text-[#05DF72]">Forge</span>
          </span>
        </Link>

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

          <div className="relative" ref={languageMenuRef}>
            <button
              type="button"
              onClick={toggleLanguageMenu}
              className="hidden h-9 items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/70 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)] transition hover:border-[color:var(--foreground)]/10 hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--foreground)] md:inline-flex"
              aria-label={`Change language. Current language: ${currentLanguage.name}`}
              aria-expanded={languageMenuOpen}
              aria-haspopup="menu"
              title={`Language: ${currentLanguage.name}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
              </svg>
              <span>{currentLanguage.short}</span>
            </button>

            <button
              type="button"
              onClick={toggleLanguageMenu}
              className="inline-flex h-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)] transition hover:border-[color:var(--foreground)]/10 hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--foreground)] md:hidden"
              aria-label={`Change language. Current language: ${currentLanguage.name}`}
              aria-expanded={languageMenuOpen}
              aria-haspopup="menu"
              title={`Language: ${currentLanguage.name}`}
            >
              {currentLanguage.short}
            </button>

            {languageMenuOpen ? (
              <div
                className="absolute right-0 top-[calc(100%+0.75rem)] w-56 rounded-2xl border border-[color:var(--border)] bg-[color:var(--header-bg)] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
                role="menu"
                aria-label="Language selector"
              >
                <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                  Language
                </div>
                <div className="space-y-1">
                  {LANGUAGE_CYCLE.map((lang) => {
                    const option = LANGUAGE_LABELS[lang];
                    const isActive = lang === language;

                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleLanguageSelect(lang)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                          isActive
                            ? "bg-[#05DF72]/10 text-[color:var(--foreground)]"
                            : "text-[color:var(--muted)] hover:bg-[color:var(--surface)] hover:text-[color:var(--foreground)]"
                        }`}
                        role="menuitemradio"
                        aria-checked={isActive}
                      >
                        <span className="text-sm font-medium">{option.name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                            isActive
                              ? "bg-[#05DF72]/15 text-[#05DF72]"
                              : "bg-[color:var(--surface)] text-[color:var(--muted)]"
                          }`}
                        >
                          {option.short}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <Link
            href="/upload"
            className="rounded-full bg-[#05DF72] px-5 py-2 text-sm font-bold text-black transition hover:bg-[#34e58a] active:scale-95"
          >
            {t.nav.startFree}
          </Link>

          <button
            type="button"
            onClick={() => {
              setMobileOpen((open) => !open);
              setLanguageMenuOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--muted)] transition hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--foreground)] md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M4 4l10 10M14 4L4 14" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M3 5h12M3 9h12M3 13h12" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
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

          </nav>
        </div>
      ) : null}
    </header>
  );
}
