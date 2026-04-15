"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ResultsView } from "@/components/results-view";
import { useLanguage } from "@/lib/language-context";
import type { GenerationVariant } from "@/lib/image-provider";

const VALID_VARIANTS = new Set<string>(["a", "b", "c", "d"]);

function ResultsPageInner() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const preset = searchParams.get("preset") ?? "clean_studio";
  const category = searchParams.get("category") ?? "unspecified";
  const format = searchParams.get("format") ?? "1:1 square";
  const productName = searchParams.get("productName") ?? "Untitled product";
  const sourceImageUrl = searchParams.get("sourceImageUrl") ?? undefined;
  const compareVariantsParam = searchParams.get("compareVariants");
  const variantParam = searchParams.get("variant");

  const customModel = searchParams.get("customModel") ?? undefined;
  const customPrompt = searchParams.get("customPrompt") ?? undefined;

  const compareVariants = compareVariantsParam
    ? (compareVariantsParam
        .split(",")
        .map((v) => v.trim())
        .filter((v) => VALID_VARIANTS.has(v)) as GenerationVariant[])
    : null;

  const variant: GenerationVariant =
    variantParam === "b"
      ? "b"
      : variantParam === "c"
        ? "c"
        : variantParam === "d"
          ? "d"
          : "a";

  const isCompare = compareVariants && compareVariants.length >= 2;

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/upload"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-white/35 transition hover:bg-white/5 hover:text-white/70"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M9 11L5 7l4-4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t.results.back.replace("← ", "")}
          </Link>
          <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/25">
            {isCompare ? t.results.comparison : t.results.result}
          </span>
        </div>

        <ResultsView
          preset={preset}
          category={category}
          format={format}
          productName={productName}
          sourceImageUrl={sourceImageUrl}
          variant={variant}
          compareVariants={isCompare ? compareVariants : null}
          customModel={customModel}
          customPrompt={customPrompt}
        />
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ResultsPageInner />
    </Suspense>
  );
}
