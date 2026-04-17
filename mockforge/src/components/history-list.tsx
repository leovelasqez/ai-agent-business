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

const VARIANT_COLORS: Record<string, string> = {
  a: "bg-stone-500/15 text-stone-300",
  b: "bg-blue-500/15 text-blue-300",
  c: "bg-violet-500/15 text-violet-300",
  d: "bg-amber-500/15 text-amber-300",
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
  page?: number;
  hasMore?: boolean;
}

export function HistoryList({ generations, page = 1, hasMore = false }: HistoryListProps) {
  const { t, language } = useLanguage();
  const h = t.history;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/20">
            Generation history
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">{h.title}</h1>
        </div>
        <Link
          href="/upload"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#05DF72] px-5 py-2 text-sm font-bold text-black transition hover:bg-[#34e58a]"
        >
          {h.newGeneration}
        </Link>
      </div>

      {generations.length === 0 ? (
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/20"
              aria-hidden="true"
            >
              <rect x="4" y="4" width="8" height="8" rx="2" />
              <rect x="16" y="4" width="8" height="8" rx="2" />
              <rect x="4" y="16" width="8" height="8" rx="2" />
              <path d="M20 16v8M16 20h8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white/50">{h.empty}</p>
            <p className="mt-1 text-sm text-white/25">Generate your first mockup to see it here.</p>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] px-5 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
          >
            {h.createFirst}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {generations.map((gen) => {
            const preset = getPresetById(gen.preset);
            const thumbnail = gen.previewUrls[0];
            const variantColor =
              VARIANT_COLORS[gen.variant] ?? "bg-white/10 text-white/40";

            return (
              <Link
                key={gen.id}
                href={`/history/${gen.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition hover:border-white/[0.14] hover:bg-white/[0.04]"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={gen.productName ?? h.noPreview}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-xs text-white/20">{h.noPreview}</span>
                    </div>
                  )}

                  {/* Status badge */}
                  {gen.status !== "completed" && (
                    <span
                      className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm ${
                        gen.status === "failed"
                          ? "bg-red-900/80 text-red-300"
                          : "bg-yellow-900/80 text-yellow-300"
                      }`}
                    >
                      {gen.status}
                    </span>
                  )}

                  {/* Variant badge top-right */}
                  <span
                    className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${variantColor}`}
                  >
                    {VARIANT_LABELS[gen.variant] ?? gen.variant}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate text-sm font-bold text-white">
                      {gen.productName ?? h.noName}
                    </span>
                    {gen.rating === 1 ? (
                      <span
                        className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400"
                        title={h.liked}
                      >
                        ✓
                      </span>
                    ) : gen.rating === -1 ? (
                      <span
                        className="shrink-0 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400"
                        title={h.disliked}
                      >
                        ✕
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <span>{preset?.name ?? gen.preset}</span>
                    {gen.category && (
                      <>
                        <span className="text-white/10">·</span>
                        <span>{gen.category}</span>
                      </>
                    )}
                  </div>

                  <div className="text-[11px] text-white/20">
                    {formatDate(gen.createdAt, language)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {(page > 1 || hasMore) && (
        <div className="flex items-center justify-center gap-3 pt-2">
          {page > 1 && (
            <Link
              href={`/history?page=${page - 1}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] px-5 py-2 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
            >
              ← Previous
            </Link>
          )}
          <span className="text-xs text-white/20">Page {page}</span>
          {hasMore && (
            <Link
              href={`/history?page=${page + 1}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] px-5 py-2 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
