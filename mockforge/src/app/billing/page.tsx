import Link from "next/link";
import { BillingActions } from "@/components/billing-actions";

export default function BillingPage() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-16">
        <Link href="/upload" className="mb-8 text-sm font-semibold text-white/50 transition hover:text-white">
          ← Back to upload
        </Link>

        <div className="mb-8 inline-flex w-fit rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
          Credits
        </div>

        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Buy credits and keep generating.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
          Credits unlock HD exports, extra variants, upscale, and video generation. Checkout is handled securely by Stripe.
        </p>

        <div className="mt-10">
          <BillingActions />
        </div>
      </section>
    </main>
  );
}
