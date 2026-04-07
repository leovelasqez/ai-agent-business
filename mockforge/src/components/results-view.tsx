"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ResultsSummary } from "@/components/results-summary";
import { RatingButtons } from "@/components/rating-buttons";
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

// ── Single-variant mode ──────────────────────────────────────────────────────

const VARIANT_LABELS: Record<string, string> = {
  a: "A · FLUX Kontext Dev",
  b: "B · FLUX Kontext Pro",
  c: "C · GPT Image 1 via fal",
  d: "D · Nano Banana 2",
};

function friendlyError(raw: string): string {
  if (raw.includes("Load failed"))
    return "La solicitud falló al cargar. Si abriste MockForge dentro de Telegram, prueba en Chrome o Safari y vuelve a intentar.";
  if (raw.includes("Failed to fetch"))
    return "No se pudo conectar con el servidor. Revisa la conexión o intenta abrir MockForge fuera del navegador embebido.";
  if (raw.includes("ENOENT"))
    return "La imagen fuente ya no existe en el servidor. Sube el producto otra vez e intenta de nuevo.";
  return raw;
}

async function callGenerate(body: {
  preset: string;
  category: string;
  format: string;
  productName: string;
  sourceImageUrl?: string;
  variant: string;
}): Promise<GenerateResponse> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json() as Promise<GenerateResponse>;
}

// ── Compare mode types ────────────────────────────────────────────────────────

interface VariantResult {
  variant: GenerationVariant;
  variantLabel: string;
  status: GenerationStatus;
  previewUrls: string[];
  generationId: string | null;
  error: string | null;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ImageCard({
  url,
  index,
  generationId,
}: {
  url: string;
  index: number;
  generationId: string | null;
}) {
  return (
    <div className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={url}
          alt={`Generated mockup ${index + 1}`}
          fill
          className="object-contain transition duration-500 group-hover:scale-[1.03]"
          unoptimized
        />
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <div className="text-sm font-medium text-white">Mockup {index + 1}</div>
          <div className="mt-0.5 text-xs text-white/50">Preview lista para revisar o compartir</div>
        </div>
        <div className="flex items-center gap-2">
          {generationId ? (
            <RatingButtons generationId={generationId} />
          ) : null}
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            download
            className="rounded-xl border border-white/15 px-3 py-1.5 text-xs font-medium text-white transition hover:border-white/30 hover:bg-white/10"
          >
            Descargar
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Compare grid card ─────────────────────────────────────────────────────────

function CompareCard({ result, sourceImageUrl }: { result: VariantResult; sourceImageUrl?: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Variante</div>
          <div className="mt-1 text-base font-medium text-white">{result.variantLabel}</div>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            result.status === "completed"
              ? "bg-emerald-500/15 text-emerald-200"
              : result.status === "failed"
                ? "bg-red-500/15 text-red-200"
                : "bg-white/10 text-neutral-300"
          }`}
        >
          {result.status === "processing"
            ? "En curso"
            : result.status === "failed"
              ? "Falló"
              : "Listo"}
        </div>
      </div>

      {result.status === "processing" ? (
        <div className="flex aspect-square items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-white" />
        </div>
      ) : result.status === "failed" ? (
        <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-red-500/20 bg-red-500/10 p-6 text-center">
          <p className="text-sm text-red-200">{result.error}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {result.previewUrls.map((url, i) => (
            <ImageCard key={`${url}-${i}`} url={url} index={i} generationId={result.generationId} />
          ))}
        </div>
      )}

      {result.status === "completed" && sourceImageUrl ? (
        <div className="mt-4">
          <div className="mb-2 text-xs text-neutral-500">Original</div>
          <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
            <Image src={sourceImageUrl} alt="Imagen base" fill className="object-cover" unoptimized />
          </div>
        </div>
      ) : null}
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
}: ResultsViewProps) {
  // ── Single mode state ──
  const [status, setStatus] = useState<GenerationStatus>("processing");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const defaultVariantLabel = VARIANT_LABELS[variant] ?? variant;
  const [variantLabel, setVariantLabel] = useState<string>(defaultVariantLabel);

  // ── Compare mode state ──
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

  const isCompareMode = Boolean(compareVariants && compareVariants.length >= 2);

  // ── Single-variant generation ──
  useEffect(() => {
    if (isCompareMode) return;

    let isCancelled = false;

    async function generate() {
      setStatus("processing");
      setError(null);

      try {
        const json = await callGenerate({ preset, category, format, productName, sourceImageUrl, variant });

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
        const raw = err instanceof Error ? err.message : "Unknown generation error";
        setError(friendlyError(raw));
        setStatus("failed");
      }
    }

    generate();
    return () => { isCancelled = true; };
  }, [preset, category, format, productName, sourceImageUrl, variant, isCompareMode, defaultVariantLabel]);

  // ── Compare mode: generate each variant independently, update state as each resolves ──
  useEffect(() => {
    if (!isCompareMode || !compareVariants) return;

    let isCancelled = false;

    async function generateVariant(v: GenerationVariant, index: number) {
      try {
        const json = await callGenerate({ preset, category, format, productName, sourceImageUrl, variant: v });

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
                  variantLabel: json.data!.variantLabel || r.variantLabel,
                }
              : r,
          ),
        );
      } catch (err) {
        if (isCancelled) return;
        const raw = err instanceof Error ? err.message : "Unknown generation error";
        setVariantResults((prev) =>
          prev.map((r, i) =>
            i === index ? { ...r, status: "failed", error: friendlyError(raw) } : r,
          ),
        );
      }
    }

    // Fire all in parallel
    void Promise.all(compareVariants.map((v, i) => generateVariant(v, i)));

    return () => { isCancelled = true; };
  }, [isCompareMode, compareVariants, preset, category, format, productName, sourceImageUrl]);

  const title = useMemo(() => {
    if (isCompareMode) {
      const allDone = variantResults.every((r) => r.status !== "processing");
      if (!allDone) return "Generando comparación de variantes...";
      const anyFailed = variantResults.some((r) => r.status === "failed");
      return anyFailed ? "Comparación completada con errores" : "Comparación lista";
    }
    if (status === "processing") return "Generando tus mockups premium...";
    if (status === "failed") return "No se pudieron generar los mockups";
    return "Tus mockups están listos";
  }, [status, isCompareMode, variantResults]);

  const subtitle = useMemo(() => {
    if (isCompareMode)
      return "Generando el mismo producto con múltiples modelos en paralelo para que puedas elegir el mejor resultado.";
    if (status === "processing")
      return "Estamos creando versiones con look comercial a partir de tu imagen. Esto puede tardar unos segundos.";
    if (status === "failed")
      return "Prueba con otra imagen del producto o vuelve al paso anterior para ajustar los datos.";
    return "Ya tienes previews listas para validar tu idea, enseñar a clientes o preparar tu siguiente iteración.";
  }, [status, isCompareMode]);

  const overallStatus = isCompareMode
    ? variantResults.every((r) => r.status !== "processing")
      ? "completed"
      : "processing"
    : status;

  const primaryPreview = isCompareMode
    ? variantResults.find((r) => r.previewUrls.length > 0)?.previewUrls[0] ?? null
    : previewUrls[0] ?? null;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-neutral-300">
              {isCompareMode ? "MockForge Comparación" : "MockForge Results"}
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
              <p className="max-w-2xl text-base leading-7 text-neutral-300 md:text-lg">{subtitle}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/upload"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-white/30"
              >
                Crear otra versión
              </Link>
              {primaryPreview ? (
                <a
                  href={primaryPreview}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
                >
                  Abrir mejor resultado
                </a>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Estado</div>
                <div className="mt-2 text-lg font-medium text-white">
                  {overallStatus === "processing" ? "Procesando" : "Completado"}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    overallStatus === "completed"
                      ? "bg-emerald-500/15 text-emerald-200"
                      : "bg-white/10 text-neutral-200"
                  }`}
                >
                  {overallStatus === "processing" ? "En curso" : "Listo"}
                </div>
                {!isCompareMode ? (
                  <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">{variantLabel}</div>
                ) : (
                  <div className="text-xs text-neutral-500">
                    {variantResults.filter((r) => r.status === "completed").length}/{variantResults.length} listas
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
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {variantResults.map((result) => (
            <CompareCard key={result.variant} result={result} sourceImageUrl={sourceImageUrl} />
          ))}
        </section>
      ) : null}

      {/* ── Single mode ── */}
      {!isCompareMode ? (
        <>
          {status === "processing" ? (
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
              <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/15 border-t-white" />
              <p className="mt-5 text-sm text-neutral-400">Creando previews premium...</p>
            </section>
          ) : null}

          {status === "failed" ? (
            <section className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-6 text-red-100">
              <div className="text-lg font-medium">Error de generación</div>
              <p className="mt-2 text-sm text-red-200">{error}</p>
              <p className="mt-2 text-xs text-red-300/90">
                Consejo: si esto pasó dentro de Telegram o de otro navegador embebido, abre MockForge en Chrome o Safari.
              </p>
            </section>
          ) : null}

          {(sourceImageUrl || previewUrls.length > 0) && status !== "processing" ? (
            <section className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
              {sourceImageUrl ? (
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Original</div>
                      <div className="mt-2 text-lg font-medium text-white">Imagen base</div>
                    </div>
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
                    <Image src={sourceImageUrl} alt="Imagen base del producto" fill className="object-cover" unoptimized />
                  </div>
                </div>
              ) : null}

              {status === "completed" ? (
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Resultados</div>
                      <div className="mt-2 text-lg font-medium text-white">Mockups generados</div>
                    </div>
                    <div className="text-sm text-neutral-400">{previewUrls.length} variantes</div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {previewUrls.map((url, index) => (
                      <ImageCard
                        key={`${url}-${index}`}
                        url={url}
                        index={index}
                        generationId={generationId}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}
        </>
      ) : null}

      <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-2xl font-semibold">Desbloquea más variantes y exports HD</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
            Si este resultado te sirve, el siguiente paso es convertir estas previews en un flujo comercial completo con más packs, mejor resolución y entregables listos para vender.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-white/30">
            $9 · Desbloquear este pack
          </button>
          <Link
            href="/success"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
          >
            $19 · Comprar 3 packs
          </Link>
        </div>
      </section>
    </div>
  );
}
