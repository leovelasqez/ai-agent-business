export const dynamic = "force-dynamic";

import { SiteHeader } from "@/components/site-header";
import { HistoryList } from "@/components/history-list";
import { getRecentGenerations } from "@/lib/db/generations";

export default async function HistoryPage() {
  const generations = await getRecentGenerations(30);

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <HistoryList generations={generations} />
      </main>
    </div>
  );
}
