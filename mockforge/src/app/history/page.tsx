export const dynamic = "force-dynamic";

import { SiteHeader } from "@/components/site-header";
import { HistoryList } from "@/components/history-list";
import { getRecentGenerations } from "@/lib/db/generations";

const PAGE_SIZE = 24;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function HistoryPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const pageNum = Math.max(1, parseInt(page ?? "1", 10));
  const offset = (pageNum - 1) * PAGE_SIZE;

  const generations = await getRecentGenerations(PAGE_SIZE, offset);
  const hasMore = generations.length === PAGE_SIZE;

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <HistoryList
          generations={generations}
          page={pageNum}
          hasMore={hasMore}
        />
      </main>
    </div>
  );
}
