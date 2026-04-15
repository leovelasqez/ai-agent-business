"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FilePicker } from "@/components/file-picker";
import { PRESETS, type PresetId } from "@/lib/presets";
import { CURATED_MODELS } from "@/lib/model-config";
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

  const VARIANTS: {
    id: GenerationVariant;
    label: string;
    description: string;
  }[] = [
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
  const [customModel, setCustomModel] = useState<string>(CURATED_MODELS[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>("");
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
      const message =
        uploadError instanceof Error ? uploadError.message : "Unknown upload error";
      setError(message);
      throw new Error(message);
    } finally {
      setIsUploadingFile(false);
    }
  }, []);

  const toggleCompareVariant = (v: GenerationVariant) => {
    setCompareVariants((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      let nextSourceImageUrl = effectiveSourceImageUrl;

      const domFileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement | null;

      if (!nextSourceImageUrl && domFileInput?.files?.[0]) {
        nextSourceImageUrl = await uploadFile(domFileInput.files[0]);
      }

      if (!nextSourceImageUrl) {
        throw new Error(
          "No image available. Upload a real product image or enter with a link already pointing to a valid image in /uploads.",
        );
      }

      if (!nextSourceImageUrl.trim()) {
        throw new Error(
          "The product image was not ready to generate. Upload the image again and wait for the upload to finish.",
        );
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

      if (variant === "d" || (compareMode && compareVariants.has("d"))) {
        params.set("customModel", customModel);
        if (customPrompt.trim()) params.set("customPrompt", customPrompt.trim());
      }

      router.push(`/results?${params.toString()}`);
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unknown upload error";
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

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime-400/40 focus:ring-1 focus:ring-lime-400/15 hover:border-white/[0.12]";

  const selectClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-lime-400/40 hover:border-white/[0.12] cursor-pointer";

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      {/* ── Left column: image + form fields ── */}
      <section className="flex flex-col gap-5">
        {/* File picker card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
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
            <div className="mt-5 rounded-xl border border-lime-400/15 bg-lime-400/[0.05] p-4">
              <div className="mb-3 text-sm text-lime-200/80">{f.preloadedImage}</div>
              <div className="relative aspect-square max-w-sm overflow-hidden rounded-xl border border-white/[0.08] bg-black/30">
                <Image
                  src={effectiveSourceImageUrl}
                  alt="Preloaded source image"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Product details card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <h3 className="mb-5 text-sm font-semibold text-white/60">Product details</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-white/40">
                {f.productName}
              </label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className={inputClass}
                placeholder={f.productNamePlaceholder}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-white/40">
                {f.productCategory}
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
                placeholder={f.productCategoryPlaceholder}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-xs font-medium text-white/40">
              {f.format}
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className={selectClass}
            >
              <option value="1:1 square">{f.formatOptions.square}</option>
              <option value="4:5 portrait">{f.formatOptions.portrait}</option>
              <option value="9:16 story">{f.formatOptions.story}</option>
              <option value="16:9 landscape">{f.formatOptions.landscape}</option>
            </select>
          </div>
        </div>

        {/* Model selector card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/60">{f.modelMode}</h3>
            <button
              type="button"
              onClick={() => setCompareMode((v) => !v)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                compareMode
                  ? "border-lime-400/40 bg-lime-400/10 text-lime-400"
                  : "border-white/[0.08] bg-white/[0.03] text-white/35 hover:border-white/[0.15] hover:text-white/60"
              }`}
            >
              {compareMode ? f.comparingVariants : f.compareVariants}
            </button>
          </div>

          {compareMode ? (
            <div className="space-y-3">
              <p className="text-xs text-white/25">{f.compareHint}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {VARIANTS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => toggleCompareVariant(v.id)}
                    className={`rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                      compareVariants.has(v.id)
                        ? "border-lime-400/40 bg-lime-400/[0.06] text-white"
                        : "border-white/[0.07] bg-white/[0.02] text-white/35 hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="font-semibold">{v.label}</div>
                    <div className="mt-1 text-xs opacity-60">{v.description}</div>
                  </button>
                ))}
              </div>
              {compareVariants.size < 2 ? (
                <p className="text-xs text-amber-400">{f.compareWarning}</p>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {VARIANTS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariant(v.id)}
                  className={`rounded-xl border px-3 py-3 text-left text-sm transition ${
                    variant === v.id
                      ? "border-lime-400 bg-lime-400/10 text-lime-300"
                      : "border-white/[0.07] bg-white/[0.02] text-white/35 hover:border-white/[0.12] hover:text-white/60"
                  }`}
                >
                  <div className="font-semibold">{v.label}</div>
                  <div className="mt-1 text-xs opacity-70">{v.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Variant D controls */}
        {(variant === "d" || (compareMode && compareVariants.has("d"))) && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <h3 className="mb-4 text-sm font-semibold text-white/60">Custom model settings</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-white/40">
                  {f.customModel}
                </label>
                <select
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  className={selectClass}
                >
                  {CURATED_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-white/40">
                  {f.customPrompt}
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder={String(f.customPromptPlaceholder)}
                />
                <p className="mt-1.5 text-xs text-white/20">{f.customPromptHint}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Right column: preset picker + submit ── */}
      <aside className="flex flex-col gap-5">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <h2 className="mb-1 text-sm font-semibold text-white/60">{f.choosePreset}</h2>
          <p className="mb-5 text-xs text-white/25">Select the visual style for your mockup</p>

          <div className="space-y-2">
            {PRESETS.filter((item) => variant === "d" || item.id !== "custom").map((item) => (
              <label
                key={item.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                  preset === item.id
                    ? "border-lime-400/30 bg-lime-400/[0.05]"
                    : "border-white/[0.07] bg-white/[0.01] hover:border-white/[0.12]"
                }`}
              >
                <input
                  type="radio"
                  name="preset"
                  value={item.id}
                  checked={preset === item.id}
                  onChange={() => setPreset(item.id)}
                  className="mt-0.5 accent-lime-400"
                />
                <div>
                  <div
                    className={`font-semibold text-sm ${preset === item.id ? "text-lime-300" : "text-white/75"}`}
                  >
                    {item.name}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-white/30">{item.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Warnings / errors */}
        {!effectiveSourceImageUrl ? (
          <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-4">
            <div className="flex items-start gap-2.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true">
                <path d="M8 1.5L14.5 13h-13L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-amber-200/80">{f.uploadFirst}</p>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
            <div className="flex items-start gap-2.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-red-400" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        ) : null}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime-400 px-5 py-4 text-sm font-bold text-black transition hover:bg-lime-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting || isUploadingFile ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/>
              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75"/>
            </svg>
          ) : null}
          {submitLabel}
        </button>
      </aside>
    </div>
  );
}
