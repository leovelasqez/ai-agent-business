import Link from "next/link";
import { PRESETS } from "@/lib/presets";

const PRESET_ACCENTS: Record<string, string> = {
  clean_studio: "from-neutral-700 to-neutral-900",
  lifestyle_scene: "from-blue-900 to-neutral-900",
  ad_creative: "from-violet-900 to-neutral-900",
};

const useCases = [
  {
    title: "Product pages",
    description: "Create cleaner product visuals for your PDP without a full photoshoot.",
  },
  {
    title: "Paid ads",
    description: "Generate multiple visual angles to test in Meta, TikTok, or creative experiments.",
  },
  {
    title: "Organic content",
    description: "Turn one product shot into lifestyle and creative assets for social posting.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12 lg:py-20">
        <header className="flex items-center justify-between">
          <div className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-300">MockForge</div>
          <nav className="flex items-center gap-4">
            <Link href="/history" className="text-sm text-neutral-400 transition hover:text-white">
              Historial
            </Link>
            <Link
              href="/upload"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/5"
            >
              Generar
            </Link>
          </nav>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
              Ecommerce mockup generator
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Turn one product photo into mockups you can actually use.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
              Create studio shots, lifestyle scenes, and ad-style creatives without hiring a photographer or designer.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/upload"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                Generate your first mockup free
              </Link>
              <a
                href="#how-it-works"
                className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-medium text-white hover:border-white/30"
              >
                See how it works
              </a>
            </div>

          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30">
            <div className="flex flex-col gap-3">
              {PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20"
                >
                  <div
                    className={`h-10 w-10 flex-shrink-0 rounded-xl bg-gradient-to-br ${PRESET_ACCENTS[preset.id] ?? "from-neutral-700 to-neutral-900"}`}
                  />
                  <div>
                    <div className="text-sm font-medium text-white">{preset.name}</div>
                    <div className="mt-0.5 text-xs text-neutral-500">{preset.description}</div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/10 px-4 py-3">
                <span className="text-xs text-neutral-500">3 presets · 4 variantes de modelo</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  En producción
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-white/5 bg-black/20">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-14 md:grid-cols-3">
          {[
            ["1", "Upload your product", "Start with a simple product image. Clean photos work best for the MVP."],
            ["2", "Choose a preset", "Pick studio, lifestyle, or ad creative depending on the asset you need."],
            ["3", "Unlock HD", "Review previews first, then pay to unlock high-resolution exports."],
          ].map(([step, title, description]) => (
            <div key={step} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-medium text-emerald-300">Step {step}</div>
              <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-neutral-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14">
        <div className="max-w-2xl">
          <div className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">Use cases</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Built for small ecommerce teams that need more creative volume.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {useCases.map((useCase) => (
            <div key={useCase.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-medium">{useCase.title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-400">{useCase.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-6 pb-16">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-white/10 bg-white/5 px-8 py-10 text-center">
          <div className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">Ready to start?</div>
          <h2 className="text-3xl font-semibold tracking-tight">Turn your product photo into a commercial mockup in seconds.</h2>
          <Link
            href="/upload"
            className="rounded-2xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
          >
            Generate your first mockup free
          </Link>
        </div>
      </section>
    </main>
  );
}
