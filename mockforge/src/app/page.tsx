/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/lib/language-context";
import type { Language } from "@/lib/i18n";

const BRANDS = ["Shopify", "WooCommerce", "Etsy", "Amazon", "BigCommerce", "Squarespace", "Wix"];

const copy: Record<Language, any> = {
  en: {
    stats: [
      { value: "12,847+", label: "Mockups generated" },
      { value: "< 2 min", label: "Average time" },
      { value: "4", label: "AI models" },
      { value: "4.9 ★", label: "User rating" },
    ],
    avatars: ["SM", "CR", "PK", "JL"],
    heroCards: [
      { label: "Clean Studio", tag: "E-commerce", from: "from-stone-700", to: "to-stone-950", accent: "bg-stone-400/30", rotate: "-rotate-6", translate: "-translate-x-8 translate-y-6", zIndex: "z-0" },
      { label: "Lifestyle Scene", tag: "Social Media", from: "from-blue-700", to: "to-indigo-950", accent: "bg-blue-400/30", rotate: "-rotate-2", translate: "translate-x-0 translate-y-2", zIndex: "z-10" },
      { label: "Ad Creative", tag: "Advertising", from: "from-violet-700", to: "to-purple-950", accent: "bg-violet-400/30", rotate: "rotate-5", translate: "translate-x-10 -translate-y-6", zIndex: "z-20", highlighted: true },
    ],
    showcase: [
      { name: "Clean Studio", tag: "E-commerce", image: "/showcase/mockforge-example-1.jpg" },
      { name: "Lifestyle Scene", tag: "Lifestyle", image: "/showcase/mockforge-example-2.jpg" },
      { name: "Clean Studio", tag: "Catalog", image: "/showcase/mockforge-example-3.jpg" },
    ],
    liveBadge: "AI-powered · No photoshoot needed",
    heroTitle1: "Fire your product",
    heroTitle2: "photographer.",
    heroDesc: "Turn one product photo into studio-quality mockups in seconds. No photoshoot. No designer. Just results.",
    heroCta: "Generate your first mockup free",
    heroSecondary: "See how it works ↓",
    socialProof: "Loved by 12,000+ ecommerce teams",
    brandsTitle: "Used by teams selling on",
    galleryKicker: "Output quality",
    galleryTitle1: "Commercial-grade results.",
    galleryTitle2: "Every single time.",
    galleryCta: "Try it yourself →",
    tryStyle: "Try this style →",
    howKicker: "How it works",
    howTitle1: "Three steps to a",
    howTitle2: "professional mockup.",
    steps: [
      { step: "01", title: "Upload your product", description: "Drop any product photo. No white background required. Clean shots work best." },
      { step: "02", title: "Choose your scene", description: "Pick studio, lifestyle, or ad-creative preset. Select your AI model and output format." },
      { step: "03", title: "Download your mockup", description: "Commercial-quality visuals in under 2 minutes. Ready for store, ads, or social posts." },
    ],
    stepLabel: "Step",
    howCta: "Start generating now →",
    templatesKicker: "Presets & templates",
    templatesTitle1: "Every format your",
    templatesTitle2: "business needs.",
    templatesCta: "Browse all presets →",
    packs: [
      { id: "clean", name: "Clean Studio", description: "White backgrounds, perfect lighting, e-commerce ready.", count: "12 styles", from: "from-stone-600/15", to: "to-stone-900/5", iconColor: "text-stone-300" },
      { id: "life", name: "Lifestyle Scenes", description: "Natural environments that show your product in real context.", count: "18 styles", from: "from-blue-600/15", to: "to-blue-900/5", iconColor: "text-blue-300" },
      { id: "ad", name: "Ad Creative", description: "Bold compositions built for Meta, TikTok, and Google ads.", count: "15 styles", from: "from-violet-600/15", to: "to-violet-900/5", iconColor: "text-violet-300" },
      { id: "social", name: "Social Media", description: "Stories, reels, and feed formats. Scroll-stopping visuals.", count: "20 styles", from: "from-rose-600/15", to: "to-rose-900/5", iconColor: "text-rose-300" },
      { id: "flat", name: "Flat Lay", description: "Top-down compositions for food, beauty, and lifestyle.", count: "10 styles", from: "from-amber-600/15", to: "to-amber-900/5", iconColor: "text-amber-300" },
      { id: "seasonal", name: "Seasonal Campaigns", description: "Holiday and event-themed setups for timely promotions.", count: "8 styles", from: "from-emerald-600/15", to: "to-emerald-900/5", iconColor: "text-emerald-300" },
    ],
    testimonialsKicker: "What teams are saying",
    testimonialsTitle: "Loved by ecommerce teams.",
    testimonialsDesc: "Join thousands of brands generating professional mockups without ever booking a studio.",
    testimonials: [
      { quote: "I was spending $500 per photoshoot. MockForge replaced that entirely for my product pages. ROI in the first week.", name: "Sarah M.", role: "DTC Brand Founder", initials: "SM", avatarColor: "bg-rose-500/20 text-rose-300" },
      { quote: "Generated 40 mockups for our new skincare line in one afternoon. The quality is genuinely impressive.", name: "Carlos R.", role: "E-commerce Manager", initials: "CR", avatarColor: "bg-blue-500/20 text-blue-300" },
      { quote: "Our conversion rate went up 18% after switching to AI-generated lifestyle mockups. Clients love them.", name: "Priya K.", role: "Growth Marketer", initials: "PK", avatarColor: "bg-violet-500/20 text-violet-300" },
    ],
    counters: [
      { value: "$500+", label: "Avg. photoshoot cost saved" },
      { value: "18%", label: "Avg. conversion lift" },
      { value: "40x", label: "Faster than a studio shoot" },
      { value: "4.9/5", label: "Average satisfaction score" },
    ],
    finalKicker: "Ready to start?",
    finalTitle1: "Stop paying for",
    finalTitle2: "photoshoots.",
    finalDesc: "Join thousands of ecommerce brands generating professional mockups in seconds with AI.",
    finalCta: "Generate your first mockup free →",
    finalFoot: "No account required · No credit card needed · Results in 2 minutes",
    footerDesc: "AI-powered product mockup generator for ecommerce teams. Create professional visuals without the photoshoot.",
    footer: {
      product: "Product",
      company: "Company",
      legal: "Legal",
      productLinks: [["Features", "/upload"], ["Templates", "/#templates"], ["How it works", "/#how-it-works"], ["History", "/history"], ["Pricing", "/upload"]],
      companyLinks: ["About", "Blog", "Careers", "Press"],
      legalLinks: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
      rights: "All rights reserved.",
      built: "Powered by fal.ai · Built with Next.js",
    },
  },
  es: {
    stats: [
      { value: "12,847+", label: "Mockups generados" },
      { value: "< 2 min", label: "Tiempo promedio" },
      { value: "4", label: "Modelos de IA" },
      { value: "4.9 ★", label: "Calificación" },
    ],
    avatars: ["SM", "CR", "PK", "JL"],
    heroCards: [
      { label: "Estudio limpio", tag: "E-commerce", from: "from-stone-700", to: "to-stone-950", accent: "bg-stone-400/30", rotate: "-rotate-6", translate: "-translate-x-8 translate-y-6", zIndex: "z-0" },
      { label: "Escena lifestyle", tag: "Social Media", from: "from-blue-700", to: "to-indigo-950", accent: "bg-blue-400/30", rotate: "-rotate-2", translate: "translate-x-0 translate-y-2", zIndex: "z-10" },
      { label: "Creativo publicitario", tag: "Ads", from: "from-violet-700", to: "to-purple-950", accent: "bg-violet-400/30", rotate: "rotate-5", translate: "translate-x-10 -translate-y-6", zIndex: "z-20", highlighted: true },
    ],
    showcase: [
      { name: "Estudio limpio", tag: "E-commerce", image: "/showcase/mockforge-example-1.jpg" },
      { name: "Escena lifestyle", tag: "Lifestyle", image: "/showcase/mockforge-example-2.jpg" },
      { name: "Estudio limpio", tag: "Catálogo", image: "/showcase/mockforge-example-3.jpg" },
    ],
    liveBadge: "Con IA · Sin photoshoot",
    heroTitle1: "Despide a tu",
    heroTitle2: "fotógrafo de producto.",
    heroDesc: "Convierte una sola foto de producto en mockups de calidad estudio en segundos. Sin photoshoot. Sin diseñador. Solo resultados.",
    heroCta: "Genera tu primer mockup gratis",
    heroSecondary: "Mira cómo funciona ↓",
    socialProof: "Amado por más de 12,000 equipos ecommerce",
    brandsTitle: "Usado por equipos que venden en",
    galleryKicker: "Calidad de salida",
    galleryTitle1: "Resultados de nivel comercial.",
    galleryTitle2: "Siempre.",
    galleryCta: "Pruébalo tú mismo →",
    tryStyle: "Prueba este estilo →",
    howKicker: "Cómo funciona",
    howTitle1: "Tres pasos para un",
    howTitle2: "mockup profesional.",
    steps: [
      { step: "01", title: "Sube tu producto", description: "Suelta cualquier foto de producto. No necesitas fondo blanco. Las tomas limpias funcionan mejor." },
      { step: "02", title: "Elige tu escena", description: "Escoge un preset de estudio, lifestyle o creativo publicitario. Selecciona tu modelo de IA y formato." },
      { step: "03", title: "Descarga tu mockup", description: "Visuales de calidad comercial en menos de 2 minutos. Listos para tienda, ads o redes sociales." },
    ],
    stepLabel: "Paso",
    howCta: "Empieza a generar ahora →",
    templatesKicker: "Presets y plantillas",
    templatesTitle1: "Todos los formatos que tu",
    templatesTitle2: "negocio necesita.",
    templatesCta: "Ver todos los presets →",
    packs: [
      { id: "clean", name: "Estudio limpio", description: "Fondos blancos, luz perfecta, listos para ecommerce.", count: "12 estilos", from: "from-stone-600/15", to: "to-stone-900/5", iconColor: "text-stone-300" },
      { id: "life", name: "Escenas lifestyle", description: "Entornos naturales que muestran tu producto en contexto real.", count: "18 estilos", from: "from-blue-600/15", to: "to-blue-900/5", iconColor: "text-blue-300" },
      { id: "ad", name: "Creativo publicitario", description: "Composiciones pensadas para Meta, TikTok y Google Ads.", count: "15 estilos", from: "from-violet-600/15", to: "to-violet-900/5", iconColor: "text-violet-300" },
      { id: "social", name: "Social Media", description: "Stories, reels y formatos feed. Visuales que frenan el scroll.", count: "20 estilos", from: "from-rose-600/15", to: "to-rose-900/5", iconColor: "text-rose-300" },
      { id: "flat", name: "Flat Lay", description: "Composiciones cenitales para food, beauty y lifestyle.", count: "10 estilos", from: "from-amber-600/15", to: "to-amber-900/5", iconColor: "text-amber-300" },
      { id: "seasonal", name: "Campañas estacionales", description: "Sets temáticos para promociones de fechas clave.", count: "8 estilos", from: "from-emerald-600/15", to: "to-emerald-900/5", iconColor: "text-emerald-300" },
    ],
    testimonialsKicker: "Lo que dicen los equipos",
    testimonialsTitle: "Amado por equipos ecommerce.",
    testimonialsDesc: "Únete a miles de marcas que generan mockups profesionales sin volver a reservar un estudio.",
    testimonials: [
      { quote: "Gastaba $500 por sesión de fotos. MockForge reemplazó eso por completo en mis páginas de producto. ROI en la primera semana.", name: "Sarah M.", role: "Fundadora DTC", initials: "SM", avatarColor: "bg-rose-500/20 text-rose-300" },
      { quote: "Generamos 40 mockups para nuestra nueva línea de skincare en una tarde. La calidad está seriamente buena.", name: "Carlos R.", role: "E-commerce Manager", initials: "CR", avatarColor: "bg-blue-500/20 text-blue-300" },
      { quote: "La tasa de conversión subió 18% después de pasar a mockups lifestyle con IA. A los clientes les encantan.", name: "Priya K.", role: "Growth Marketer", initials: "PK", avatarColor: "bg-violet-500/20 text-violet-300" },
    ],
    counters: [
      { value: "$500+", label: "Ahorro promedio por photoshoot" },
      { value: "18%", label: "Mejora promedio en conversión" },
      { value: "40x", label: "Más rápido que un estudio" },
      { value: "4.9/5", label: "Satisfacción promedio" },
    ],
    finalKicker: "¿Listo para empezar?",
    finalTitle1: "Deja de pagar",
    finalTitle2: "photoshoots.",
    finalDesc: "Únete a miles de marcas ecommerce que generan mockups profesionales en segundos con IA.",
    finalCta: "Genera tu primer mockup gratis →",
    finalFoot: "Sin cuenta · Sin tarjeta de crédito · Resultados en 2 minutos",
    footerDesc: "Generador de mockups de producto con IA para equipos ecommerce. Crea visuales profesionales sin photoshoot.",
    footer: {
      product: "Producto",
      company: "Empresa",
      legal: "Legal",
      productLinks: [["Funciones", "/upload"], ["Templates", "/#templates"], ["Cómo funciona", "/#how-it-works"], ["Historial", "/history"], ["Precios", "/upload"]],
      companyLinks: ["Nosotros", "Blog", "Carreras", "Prensa"],
      legalLinks: ["Privacidad", "Términos del servicio", "Política de cookies", "GDPR"],
      rights: "Todos los derechos reservados.",
      built: "Powered by fal.ai · Hecho con Next.js",
    },
  },
};

function IconBox() {
  return <div className="h-8 w-8 rounded-xl bg-white/10" />;
}

export default function Home() {
  const { language } = useLanguage();
  const c = copy[language];

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/[0.06] px-5 pb-28 pt-20 md:pb-36 md:pt-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-pulse-glow absolute left-1/3 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#05DF72]/[0.07] blur-[130px]" />
          <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-violet-500/[0.04] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.85fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#05DF72]/20 bg-[#05DF72]/[0.06] px-4 py-1.5 text-xs font-semibold text-[#05DF72]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#05DF72]" />
                {c.liveBadge}
              </div>

              <h1 className="mt-6 text-[clamp(3rem,7vw,5.5rem)] font-black leading-[1.03] tracking-tight">
                {c.heroTitle1}
                <br />
                <span className="text-[#05DF72]">{c.heroTitle2}</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/50">{c.heroDesc}</p>

              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link href="/upload" className="group inline-flex items-center gap-2 rounded-full bg-[#05DF72] px-7 py-3.5 text-base font-bold text-black transition hover:bg-[#34e58a] active:scale-[0.98]">
                  {c.heroCta}
                  <span className="transition group-hover:translate-x-0.5" aria-hidden>→</span>
                </Link>
                <a href="#how-it-works" className="text-sm text-white/30 transition hover:text-white/60">{c.heroSecondary}</a>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {c.avatars.map((initials: string, i: number) => (
                    <div key={initials} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-black text-[10px] font-bold ${['bg-rose-500/30 text-rose-300','bg-blue-500/30 text-blue-300','bg-violet-500/30 text-violet-300','bg-amber-500/30 text-amber-300'][i]}`}>{initials}</div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400 text-xs">★★★★★</div>
                  <div className="mt-0.5 text-xs text-white/35">{c.socialProof}</div>
                </div>
              </div>
            </div>

            <div className="relative flex h-[400px] items-center justify-center lg:h-[480px]">
              {c.heroCards.map((card: any, i: number) => (
                <div key={card.label} className={`absolute w-[240px] rounded-3xl border bg-gradient-to-br ${card.from} ${card.to} shadow-2xl ${card.rotate} ${card.translate} ${card.zIndex} transition-transform duration-700 ${card.highlighted ? 'border-[#05DF72]/30 animate-float' : 'border-white/[0.08] animate-float-delayed'}`} style={{ animationDelay: `${i * 0.8}s` }}>
                  <div className="flex h-[240px] flex-col items-center justify-center gap-3 p-6">
                    <div className={`h-16 w-16 rounded-2xl ${card.accent} flex items-center justify-center`}><IconBox /></div>
                    <div className="w-full space-y-2 px-4">
                      <div className="h-1.5 w-full rounded-full bg-white/10" />
                      <div className="h-1.5 w-3/4 rounded-full bg-white/6" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/8 px-4 py-3">
                    <span className="text-xs font-medium text-white/70">{card.label}</span>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/30">{card.tag}</span>
                  </div>
                  {card.highlighted && <div className="absolute -bottom-3 -right-3 rounded-full border border-[#05DF72]/30 bg-black px-3 py-1.5 text-[10px] font-bold text-[#05DF72]">✓ Generated in 47s</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-8 border-t border-white/[0.06] pt-12 md:grid-cols-4">
            {c.stats.map((stat: any) => (
              <div key={stat.label}><div className="text-3xl font-black text-white">{stat.value}</div><div className="mt-1.5 text-sm text-white/30">{stat.label}</div></div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-b border-white/[0.06] py-5 overflow-hidden">
        <div className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-white/15">{c.brandsTitle}</div>
        <div className="relative flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-16 pr-16">{[...BRANDS, ...BRANDS].map((brand, i) => <span key={`${brand}-${i}`} className="shrink-0 text-sm font-semibold text-white/20 transition hover:text-white/40">{brand}</span>)}</div>
          <div className="animate-marquee flex shrink-0 items-center gap-16 pr-16" aria-hidden>{[...BRANDS, ...BRANDS].map((brand, i) => <span key={`${brand}-dup-${i}`} className="shrink-0 text-sm font-semibold text-white/20">{brand}</span>)}</div>
        </div>
      </div>

      <section id="examples" className="border-b border-white/[0.06] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/20">{c.galleryKicker}</div>
          <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-lg text-4xl font-black tracking-tight md:text-5xl">{c.galleryTitle1}<br /><span className="text-white/35">{c.galleryTitle2}</span></h2>
            <Link href="/upload" className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/50 transition hover:border-white/20 hover:text-white">{c.galleryCta}</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.showcase.map((item: any, idx: number) => (
              <div key={`${item.name}-${idx}`} className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition hover:border-white/[0.14]">
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">{item.name}</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100"><Link href="/upload" className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-[#05DF72]">{c.tryStyle}</Link></div>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5"><div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-white/40" /><span className="text-sm font-medium text-white/60">{item.name}</span></div><span className="rounded-full border border-white/[0.07] px-2.5 py-0.5 text-[11px] text-white/25">{item.tag}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-white/[0.06] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/20">{c.howKicker}</div>
          <h2 className="mb-16 max-w-lg text-4xl font-black tracking-tight md:text-5xl">{c.howTitle1}<br />{c.howTitle2}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {c.steps.map((item: any, i: number) => (
              <div key={item.step} className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8 transition hover:border-white/[0.12] hover:bg-white/[0.04]">
                <div className="pointer-events-none absolute -right-4 -top-4 select-none text-[120px] font-black leading-none text-white/[0.03]">{item.step}</div>
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-[#05DF72]/20 bg-[#05DF72]/8 text-[#05DF72]"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M10 14V4M6 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 16h14" strokeLinecap="round"/></svg></div>
                <div className="relative"><div className="mb-1 text-xs font-bold text-[#05DF72]/70">{c.stepLabel} {item.step}</div><h3 className="text-xl font-bold text-white">{item.title}</h3><p className="mt-3 text-sm leading-7 text-white/40">{item.description}</p></div>
                {i < c.steps.length - 1 && <div className="absolute right-0 top-1/2 hidden h-px w-5 -translate-y-1/2 bg-gradient-to-r from-white/10 to-transparent md:block" />}
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center"><Link href="/upload" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black transition hover:bg-neutral-100 active:scale-[0.98]">{c.howCta}</Link></div>
        </div>
      </section>

      <section id="templates" className="border-b border-white/[0.06] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/20">{c.templatesKicker}</div>
          <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl text-4xl font-black tracking-tight md:text-5xl">{c.templatesTitle1}<br />{c.templatesTitle2}</h2>
            <Link href="/upload" className="inline-flex shrink-0 items-center gap-1 text-sm text-[#05DF72] transition hover:text-[#34e58a]">{c.templatesCta}</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.packs.map((pack: any) => (
              <Link key={pack.id} href="/upload" className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition hover:border-[#05DF72]/20 hover:bg-white/[0.04]">
                <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${pack.from} ${pack.to} transition`}><div className={`${pack.iconColor} opacity-60 transition group-hover:opacity-100`}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/></svg></div></div>
                <div className="flex items-start justify-between gap-3 p-5"><div><h3 className="font-bold text-white transition group-hover:text-[#05DF72]">{pack.name}</h3><p className="mt-1.5 text-sm leading-6 text-white/35">{pack.description}</p></div><span className="mt-0.5 shrink-0 rounded-full border border-white/[0.07] px-2 py-0.5 text-[11px] text-white/20">{pack.count}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-white/[0.012] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center"><div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/20">{c.testimonialsKicker}</div><h2 className="text-4xl font-black tracking-tight md:text-5xl">{c.testimonialsTitle}</h2><p className="mx-auto mt-4 max-w-md text-base text-white/35">{c.testimonialsDesc}</p></div>
          <div className="grid gap-5 md:grid-cols-3">
            {c.testimonials.map((t: any) => (
              <div key={t.name} className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7"><div className="mb-5 flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <svg key={i} width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1l1.545 4.757H13.5l-4.045 2.94 1.545 4.757L7 10.514l-3.999 2.94 1.545-4.757L.5 5.757H5.455z" fill="#facc15"/></svg>)}</div><p className="flex-1 text-sm leading-7 text-white/55">&ldquo;{t.quote}&rdquo;</p><div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5"><div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${t.avatarColor}`}>{t.initials}</div><div><div className="text-sm font-semibold text-white">{t.name}</div><div className="text-xs text-white/30">{t.role}</div></div></div></div>
            ))}
          </div>
          <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8 sm:grid-cols-4">{c.counters.map((stat: any) => <div key={stat.label} className="text-center"><div className="text-2xl font-black text-[#05DF72]">{stat.value}</div><div className="mt-1.5 text-xs text-white/30">{stat.label}</div></div>)}</div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-white/[0.06] px-5 py-36">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center"><div className="animate-pulse-glow h-[600px] w-[600px] rounded-full bg-[#05DF72]/[0.07] blur-[120px]" /></div>
        <div className="relative mx-auto max-w-4xl text-center"><div className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-white/20">{c.finalKicker}</div><h2 className="text-5xl font-black tracking-tight md:text-6xl lg:text-7xl">{c.finalTitle1}<br /><span className="text-[#05DF72]">{c.finalTitle2}</span></h2><p className="mx-auto mt-7 max-w-md text-lg text-white/35">{c.finalDesc}</p><div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"><Link href="/upload" className="inline-flex items-center gap-2 rounded-full bg-[#05DF72] px-9 py-4 text-base font-bold text-black transition hover:bg-[#34e58a] active:scale-[0.98]">{c.finalCta}</Link></div><p className="mt-5 text-xs text-white/20">{c.finalFoot}</p></div>
      </section>

      <footer className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-10 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr]">
            <div><div className="flex items-center gap-2.5"><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#05DF72]"><div className="h-3 w-3 rounded bg-black/40" /></div><span className="text-lg font-black tracking-tight">Mock<span className="text-[#05DF72]">Forge</span></span></div><p className="mt-4 max-w-xs text-sm leading-7 text-white/25">{c.footerDesc}</p><div className="mt-6 flex gap-4"><a href="https://twitter.com" className="text-xs text-white/20 transition hover:text-white/50" target="_blank" rel="noreferrer">Twitter</a><a href="https://instagram.com" className="text-xs text-white/20 transition hover:text-white/50" target="_blank" rel="noreferrer">Instagram</a><a href="https://linkedin.com" className="text-xs text-white/20 transition hover:text-white/50" target="_blank" rel="noreferrer">LinkedIn</a></div></div>
            <div><div className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">{c.footer.product}</div><div className="space-y-3">{c.footer.productLinks.map(([label, href]: [string, string]) => <div key={label}><Link href={href} className="text-sm text-white/30 transition hover:text-white">{label}</Link></div>)}</div></div>
            <div><div className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">{c.footer.company}</div><div className="space-y-3">{c.footer.companyLinks.map((label: string) => <div key={label}><Link href="/" className="text-sm text-white/30 transition hover:text-white">{label}</Link></div>)}</div></div>
            <div><div className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">{c.footer.legal}</div><div className="space-y-3">{c.footer.legalLinks.map((label: string) => <div key={label}><Link href="/" className="text-sm text-white/30 transition hover:text-white">{label}</Link></div>)}</div></div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-8"><div className="text-xs text-white/15">© {new Date().getFullYear()} MockForge. {c.footer.rights}</div><div className="text-xs text-white/15">{c.footer.built}</div></div>
        </div>
      </footer>
    </div>
  );
}
