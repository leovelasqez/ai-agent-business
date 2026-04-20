import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { SiteHeader } from "@/components/site-header";
import { GenerationDetail } from "@/components/generation-detail";
import { getGenerationByIdForViewer } from "@/lib/db/generations";
import { getTrustedSessionIdFromCookies } from "@/lib/session";
import { getServerUser } from "@/lib/supabase-server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GenerationDetailPage({ params }: Props) {
  const { id } = await params;
  const authedUser = await getServerUser();
  const cookieStore = await cookies();
  const viewerSessionId = authedUser?.id ?? getTrustedSessionIdFromCookies(cookieStore);
  const generation = await getGenerationByIdForViewer(id, viewerSessionId);

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
