"use client";

import Image from "next/image";
import { memo, useEffect, useId, useState } from "react";

interface FilePickerProps {
  selectedFileName?: string;
  isUploading?: boolean;
  onFileSelected: (file: File | null) => void;
}

function FilePickerComponent({ selectedFileName, isUploading = false, onFileSelected }: FilePickerProps) {
  const inputId = useId();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [internalSelectedFileName, setInternalSelectedFileName] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("No file selected yet.");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0] ?? null;
    onFileSelected(selectedFile);

    if (selectedFile) {
      setInternalSelectedFileName(selectedFile.name);
      setStatusMessage(`Selected file: ${selectedFile.name}`);

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return objectUrl;
      });
    } else {
      setInternalSelectedFileName("");
      setStatusMessage("No file selected yet.");
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return null;
      });
    }
  };

  const visibleSelectedFileName = selectedFileName || internalSelectedFileName;

  return (
    <div>
      <label className="mb-2 block text-sm text-neutral-300" htmlFor={inputId}>
        Imagen del producto
      </label>

      <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-4">
        <div className="flex flex-col gap-4">
          <input
            id={inputId}
            name="file"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-neutral-300 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="text-sm text-neutral-400">PNG, JPG o WEBP · evita imágenes vacías, dañadas o demasiado pequeñas</div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-neutral-300">
            {isUploading ? "Subiendo imagen..." : statusMessage}
          </div>

          {visibleSelectedFileName ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              Archivo seleccionado: {visibleSelectedFileName}
            </div>
          ) : null}

          {previewUrl ? (
            <div className="relative aspect-square max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-black/20">
              <Image src={previewUrl} alt="Local upload preview" fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 text-center text-sm text-neutral-500">
              La vista previa aparecerá aquí cuando selecciones una imagen
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        Usa una imagen real del producto. Si subes un archivo vacío, corrupto o demasiado pequeño, el sistema lo va a rechazar antes de generar.
      </p>
    </div>
  );
}

export const FilePicker = memo(FilePickerComponent);
