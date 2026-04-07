import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ResultsView } from "@/components/results-view";
import type { GenerationVariant } from "@/lib/image-provider";

const VALID_VARIANTS = new Set<string>(["a", "b", "c", "d"]);

interface ResultsPageProps {
  searchParams: Promise<{
    preset?: string;
    category?: string;
    format?: string;
    productName?: string;
    sourceImageUrl?: string;
    variant?: string;
    compareVariants?: string;
  }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const preset = params.preset ?? "clean_studio";
  const category = params.category ?? "unspecified";
  const format = params.format ?? "1:1 square";
  const productName = params.productName ?? "Untitled product";
  const sourceImageUrl = params.sourceImageUrl;

  // Compare mode: parse comma-separated variants (e.g. "b,c,d")
  const compareVariants = params.compareVariants
    ? (params.compareVariants
        .split(",")
        .map((v) => v.trim())
        .filter((v) => VALID_VARIANTS.has(v)) as GenerationVariant[])
    : null;

  const variant: GenerationVariant =
    params.variant === "b"
      ? "b"
      : params.variant === "c"
        ? "c"
        : params.variant === "d"
          ? "d"
          : "a";

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <SiteHeader />

        <div className="flex items-center justify-between">
          <Link href="/upload" className="text-sm text-neutral-400 hover:text-white">
            ← Back to upload
          </Link>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300">
            {compareVariants && compareVariants.length >= 2 ? "Comparación" : "Resultado"}
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
