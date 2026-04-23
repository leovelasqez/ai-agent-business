"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export function CreditsBadge() {
  const { language } = useLanguage();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/credits")
      .then((r) => r.json())
      .then((j) => { if (j.ok) setBalance(j.data.balance); })
      .catch(() => {});
  }, []);

  if (balance === null) return null;

  const low = balance <= 1;
  const labels = {
    en: { credit: "credit", credits: "credits", low: "low" },
    es: { credit: "crédito", credits: "créditos", low: "poco" },
    fr: { credit: "crédit", credits: "crédits", low: "faible" },
    pt: { credit: "crédito", credits: "créditos", low: "baixo" },
    de: { credit: "Kredit", credits: "Kredite", low: "wenig" },
  }[language];

  return (
    <Link
      href="/upload"
      className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition md:flex ${
        low
          ? "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
          : "border-white/[0.1] bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/80"
      }`}
      title={`${balance} ${balance === 1 ? labels.credit : labels.credits}`}
    >
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
        <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5.5 3v2.5l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      {balance} {balance === 1 ? labels.credit : labels.credits}
      {low && <span className="ml-0.5 text-[10px] opacity-70">· {labels.low}</span>}
    </Link>
  );
}
