"use client";

import { useLanguage } from "@/lib/language-context";
import { getLocalizedPresetById } from "@/lib/presets";

interface ResultsSummaryProps {
  preset: string;
  category?: string;
  format?: string;
  productName?: string;
}

export function ResultsSummary({
  preset,
  category,
  format,
  productName,
}: ResultsSummaryProps) {
  const { t, language } = useLanguage();
  const s = t.resultsSummary;
  const presetData = getLocalizedPresetById(preset, language);

  const items = [
    { label: s.preset, value: presetData?.name ?? preset },
    { label: s.category, value: category || s.noCategory },
    { label: s.format, value: format || "1:1 square" },
    { label: s.product, value: productName || s.noProduct },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2.5"
        >
          <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/20">
            {label}
          </div>
          <div className="mt-1 truncate text-xs font-semibold text-white/70">
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
