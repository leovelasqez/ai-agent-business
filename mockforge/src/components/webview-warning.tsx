"use client";

import { useEffect, useState } from "react";

function detectEmbeddedBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /Telegram|TelegramBot|Instagram|FBAN|FBAV|Line\//i.test(ua);
}

export function WebviewWarning() {
  const [isEmbeddedBrowser, setIsEmbeddedBrowser] = useState(false);

  useEffect(() => {
    setIsEmbeddedBrowser(detectEmbeddedBrowser());
  }, []);

  if (!isEmbeddedBrowser) return null;

  return (
    <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-100">
      Parece que abriste MockForge dentro de un navegador embebido, como Telegram o Instagram. Ahí los uploads y requests a veces fallan. Abre este link en Chrome o Safari para evitar errores raros.
    </div>
  );
}
