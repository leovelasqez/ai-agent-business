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

function MetaRow({
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
    <div className="flex flex-col gap-0.5">
      <dt className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">{label}</dt>
      <dd className={`text-xs text-neutral-200 ${mono ? "font-mono" : ""} ${valueClass ?? ""}`}>
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
      <div className="flex items-center justify-between">
        <Link href="/history" className="text-sm text-neutral-400 hover:text-white">
          {h.back}
        </Link>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300">
          {formatDate(generation.createdAt, language)}
        </span>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Images */}
        <div className="flex flex-1 flex-col gap-4">
          {generation.previewUrls.length > 0 ? (
            <div className={`grid gap-3 ${generation.previewUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {generation.previewUrls.map((url, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl bg-neutral-900">
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
                    className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
                  >
                    {h.download}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-2xl bg-neutral-900 text-neutral-600 text-sm">
              {h.noImages}
            </div>
          )}

          {generation.sourceImageUrl && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">{h.originalImage}</p>
              <div className="relative overflow-hidden rounded-xl bg-neutral-900">
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
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">
              {generation.productName ?? h.noName}
            </h2>

            <dl className="flex flex-col gap-3">
              <MetaRow label={h.metaLabels.preset} value={preset?.name ?? generation.preset} />
              {generation.category && (
                <MetaRow label={h.metaLabels.category} value={generation.category} />
              )}
              {generation.format && (
                <MetaRow label={h.metaLabels.format} value={generation.format} />
              )}
              <MetaRow label={h.metaLabels.variant} value={VARIANT_LABELS[generation.variant] ?? generation.variant} />
              <MetaRow label={h.metaLabels.model} value={generation.model} mono />
              {generation.provider && (
                <MetaRow label={h.metaLabels.provider} value={generation.provider} />
              )}
              <MetaRow
                label={h.metaLabels.status}
                value={generation.status}
                valueClass={
                  generation.status === "completed"
                    ? "text-green-400"
                    : generation.status === "failed"
                    ? "text-red-400"
                    : "text-yellow-400"
                }
              />
            </dl>

            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-neutral-500">{h.rating}</p>
              <RatingButtons generationId={generation.id} initialRating={generation.rating} />
            </div>
          </div>

          <Link
            href="/upload"
            className="rounded-2xl bg-white px-4 py-2.5 text-center text-sm font-medium text-black transition hover:bg-neutral-200"
          >
            {h.newGeneration}
          </Link>
        </div>
      </div>
    </div>
  );
}
