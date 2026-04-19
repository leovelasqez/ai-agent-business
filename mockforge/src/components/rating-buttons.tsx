"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { track } from "@/lib/analytics";

function ThumbUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M1 8.25a1.25 1.25 0 1 1 2.5 0v7.5a1.25 1.25 0 0 1-2.5 0v-7.5ZM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0 1 14 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 0 1-2.096 7.36c-.333.670-1.008 1.093-1.748 1.093H9.89c-.482 0-.952-.154-1.342-.438l-1.256-.94a2.25 2.25 0 0 1-.892-1.790V8.75c0-.69.559-1.25 1.25-1.25H11Z" />
    </svg>
  );
}

function ThumbDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M18.905 12.75a1.25 1.25 0 0 1-2.5 0v-7.5a1.25 1.25 0 0 1 2.5 0v7.5ZM8.905 17v1.3c0 .268-.14.526-.395.607A2 2 0 0 1 5.905 17c0-.995.182-1.948.514-2.826.204-.54-.166-1.174-.744-1.174h-2.52c-1.243 0-2.261-1.01-2.146-2.247a23.864 23.864 0 0 1 2.096-7.36C3.44 2.723 4.114 2.3 4.854 2.3h4.276c.482 0 .952.154 1.342.438l1.256.94a2.25 2.25 0 0 1 .892 1.79v5.755c0 .69-.559 1.25-1.25 1.25h-1.465Z" />
    </svg>
  );
}

interface RatingButtonsProps {
  generationId: string;
  initialRating?: number | null;
}

export function RatingButtons({ generationId, initialRating }: RatingButtonsProps) {
  const { t } = useLanguage();
  const r = t.rating;
  const [rating, setRating] = useState<number | null>(initialRating ?? null);
  const [loading, setLoading] = useState(false);

  const rate = async (value: 1 | -1) => {
    if (loading || rating === value) return;
    setLoading(true);
    const prev = rating;
    setRating(value);

    try {
      await fetch("/api/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId, rating: value }),
      });
      track("mockup_rated", { generationId, rating: value });
    } catch {
      setRating(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => rate(1)}
        disabled={loading}
        title={r.likeTitle}
        aria-label={r.likeAriaLabel}
        aria-pressed={rating === 1}
        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
          rating === 1
            ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
            : "border-white/10 bg-black/20 text-neutral-400 hover:border-white/20 hover:text-white"
        }`}
      >
        <ThumbUp className="h-3.5 w-3.5" />
        <span>{r.like}</span>
      </button>
      <button
        type="button"
        onClick={() => rate(-1)}
        disabled={loading}
        title={r.dislikeTitle}
        aria-label={r.dislikeAriaLabel}
        aria-pressed={rating === -1}
        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
          rating === -1
            ? "border-red-500/50 bg-red-500/20 text-red-300"
            : "border-white/10 bg-black/20 text-neutral-400 hover:border-white/20 hover:text-white"
        }`}
      >
        <ThumbDown className="h-3.5 w-3.5" />
        <span>{r.dislike}</span>
      </button>
    </div>
  );
}
