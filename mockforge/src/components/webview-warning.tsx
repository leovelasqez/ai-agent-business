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
    <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-100">
      <div className="font-medium text-amber-50">{w.title}</div>
      <p className="mt-2">{w.message}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href={directUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
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
          className="inline-flex items-center justify-center rounded-xl border border-amber-200/30 px-4 py-3 text-sm font-medium text-amber-50 transition hover:border-amber-100/50"
        >
          {w.copyLink}
        </button>
      </div>
    </div>
  );
}
