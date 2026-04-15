"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { MockupUploadForm } from "@/components/mockup-upload-form";
import { WebviewWarning } from "@/components/webview-warning";
import { useLanguage } from "@/lib/language-context";
import { getPresetById, type PresetId } from "@/lib/presets";
import type { GenerationVariant } from "@/lib/image-provider";

function UploadPageInner() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const fileParam = searchParams.get("file");
  const sourceImageUrl = fileParam ? `/api/uploads/${fileParam}` : undefined;
  const preset =
    getPresetById(searchParams.get("preset") ?? "")?.id ??
    ("clean_studio" as PresetId);
  const category = searchParams.get("category") ?? "";
  const format = searchParams.get("format") ?? "1:1 square";
  const productName = searchParams.get("productName") ?? "";
  const variantParam = searchParams.get("variant");
  const variant: GenerationVariant =
    variantParam === "d"
      ? "d"
      : variantParam === "c"
        ? "c"
        : variantParam === "b"
          ? "b"
          : "a";

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl px-5 py-10">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-white/35 transition hover:bg-white/5 hover:text-white/70"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M9 11L5 7l4-4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t.upload.back.replace("← ", "")}
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-10">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/20">
            New mockup
          </div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            {t.upload.title}
          </h1>
          <p className="mt-3 max-w-lg text-base text-white/40">
            {t.upload.description}
          </p>
        </div>

        <WebviewWarning />

        <MockupUploadForm
          initialSourceImageUrl={sourceImageUrl}
          initialPreset={preset}
          initialCategory={category}
          initialFormat={format}
          initialProductName={productName}
          initialVariant={variant}
        />
      </main>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <UploadPageInner />
    </Suspense>
  );
}
