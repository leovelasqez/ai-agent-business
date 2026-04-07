"use client";

import { useLanguage } from "@/lib/language-context";
import { getPresetById } from "@/lib/presets";

interface ResultsSummaryProps {
  preset: string;
  category?: string;
  format?: string;
  productName?: string;
}

export function ResultsSummary({ preset, category, format, productName }: ResultsSummaryProps) {
  const { t } = useLanguage();
  const s = t.resultsSummary;
  const presetData = getPresetById(preset);

  return (
    <section className="grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">{s.preset}</div>
        <div className="mt-2 text-sm font-medium text-white">{presetData?.name ?? preset}</div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">{s.category}</div>
        <div className="mt-2 text-sm font-medium text-white">{category || s.noCategory}</div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">{s.format}</div>
        <div className="mt-2 text-sm font-medium text-white">{format || "1:1 square"}</div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">{s.product}</div>
        <div className="mt-2 text-sm font-medium text-white">{productName || s.noProduct}</div>
      </div>
    </section>
  );
}
