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
  const preset = getPresetById(searchParams.get("preset") ?? "")?.id ?? ("clean_studio" as PresetId);
  const category = searchParams.get("category") ?? "";
  const format = searchParams.get("format") ?? "1:1 square";
  const productName = searchParams.get("productName") ?? "";
  const variantParam = searchParams.get("variant");
  const variant: GenerationVariant =
    variantParam === "d" ? "d" : variantParam === "c" ? "c" : variantParam === "b" ? "b" : "a";

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
        <SiteHeader />

        <div>
          <Link href="/" className="text-sm text-neutral-400 hover:text-white">
            {t.upload.back}
          </Link>
        </div>

        <div className="max-w-2xl space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">{t.upload.title}</h1>
          <p className="text-base text-neutral-400">
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
      </div>
    </main>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950" />}>
      <UploadPageInner />
    </Suspense>
  );
}
