"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ResultsSummary } from "@/components/results-summary";
import { RatingButtons } from "@/components/rating-buttons";
import { useLanguage } from "@/lib/language-context";
import type { GenerationStatus } from "@/lib/types";
import type { GenerationVariant } from "@/lib/image-provider";

interface ResultsViewProps {
  preset: string;
  category: string;
  format: string;
  productName: string;
  sourceImageUrl?: string;
  variant?: GenerationVariant;
  compareVariants?: GenerationVariant[] | null;
  customModel?: string;
  customPrompt?: string;
}

interface GenerateResponse {
  ok: boolean;
  message?: string;
  error?: string;
  details?: string;
  data?: {
    generationId: string;
    previewUrls: string[];
    prompt?: string;
    provider?: string;
    model?: string;
    status?: GenerationStatus;
    variant?: GenerationVariant;
    variantLabel?: string;
  };
}

const VARIANT_LABELS: Record<string, string> = {
  a: "A · Nano Banana 2",
  b: "B · GPT Image",
  c: "C · FLUX.2 Pro",
  d: "D · Personalizado",
};

async function callGenerate(body: {
  preset: string;
  category: string;
  format: string;
  productName: string;
  sourceImageUrl?: string;
  variant: string;
  customModel?: string;
  customPrompt?: string;
}): Promise<GenerateResponse> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json() as Promise<GenerateResponse>;
}

interface VariantResult {
  variant: GenerationVariant;
  variantLabel: string;
  status: GenerationStatus;
  previewUrls: string[];
  generationId: string | null;
  error: string | null;
}

// ── Image card ────────────────────────────────────────────────────────────────

function ImageCard({
  url,
  index,
  generationId,
  downloadLabel,
  mockupLabel,
  previewReadyLabel,
}: {
  url: string;
  index: number;
  generationId: string | null;
  downloadLabel: string;
  mockupLabel: string;
  previewReadyLabel: string;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20 transition hover:border-white/[0.14]">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={url}
          alt={`Generated mockup ${index + 1}`}
          fill
          className="object-contain transition duration-500 group-hover:scale-[1.02]"
          unoptimized
        />
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          download
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-black/80"
          title={downloadLabel}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M6.5 2v7M3.5 6l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1.5 10.5h10" strokeLinecap="round" />
          </svg>
        </a>
      </div>
      <div className="flex items-center justify-between px-4 py-3.5">
        <div>
          <div className="text-sm font-semibold text-white">
            {mockupLabel} {index + 1}
          </div>
          <div className="mt-0.5 text-xs text-white/30">{previewReadyLabel}</div>
        </div>
        <div className="flex items-center gap-2">
          {generationId ? <RatingButtons generationId={generationId} /> : null}
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            download
            className="rounded-xl border border-white/[0.1] px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
          >
            {downloadLabel}
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Compare card ──────────────────────────────────────────────────────────────

function CompareCard({
  result,
  sourceImageUrl,
  rv,
}: {
  result: VariantResult;
  sourceImageUrl?: string;
  rv: ReturnType<typeof useLanguage>["t"]["resultsView"];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/25">
            {rv.variantLabel}
          </div>
          <div className="mt-1 text-sm font-bold text-white">{result.variantLabel}</div>
        </div>
        <div
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            result.status === "completed"
              ? "bg-emerald-500/15 text-emerald-300"
              : result.status === "failed"
                ? "bg-red-500/15 text-red-300"
                : "bg-white/[0.06] text-white/35"
          }`}
        >
          {result.status === "processing"
            ? rv.variantStatus.processing
            : result.status === "failed"
              ? rv.variantStatus.failed
              : rv.variantStatus.completed}
        </div>
      </div>

      <div className="p-5">
        {result.status === "processing" ? (
          <div className="flex aspect-square items-center justify-center rounded-xl border border-white/[0.06] bg-black/30">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-lime-400" />
              <p className="text-xs text-white/25">Generating...</p>
            </div>
          </div>
        ) : result.status === "failed" ? (
          <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-red-500/15 bg-red-500/[0.06] p-6 text-center">
            <p className="text-sm text-red-300">{result.error}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {result.previewUrls.map((url, i) => (
              <ImageCard
                key={`${url}-${i}`}
                url={url}
                index={i}
                generationId={result.generationId}
                downloadLabel={rv.download}
                mockupLabel={rv.mockupLabel}
                previewReadyLabel={rv.previewReady}
              />
            ))}
          </div>
        )}

        {result.status === "completed" && sourceImageUrl ? (
          <div className="mt-4">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/25">
              {rv.originalLabel}
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl border border-white/[0.06] bg-black/30">
              <Image
                src={sourceImageUrl}
                alt={rv.sourceImageTitle}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ResultsView({
  preset,
  category,
  format,
  productName,
  sourceImageUrl,
  variant = "a",
  compareVariants,
  customModel,
  customPrompt,
}: ResultsViewProps) {
  const { t } = useLanguage();
  const rv = t.resultsView;

  function friendlyError(raw: string): string {
    if (raw.includes("Load failed")) return rv.errors.loadFailed;
    if (raw.includes("Failed to fetch")) return rv.errors.fetchFailed;
    if (raw.includes("ENOENT")) return rv.errors.fileNotFound;
    return raw;
  }

  const [status, setStatus] = useState<GenerationStatus>("processing");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const defaultVariantLabel = VARIANT_LABELS[variant] ?? variant;
  const [variantLabel, setVariantLabel] =
    useState<string>(defaultVariantLabel);

  const [variantResults, setVariantResults] = useState<VariantResult[]>(() =>
    compareVariants
      ? compareVariants.map((v) => ({
          variant: v,
          variantLabel: VARIANT_LABELS[v] ?? v,
          status: "processing" as GenerationStatus,
          previewUrls: [],
          generationId: null,
          error: null,
        }))
      : [],
  );

  const isCompareMode = Boolean(
    compareVariants && compareVariants.length >= 2,
  );

  async function startCheckout(pkg: "single" | "bundle") {
    setCheckoutLoading(pkg);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId, package: pkg }),
      });
      const json = await res.json() as { ok: boolean; data?: { checkoutUrl?: string }; message?: string };
      if (json.ok && json.data?.checkoutUrl) {
        window.location.href = json.data.checkoutUrl;
      } else {
        alert(json.message ?? "Could not start checkout. Please try again.");
      }
    } catch {
      alert("Could not connect to payment server. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  }

  useEffect(() => {
    if (isCompareMode) return;

    let isCancelled = false;

    async function generate() {
      setStatus("processing");
      setError(null);

      try {
        const json = await callGenerate({
          preset,
          category,
          format,
          productName,
          sourceImageUrl,
          variant,
          customModel,
          customPrompt,
        });

        if (!json.ok || !json.data?.previewUrls?.length) {
          throw new Error(json.details || json.message || "Generation failed");
        }

        if (isCancelled) return;

        setPreviewUrls(json.data.previewUrls);
        setGenerationId(json.data.generationId ?? null);
        setVariantLabel(json.data.variantLabel || defaultVariantLabel);
        setStatus("completed");
      } catch (err) {
        if (isCancelled) return;
        const raw =
          err instanceof Error ? err.message : "Unknown generation error";
        setError(friendlyError(raw));
        setStatus("failed");
      }
    }

    generate();
    return () => {
      isCancelled = true;
    };
  }, [
    preset,
    category,
    format,
    productName,
    sourceImageUrl,
    variant,
    isCompareMode,
    defaultVariantLabel,
  ]);

  useEffect(() => {
    if (!isCompareMode || !compareVariants) return;

    let isCancelled = false;

    async function generateVariant(v: GenerationVariant, index: number) {
      try {
        const json = await callGenerate({
          preset,
          category,
          format,
          productName,
          sourceImageUrl,
          variant: v,
          customModel: v === "d" ? customModel : undefined,
          customPrompt: v === "d" ? customPrompt : undefined,
        });

        if (isCancelled) return;

        if (!json.ok || !json.data?.previewUrls?.length) {
          throw new Error(json.details || json.message || "Generation failed");
        }

        setVariantResults((prev) =>
          prev.map((r, i) =>
            i === index
              ? {
                  ...r,
                  status: "completed",
                  previewUrls: json.data!.previewUrls,
                  generationId: json.data!.generationId ?? null,
                  variantLabel:
                    json.data!.variantLabel || r.variantLabel,
                }
              : r,
          ),
        );
      } catch (err) {
        if (isCancelled) return;
        const raw =
          err instanceof Error ? err.message : "Unknown generation error";
        setVariantResults((prev) =>
          prev.map((r, i) =>
            i === index
              ? { ...r, status: "failed", error: friendlyError(raw) }
              : r,
          ),
        );
      }
    }

    void Promise.all(compareVariants.map((v, i) => generateVariant(v, i)));

    return () => {
      isCancelled = true;
    };
  }, [
    isCompareMode,
    compareVariants,
    preset,
    category,
    format,
    productName,
    sourceImageUrl,
  ]);

  const title = useMemo(() => {
    if (isCompareMode) {
      const allDone = variantResults.every((r) => r.status !== "processing");
      if (!allDone) return rv.title.compareLoading;
      const anyFailed = variantResults.some((r) => r.status === "failed");
      return anyFailed ? rv.title.compareWithErrors : rv.title.compareDone;
    }
    if (status === "processing") return rv.title.singleLoading;
    if (status === "failed") return rv.title.singleFailed;
    return rv.title.singleDone;
  }, [status, isCompareMode, variantResults, rv]);

  const subtitle = useMemo(() => {
    if (isCompareMode) return rv.subtitle.compare;
    if (status === "processing") return rv.subtitle.singleLoading;
    if (status === "failed") return rv.subtitle.singleFailed;
    return rv.subtitle.singleDone;
  }, [status, isCompareMode, rv]);

  const overallStatus = isCompareMode
    ? variantResults.every((r) => r.status !== "processing")
      ? "completed"
      : "processing"
    : status;

  const primaryPreview = isCompareMode
    ? variantResults.find((r) => r.previewUrls.length > 0)?.previewUrls[0] ??
      null
    : previewUrls[0] ?? null;

  return (
    <div className="space-y-6">
      {/* ── Status header ── */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7 md:p-9">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              {isCompareMode ? rv.badge.compare : rv.badge.single}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {title}
              </h1>
              <p className="max-w-xl text-sm leading-7 text-white/40 md:text-base">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/upload"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.1] px-5 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              >
                {rv.createAnother}
              </Link>
              {primaryPreview ? (
                <a
                  href={primaryPreview}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#05DF72] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#34e58a]"
                >
                  {rv.openBest}
                </a>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-black/30 p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/20">
                  {rv.statusLabel}
                </div>
                <div className="mt-1.5 font-bold text-white">
                  {overallStatus === "processing"
                    ? rv.statusProcessing
                    : rv.statusCompleted}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    overallStatus === "completed"
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-white/[0.06] text-white/35"
                  }`}
                >
                  {overallStatus === "processing" && (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                  )}
                  {overallStatus === "processing"
                    ? rv.badgeProcessing
                    : rv.badgeReady}
                </div>
                {!isCompareMode ? (
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">
                    {variantLabel}
                  </div>
                ) : (
                  <div className="text-xs text-white/25">
                    {
                      variantResults.filter((r) => r.status === "completed")
                        .length
                    }
                    /{variantResults.length} {rv.badgeReady.toLowerCase()}
                  </div>
                )}
              </div>
            </div>

            <ResultsSummary
              preset={preset}
              category={category}
              format={format}
              productName={productName}
            />
          </div>
        </div>
      </section>

      {/* ── Compare mode grid ── */}
      {isCompareMode ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {variantResults.map((result) => (
            <CompareCard
              key={result.variant}
              result={result}
              sourceImageUrl={sourceImageUrl}
              rv={rv}
            />
          ))}
        </section>
      ) : null}

      {/* ── Single mode ── */}
      {!isCompareMode ? (
        <>
          {status === "processing" ? (
            <section className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02] py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/[0.08] border-t-lime-400" />
              <p className="mt-5 text-sm text-white/30">{rv.spinnerText}</p>
            </section>
          ) : null}

          {status === "failed" ? (
            <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6">
              <div className="flex items-start gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mt-0.5 shrink-0 text-red-400"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="9" r="7.5" />
                  <path d="M9 5.5v3.5M9 11v.5" strokeLinecap="round" />
                </svg>
                <div>
                  <div className="font-bold text-red-200">{rv.errorTitle}</div>
                  <p className="mt-1.5 text-sm text-red-300/80">{error}</p>
                  <p className="mt-2 text-xs text-red-400/60">{rv.errorTip}</p>
                </div>
              </div>
            </section>
          ) : null}

          {(sourceImageUrl || previewUrls.length > 0) &&
          status !== "processing" ? (
            <section className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
              {sourceImageUrl ? (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <div className="mb-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/20">
                      {rv.originalLabel}
                    </div>
                    <div className="mt-1.5 font-bold text-white">
                      {rv.sourceImageTitle}
                    </div>
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-white/[0.06] bg-black/30">
                    <Image
                      src={sourceImageUrl}
                      alt={rv.sourceImageTitle}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              ) : null}

              {status === "completed" ? (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/20">
                        {rv.resultsLabel}
                      </div>
                      <div className="mt-1.5 font-bold text-white">
                        {rv.generatedMockups}
                      </div>
                    </div>
                    <div className="text-sm text-white/30">
                      {previewUrls.length} {rv.variants}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {previewUrls.map((url, index) => (
                      <ImageCard
                        key={`${url}-${index}`}
                        url={url}
                        index={index}
                        generationId={generationId}
                        downloadLabel={rv.download}
                        mockupLabel={rv.mockupLabel}
                        previewReadyLabel={rv.previewReady}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}
        </>
      ) : null}

      {/* ── Upsell ── */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        <div className="grid gap-5 p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-xl font-black tracking-tight">
              {rv.upsell.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
              {rv.upsell.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => startCheckout("single")}
              disabled={checkoutLoading !== null}
              className="rounded-xl border border-white/[0.1] px-5 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white disabled:opacity-50"
            >
              {checkoutLoading === "single" ? "Redirecting…" : rv.upsell.pack}
            </button>
            <button
              onClick={() => startCheckout("bundle")}
              disabled={checkoutLoading !== null}
              className="rounded-xl bg-[#05DF72] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#34e58a] disabled:opacity-50"
            >
              {checkoutLoading === "bundle" ? "Redirecting…" : rv.upsell.bundle}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
