"use client";

import Image from "next/image";
import { memo, useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";

interface FilePickerProps {
  selectedFileName?: string;
  isUploading?: boolean;
  onFileSelected: (file: File | null) => void;
}

function FilePickerComponent({
  selectedFileName,
  isUploading = false,
  onFileSelected,
}: FilePickerProps) {
  const inputId = useId();
  const { t } = useLanguage();
  const fp = t.filePicker;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [internalSelectedFileName, setInternalSelectedFileName] =
    useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const processFile = (file: File) => {
    setDragError(null);
    onFileSelected(file);
    setInternalSelectedFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return objectUrl;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0] ?? null;
    if (selectedFile) {
      setDragError(null);
      processFile(selectedFile);
    } else {
      onFileSelected(null);
      setInternalSelectedFileName("");
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && ["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      processFile(file);
    } else if (file) {
      setDragError(fp.invalidType);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const visibleSelectedFileName = selectedFileName || internalSelectedFileName;

  return (
    <div>
      <label
        className="mb-2 block text-xs font-semibold text-white/40"
        htmlFor={inputId}
      >
        {fp.label}
      </label>

      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`rounded-2xl border-2 border-dashed transition ${
          isDragging
            ? "border-[#05DF72]/50 bg-[#05DF72]/[0.04]"
            : "border-white/[0.08] bg-white/[0.015] hover:border-white/[0.15]"
        }`}
      >
        {previewUrl ? (
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              src={previewUrl}
              alt="Local upload preview"
              fill
              className="object-cover"
              unoptimized
            />
            {/* Replace overlay */}
            <label
              htmlFor={inputId}
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 opacity-0 transition hover:bg-black/55 hover:opacity-100"
            >
              <span className="rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                {fp.replaceImage}
              </span>
            </label>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="flex min-h-52 cursor-pointer flex-col items-center justify-center gap-4 p-8 text-center"
          >
            {isUploading ? (
              <>
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/[0.08] border-t-lime-400" />
                <span className="text-sm text-white/35">
                  {fp.uploading.replace("· ", "")}
                </span>
              </>
            ) : (
              <>
                {/* Upload icon */}
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition ${
                    isDragging
                      ? "border-[#05DF72]/30 bg-[#05DF72]/10 text-[#05DF72]"
                      : "border-white/[0.08] bg-white/[0.04] text-white/30"
                  }`}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                      strokeLinecap="round"
                    />
                    <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-white/55">
                    {isDragging ? (
                      <span className="text-[#05DF72]">{fp.releaseToUpload}</span>
                    ) : (
                      fp.dropHere
                    )}
                  </p>
                  <p className="mt-1 text-xs text-white/20">
                    {fp.formats} · {fp.clickToBrowse}
                  </p>
                </div>
              </>
            )}
          </label>
        )}

        <input
          id={inputId}
          name="file"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
          className="sr-only"
        />
      </div>

      {/* Status line */}
      <div className="mt-2 flex items-center gap-2 text-xs">
        {isUploading ? (
          <span className="flex items-center gap-1.5 text-[#05DF72]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#05DF72]" />
            {fp.uploadingStatus}
          </span>
        ) : visibleSelectedFileName ? (
          <span className="flex items-center gap-1.5 truncate text-[#05DF72]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="6" cy="6" r="5.5" className="fill-lime-400/20 stroke-lime-400" strokeWidth="1"/>
              <path d="M3.5 6l2 2 3-3" stroke="#05DF72" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {visibleSelectedFileName}
          </span>
        ) : dragError ? (
          <span className="text-red-300">{dragError}</span>
        ) : (
          <span className="text-white/20">{fp.hint}</span>
        )}
      </div>
    </div>
  );
}

export const FilePicker = memo(FilePickerComponent);
