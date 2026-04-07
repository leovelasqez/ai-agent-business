"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FilePicker } from "@/components/file-picker";
import { PRESETS, type PresetId } from "@/lib/presets";
import { useLanguage } from "@/lib/language-context";
import type { GenerationVariant } from "@/lib/image-provider";

interface MockupUploadFormProps {
  initialSourceImageUrl?: string;
  initialPreset?: PresetId;
  initialCategory?: string;
  initialFormat?: string;
  initialProductName?: string;
  initialVariant?: GenerationVariant;
}

export function MockupUploadForm({
  initialSourceImageUrl,
  initialPreset = "clean_studio",
  initialCategory = "",
  initialFormat = "1:1 square",
  initialProductName = "",
  initialVariant = "a",
}: MockupUploadFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const f = t.form;

  const VARIANTS: { id: GenerationVariant; label: string; description: string }[] = [
    { id: "a", label: f.variants[0].label, description: f.variants[0].description },
    { id: "b", label: f.variants[1].label, description: f.variants[1].description },
    { id: "c", label: f.variants[2].label, description: f.variants[2].description },
    { id: "d", label: f.variants[3].label, description: f.variants[3].description },
  ];

  const [productName, setProductName] = useState(initialProductName);
  const [category, setCategory] = useState(initialCategory);
  const [format, setFormat] = useState(initialFormat);
  const [preset, setPreset] = useState<PresetId>(initialPreset);
  const [variant, setVariant] = useState<GenerationVariant>(initialVariant);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVariants, setCompareVariants] = useState<Set<GenerationVariant>>(
    new Set(["b", "c", "d"]),
  );
  const [selectedSourceImageUrl, setSelectedSourceImageUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveSourceImageUrl = selectedSourceImageUrl || initialSourceImageUrl || null;
  const canSubmit = useMemo(() => {
    const hasImage = Boolean(effectiveSourceImageUrl);
    const hasVariants = compareMode ? compareVariants.size >= 2 : true;
    return !isSubmitting && !isUploadingFile && hasImage && hasVariants;
  }, [effectiveSourceImageUrl, isSubmitting, isUploadingFile, compareMode, compareVariants]);

  const uploadFile = useCallback(async (file: File) => {
    setSelectedFileName(file.name);
    setSelectedSourceImageUrl(null);
    setIsUploadingFile(true);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadJson = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadJson?.data?.sourceImageUrl) {
        throw new Error(uploadJson?.message || "Upload failed");
      }

      setSelectedSourceImageUrl(uploadJson.data.sourceImageUrl);
      return uploadJson.data.sourceImageUrl as string;
    } catch (uploadError) {
      setSelectedFileName("");
      setSelectedSourceImageUrl(null);
      const message = uploadError instanceof Error ? uploadError.message : "Unknown upload error";
      setError(message);
      throw new Error(message);
    } finally {
      setIsUploadingFile(false);
    }
  }, []);

  const toggleCompareVariant = (v: GenerationVariant) => {
    setCompareVariants((prev) => {
      const next = new Set(prev);
      if (next.has(v)) {
        next.delete(v);
      } else {
        next.add(v);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      let nextSourceImageUrl = effectiveSourceImageUrl;

      const domFileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;

      if (!nextSourceImageUrl && domFileInput?.files?.[0]) {
        nextSourceImageUrl = await uploadFile(domFileInput.files[0]);
      }

      if (!nextSourceImageUrl) {
        throw new Error("No image available. Upload a real product image or enter with a link already pointing to a valid image in /uploads.");
      }

      if (!nextSourceImageUrl.trim()) {
        throw new Error("The product image was not ready to generate. Upload the image again and wait for the upload to finish.");
      }

      const params = new URLSearchParams({
        preset,
        category: category || "unspecified",
        format,
        productName: productName || "Untitled product",
        sourceImageUrl: nextSourceImageUrl.trim(),
      });

      if (compareMode && compareVariants.size >= 2) {
        params.set("compareVariants", [...compareVariants].join(","));
      } else {
        params.set("variant", variant);
      }

      router.push(`/results?${params.toString()}`);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unknown upload error";
      setError(message);
      setIsSubmitting(false);
    }
  };

  const submitLabel = isSubmitting
    ? f.submitPreparing
    : isUploadingFile
      ? f.submitUploading
      : compareMode
        ? f.submitCompare.replace("{n}", String(compareVariants.size))
        : f.submitGenerate;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="space-y-5">
          <FilePicker
            selectedFileName={selectedFileName}
            isUploading={isUploadingFile}
            onFileSelected={async (file) => {
              if (!file) {
                setError(null);
                setSelectedFileName("");
                setSelectedSourceImageUrl(null);
                return;
              }

              await uploadFile(file);
            }}
          />

          {effectiveSourceImageUrl && !selectedSourceImageUrl ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="mb-3 text-sm text-emerald-100">
                {f.preloadedImage}
              </div>
              <div className="relative aspect-square max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                <Image src={effectiveSourceImageUrl} alt="Preloaded source image" fill className="object-cover" unoptimized />
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-neutral-300">{f.productName}</label>
              <input
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-neutral-600"
                placeholder={f.productNamePlaceholder}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-neutral-300">{f.productCategory}</label>
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-neutral-600"
                placeholder={f.productCategoryPlaceholder}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">{f.format}</label>
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
            >
              <option value="1:1 square">{f.formatOptions.square}</option>
              <option value="4:5 portrait">{f.formatOptions.portrait}</option>
              <option value="9:16 story">{f.formatOptions.story}</option>
            </select>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm text-neutral-300">{f.modelMode}</label>
              <button
                type="button"
                onClick={() => setCompareMode((v) => !v)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  compareMode
                    ? "border-violet-500/50 bg-violet-500/20 text-violet-300"
                    : "border-white/10 bg-black/20 text-neutral-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {compareMode ? f.comparingVariants : f.compareVariants}
              </button>
            </div>

            {compareMode ? (
              <div className="space-y-2">
                <p className="text-xs text-neutral-500">{f.compareHint}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {VARIANTS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => toggleCompareVariant(v.id)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        compareVariants.has(v.id)
                          ? "border-violet-500/60 bg-violet-500/15 text-white"
                          : "border-white/10 bg-black/20 text-neutral-400 hover:border-white/20"
                      }`}
                    >
                      <div className="font-medium">{v.label}</div>
                      <div className="mt-1 text-xs opacity-70">{v.description}</div>
                    </button>
                  ))}
                </div>
                {compareVariants.size < 2 ? (
                  <p className="text-xs text-amber-400">{f.compareWarning}</p>
                ) : null}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {VARIANTS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariant(v.id)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      variant === v.id
                        ? "border-white bg-white text-black"
                        : "border-white/10 bg-black/20 text-neutral-300 hover:border-white/20"
                    }`}
                  >
                    <div className="font-medium">{v.label}</div>
                    <div className="mt-1 text-xs opacity-80">{v.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-medium">{f.choosePreset}</h2>
        <div className="mt-4 space-y-3">
          {PRESETS.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20"
            >
              <input
                type="radio"
                name="preset"
                value={item.id}
                checked={preset === item.id}
                onChange={() => setPreset(item.id)}
                className="mt-1"
              />
              <div>
                <div className="font-medium">{item.name}</div>
                <p className="mt-1 text-sm text-neutral-400">{item.description}</p>
              </div>
            </label>
          ))}
        </div>

        {!effectiveSourceImageUrl ? (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            {f.uploadFirst}
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLabel}
        </button>
      </aside>
    </div>
  );
}
