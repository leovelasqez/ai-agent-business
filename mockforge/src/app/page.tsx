"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

/* ── Data ─────────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "12,847+", label: "Mockups generated" },
  { value: "< 2 min", label: "Average time" },
  { value: "4", label: "AI models" },
  { value: "4.9 ★", label: "User rating" },
];

const AVATARS = [
  { initials: "SM", color: "bg-rose-500/30 text-rose-300" },
  { initials: "CR", color: "bg-blue-500/30 text-blue-300" },
  { initials: "PK", color: "bg-violet-500/30 text-violet-300" },
  { initials: "JL", color: "bg-amber-500/30 text-amber-300" },
];

const HERO_CARDS = [
  {
    label: "Clean Studio",
    tag: "E-commerce",
    from: "from-stone-700",
    to: "to-stone-950",
    accent: "bg-stone-400/30",
    rotate: "-rotate-6",
    translate: "-translate-x-8 translate-y-6",
    zIndex: "z-0",
  },
  {
    label: "Lifestyle Scene",
    tag: "Social Media",
    from: "from-blue-700",
    to: "to-indigo-950",
    accent: "bg-blue-400/30",
    rotate: "-rotate-2",
    translate: "translate-x-0 translate-y-2",
    zIndex: "z-10",
  },
  {
    label: "Ad Creative",
    tag: "Advertising",
    from: "from-violet-700",
    to: "to-purple-950",
    accent: "bg-violet-400/30",
    rotate: "rotate-5",
    translate: "translate-x-10 -translate-y-6",
    zIndex: "z-20",
    highlighted: true,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Upload your product",
    description:
      "Drop any product photo — no white background required. Clean shots work best.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M10 14V4M6 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 16h14" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    step: "02",
    title: "Choose your scene",
    description:
      "Pick studio, lifestyle, or ad-creative preset. Select your AI model and output format.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="2" y="2" width="7" height="7" rx="1.5" strokeLinejoin="round"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" strokeLinejoin="round"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5" strokeLinejoin="round"/>
        <circle cx="14.5" cy="14.5" r="3.5"/>
        <path d="M14.5 13v1.5l1 1" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    step: "03",
    title: "Download your mockup",
    description:
      "Commercial-quality visuals in under 2 minutes. Ready for store, ads, or social posts.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M10 4v10M6 10l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 16h14" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const GALLERY_ITEMS = [
  {
    id: 1,
    label: "Clean Studio",
    sublabel: "E-commerce",
    from: "from-stone-600",
    to: "to-stone-950",
    dot: "bg-stone-300",
    gridPattern: true,
  },
  {
    id: 2,
    label: "Lifestyle Scene",
    sublabel: "Social Media",
    from: "from-blue-700",
    to: "to-indigo-950",
    dot: "bg-blue-300",
    gridPattern: true,
  },
  {
    id: 3,
    label: "Ad Creative",
    sublabel: "Advertising",
    from: "from-violet-700",
    to: "to-purple-950",
    dot: "bg-violet-300",
    gridPattern: true,
  },
  {
    id: 4,
    label: "Flat Lay",
    sublabel: "Print",
    from: "from-amber-600",
    to: "to-orange-950",
    dot: "bg-amber-300",
    gridPattern: true,
  },
  {
    id: 5,
    label: "Context Scene",
    sublabel: "Lifestyle",
    from: "from-emerald-700",
    to: "to-teal-950",
    dot: "bg-emerald-300",
    gridPattern: true,
  },
  {
    id: 6,
    label: "Minimal White",
    sublabel: "E-commerce",
    from: "from-neutral-500",
    to: "to-neutral-900",
    dot: "bg-neutral-300",
    gridPattern: true,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I was spending $500 per photoshoot. MockForge replaced that entirely for my product pages. ROI in the first week.",
    name: "Sarah M.",
    role: "DTC Brand Founder",
    initials: "SM",
    avatarColor: "bg-rose-500/20 text-rose-300",
    rating: 5,
  },
  {
    quote:
      "Generated 40 mockups for our new skincare line in one afternoon. The quality is genuinely impressive.",
    name: "Carlos R.",
    role: "E-commerce Manager",
    initials: "CR",
    avatarColor: "bg-blue-500/20 text-blue-300",
    rating: 5,
  },
  {
    quote:
      "Our conversion rate went up 18% after switching to AI-generated lifestyle mockups. Clients love them.",
    name: "Priya K.",
    role: "Growth Marketer",
    initials: "PK",
    avatarColor: "bg-violet-500/20 text-violet-300",
    rating: 5,
  },
];

const TEMPLATE_PACKS = [
  {
    id: "clean_studio",
    name: "Clean Studio",
    description: "White backgrounds, perfect lighting, e-commerce ready.",
    count: "12 styles",
    from: "from-stone-600/15",
    to: "to-stone-900/5",
    iconColor: "text-stone-300",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
    ),
  },
  {
    id: "lifestyle_scene",
    name: "Lifestyle Scenes",
    description: "Natural environments that show your product in real context.",
    count: "18 styles",
    from: "from-blue-600/15",
    to: "to-blue-900/5",
    iconColor: "text-blue-300",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 9l4-4 4 4 4-4 4 4"/>
        <path d="M3 15l4-4 4 4 4-4 4 4"/>
      </svg>
    ),
  },
  {
    id: "ad_creative",
    name: "Ad Creative",
    description: "Bold compositions built for Meta, TikTok, and Google ads.",
    count: "15 styles",
    from: "from-violet-600/15",
    to: "to-violet-900/5",
    iconColor: "text-violet-300",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    ),
  },
  {
    id: "social_media",
    name: "Social Media",
    description: "Stories, reels, and feed formats. Scroll-stopping visuals.",
    count: "20 styles",
    from: "from-rose-600/15",
    to: "to-rose-900/5",
    iconColor: "text-rose-300",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: "flat_lay",
    name: "Flat Lay",
    description: "Top-down compositions for food, beauty, and lifestyle.",
    count: "10 styles",
    from: "from-amber-600/15",
    to: "to-amber-900/5",
    iconColor: "text-amber-300",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="2" y="7" width="20" height="10" rx="2"/>
        <path d="M7 7V5a2 2 0 014 0v2M13 7V5a2 2 0 014 0v2"/>
      </svg>
    ),
  },
  {
    id: "seasonal",
    name: "Seasonal Campaigns",
    description: "Holiday and event-themed setups for timely promotions.",
    count: "8 styles",
    from: "from-emerald-600/15",
    to: "to-emerald-900/5",
    iconColor: "text-emerald-300",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
      </svg>
    ),
  },
];

const BRANDS = ["Shopify", "WooCommerce", "Etsy", "Amazon", "BigCommerce", "Squarespace", "Wix"];

/* ── Component ────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.06] px-5 pb-28 pt-20 md:pb-36 md:pt-28">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-pulse-glow absolute left-1/3 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/[0.07] blur-[130px]" />
          <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-violet-500/[0.04] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.85fr]">

            {/* Left: copy */}
            <div className="max-w-2xl">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/[0.06] px-4 py-1.5 text-xs font-semibold text-lime-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400" />
                AI-powered · No photoshoot needed
              </div>

              {/* Headline */}
              <h1 className="mt-6 text-[clamp(3rem,7vw,5.5rem)] font-black leading-[1.03] tracking-tight">
                Fire your product
                <br />
                <span className="text-lime-400">photographer.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/50">
                Turn one product photo into studio-quality mockups in seconds.
                No photoshoot. No designer. Just results.
              </p>

              {/* CTAs */}
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/upload"
                  className="group inline-flex items-center gap-2 rounded-full bg-lime-400 px-7 py-3.5 text-base font-bold text-black transition hover:bg-lime-300 active:scale-[0.98]"
                >
                  Generate your first mockup free
                  <span className="transition group-hover:translate-x-0.5" aria-hidden>→</span>
                </Link>
                <a
                  href="#how-it-works"
                  className="text-sm text-white/30 transition hover:text-white/60"
                >
                  See how it works ↓
                </a>
              </div>

              {/* Social proof mini */}
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {AVATARS.map((a) => (
                    <div
                      key={a.initials}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-black text-[10px] font-bold ${a.color}`}
                    >
                      {a.initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400 text-xs">★★★★★</div>
                  <div className="mt-0.5 text-xs text-white/35">
                    Loved by 12,000+ ecommerce teams
                  </div>
                </div>
              </div>
            </div>

            {/* Right: stacked mockup cards */}
            <div className="relative flex h-[400px] items-center justify-center lg:h-[480px]">
              {HERO_CARDS.map((card, i) => (
                <div
                  key={card.label}
                  className={`absolute w-[240px] rounded-3xl border bg-gradient-to-br ${card.from} ${card.to} shadow-2xl ${card.rotate} ${card.translate} ${card.zIndex} transition-transform duration-700 ${card.highlighted ? "border-lime-400/30 animate-float" : "border-white/[0.08] animate-float-delayed"}`}
                  style={{ animationDelay: `${i * 0.8}s` }}
                >
                  {/* Card inner */}
                  <div className="flex h-[240px] flex-col items-center justify-center gap-3 p-6">
                    {/* Product placeholder */}
                    <div className={`h-16 w-16 rounded-2xl ${card.accent} flex items-center justify-center`}>
                      <div className="h-8 w-8 rounded-xl bg-white/10" />
                    </div>
                    {/* Simulated mockup lines */}
                    <div className="w-full space-y-2 px-4">
                      <div className="h-1.5 w-full rounded-full bg-white/10" />
                      <div className="h-1.5 w-3/4 rounded-full bg-white/6" />
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="flex items-center justify-between border-t border-white/8 px-4 py-3">
                    <span className="text-xs font-medium text-white/70">{card.label}</span>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/30">
                      {card.tag}
                    </span>
                  </div>

                  {/* Generated badge on highlighted */}
                  {card.highlighted && (
                    <div className="absolute -bottom-3 -right-3 rounded-full border border-lime-400/30 bg-black px-3 py-1.5 text-[10px] font-bold text-lime-400">
                      ✓ Generated in 47s
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-20 grid grid-cols-2 gap-8 border-t border-white/[0.06] pt-12 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="mt-1.5 text-sm text-white/30">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand marquee ─────────────────────────────────────────────────── */}
      <div className="border-b border-white/[0.06] py-5 overflow-hidden">
        <div className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-white/15">
          Used by teams selling on
        </div>
        <div className="relative flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-16 pr-16">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span
                key={`${brand}-${i}`}
                className="shrink-0 text-sm font-semibold text-white/20 transition hover:text-white/40"
              >
                {brand}
              </span>
            ))}
          </div>
          <div className="animate-marquee flex shrink-0 items-center gap-16 pr-16" aria-hidden>
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span key={`${brand}-dup-${i}`} className="shrink-0 text-sm font-semibold text-white/20">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Gallery ───────────────────────────────────────────────────────── */}
      <section id="examples" className="border-b border-white/[0.06] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/20">
            Output quality
          </div>
          <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-lg text-4xl font-black tracking-tight md:text-5xl">
              Commercial-grade results.
              <br />
              <span className="text-white/35">Every single time.</span>
            </h2>
            <Link
              href="/upload"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/50 transition hover:border-white/20 hover:text-white"
            >
              Try it yourself →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition hover:border-white/[0.14]"
              >
                <div
                  className={`relative aspect-[4/3] bg-gradient-to-br ${item.from} ${item.to} flex items-center justify-center overflow-hidden`}
                >
                  {/* Grid overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  {/* Product placeholder */}
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="h-20 w-20 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm" />
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-28 rounded-full bg-white/15" />
                      <div className="h-1 w-20 rounded-full bg-white/8 mx-auto" />
                    </div>
                  </div>
                  {/* Style label bottom-left */}
                  <div className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">
                    {item.label}
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                    <Link
                      href="/upload"
                      className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-lime-400"
                    >
                      Try this style →
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                    <span className="text-sm font-medium text-white/60">{item.label}</span>
                  </div>
                  <span className="rounded-full border border-white/[0.07] px-2.5 py-0.5 text-[11px] text-white/25">
                    {item.sublabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-white/[0.06] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/20">
            How it works
          </div>
          <h2 className="mb-16 max-w-lg text-4xl font-black tracking-tight md:text-5xl">
            Three steps to a
            <br />
            professional mockup.
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={item.step}
                className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8 transition hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                {/* Step number bg */}
                <div className="pointer-events-none absolute -right-4 -top-4 text-[120px] font-black leading-none text-white/[0.03] select-none">
                  {item.step}
                </div>

                {/* Icon */}
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-lime-400/20 bg-lime-400/8 text-lime-400">
                  {item.icon}
                </div>

                <div className="relative">
                  <div className="mb-1 text-xs font-bold text-lime-400/70">
                    Step {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/40">
                    {item.description}
                  </p>
                </div>

                {/* Connector arrow (hidden on last) */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden h-px w-5 -translate-y-1/2 bg-gradient-to-r from-white/10 to-transparent md:block" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black transition hover:bg-neutral-100 active:scale-[0.98]"
            >
              Start generating now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Template packs ────────────────────────────────────────────────── */}
      <section id="templates" className="border-b border-white/[0.06] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/20">
            Presets &amp; templates
          </div>
          <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl text-4xl font-black tracking-tight md:text-5xl">
              Every format your
              <br />
              business needs.
            </h2>
            <Link
              href="/upload"
              className="inline-flex shrink-0 items-center gap-1 text-sm text-lime-400 transition hover:text-lime-300"
            >
              Browse all presets →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATE_PACKS.map((pack) => (
              <Link
                key={pack.id}
                href="/upload"
                className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition hover:border-lime-400/20 hover:bg-white/[0.04]"
              >
                {/* Preview area */}
                <div
                  className={`flex h-32 items-center justify-center bg-gradient-to-br ${pack.from} ${pack.to} transition`}
                >
                  <div className={`${pack.iconColor} opacity-60 transition group-hover:opacity-100`}>
                    {pack.icon}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3 p-5">
                  <div>
                    <h3 className="font-bold text-white transition group-hover:text-lime-400">
                      {pack.name}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-white/35">
                      {pack.description}
                    </p>
                  </div>
                  <span className="mt-0.5 shrink-0 rounded-full border border-white/[0.07] px-2 py-0.5 text-[11px] text-white/20">
                    {pack.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof / testimonials ────────────────────────────────────── */}
      <section className="border-b border-white/[0.06] bg-white/[0.012] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/20">
              What teams are saying
            </div>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              Loved by ecommerce teams.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-white/35">
              Join thousands of brands generating professional mockups without ever booking a studio.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7"
              >
                {/* Stars */}
                <div className="mb-5 flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M7 1l1.545 4.757H13.5l-4.045 2.94 1.545 4.757L7 10.514l-3.999 2.94 1.545-4.757L.5 5.757H5.455z" fill="#facc15"/>
                    </svg>
                  ))}
                </div>

                <p className="flex-1 text-sm leading-7 text-white/55">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${t.avatarColor}`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-white/30">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Counter row */}
          <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8 sm:grid-cols-4">
            {[
              { value: "$500+", label: "Avg. photoshoot cost saved" },
              { value: "18%", label: "Avg. conversion lift" },
              { value: "40x", label: "Faster than a studio shoot" },
              { value: "4.9/5", label: "Average satisfaction score" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-lime-400">{stat.value}</div>
                <div className="mt-1.5 text-xs text-white/30">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.06] px-5 py-36">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse-glow h-[600px] w-[600px] rounded-full bg-lime-400/[0.07] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-white/20">
            Ready to start?
          </div>
          <h2 className="text-5xl font-black tracking-tight md:text-6xl lg:text-7xl">
            Stop paying for
            <br />
            <span className="text-lime-400">photoshoots.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-md text-lg text-white/35">
            Join thousands of ecommerce brands generating professional mockups
            in seconds with AI.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-9 py-4 text-base font-bold text-black transition hover:bg-lime-300 active:scale-[0.98]"
            >
              Generate your first mockup free →
            </Link>
          </div>
          <p className="mt-5 text-xs text-white/20">
            No account required · No credit card needed · Results in 2 minutes
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-10 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr]">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime-400">
                  <div className="h-3 w-3 rounded bg-black/40" />
                </div>
                <span className="text-lg font-black tracking-tight">
                  Mock<span className="text-lime-400">Forge</span>
                </span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-7 text-white/25">
                AI-powered product mockup generator for ecommerce teams. Create
                professional visuals without the photoshoot.
              </p>
              <div className="mt-6 flex gap-4">
                <a
                  href="https://twitter.com"
                  className="text-xs text-white/20 transition hover:text-white/50"
                  target="_blank"
                  rel="noreferrer"
                >
                  Twitter
                </a>
                <a
                  href="https://instagram.com"
                  className="text-xs text-white/20 transition hover:text-white/50"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-xs text-white/20 transition hover:text-white/50"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">
                Product
              </div>
              <div className="space-y-3">
                {[
                  ["Features", "/upload"],
                  ["Templates", "/#templates"],
                  ["How it works", "/#how-it-works"],
                  ["History", "/history"],
                  ["Pricing", "/upload"],
                ].map(([label, href]) => (
                  <div key={label}>
                    <Link
                      href={href}
                      className="text-sm text-white/30 transition hover:text-white"
                    >
                      {label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">
                Company
              </div>
              <div className="space-y-3">
                {["About", "Blog", "Careers", "Press"].map((label) => (
                  <div key={label}>
                    <Link
                      href="/"
                      className="text-sm text-white/30 transition hover:text-white"
                    >
                      {label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">
                Legal
              </div>
              <div className="space-y-3">
                {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"].map(
                  (label) => (
                    <div key={label}>
                      <Link
                        href="/"
                        className="text-sm text-white/30 transition hover:text-white"
                      >
                        {label}
                      </Link>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-8">
            <div className="text-xs text-white/15">
              © {new Date().getFullYear()} MockForge. All rights reserved.
            </div>
            <div className="text-xs text-white/15">
              Powered by fal.ai · Built with Next.js
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
