"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/lib/language-context";

function detectEmbeddedBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /Telegram|TelegramBot|Instagram|FBAN|FBAV|Line\//i.test(ua);
}

export function WebviewWarning() {
  const { t } = useLanguage();
  const w = t.webviewWarning;
  const [isEmbeddedBrowser, setIsEmbeddedBrowser] = useState(false);

  useEffect(() => {
    setIsEmbeddedBrowser(detectEmbeddedBrowser());
  }, []);

  const directUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  if (!isEmbeddedBrowser) return null;

  return (
    <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
      <div className="flex items-start gap-3">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true">
          <path d="M9 1.5L16.5 15h-15L9 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          <path d="M9 7v3.5M9 13v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <div>
          <div className="text-sm font-bold text-amber-200">{w.title}</div>
          <p className="mt-1 text-sm text-amber-200/70">{w.message}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <a
          href={directUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-amber-300"
        >
          {w.openBrowser}
        </a>
        <button
          type="button"
          onClick={async () => {
            if (!directUrl) return;
            try {
              await navigator.clipboard.writeText(directUrl);
            } catch {}
          }}
          className="inline-flex items-center justify-center rounded-xl border border-amber-400/20 px-4 py-2.5 text-sm font-medium text-amber-200/80 transition hover:border-amber-400/40 hover:text-amber-200"
        >
          {w.copyLink}
        </button>
      </div>
    </div>
  );
}
