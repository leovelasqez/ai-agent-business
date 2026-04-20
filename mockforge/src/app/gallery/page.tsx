"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/lib/language-context";

interface GalleryItem {
  id: string;
  preset: string;
  category: string | null;
  preview_urls: string[];
  created_at: string;
}

export default function GalleryPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  async function fetchItems(cursor?: string) {
    const url = `/api/gallery?limit=24${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`;
    const res = await fetch(url);
    const json = await res.json() as { ok: boolean; data?: { items: GalleryItem[]; nextCursor: string | null } };
    if (json.ok && json.data) {
      return json.data;
    }
    return { items: [], nextCursor: null };
  }

  useEffect(() => {
    fetchItems().then(({ items: i, nextCursor: c }) => {
      setItems(i);
      setNextCursor(c);
      setLoading(false);
    });
  }, []);

  async function loadMore() {
    if (!nextCursor) return;
    setLoadingMore(true);
    const { items: more, nextCursor: c } = await fetchItems(nextCursor);
    setItems((prev) => [...prev, ...more]);
    setNextCursor(c);
    setLoadingMore(false);
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-5 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#05DF72]/20 bg-[#05DF72]/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#05DF72]">
            Community Gallery
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Made with MockForge
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/40">
            Mockups shared by the community. Generate yours and opt in to be featured.
          </p>
          <Link
            href="/upload"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#05DF72] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#34e58a]"
          >
            Generate your own →
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-white/[0.04]" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-white/30">No public mockups yet. Be the first to share yours!</p>
            <Link
              href="/upload"
              className="mt-6 inline-flex items-center justify-center rounded-xl border border-white/[0.1] px-5 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
            >
              Start generating
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {items.flatMap((item) =>
                item.preview_urls.map((url, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-white/[0.06] bg-black/20"
                  >
                    <Image
                      src={url}
                      alt={`${item.preset} mockup`}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100">
                      <div className="w-full px-3 pb-3">
                        <span className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white/70 backdrop-blur-sm">
                          {item.preset.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {nextCursor && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="rounded-xl border border-white/[0.1] px-8 py-3 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white disabled:opacity-40"
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
