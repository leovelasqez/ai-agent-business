import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { GenerationDetail } from "@/components/generation-detail";
import { getGenerationById } from "@/lib/db/generations";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GenerationDetailPage({ params }: Props) {
  const { id } = await params;
  const generation = await getGenerationById(id);

  if (!generation) notFound();

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <GenerationDetail generation={generation} />
      </main>
    </div>
  );
}
