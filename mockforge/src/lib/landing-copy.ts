import type { Language } from "@/lib/i18n";

export interface LandingCard {
  label: string;
  tag: string;
  from: string;
  to: string;
  accent: string;
  rotate: string;
  translate: string;
  zIndex: string;
  highlighted?: boolean;
}

export interface LandingShowcaseItem {
  name: string;
  tag: string;
  image: string;
}

export interface LandingStep {
  step: string;
  title: string;
  description: string;
}

export interface LandingPack {
  id: string;
  name: string;
  description: string;
  count: string;
  from: string;
  to: string;
  iconColor: string;
}

export interface LandingTestimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
}

export interface LandingStat {
  value: string;
  label: string;
}

export interface LandingFooter {
  product: string;
  company: string;
  legal: string;
  productLinks: [string, string][];
  companyLinks: string[];
  legalLinks: string[];
  rights: string;
  built: string;
}

export interface LandingContent {
  stats: LandingStat[];
  avatars: string[];
  heroCards: LandingCard[];
  showcase: LandingShowcaseItem[];
  liveBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDesc: string;
  heroCta: string;
  heroSecondary: string;
  socialProof: string;
  brandsTitle: string;
  galleryKicker: string;
  galleryTitle1: string;
  galleryTitle2: string;
  galleryCta: string;
  tryStyle: string;
  howKicker: string;
  howTitle1: string;
  howTitle2: string;
  steps: LandingStep[];
  stepLabel: string;
  howCta: string;
  templatesKicker: string;
  templatesTitle1: string;
  templatesTitle2: string;
  templatesCta: string;
  packs: LandingPack[];
  testimonialsKicker: string;
  testimonialsTitle: string;
  testimonialsDesc: string;
  testimonials: LandingTestimonial[];
  counters: LandingStat[];
  finalKicker: string;
  finalTitle1: string;
  finalTitle2: string;
  finalDesc: string;
  finalCta: string;
  finalFoot: string;
  footerDesc: string;
  footer: LandingFooter;
}

const sharedAvatars = ["SM", "CR", "PK", "JL"];

const sharedHeroCards: LandingCard[] = [
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

const sharedPacks = {
  en: [
    { id: "clean", name: "Clean Studio", description: "White backgrounds, perfect lighting, e-commerce ready.", count: "12 styles", from: "from-stone-600/15", to: "to-stone-900/5", iconColor: "text-stone-300" },
    { id: "life", name: "Lifestyle Scenes", description: "Natural environments that show your product in real context.", count: "18 styles", from: "from-blue-600/15", to: "to-blue-900/5", iconColor: "text-blue-300" },
    { id: "ad", name: "Ad Creative", description: "Bold compositions built for Meta, TikTok, and Google ads.", count: "15 styles", from: "from-violet-600/15", to: "to-violet-900/5", iconColor: "text-violet-300" },
    { id: "social", name: "Social Media", description: "Stories, reels, and feed formats. Scroll-stopping visuals.", count: "20 styles", from: "from-rose-600/15", to: "to-rose-900/5", iconColor: "text-rose-300" },
    { id: "flat", name: "Flat Lay", description: "Top-down compositions for food, beauty, and lifestyle.", count: "10 styles", from: "from-amber-600/15", to: "to-amber-900/5", iconColor: "text-amber-300" },
    { id: "seasonal", name: "Seasonal Campaigns", description: "Holiday and event-themed setups for timely promotions.", count: "8 styles", from: "from-emerald-600/15", to: "to-emerald-900/5", iconColor: "text-emerald-300" },
  ],
  es: [
    { id: "clean", name: "Estudio limpio", description: "Fondos blancos, luz perfecta, listos para ecommerce.", count: "12 estilos", from: "from-stone-600/15", to: "to-stone-900/5", iconColor: "text-stone-300" },
    { id: "life", name: "Escenas lifestyle", description: "Entornos naturales que muestran tu producto en contexto real.", count: "18 estilos", from: "from-blue-600/15", to: "to-blue-900/5", iconColor: "text-blue-300" },
    { id: "ad", name: "Creativo publicitario", description: "Composiciones pensadas para Meta, TikTok y Google Ads.", count: "15 estilos", from: "from-violet-600/15", to: "to-violet-900/5", iconColor: "text-violet-300" },
    { id: "social", name: "Social Media", description: "Stories, reels y formatos feed. Visuales que frenan el scroll.", count: "20 estilos", from: "from-rose-600/15", to: "to-rose-900/5", iconColor: "text-rose-300" },
    { id: "flat", name: "Flat Lay", description: "Composiciones cenitales para food, beauty y lifestyle.", count: "10 estilos", from: "from-amber-600/15", to: "to-amber-900/5", iconColor: "text-amber-300" },
    { id: "seasonal", name: "Campañas estacionales", description: "Sets temáticos para promociones de fechas clave.", count: "8 estilos", from: "from-emerald-600/15", to: "to-emerald-900/5", iconColor: "text-emerald-300" },
  ],
  fr: [
    { id: "clean", name: "Studio propre", description: "Fonds blancs, lumière parfaite, prêts pour l'e-commerce.", count: "12 styles", from: "from-stone-600/15", to: "to-stone-900/5", iconColor: "text-stone-300" },
    { id: "life", name: "Scènes lifestyle", description: "Des environnements naturels qui montrent votre produit en contexte.", count: "18 styles", from: "from-blue-600/15", to: "to-blue-900/5", iconColor: "text-blue-300" },
    { id: "ad", name: "Créatif publicitaire", description: "Des compositions fortes pour Meta, TikTok et Google Ads.", count: "15 styles", from: "from-violet-600/15", to: "to-violet-900/5", iconColor: "text-violet-300" },
    { id: "social", name: "Social Media", description: "Stories, reels et formats feed. Des visuels qui arrêtent le scroll.", count: "20 styles", from: "from-rose-600/15", to: "to-rose-900/5", iconColor: "text-rose-300" },
    { id: "flat", name: "Flat Lay", description: "Compositions vues du dessus pour food, beauty et lifestyle.", count: "10 styles", from: "from-amber-600/15", to: "to-amber-900/5", iconColor: "text-amber-300" },
    { id: "seasonal", name: "Campagnes saisonnières", description: "Sets thématiques pour promotions et temps forts.", count: "8 styles", from: "from-emerald-600/15", to: "to-emerald-900/5", iconColor: "text-emerald-300" },
  ],
  pt: [
    { id: "clean", name: "Estúdio limpo", description: "Fundos brancos, luz perfeita, pronto para e-commerce.", count: "12 estilos", from: "from-stone-600/15", to: "to-stone-900/5", iconColor: "text-stone-300" },
    { id: "life", name: "Cenas lifestyle", description: "Ambientes naturais que mostram seu produto em contexto real.", count: "18 estilos", from: "from-blue-600/15", to: "to-blue-900/5", iconColor: "text-blue-300" },
    { id: "ad", name: "Criativo publicitário", description: "Composições fortes para Meta, TikTok e Google Ads.", count: "15 estilos", from: "from-violet-600/15", to: "to-violet-900/5", iconColor: "text-violet-300" },
    { id: "social", name: "Social Media", description: "Stories, reels e formatos de feed. Visuais que param o scroll.", count: "20 estilos", from: "from-rose-600/15", to: "to-rose-900/5", iconColor: "text-rose-300" },
    { id: "flat", name: "Flat Lay", description: "Composições de cima para baixo para food, beauty e lifestyle.", count: "10 estilos", from: "from-amber-600/15", to: "to-amber-900/5", iconColor: "text-amber-300" },
    { id: "seasonal", name: "Campanhas sazonais", description: "Cenários temáticos para promoções de datas importantes.", count: "8 estilos", from: "from-emerald-600/15", to: "to-emerald-900/5", iconColor: "text-emerald-300" },
  ],
  de: [
    { id: "clean", name: "Clean Studio", description: "Weiße Hintergründe, perfektes Licht, bereit für E-Commerce.", count: "12 Stile", from: "from-stone-600/15", to: "to-stone-900/5", iconColor: "text-stone-300" },
    { id: "life", name: "Lifestyle-Szenen", description: "Natürliche Umgebungen, die Ihr Produkt im echten Kontext zeigen.", count: "18 Stile", from: "from-blue-600/15", to: "to-blue-900/5", iconColor: "text-blue-300" },
    { id: "ad", name: "Ad Creative", description: "Starke Kompositionen für Meta, TikTok und Google Ads.", count: "15 Stile", from: "from-violet-600/15", to: "to-violet-900/5", iconColor: "text-violet-300" },
    { id: "social", name: "Social Media", description: "Stories, Reels und Feed-Formate. Visuals, die den Scroll stoppen.", count: "20 Stile", from: "from-rose-600/15", to: "to-rose-900/5", iconColor: "text-rose-300" },
    { id: "flat", name: "Flat Lay", description: "Top-down-Kompositionen für Food, Beauty und Lifestyle.", count: "10 Stile", from: "from-amber-600/15", to: "to-amber-900/5", iconColor: "text-amber-300" },
    { id: "seasonal", name: "Saisonale Kampagnen", description: "Thematische Sets für Aktionen rund um wichtige Termine.", count: "8 Stile", from: "from-emerald-600/15", to: "to-emerald-900/5", iconColor: "text-emerald-300" },
  ],
} satisfies Record<Language, LandingPack[]>;

export const landingCopy: Record<Language, LandingContent> = {
  en: {
    stats: [
      { value: "12,847+", label: "Mockups generated" },
      { value: "< 2 min", label: "Average time" },
      { value: "4", label: "AI models" },
      { value: "4.9 *", label: "User rating" },
    ],
    avatars: sharedAvatars,
    heroCards: sharedHeroCards,
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
    heroSecondary: "See how it works",
    socialProof: "Loved by 12,000+ ecommerce teams",
    brandsTitle: "Used by teams selling on",
    galleryKicker: "Output quality",
    galleryTitle1: "Commercial-grade results.",
    galleryTitle2: "Every single time.",
    galleryCta: "Try it yourself",
    tryStyle: "Try this style",
    howKicker: "How it works",
    howTitle1: "Three steps to a",
    howTitle2: "professional mockup.",
    steps: [
      { step: "01", title: "Upload your product", description: "Drop any product photo. No white background required. Clean shots work best." },
      { step: "02", title: "Choose your scene", description: "Pick studio, lifestyle, or ad-creative preset. Select your AI model and output format." },
      { step: "03", title: "Download your mockup", description: "Commercial-quality visuals in under 2 minutes. Ready for store, ads, or social posts." },
    ],
    stepLabel: "Step",
    howCta: "Start generating now",
    templatesKicker: "Presets and templates",
    templatesTitle1: "Every format your",
    templatesTitle2: "business needs.",
    templatesCta: "Browse all presets",
    packs: sharedPacks.en,
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
    finalCta: "Generate your first mockup free",
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
      { value: "4.9 *", label: "Calificación" },
    ],
    avatars: sharedAvatars,
    heroCards: [
      { ...sharedHeroCards[0], label: "Estudio limpio" },
      { ...sharedHeroCards[1], label: "Escena lifestyle" },
      { ...sharedHeroCards[2], label: "Creativo publicitario", tag: "Ads" },
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
    heroSecondary: "Mira cómo funciona",
    socialProof: "Amado por más de 12,000 equipos ecommerce",
    brandsTitle: "Usado por equipos que venden en",
    galleryKicker: "Calidad de salida",
    galleryTitle1: "Resultados de nivel comercial.",
    galleryTitle2: "Siempre.",
    galleryCta: "Pruébalo tú mismo",
    tryStyle: "Prueba este estilo",
    howKicker: "Cómo funciona",
    howTitle1: "Tres pasos para un",
    howTitle2: "mockup profesional.",
    steps: [
      { step: "01", title: "Sube tu producto", description: "Suelta cualquier foto de producto. No necesitas fondo blanco. Las tomas limpias funcionan mejor." },
      { step: "02", title: "Elige tu escena", description: "Escoge un preset de estudio, lifestyle o creativo publicitario. Selecciona tu modelo de IA y formato." },
      { step: "03", title: "Descarga tu mockup", description: "Visuales de calidad comercial en menos de 2 minutos. Listos para tienda, ads o redes sociales." },
    ],
    stepLabel: "Paso",
    howCta: "Empieza a generar ahora",
    templatesKicker: "Presets y plantillas",
    templatesTitle1: "Todos los formatos que tu",
    templatesTitle2: "negocio necesita.",
    templatesCta: "Ver todos los presets",
    packs: sharedPacks.es,
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
    finalCta: "Genera tu primer mockup gratis",
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
  fr: {
    stats: [
      { value: "12,847+", label: "Mockups générés" },
      { value: "< 2 min", label: "Temps moyen" },
      { value: "4", label: "Modèles IA" },
      { value: "4.9 *", label: "Note utilisateur" },
    ],
    avatars: sharedAvatars,
    heroCards: [
      { ...sharedHeroCards[0], label: "Studio propre" },
      { ...sharedHeroCards[1], label: "Scène lifestyle" },
      { ...sharedHeroCards[2], label: "Créatif publicitaire" },
    ],
    showcase: [
      { name: "Studio propre", tag: "E-commerce", image: "/showcase/mockforge-example-1.jpg" },
      { name: "Scène lifestyle", tag: "Lifestyle", image: "/showcase/mockforge-example-2.jpg" },
      { name: "Studio propre", tag: "Catalogue", image: "/showcase/mockforge-example-3.jpg" },
    ],
    liveBadge: "IA · Sans shooting photo",
    heroTitle1: "Licenciez votre",
    heroTitle2: "photographe produit.",
    heroDesc: "Transformez une seule photo produit en mockups de qualité studio en quelques secondes. Sans shooting. Sans designer. Juste des résultats.",
    heroCta: "Générez votre premier mockup gratuitement",
    heroSecondary: "Voir comment ça marche",
    socialProof: "Adopté par plus de 12 000 équipes e-commerce",
    brandsTitle: "Utilisé par des équipes qui vendent sur",
    galleryKicker: "Qualité de sortie",
    galleryTitle1: "Des résultats de niveau commercial.",
    galleryTitle2: "À chaque fois.",
    galleryCta: "Essayez par vous-même",
    tryStyle: "Essayer ce style",
    howKicker: "Comment ça marche",
    howTitle1: "Trois étapes vers un",
    howTitle2: "mockup professionnel.",
    steps: [
      { step: "01", title: "Importez votre produit", description: "Déposez n'importe quelle photo produit. Le fond blanc n'est pas obligatoire. Les images propres donnent les meilleurs résultats." },
      { step: "02", title: "Choisissez votre scène", description: "Sélectionnez un preset studio, lifestyle ou publicitaire. Choisissez aussi votre modèle IA et votre format de sortie." },
      { step: "03", title: "Téléchargez votre mockup", description: "Des visuels de qualité commerciale en moins de 2 minutes. Prêts pour la boutique, les ads ou les réseaux sociaux." },
    ],
    stepLabel: "Étape",
    howCta: "Commencer maintenant",
    templatesKicker: "Presets et templates",
    templatesTitle1: "Tous les formats dont votre",
    templatesTitle2: "business a besoin.",
    templatesCta: "Voir tous les presets",
    packs: sharedPacks.fr,
    testimonialsKicker: "Ce que disent les équipes",
    testimonialsTitle: "Adopté par les équipes e-commerce.",
    testimonialsDesc: "Rejoignez des milliers de marques qui créent des mockups professionnels sans réserver un studio.",
    testimonials: [
      { quote: "Je dépensais 500 $ par shooting. MockForge a remplacé tout ça sur mes pages produit. ROI dès la première semaine.", name: "Sarah M.", role: "Fondatrice DTC", initials: "SM", avatarColor: "bg-rose-500/20 text-rose-300" },
      { quote: "Nous avons généré 40 mockups pour notre nouvelle gamme skincare en une après-midi. La qualité est vraiment impressionnante.", name: "Carlos R.", role: "Responsable e-commerce", initials: "CR", avatarColor: "bg-blue-500/20 text-blue-300" },
      { quote: "Notre taux de conversion a augmenté de 18 % après le passage aux mockups lifestyle avec IA. Les clients adorent.", name: "Priya K.", role: "Growth Marketer", initials: "PK", avatarColor: "bg-violet-500/20 text-violet-300" },
    ],
    counters: [
      { value: "$500+", label: "Économie moyenne par shooting" },
      { value: "18%", label: "Hausse moyenne de conversion" },
      { value: "40x", label: "Plus rapide qu'un studio" },
      { value: "4.9/5", label: "Satisfaction moyenne" },
    ],
    finalKicker: "Prêt à commencer ?",
    finalTitle1: "Arrêtez de payer des",
    finalTitle2: "shootings photo.",
    finalDesc: "Rejoignez des milliers de marques e-commerce qui génèrent des mockups professionnels en quelques secondes grâce à l'IA.",
    finalCta: "Générez votre premier mockup gratuitement",
    finalFoot: "Sans compte · Sans carte bancaire · Résultats en 2 minutes",
    footerDesc: "Générateur de mockups produit propulsé par l'IA pour les équipes e-commerce. Créez des visuels professionnels sans shooting.",
    footer: {
      product: "Produit",
      company: "Entreprise",
      legal: "Légal",
      productLinks: [["Fonctionnalités", "/upload"], ["Templates", "/#templates"], ["Comment ça marche", "/#how-it-works"], ["Historique", "/history"], ["Tarifs", "/upload"]],
      companyLinks: ["À propos", "Blog", "Carrières", "Presse"],
      legalLinks: ["Confidentialité", "Conditions d'utilisation", "Cookies", "RGPD"],
      rights: "Tous droits réservés.",
      built: "Powered by fal.ai · Construit avec Next.js",
    },
  },
  pt: {
    stats: [
      { value: "12,847+", label: "Mockups gerados" },
      { value: "< 2 min", label: "Tempo médio" },
      { value: "4", label: "Modelos de IA" },
      { value: "4.9 *", label: "Avaliação" },
    ],
    avatars: sharedAvatars,
    heroCards: [
      { ...sharedHeroCards[0], label: "Estúdio limpo" },
      { ...sharedHeroCards[1], label: "Cena lifestyle" },
      { ...sharedHeroCards[2], label: "Criativo publicitário" },
    ],
    showcase: [
      { name: "Estúdio limpo", tag: "E-commerce", image: "/showcase/mockforge-example-1.jpg" },
      { name: "Cena lifestyle", tag: "Lifestyle", image: "/showcase/mockforge-example-2.jpg" },
      { name: "Estúdio limpo", tag: "Catálogo", image: "/showcase/mockforge-example-3.jpg" },
    ],
    liveBadge: "Com IA · Sem sessão de fotos",
    heroTitle1: "Demita seu",
    heroTitle2: "fotógrafo de produto.",
    heroDesc: "Transforme uma única foto de produto em mockups com qualidade de estúdio em segundos. Sem sessão. Sem designer. Só resultado.",
    heroCta: "Gere seu primeiro mockup grátis",
    heroSecondary: "Veja como funciona",
    socialProof: "Amado por mais de 12.000 equipes de e-commerce",
    brandsTitle: "Usado por equipes que vendem em",
    galleryKicker: "Qualidade de saída",
    galleryTitle1: "Resultados de nível comercial.",
    galleryTitle2: "Sempre.",
    galleryCta: "Teste agora",
    tryStyle: "Teste este estilo",
    howKicker: "Como funciona",
    howTitle1: "Três passos para um",
    howTitle2: "mockup profissional.",
    steps: [
      { step: "01", title: "Envie seu produto", description: "Solte qualquer foto do seu produto. Não precisa fundo branco. Fotos limpas funcionam melhor." },
      { step: "02", title: "Escolha sua cena", description: "Selecione um preset de estúdio, lifestyle ou criativo publicitário. Escolha também o modelo de IA e o formato." },
      { step: "03", title: "Baixe seu mockup", description: "Visuais com qualidade comercial em menos de 2 minutos. Prontos para loja, anúncios ou redes sociais." },
    ],
    stepLabel: "Passo",
    howCta: "Comece a gerar agora",
    templatesKicker: "Presets e templates",
    templatesTitle1: "Todos os formatos que o seu",
    templatesTitle2: "negócio precisa.",
    templatesCta: "Ver todos os presets",
    packs: sharedPacks.pt,
    testimonialsKicker: "O que as equipes dizem",
    testimonialsTitle: "Amado por equipes de e-commerce.",
    testimonialsDesc: "Junte-se a milhares de marcas que geram mockups profissionais sem reservar um estúdio.",
    testimonials: [
      { quote: "Eu gastava US$ 500 por sessão. O MockForge substituiu isso totalmente nas minhas páginas de produto. ROI na primeira semana.", name: "Sarah M.", role: "Fundadora DTC", initials: "SM", avatarColor: "bg-rose-500/20 text-rose-300" },
      { quote: "Geramos 40 mockups para nossa nova linha de skincare em uma tarde. A qualidade impressiona de verdade.", name: "Carlos R.", role: "Gerente de e-commerce", initials: "CR", avatarColor: "bg-blue-500/20 text-blue-300" },
      { quote: "Nossa taxa de conversão subiu 18% depois de adotar mockups lifestyle com IA. Os clientes adoram.", name: "Priya K.", role: "Growth Marketer", initials: "PK", avatarColor: "bg-violet-500/20 text-violet-300" },
    ],
    counters: [
      { value: "$500+", label: "Economia média por sessão" },
      { value: "18%", label: "Ganho médio de conversão" },
      { value: "40x", label: "Mais rápido que um estúdio" },
      { value: "4.9/5", label: "Satisfação média" },
    ],
    finalKicker: "Pronto para começar?",
    finalTitle1: "Pare de pagar por",
    finalTitle2: "sessões de fotos.",
    finalDesc: "Junte-se a milhares de marcas de e-commerce que geram mockups profissionais em segundos com IA.",
    finalCta: "Gere seu primeiro mockup grátis",
    finalFoot: "Sem conta · Sem cartão de crédito · Resultados em 2 minutos",
    footerDesc: "Gerador de mockups de produto com IA para equipes de e-commerce. Crie visuais profissionais sem sessão de fotos.",
    footer: {
      product: "Produto",
      company: "Empresa",
      legal: "Legal",
      productLinks: [["Recursos", "/upload"], ["Templates", "/#templates"], ["Como funciona", "/#how-it-works"], ["Histórico", "/history"], ["Preços", "/upload"]],
      companyLinks: ["Sobre", "Blog", "Carreiras", "Imprensa"],
      legalLinks: ["Privacidade", "Termos de serviço", "Política de cookies", "RGPD"],
      rights: "Todos os direitos reservados.",
      built: "Powered by fal.ai · Feito com Next.js",
    },
  },
  de: {
    stats: [
      { value: "12,847+", label: "Generierte Mockups" },
      { value: "< 2 min", label: "Durchschnittszeit" },
      { value: "4", label: "KI-Modelle" },
      { value: "4.9 *", label: "Bewertung" },
    ],
    avatars: sharedAvatars,
    heroCards: [
      { ...sharedHeroCards[0], label: "Clean Studio" },
      { ...sharedHeroCards[1], label: "Lifestyle-Szene" },
      { ...sharedHeroCards[2], label: "Ad Creative" },
    ],
    showcase: [
      { name: "Clean Studio", tag: "E-commerce", image: "/showcase/mockforge-example-1.jpg" },
      { name: "Lifestyle-Szene", tag: "Lifestyle", image: "/showcase/mockforge-example-2.jpg" },
      { name: "Clean Studio", tag: "Katalog", image: "/showcase/mockforge-example-3.jpg" },
    ],
    liveBadge: "Mit KI · Kein Fotoshooting nötig",
    heroTitle1: "Feuern Sie Ihren",
    heroTitle2: "Produktfotografen.",
    heroDesc: "Verwandeln Sie ein einziges Produktfoto in Mockups in Studioqualität. Ohne Shooting. Ohne Designer. Nur Ergebnisse.",
    heroCta: "Erstes Mockup kostenlos generieren",
    heroSecondary: "So funktioniert es",
    socialProof: "Beliebt bei mehr als 12.000 E-Commerce-Teams",
    brandsTitle: "Genutzt von Teams, die verkaufen auf",
    galleryKicker: "Output-Qualität",
    galleryTitle1: "Ergebnisse auf kommerziellem Niveau.",
    galleryTitle2: "Jedes Mal.",
    galleryCta: "Selbst ausprobieren",
    tryStyle: "Diesen Stil testen",
    howKicker: "So funktioniert's",
    howTitle1: "Drei Schritte zu einem",
    howTitle2: "professionellen Mockup.",
    steps: [
      { step: "01", title: "Produkt hochladen", description: "Laden Sie ein beliebiges Produktfoto hoch. Kein weißer Hintergrund nötig. Saubere Aufnahmen funktionieren am besten." },
      { step: "02", title: "Szene wählen", description: "Wählen Sie ein Studio-, Lifestyle- oder Werbe-Preset. Danach KI-Modell und Format festlegen." },
      { step: "03", title: "Mockup herunterladen", description: "Visuals in kommerzieller Qualität in unter 2 Minuten. Bereit für Shop, Ads oder Social Media." },
    ],
    stepLabel: "Schritt",
    howCta: "Jetzt starten",
    templatesKicker: "Presets und Templates",
    templatesTitle1: "Jedes Format, das Ihr",
    templatesTitle2: "Business braucht.",
    templatesCta: "Alle Presets ansehen",
    packs: sharedPacks.de,
    testimonialsKicker: "Was Teams sagen",
    testimonialsTitle: "Beliebt bei E-Commerce-Teams.",
    testimonialsDesc: "Schließen Sie sich tausenden Marken an, die professionelle Mockups erzeugen, ohne ein Studio zu buchen.",
    testimonials: [
      { quote: "Ich habe 500 $ pro Shooting ausgegeben. MockForge hat das für meine Produktseiten komplett ersetzt. ROI in der ersten Woche.", name: "Sarah M.", role: "DTC-Gründerin", initials: "SM", avatarColor: "bg-rose-500/20 text-rose-300" },
      { quote: "Wir haben 40 Mockups für unsere neue Skincare-Linie an einem Nachmittag erzeugt. Die Qualität ist wirklich stark.", name: "Carlos R.", role: "E-Commerce Manager", initials: "CR", avatarColor: "bg-blue-500/20 text-blue-300" },
      { quote: "Unsere Conversion-Rate stieg um 18 %, nachdem wir auf KI-Lifestyle-Mockups umgestellt haben. Die Kunden lieben sie.", name: "Priya K.", role: "Growth Marketer", initials: "PK", avatarColor: "bg-violet-500/20 text-violet-300" },
    ],
    counters: [
      { value: "$500+", label: "Durchschnittlich gesparte Shooting-Kosten" },
      { value: "18%", label: "Durchschnittlicher Conversion-Uplift" },
      { value: "40x", label: "Schneller als ein Studio-Shooting" },
      { value: "4.9/5", label: "Durchschnittliche Zufriedenheit" },
    ],
    finalKicker: "Bereit loszulegen?",
    finalTitle1: "Hören Sie auf, für",
    finalTitle2: "Fotoshootings zu zahlen.",
    finalDesc: "Schließen Sie sich tausenden E-Commerce-Marken an, die mit KI in Sekunden professionelle Mockups generieren.",
    finalCta: "Erstes Mockup kostenlos generieren",
    finalFoot: "Kein Account · Keine Kreditkarte · Ergebnisse in 2 Minuten",
    footerDesc: "KI-basierter Produkt-Mockup-Generator für E-Commerce-Teams. Erstellen Sie professionelle Visuals ohne Fotoshooting.",
    footer: {
      product: "Produkt",
      company: "Unternehmen",
      legal: "Rechtliches",
      productLinks: [["Features", "/upload"], ["Templates", "/#templates"], ["So funktioniert's", "/#how-it-works"], ["Verlauf", "/history"], ["Preise", "/upload"]],
      companyLinks: ["Über uns", "Blog", "Karriere", "Presse"],
      legalLinks: ["Datenschutz", "Nutzungsbedingungen", "Cookie-Richtlinie", "DSGVO"],
      rights: "Alle Rechte vorbehalten.",
      built: "Powered by fal.ai · Gebaut mit Next.js",
    },
  },
};
