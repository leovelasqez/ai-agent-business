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

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <SiteHeader />

        <div className="flex items-center justify-between">
          <Link href="/upload" className="text-sm text-neutral-400 hover:text-white">
            {t.results.back}
          </Link>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300">
            {compareVariants && compareVariants.length >= 2 ? t.results.comparison : t.results.result}
          </span>
        </div>

        <ResultsView
          preset={preset}
          category={category}
          format={format}
          productName={productName}
          sourceImageUrl={sourceImageUrl}
          variant={variant}
          compareVariants={compareVariants && compareVariants.length >= 2 ? compareVariants : null}
        />
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950" />}>
      <ResultsPageInner />
    </Suspense>
  );
}
