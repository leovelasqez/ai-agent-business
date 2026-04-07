"use client";

import { useState } from "react";

interface RatingButtonsProps {
  generationId: string;
  initialRating?: number | null;
}

export function RatingButtons({ generationId, initialRating }: RatingButtonsProps) {
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
    } catch {
      setRating(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => rate(1)}
        disabled={loading}
        title="Me gusta"
        className={`flex h-8 w-8 items-center justify-center rounded-xl border text-sm transition ${
          rating === 1
            ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
            : "border-white/10 bg-black/20 text-neutral-400 hover:border-white/20 hover:text-white"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        👍
      </button>
      <button
        type="button"
        onClick={() => rate(-1)}
        disabled={loading}
        title="No me gusta"
        className={`flex h-8 w-8 items-center justify-center rounded-xl border text-sm transition ${
          rating === -1
            ? "border-red-500/50 bg-red-500/20 text-red-300"
            : "border-white/10 bg-black/20 text-neutral-400 hover:border-white/20 hover:text-white"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        👎
      </button>
    </div>
  );
}
