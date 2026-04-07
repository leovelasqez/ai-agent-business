"use client";

import Image from "next/image";
import { memo, useEffect, useId, useState } from "react";
import { useLanguage } from "@/lib/language-context";

interface FilePickerProps {
  selectedFileName?: string;
  isUploading?: boolean;
  onFileSelected: (file: File | null) => void;
}

function FilePickerComponent({ selectedFileName, isUploading = false, onFileSelected }: FilePickerProps) {
  const inputId = useId();
  const { t } = useLanguage();
  const fp = t.filePicker;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [internalSelectedFileName, setInternalSelectedFileName] = useState<string>("");

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

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return objectUrl;
      });
    } else {
      setInternalSelectedFileName("");
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
        {fp.label}
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

          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span>{fp.formats}</span>
            {isUploading && <span className="text-emerald-400">{fp.uploading}</span>}
            {visibleSelectedFileName && !isUploading && (
              <span className="text-emerald-400 truncate">· {visibleSelectedFileName}</span>
            )}
          </div>

          {previewUrl ? (
            <div className="relative aspect-square max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-black/20">
              <Image src={previewUrl} alt="Local upload preview" fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 text-center text-sm text-neutral-500">
              {fp.placeholder}
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        {fp.hint}
      </p>
    </div>
  );
}

export const FilePicker = memo(FilePickerComponent);
