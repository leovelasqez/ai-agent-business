export const dynamic = "force-dynamic";

import { SiteHeader } from "@/components/site-header";
import { HistoryList } from "@/components/history-list";
import { getRecentGenerations } from "@/lib/db/generations";

export default async function HistoryPage() {
  const generations = await getRecentGenerations(30);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <SiteHeader />
        <HistoryList generations={generations} />
      </div>
    </main>
  );
}
