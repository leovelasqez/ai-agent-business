import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getGenerationById } from "@/lib/db/generations";
import { getPresetById } from "@/lib/presets";

const VARIANT_LABELS: Record<string, string> = {
  a: "A · FLUX Kontext Dev",
  b: "B · FLUX Kontext Pro",
  c: "C · GPT Image 1",
  d: "D · Nano Banana 2",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GenerationDetailPage({ params }: Props) {
  const { id } = await params;
  const generation = await getGenerationById(id);

  if (!generation) notFound();

  const preset = getPresetById(generation.preset);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <SiteHeader />

        <div className="flex items-center justify-between">
          <Link href="/history" className="text-sm text-neutral-400 hover:text-white">
            ← Historial
          </Link>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300">
            {formatDate(generation.createdAt)}
          </span>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Images */}
          <div className="flex flex-1 flex-col gap-4">
            {/* Generated previews */}
            {generation.previewUrls.length > 0 ? (
              <div className={`grid gap-3 ${generation.previewUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                {generation.previewUrls.map((url, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl bg-neutral-900">
                    <Image
                      src={url}
                      alt={`Mockup generado ${i + 1}`}
                      width={800}
                      height={800}
                      className="w-full object-cover"
                      unoptimized
                    />
                    <a
                      href={url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
                    >
                      Descargar
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-neutral-900 text-neutral-600 text-sm">
                Sin imágenes generadas
              </div>
            )}

            {/* Source image */}
            {generation.sourceImageUrl && (
              <div className="flex flex-col gap-2">
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Imagen original</p>
                <div className="relative overflow-hidden rounded-xl bg-neutral-900">
                  <Image
                    src={generation.sourceImageUrl}
                    alt="Imagen original subida"
                    width={400}
                    height={400}
                    className="max-h-48 w-full object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>

          {/* Metadata sidebar */}
          <div className="flex w-full flex-col gap-4 lg:w-72">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="mb-4 text-sm font-semibold text-white">
                {generation.productName ?? "Sin nombre"}
              </h2>

              <dl className="flex flex-col gap-3">
                <MetaRow label="Preset" value={preset?.name ?? generation.preset} />
                {generation.category && (
                  <MetaRow label="Categoría" value={generation.category} />
                )}
                {generation.format && (
                  <MetaRow label="Formato" value={generation.format} />
                )}
                <MetaRow label="Variante" value={VARIANT_LABELS[generation.variant] ?? generation.variant} />
                <MetaRow label="Modelo" value={generation.model} mono />
                {generation.provider && (
                  <MetaRow label="Proveedor" value={generation.provider} />
                )}
                <MetaRow
                  label="Estado"
                  value={generation.status}
                  valueClass={
                    generation.status === "completed"
                      ? "text-green-400"
                      : generation.status === "failed"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }
                />
              </dl>
            </div>

            {generation.prompt && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500">Prompt</p>
                <p className="text-xs leading-relaxed text-neutral-400">{generation.prompt}</p>
              </div>
            )}

            <Link
              href="/upload"
              className="rounded-full border border-white/15 px-4 py-2.5 text-center text-sm text-white transition hover:border-white/30"
            >
              + Nueva generación
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function MetaRow({
  label,
  value,
  mono = false,
  valueClass,
}: {
  label: string;
  value: string;
  mono?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">{label}</dt>
      <dd className={`text-xs text-neutral-200 ${mono ? "font-mono" : ""} ${valueClass ?? ""}`}>
        {value}
      </dd>
    </div>
  );
}
