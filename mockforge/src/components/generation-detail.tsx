"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { RatingButtons } from "@/components/rating-buttons";
import { getPresetById } from "@/lib/presets";
import type { MockupGeneration } from "@/lib/types";

type Generation = MockupGeneration & { model: string; variant: string };

const VARIANT_LABELS: Record<string, string> = {
  a: "A · FLUX Kontext Dev",
  b: "B · FLUX Kontext Pro",
  c: "C · GPT Image 1",
  d: "D · Nano Banana 2",
};

function formatDate(iso: string, lang: string) {
  return new Date(iso).toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MetaItem({
  label,
  value,
  mono = false,
  valueClass,
}: {
  label: string;
  value: string;
  mono?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
      <dt className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/20">
        {label}
      </dt>
      <dd
        className={`mt-1 truncate text-xs text-white/70 ${mono ? "font-mono" : "font-semibold"} ${valueClass ?? ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

interface GenerationDetailProps {
  generation: Generation;
}

export function GenerationDetail({ generation }: GenerationDetailProps) {
  const { t, language } = useLanguage();
  const h = t.historyDetail;
  const preset = getPresetById(generation.preset);

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb row */}
      <div className="flex items-center justify-between">
        <Link
          href="/history"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-white/35 transition hover:bg-white/[0.05] hover:text-white/70"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M9 11L5 7l4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {h.back}
        </Link>
        <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/25">
          {formatDate(generation.createdAt, language)}
        </span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Images */}
        <div className="flex flex-1 flex-col gap-5">
          {generation.previewUrls.length > 0 ? (
            <div
              className={`grid gap-3 ${generation.previewUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
            >
              {generation.previewUrls.map((url, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl bg-neutral-950"
                >
                  <Image
                    src={url}
                    alt={`${h.generatedMockup} ${i + 1}`}
                    width={800}
                    height={800}
                    className="w-full object-cover"
                    unoptimized
                  />
                  <a
                    href={url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-black"
                  >
                    {h.download}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-2xl bg-neutral-950 text-sm text-white/20">
              {h.noImages}
            </div>
          )}

          {generation.sourceImageUrl && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/20">
                {h.originalImage}
              </p>
              <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-neutral-950">
                <Image
                  src={generation.sourceImageUrl}
                  alt={h.originalImageAlt}
                  width={400}
                  height={400}
                  className="max-h-48 w-full object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>

        {/* Metadata sidebar */}
        <div className="flex w-full flex-col gap-4 lg:w-72">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <h2 className="mb-4 text-base font-black tracking-tight text-white">
              {generation.productName ?? h.noName}
            </h2>

            <dl className="grid grid-cols-1 gap-2">
              <MetaItem label={h.metaLabels.preset} value={preset?.name ?? generation.preset} />
              {generation.category && (
                <MetaItem label={h.metaLabels.category} value={generation.category} />
              )}
              {generation.format && (
                <MetaItem label={h.metaLabels.format} value={generation.format} />
              )}
              <MetaItem
                label={h.metaLabels.variant}
                value={VARIANT_LABELS[generation.variant] ?? generation.variant}
              />
              <MetaItem label={h.metaLabels.model} value={generation.model} mono />
              {generation.provider && (
                <MetaItem label={h.metaLabels.provider} value={generation.provider} />
              )}
              <MetaItem
                label={h.metaLabels.status}
                value={generation.status}
                valueClass={
                  generation.status === "completed"
                    ? "text-emerald-400"
                    : generation.status === "failed"
                      ? "text-red-400"
                      : "text-amber-400"
                }
              />
            </dl>

            <div className="mt-5 border-t border-white/[0.06] pt-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/20">
                {h.rating}
              </p>
              <RatingButtons
                generationId={generation.id}
                initialRating={generation.rating}
              />
            </div>
          </div>

          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-xl bg-lime-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-lime-300 active:scale-[0.98]"
          >
            {h.newGeneration}
          </Link>
        </div>
      </div>
    </div>
  );
}
