"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { getPresetById } from "@/lib/presets";
import type { MockupGeneration } from "@/lib/types";

type Generation = MockupGeneration & { model: string; variant: string };

const VARIANT_LABELS: Record<string, string> = {
  a: "FLUX Dev",
  b: "FLUX Pro",
  c: "GPT Image 1",
  d: "Nano Banana 2",
};

function formatDate(iso: string, lang: string) {
  return new Date(iso).toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface HistoryListProps {
  generations: Generation[];
}

export function HistoryList({ generations }: HistoryListProps) {
  const { t, language } = useLanguage();
  const h = t.history;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">{h.title}</h1>
        <Link href="/upload" className="text-sm text-neutral-400 hover:text-white">
          {h.newGeneration}
        </Link>
      </div>

      {generations.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 py-20 text-center">
          <p className="text-neutral-400">{h.empty}</p>
          <Link
            href="/upload"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30"
          >
            {h.createFirst}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {generations.map((gen) => {
            const preset = getPresetById(gen.preset);
            const thumbnail = gen.previewUrls[0];

            return (
              <Link
                key={gen.id}
                href={`/history/${gen.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/25 hover:bg-white/8"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={gen.productName ?? h.noPreview}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition group-hover:scale-[1.02]"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-600 text-xs">
                      {h.noPreview}
                    </div>
                  )}

                  {gen.status !== "completed" && (
                    <span
                      className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                        gen.status === "failed"
                          ? "bg-red-900/80 text-red-300"
                          : "bg-yellow-900/80 text-yellow-300"
                      }`}
                    >
                      {gen.status}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate text-sm font-medium text-white">
                      {gen.productName ?? h.noName}
                    </span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {gen.rating === 1 ? (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400" title={h.liked}>
                          ✓
                        </span>
                      ) : gen.rating === -1 ? (
                        <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-medium text-red-400" title={h.disliked}>
                          ✕
                        </span>
                      ) : null}
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-neutral-300">
                        {VARIANT_LABELS[gen.variant] ?? gen.variant}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span>{preset?.name ?? gen.preset}</span>
                    {gen.category && (
                      <>
                        <span className="text-neutral-700">·</span>
                        <span className="text-neutral-500">{gen.category}</span>
                      </>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-600">{formatDate(gen.createdAt, language)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
