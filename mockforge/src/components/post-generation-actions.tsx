"use client";

import Image from "next/image";
import { useState } from "react";
import { track } from "@/lib/analytics";

interface PostGenerationActionsProps {
  imageUrl: string;
  sourceImageUrl?: string;
  preset: string;
  productName?: string;
  category?: string;
  format?: string;
  variant?: string;
  customPrompt?: string;
  bgColor?: string;
  bgTexture?: string;
}

const VARIATION_HINTS = [
  "slightly different angle",
  "warmer lighting",
  "cooler tones",
  "more dramatic shadows",
  "softer bokeh background",
  "more saturated colors",
];

export function PostGenerationActions({
  imageUrl,
  sourceImageUrl,
  preset,
  productName,
  category,
  format,
  variant,
  customPrompt,
  bgColor,
  bgTexture,
}: PostGenerationActionsProps) {
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null);
  const [upscaleLoading, setUpscaleLoading] = useState(false);
  const [upscaleError, setUpscaleError] = useState<string | null>(null);

  const [variationUrl, setVariationUrl] = useState<string | null>(null);
  const [variationLoading, setVariationLoading] = useState(false);
  const [variationError, setVariationError] = useState<string | null>(null);
  const [variationHint, setVariationHint] = useState(VARIATION_HINTS[0]);

  async function handleUpscale() {
    setUpscaleLoading(true);
    setUpscaleError(null);
    track("upscale_started", { preset, variant });
    try {
      const res = await fetch("/api/generate/upscale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const json = await res.json() as { ok: boolean; data?: { url: string }; message?: string };
      if (!json.ok || !json.data?.url) throw new Error(json.message ?? "Upscale failed");
      setUpscaledUrl(json.data.url);
      track("upscale_complete", { preset, variant });
    } catch (err) {
      setUpscaleError(err instanceof Error ? err.message : "Upscale failed");
    } finally {
      setUpscaleLoading(false);
    }
  }

  async function handleVariation() {
    setVariationLoading(true);
    setVariationError(null);
    track("variation_started", { preset, variant, hint: variationHint });
    try {
      const res = await fetch("/api/generate/variation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceImageUrl,
          preset,
          productName,
          category,
          format,
          variant,
          customPrompt,
          bgColor,
          bgTexture,
          variationHint,
        }),
      });
      const json = await res.json() as { ok: boolean; data?: { previewUrls: string[] }; message?: string };
      if (!json.ok || !json.data?.previewUrls?.length) throw new Error(json.message ?? "Variation failed");
      setVariationUrl(json.data.previewUrls[0]);
      track("variation_complete", { preset, variant, hint: variationHint });
    } catch (err) {
      setVariationError(err instanceof Error ? err.message : "Variation failed");
    } finally {
      setVariationLoading(false);
    }
  }

  return (
    <div className="border-t border-white/[0.06] px-4 pb-5 pt-4">
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
        Post-generation
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Upscale 2× */}
        {!upscaledUrl && (
          <button
            type="button"
            onClick={handleUpscale}
            disabled={upscaleLoading}
            className="rounded-xl border border-white/[0.1] px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {upscaleLoading ? "Upscaling…" : "Upscale 2×"}
          </button>
        )}

        {/* Variation */}
        <div className="flex items-center gap-1.5">
          <select
            value={variationHint}
            onChange={(e) => setVariationHint(e.target.value)}
            className="appearance-none rounded-xl border border-white/[0.08] bg-neutral-950 px-3 py-1.5 text-xs text-white/50 outline-none transition hover:border-white/15 focus:border-white/20"
            style={{ colorScheme: "dark" }}
            disabled={variationLoading}
          >
            {VARIATION_HINTS.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleVariation}
            disabled={variationLoading || !sourceImageUrl}
            className="rounded-xl border border-white/[0.1] px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {variationLoading ? "Generating…" : "+ Variation"}
          </button>
        </div>
      </div>

      {(upscaleError || variationError) && (
        <p className="mt-2 text-xs text-red-400">{upscaleError ?? variationError}</p>
      )}

      {upscaledUrl && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
              Upscaled 2×
            </span>
            <a
              href={upscaledUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="text-xs text-white/30 hover:text-white/60 transition"
            >
              Download ↓
            </a>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-xl border border-white/[0.06]">
            <Image src={upscaledUrl} alt="Upscaled mockup" fill className="object-contain" unoptimized />
          </div>
        </div>
      )}

      {variationUrl && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
              Variation
            </span>
            <a
              href={variationUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="text-xs text-white/30 hover:text-white/60 transition"
            >
              Download ↓
            </a>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-xl border border-white/[0.06]">
            <Image src={variationUrl} alt="Variation mockup" fill className="object-contain" unoptimized />
          </div>
        </div>
      )}
    </div>
  );
}
