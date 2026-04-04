"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ResultsSummary } from "@/components/results-summary";
import type { GenerationStatus } from "@/lib/types";

interface ResultsViewProps {
  preset: string;
  category: string;
  format: string;
  productName: string;
  sourceImageUrl?: string;
  variant?: "a" | "b" | "c";
}

interface GenerateResponse {
  ok: boolean;
  message?: string;
  error?: string;
  data?: {
    generationId: string;
    previewUrls: string[];
    prompt?: string;
    provider?: string;
    model?: string;
    status?: GenerationStatus;
    variant?: "a" | "b" | "c";
    variantLabel?: string;
  };
}

export function ResultsView({
  preset,
  category,
  format,
  productName,
  sourceImageUrl,
  variant = "a",
}: ResultsViewProps) {
  const [status, setStatus] = useState<GenerationStatus>("processing");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [variantLabel, setVariantLabel] = useState<string>(
    variant === "c" ? "C · GPT Image 1 via fal" : variant === "b" ? "B · FLUX Kontext Pro" : "A · FLUX Kontext Dev",
  );

  useEffect(() => {
    let isCancelled = false;

    async function generate() {
      setStatus("processing");
      setError(null);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preset,
            category,
            format,
            productName,
            sourceImageUrl,
            variant,
          }),
        });

        const json = (await response.json()) as GenerateResponse;

        if (!response.ok || !json.ok || !json.data?.previewUrls?.length) {
          throw new Error(json.message || "Generation failed");
        }

        if (isCancelled) return;

        setPreviewUrls(json.data.previewUrls);
        setVariantLabel(
          json.data.variantLabel ||
            (variant === "c" ? "C · GPT Image 1 via fal" : variant === "b" ? "B · FLUX Kontext Pro" : "A · FLUX Kontext Dev"),
        );
        setStatus("completed");
      } catch (generationError) {
        if (isCancelled) return;

        setError(generationError instanceof Error ? generationError.message : "Unknown generation error");
        setStatus("failed");
      }
    }

    generate();

    return () => {
      isCancelled = true;
    };
  }, [preset, category, format, productName, sourceImageUrl, variant]);

  const title = useMemo(() => {
    if (status === "processing") return "Generando tus mockups premium...";
    if (status === "failed") return "No se pudieron generar los mockups";
    return "Tus mockups están listos";
  }, [status]);

  const subtitle = useMemo(() => {
    if (status === "processing") {
      return "Estamos creando versiones con look comercial a partir de tu imagen. Esto puede tardar unos segundos.";
    }

    if (status === "failed") {
      return "Prueba con otra imagen del producto o vuelve al paso anterior para ajustar los datos.";
    }

    return "Ya tienes previews listas para validar tu idea, enseñar a clientes o preparar tu siguiente iteración.";
  }, [status]);

  const primaryPreview = previewUrls[0] ?? null;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-neutral-300">
              MockForge Results
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
                  {status === "processing" ? "Procesando" : status === "failed" ? "Falló" : "Completado"}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    status === "completed"
                      ? "bg-emerald-500/15 text-emerald-200"
                      : status === "failed"
                        ? "bg-red-500/15 text-red-200"
                        : "bg-white/10 text-neutral-200"
                  }`}
                >
                  {status === "processing" ? "En curso" : status === "failed" ? "Requiere revisión" : "Listo"}
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">{variantLabel}</div>
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
                  <div
                    key={`${url}-${index}`}
                    className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={url}
                        alt={`Generated mockup ${index + 1}`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        unoptimized
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-4 py-4">
                        <div className="text-sm font-medium text-white">Mockup {index + 1}</div>
                        <div className="mt-1 text-xs text-white/70">Preview lista para revisar o compartir</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
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
