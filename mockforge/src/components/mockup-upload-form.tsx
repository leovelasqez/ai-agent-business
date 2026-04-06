"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FilePicker } from "@/components/file-picker";
import { PRESETS, type PresetId } from "@/lib/presets";
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

  const [productName, setProductName] = useState(initialProductName);
  const [category, setCategory] = useState(initialCategory);
  const [format, setFormat] = useState(initialFormat);
  const [preset, setPreset] = useState<PresetId>(initialPreset);
  const [variant, setVariant] = useState<GenerationVariant>(initialVariant);
  const [selectedSourceImageUrl, setSelectedSourceImageUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveSourceImageUrl = selectedSourceImageUrl || initialSourceImageUrl || null;
  const canSubmit = useMemo(
    () => !isSubmitting && !isUploadingFile && Boolean(effectiveSourceImageUrl),
    [effectiveSourceImageUrl, isSubmitting, isUploadingFile],
  );

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
        throw new Error(
          "No hay imagen disponible. Sube una imagen real del producto o entra con un link que ya apunte a una imagen válida en /uploads.",
        );
      }

      if (!nextSourceImageUrl || !nextSourceImageUrl.trim()) {
        throw new Error("La imagen del producto no quedó lista para generar. Sube la imagen otra vez y espera a que termine el upload.");
      }

      const params = new URLSearchParams({
        preset,
        category: category || "unspecified",
        format,
        productName: productName || "Untitled product",
        sourceImageUrl: nextSourceImageUrl.trim(),
        variant,
      });

      router.push(`/results?${params.toString()}`);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unknown upload error";
      setError(message);
      setIsSubmitting(false);
    }
  };

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

          {effectiveSourceImageUrl ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="mb-3 text-sm text-emerald-100">
                {selectedSourceImageUrl
                  ? "Imagen subida correctamente. Ya puedes generar mockups con esta versión."
                  : "Ya hay una imagen precargada desde el link. Puedes generar directo o reemplazarla subiendo otra."}
              </div>
              <div className="relative aspect-square max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                <Image src={effectiveSourceImageUrl} alt="Preloaded source image" fill className="object-cover" unoptimized />
              </div>
              <div className="mt-3 text-xs text-emerald-200">Fuente actual: {effectiveSourceImageUrl}</div>
              {selectedFileName ? <div className="mt-1 text-xs text-emerald-300">Archivo: {selectedFileName}</div> : null}
            </div>
          ) : null}

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            Si el selector de archivos falla dentro de Telegram o de un navegador embebido, abre esta página en Chrome o Safari. Usa una foto real del producto: archivos vacíos, corruptos o demasiado pequeños se rechazan automáticamente.
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-neutral-300">Nombre del producto</label>
              <input
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-neutral-600"
                placeholder="Ej: Vitamin C Serum"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-neutral-300">Categoría del producto</label>
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-neutral-600"
                placeholder="Ej: skincare, candle, supplement"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">Formato</label>
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
            >
              <option value="1:1 square">1:1 Cuadrado</option>
              <option value="4:5 portrait">4:5 Vertical</option>
              <option value="9:16 story">9:16 Story (Instagram)</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">Modo de modelo</label>
            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setVariant("a")}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  variant === "a"
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-black/20 text-neutral-300 hover:border-white/20"
                }`}
              >
                <div className="font-medium">A · FLUX Dev</div>
                <div className="mt-1 text-xs opacity-80">Más rápido y barato, pero deforma más.</div>
              </button>
              <button
                type="button"
                onClick={() => setVariant("b")}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  variant === "b"
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-black/20 text-neutral-300 hover:border-white/20"
                }`}
              >
                <div className="font-medium">B · FLUX Pro</div>
                <div className="mt-1 text-xs opacity-80">Más caro, debería preservar mejor el producto.</div>
              </button>
              <button
                type="button"
                onClick={() => setVariant("c")}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  variant === "c"
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-black/20 text-neutral-300 hover:border-white/20"
                }`}
              >
                <div className="font-medium">C · GPT Image 1</div>
                <div className="mt-1 text-xs opacity-80">Vía fal, orientado a editar sin destruir el producto.</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-medium">Elige un preset</h2>
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
            Primero sube una imagen válida y espera a que quede confirmada antes de generar, sobre todo para la variante C.
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
          {isSubmitting ? "Preparando..." : isUploadingFile ? "Subiendo imagen..." : "Generar mockups"}
        </button>
      </aside>
    </div>
  );
}
