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
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <SiteHeader />
        <GenerationDetail generation={generation} />
      </div>
    </main>
  );
}
