"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useRouter } from "next/navigation";
import { FilePicker } from "@/components/file-picker";
import { getLocalizedPresets, type PresetId } from "@/lib/presets";
import { CURATED_MODELS } from "@/lib/model-config";
import { useLanguage } from "@/lib/language-context";
import { track } from "@/lib/analytics";
import type { GenerationVariant } from "@/lib/image-provider";

// ── State shape ──────────────────────────────────────────────────────────────

interface FormState {
  productName: string;
  category: string;
  format: string;
  preset: PresetId;
  variant: GenerationVariant;
  customModel: string;
  customPrompt: string;
  bgColor: string;
  bgTexture: string;
  showBgControls: boolean;
  compareMode: boolean;
  compareVariants: Set<GenerationVariant>;
  selectedSourceImageUrl: string | null;
  selectedFileName: string;
  isUploadingFile: boolean;
  isSubmitting: boolean;
  error: string | null;
}

// ── Actions ───────────────────────────────────────────────────────────────────

type FormAction =
  | { type: "SET_PRODUCT_NAME"; value: string }
  | { type: "SET_CATEGORY"; value: string }
  | { type: "SET_FORMAT"; value: string }
  | { type: "SET_PRESET"; value: PresetId }
  | { type: "SET_VARIANT"; value: GenerationVariant }
  | { type: "SET_CUSTOM_MODEL"; value: string }
  | { type: "SET_CUSTOM_PROMPT"; value: string }
  | { type: "SET_BG_COLOR"; value: string }
  | { type: "SET_BG_TEXTURE"; value: string }
  | { type: "TOGGLE_BG_CONTROLS" }
  | { type: "TOGGLE_COMPARE_MODE" }
  | { type: "TOGGLE_COMPARE_VARIANT"; variant: GenerationVariant }
  | { type: "ENABLE_BATCH_ALL" }
  | { type: "UPLOAD_START"; fileName: string }
  | { type: "UPLOAD_SUCCESS"; url: string }
  | { type: "UPLOAD_FAIL" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_DONE" }
  | { type: "CLEAR_FILE" }
  | { type: "SET_ERROR"; message: string | null };

function reducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_PRODUCT_NAME":    return { ...state, productName: action.value };
    case "SET_CATEGORY":        return { ...state, category: action.value };
    case "SET_FORMAT":          return { ...state, format: action.value };
    case "SET_PRESET":          return { ...state, preset: action.value };
    case "SET_VARIANT":         return { ...state, variant: action.value };
    case "SET_CUSTOM_MODEL":    return { ...state, customModel: action.value };
    case "SET_CUSTOM_PROMPT":   return { ...state, customPrompt: action.value };
    case "SET_BG_COLOR":        return { ...state, bgColor: action.value };
    case "SET_BG_TEXTURE":      return { ...state, bgTexture: action.value };
    case "SET_ERROR":           return { ...state, error: action.message };
    case "TOGGLE_BG_CONTROLS":  return { ...state, showBgControls: !state.showBgControls };
    case "TOGGLE_COMPARE_MODE": return { ...state, compareMode: !state.compareMode };
    case "ENABLE_BATCH_ALL":    return { ...state, compareMode: true, compareVariants: new Set(["a", "b", "c"]) };
    case "TOGGLE_COMPARE_VARIANT": {
      const next = new Set(state.compareVariants);
      if (next.has(action.variant)) next.delete(action.variant);
      else next.add(action.variant);
      return { ...state, compareVariants: next };
    }
    case "UPLOAD_START":
      return { ...state, selectedFileName: action.fileName, selectedSourceImageUrl: null, isUploadingFile: true, error: null };
    case "UPLOAD_SUCCESS":
      return { ...state, selectedSourceImageUrl: action.url, isUploadingFile: false };
    case "UPLOAD_FAIL":
      return { ...state, selectedFileName: "", selectedSourceImageUrl: null, isUploadingFile: false };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true, error: null };
    case "SUBMIT_DONE":
      return { ...state, isSubmitting: false };
    case "CLEAR_FILE":
      return { ...state, selectedFileName: "", selectedSourceImageUrl: null, error: null };
    default:
      return state;
  }
}

// ── Props & initial state factory ─────────────────────────────────────────────

interface MockupUploadFormProps {
  initialSourceImageUrl?: string;
  initialPreset?: PresetId;
  initialCategory?: string;
  initialFormat?: string;
  initialProductName?: string;
  initialVariant?: GenerationVariant;
}

function makeInitialState(props: MockupUploadFormProps): FormState {
  return {
    productName: props.initialProductName ?? "",
    category: props.initialCategory ?? "",
    format: props.initialFormat ?? "1:1 square",
    preset: props.initialPreset ?? "clean_studio",
    variant: props.initialVariant ?? "a",
    customModel: CURATED_MODELS[0].id,
    customPrompt: "",
    bgColor: "",
    bgTexture: "",
    showBgControls: false,
    compareMode: false,
    compareVariants: new Set(["b", "c", "d"]),
    selectedSourceImageUrl: null,
    selectedFileName: "",
    isUploadingFile: false,
    isSubmitting: false,
    error: null,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MockupUploadForm(props: MockupUploadFormProps) {
  const { initialSourceImageUrl } = props;
  const router = useRouter();
  const { t, language } = useLanguage();
  const f = t.form;
  const localizedPresets = getLocalizedPresets(language);
  const productNameId = "product-name";
  const categoryId = "product-category";
  const formatId = "product-format";
  const customModelId = "custom-model";
  const customPromptId = "custom-prompt";

  const [state, dispatch] = useReducer(reducer, props, makeInitialState);

  const VARIANTS = useMemo(
    () => [
      { id: "a" as GenerationVariant, label: f.variants[0].label, description: f.variants[0].description },
      { id: "b" as GenerationVariant, label: f.variants[1].label, description: f.variants[1].description },
      { id: "c" as GenerationVariant, label: f.variants[2].label, description: f.variants[2].description },
      { id: "d" as GenerationVariant, label: f.variants[3].label, description: f.variants[3].description },
    ],
    [f.variants],
  );

  const effectiveSourceImageUrl = state.selectedSourceImageUrl || initialSourceImageUrl || null;

  const canSubmit = useMemo(() => {
    const hasImage = Boolean(effectiveSourceImageUrl);
    const hasVariants = state.compareMode ? state.compareVariants.size >= 2 : true;
    return !state.isSubmitting && !state.isUploadingFile && hasImage && hasVariants;
  }, [effectiveSourceImageUrl, state.isSubmitting, state.isUploadingFile, state.compareMode, state.compareVariants]);

  // Auto-clear errors after 6 s
  useEffect(() => {
    if (!state.error) return;
    const timer = setTimeout(() => dispatch({ type: "SET_ERROR", message: null }), 6000);
    return () => clearTimeout(timer);
  }, [state.error]);

  const uploadFile = useCallback(async (file: File) => {
    dispatch({ type: "UPLOAD_START", fileName: file.name });

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

      dispatch({ type: "UPLOAD_SUCCESS", url: uploadJson.data.sourceImageUrl });
      track("upload_complete", { fileName: file.name, fileSize: file.size, fileType: file.type });
      return uploadJson.data.sourceImageUrl as string;
    } catch (uploadError) {
      dispatch({ type: "UPLOAD_FAIL" });
      const message = uploadError instanceof Error ? uploadError.message : "Unknown upload error";
      dispatch({ type: "SET_ERROR", message });
      throw new Error(message);
    }
  }, []);

  const handleSubmit = async () => {
    dispatch({ type: "SUBMIT_START" });

    try {
      let nextSourceImageUrl = effectiveSourceImageUrl;

      const domFileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;

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
        preset: state.preset,
        category: state.category || "unspecified",
        format: state.format,
        productName: state.productName || "Untitled product",
        sourceImageUrl: nextSourceImageUrl.trim(),
      });

      if (state.compareMode && state.compareVariants.size >= 2) {
        params.set("compareVariants", [...state.compareVariants].join(","));
      } else {
        params.set("variant", state.variant);
      }

      if (state.variant === "d" || (state.compareMode && state.compareVariants.has("d"))) {
        params.set("customModel", state.customModel);
        if (state.customPrompt.trim()) params.set("customPrompt", state.customPrompt.trim());
      }

      if (state.bgColor.trim()) params.set("bgColor", state.bgColor.trim());
      if (state.bgTexture.trim()) params.set("bgTexture", state.bgTexture.trim());

      router.push(`/results?${params.toString()}`);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unknown upload error";
      dispatch({ type: "SET_ERROR", message });
      dispatch({ type: "SUBMIT_DONE" });
    }
  };

  const submitLabel = state.isSubmitting
    ? f.submitPreparing
    : state.isUploadingFile
      ? f.submitUploading
      : state.compareMode
        ? f.submitCompare.replace("{n}", String(state.compareVariants.size))
        : f.submitGenerate;

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#05DF72]/40 focus:ring-1 focus:ring-lime-400/15 hover:border-white/[0.12]";

  const selectClass =
    "w-full appearance-none rounded-xl border border-white/[0.08] bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition focus:border-[#05DF72]/40 focus:ring-1 focus:ring-lime-400/15 hover:border-white/[0.12] cursor-pointer";

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      {/* ── Left column: image + form fields ── */}
      <section className="flex flex-col gap-5">
        {/* File picker card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <FilePicker
            selectedFileName={state.selectedFileName}
            isUploading={state.isUploadingFile}
            onFileSelected={async (file) => {
              if (!file) { dispatch({ type: "CLEAR_FILE" }); return; }
              await uploadFile(file);
            }}
          />

          {effectiveSourceImageUrl && !state.selectedSourceImageUrl ? (
            <div className="mt-5 rounded-xl border border-[#05DF72]/15 bg-[#05DF72]/[0.05] p-4">
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
          <h3 className="mb-5 text-sm font-semibold text-white/60">{t.upload.productDetails}</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={productNameId} className="mb-2 block text-xs font-medium text-white/40">{f.productName}</label>
              <input
                id={productNameId}
                value={state.productName}
                onChange={(e) => dispatch({ type: "SET_PRODUCT_NAME", value: e.target.value })}
                className={inputClass}
                placeholder={f.productNamePlaceholder}
              />
            </div>
            <div>
              <label htmlFor={categoryId} className="mb-2 block text-xs font-medium text-white/40">{f.productCategory}</label>
              <input
                id={categoryId}
                value={state.category}
                onChange={(e) => dispatch({ type: "SET_CATEGORY", value: e.target.value })}
                className={inputClass}
                placeholder={f.productCategoryPlaceholder}
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor={formatId} className="mb-2 block text-xs font-medium text-white/40">{f.format}</label>
            <select
              id={formatId}
              value={state.format}
              onChange={(e) => dispatch({ type: "SET_FORMAT", value: e.target.value })}
              className={selectClass}
              style={{ colorScheme: "dark" }}
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
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white/60">{f.modelMode}</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => dispatch({ type: "ENABLE_BATCH_ALL" })}
                className="rounded-full border border-[#05DF72]/30 bg-[#05DF72]/[0.07] px-3 py-1 text-xs font-medium text-[#05DF72] transition hover:bg-[#05DF72]/[0.12]"
                title="Generate all 3 variants in parallel"
              >
                {f.batchAll ?? "Batch A+B+C"}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "TOGGLE_COMPARE_MODE" })}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  state.compareMode
                    ? "border-[#05DF72]/40 bg-[#05DF72]/10 text-[#05DF72]"
                    : "border-white/[0.08] bg-white/[0.03] text-white/35 hover:border-white/[0.15] hover:text-white/60"
                }`}
              >
                {state.compareMode ? f.comparingVariants : f.compareVariants}
              </button>
            </div>
          </div>

          {state.compareMode ? (
            <div className="space-y-3">
              <p className="text-xs text-white/25">{f.compareHint}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {VARIANTS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => dispatch({ type: "TOGGLE_COMPARE_VARIANT", variant: v.id })}
                    className={`rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                      state.compareVariants.has(v.id)
                        ? "border-[#05DF72]/40 bg-[#05DF72]/[0.06] text-white"
                        : "border-white/[0.07] bg-white/[0.02] text-white/35 hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="font-semibold">{v.label}</div>
                    <div className="mt-1 text-xs opacity-60">{v.description}</div>
                  </button>
                ))}
              </div>
              {state.compareVariants.size < 2 ? (
                <p className="text-xs text-amber-400">{f.compareWarning}</p>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {VARIANTS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => dispatch({ type: "SET_VARIANT", value: v.id })}
                  className={`rounded-xl border px-3 py-3 text-left text-sm transition ${
                    state.variant === v.id
                      ? "border-[#05DF72] bg-[#05DF72]/10 text-[#34e58a]"
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
        {(state.variant === "d" || (state.compareMode && state.compareVariants.has("d"))) && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <h3 className="mb-4 text-sm font-semibold text-white/60">{t.upload.customSettings}</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor={customModelId} className="mb-2 block text-xs font-medium text-white/40">{f.customModel}</label>
                <select
                  id={customModelId}
                  value={state.customModel}
                  onChange={(e) => dispatch({ type: "SET_CUSTOM_MODEL", value: e.target.value })}
                  className={selectClass}
                  style={{ colorScheme: "dark" }}
                >
                  {CURATED_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={customPromptId} className="mb-2 block text-xs font-medium text-white/40">{f.customPrompt}</label>
                <textarea
                  id={customPromptId}
                  value={state.customPrompt}
                  onChange={(e) => dispatch({ type: "SET_CUSTOM_PROMPT", value: e.target.value })}
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
          <p className="mb-5 text-xs text-white/25">{t.upload.presetDescription}</p>

          <div className="space-y-2">
            {localizedPresets.filter((item) => state.variant === "d" || item.id !== "custom").map((item) => (
              <label
                key={item.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                  state.preset === item.id
                    ? "border-[#05DF72]/30 bg-[#05DF72]/[0.05]"
                    : "border-white/[0.07] bg-white/[0.01] hover:border-white/[0.12]"
                }`}
              >
                <input
                  type="radio"
                  name="preset"
                  value={item.id}
                  checked={state.preset === item.id}
                  onChange={() => dispatch({ type: "SET_PRESET", value: item.id })}
                  className="mt-0.5 accent-[#05DF72]"
                />
                <div>
                  <div className={`font-semibold text-sm ${state.preset === item.id ? "text-[#34e58a]" : "text-white/75"}`}>
                    {item.name}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-white/30">{item.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Background controls */}
        {state.preset !== "custom" && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <button
              type="button"
              onClick={() => dispatch({ type: "TOGGLE_BG_CONTROLS" })}
              className="flex w-full items-center justify-between text-sm font-semibold text-white/60 hover:text-white/80 transition"
            >
              <span>Background controls</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
                className={`transition-transform ${state.showBgControls ? "rotate-180" : ""}`}
              >
                <path d="M2 5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {state.showBgControls && (
              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-medium text-white/40">
                    Background color hint
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={state.bgColor}
                      onChange={(e) => dispatch({ type: "SET_BG_COLOR", value: e.target.value })}
                      className={`${inputClass} flex-1`}
                      placeholder="e.g. sage green, warm beige, navy blue"
                    />
                    <div className="flex gap-1.5">
                      {["white", "cream", "sage", "navy", "black"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => dispatch({ type: "SET_BG_COLOR", value: c })}
                          title={c}
                          className={`h-9 w-9 rounded-lg border text-[10px] font-semibold capitalize transition ${
                            state.bgColor === c
                              ? "border-[#05DF72]/50 ring-1 ring-[#05DF72]/30"
                              : "border-white/[0.08] hover:border-white/20"
                          }`}
                          style={{
                            background:
                              c === "white" ? "#f5f5f5"
                              : c === "cream" ? "#fdf6e3"
                              : c === "sage" ? "#8fa888"
                              : c === "navy" ? "#1a2744"
                              : "#050505",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-white/40">
                    Background texture
                  </label>
                  <select
                    value={state.bgTexture}
                    onChange={(e) => dispatch({ type: "SET_BG_TEXTURE", value: e.target.value })}
                    className={selectClass}
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="">None (solid / plain)</option>
                    <option value="marble">Marble</option>
                    <option value="wood">Natural wood</option>
                    <option value="linen">Linen fabric</option>
                    <option value="concrete">Concrete</option>
                    <option value="bokeh">Bokeh blur</option>
                    <option value="gradient">Smooth gradient</option>
                  </select>
                </div>

                {(state.bgColor || state.bgTexture) && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: "SET_BG_COLOR", value: "" });
                      dispatch({ type: "SET_BG_TEXTURE", value: "" });
                    }}
                    className="text-xs text-white/25 hover:text-white/50 transition"
                  >
                    Clear controls
                  </button>
                )}
              </div>
            )}
          </div>
        )}

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

        {state.error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
            <div className="flex items-start gap-2.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-red-400" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-red-300">{state.error}</p>
            </div>
          </div>
        ) : null}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#05DF72] px-5 py-4 text-sm font-bold text-black transition hover:bg-[#34e58a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {state.isSubmitting || state.isUploadingFile ? (
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
