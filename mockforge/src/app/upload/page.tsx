import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { MockupUploadForm } from "@/components/mockup-upload-form";
import { getPresetById, type PresetId } from "@/lib/presets";

interface UploadPageProps {
  searchParams: Promise<{
    file?: string;
    preset?: string;
    category?: string;
    format?: string;
    productName?: string;
    variant?: "a" | "b" | "c";
  }>;
}

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const params = await searchParams;
  const sourceImageUrl = params.file ? `/uploads/${params.file}` : undefined;
  const preset = getPresetById(params.preset ?? "")?.id ?? ("clean_studio" as PresetId);
  const category = params.category ?? "";
  const format = params.format ?? "1:1 square";
  const productName = params.productName ?? "";
  const variant = params.variant === "b" ? "b" : params.variant === "c" ? "c" : "a";

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
        <SiteHeader />

        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-neutral-400 hover:text-white">
            ← Back
          </Link>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300">
            Generación en vivo
          </span>
        </div>

        <div className="max-w-2xl space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">Sube tu producto</h1>
          <p className="text-base text-neutral-400">
            Carga una imagen de tu producto, elige un preset y genera mockups listos para probar en tu tienda, anuncios o contenido.
          </p>
        </div>

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
