import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
        <SiteHeader />

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
            Checkout success placeholder
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Your HD mockups are unlocked</h1>
          <p className="mt-4 max-w-xl text-base text-neutral-400">
            Esta pantalla será la continuación del flujo después de Stripe. Aquí podremos mostrar descargas, CTA para generar más y upsell a packs adicionales.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/results"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              View results
            </Link>
            <Link
              href="/upload"
              className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-medium text-white hover:border-white/30"
            >
              Generate more
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
