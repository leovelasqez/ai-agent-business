"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

export function SiteHeader() {
  const { language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-400">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" fill="black" opacity="0.8"/>
              <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" fill="black" opacity="0.8"/>
              <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" fill="black" opacity="0.8"/>
              <rect x="9" y="9" width="5.5" height="5.5" rx="2.75" fill="black" opacity="0.5"/>
            </svg>
          </div>
          <span className="text-[15px] font-black tracking-tight text-white">
            Mock<span className="text-lime-400">Forge</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          <a
            href="/#how-it-works"
            className="rounded-lg px-3.5 py-2 text-sm text-white/45 transition hover:bg-white/[0.05] hover:text-white"
          >
            How it works
          </a>
          <a
            href="/#templates"
            className="rounded-lg px-3.5 py-2 text-sm text-white/45 transition hover:bg-white/[0.05] hover:text-white"
          >
            Templates
          </a>
          <Link
            href="/history"
            className="rounded-lg px-3.5 py-2 text-sm text-white/45 transition hover:bg-white/[0.05] hover:text-white"
          >
            History
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "es" : "en")}
            className="hidden rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white/25 transition hover:bg-white/[0.05] hover:text-white/60 md:block"
            aria-label="Toggle language"
          >
            {language === "en" ? "ES" : "EN"}
          </button>

          <Link
            href="/upload"
            className="rounded-full bg-lime-400 px-5 py-2 text-sm font-bold text-black transition hover:bg-lime-300 active:scale-95"
          >
            Start free
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
            <a
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/[0.04] hover:text-white"
            >
              How it works
            </a>
            <a
              href="/#templates"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/[0.04] hover:text-white"
            >
              Templates
            </a>
            <Link
              href="/history"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/[0.04] hover:text-white"
            >
              History
            </Link>
            <div className="mt-3 border-t border-white/[0.06] pt-3">
              <button
                type="button"
                onClick={() => {
                  setLanguage(language === "en" ? "es" : "en");
                  setMobileOpen(false);
                }}
                className="rounded-xl px-4 py-3 text-sm text-white/35 transition hover:bg-white/[0.04] hover:text-white/60"
              >
                {language === "en" ? "Switch to Spanish" : "Switch to English"}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
