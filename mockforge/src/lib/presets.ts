import type { Language } from "@/lib/i18n";

export const PRESETS = [
  {
    id: "clean_studio",
    name: "Clean Studio",
    description: "Clean background and premium ecommerce look.",
  },
  {
    id: "lifestyle_scene",
    name: "Lifestyle Scene",
    description: "Product placed in a realistic usage context.",
  },
  {
    id: "ad_creative",
    name: "Ad Creative",
    description: "Bolder composition for marketing and ads.",
  },
  {
    id: "flat_lay",
    name: "Flat Lay",
    description: "Top-down composition for beauty, food, and lifestyle.",
  },
  {
    id: "minimal_white",
    name: "Minimal White",
    description: "Pure white background with a soft shadow and no distractions.",
  },
  {
    id: "outdoor_natural",
    name: "Outdoor Natural",
    description: "Outdoor setting with natural light and organic textures.",
  },
  {
    id: "holiday_seasonal",
    name: "Holiday Seasonal",
    description: "Festive styling for seasonal campaigns.",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Write your own style in natural language.",
  },
] as const;

export type PresetId = (typeof PRESETS)[number]["id"];

type PresetDefinition = (typeof PRESETS)[number];
type LocalizedPreset = {
  id: PresetId;
  name: string;
  description: string;
};

const PRESET_TRANSLATIONS: Record<
  Language,
  Record<PresetId, { name: string; description: string }>
> = {
  en: {
    clean_studio: {
      name: "Clean Studio",
      description: "Clean background and premium ecommerce look.",
    },
    lifestyle_scene: {
      name: "Lifestyle Scene",
      description: "Product placed in a realistic usage context.",
    },
    ad_creative: {
      name: "Ad Creative",
      description: "Bolder composition for marketing and ads.",
    },
    flat_lay: {
      name: "Flat Lay",
      description: "Top-down composition for beauty, food, and lifestyle.",
    },
    minimal_white: {
      name: "Minimal White",
      description: "Pure white background with a soft shadow and no distractions.",
    },
    outdoor_natural: {
      name: "Outdoor Natural",
      description: "Outdoor setting with natural light and organic textures.",
    },
    holiday_seasonal: {
      name: "Holiday Seasonal",
      description: "Festive styling for seasonal campaigns.",
    },
    custom: {
      name: "Custom",
      description: "Write your own style in natural language.",
    },
  },
  es: {
    clean_studio: {
      name: "Estudio limpio",
      description: "Fondo limpio y look premium para ecommerce.",
    },
    lifestyle_scene: {
      name: "Escena lifestyle",
      description: "Producto en un contexto de uso realista.",
    },
    ad_creative: {
      name: "Creativo publicitario",
      description: "Composición más llamativa para marketing y ads.",
    },
    flat_lay: {
      name: "Flat Lay",
      description: "Vista cenital para beauty, food y lifestyle.",
    },
    minimal_white: {
      name: "Minimal White",
      description: "Fondo blanco puro con sombra suave y sin distracciones.",
    },
    outdoor_natural: {
      name: "Outdoor Natural",
      description: "Entorno exterior con luz natural y texturas orgánicas.",
    },
    holiday_seasonal: {
      name: "Holiday Seasonal",
      description: "Ambientación festiva para campañas de temporada.",
    },
    custom: {
      name: "Personalizado",
      description: "Escribe tu propio estilo con lenguaje natural.",
    },
  },
  fr: {
    clean_studio: {
      name: "Studio propre",
      description: "Fond propre et look premium pour l'e-commerce.",
    },
    lifestyle_scene: {
      name: "Scène lifestyle",
      description: "Produit placé dans un contexte d'usage réaliste.",
    },
    ad_creative: {
      name: "Créatif publicitaire",
      description: "Composition plus marquante pour le marketing et les ads.",
    },
    flat_lay: {
      name: "Flat Lay",
      description: "Vue du dessus pour beauty, food et lifestyle.",
    },
    minimal_white: {
      name: "Minimal White",
      description: "Fond blanc pur avec ombre douce et sans distractions.",
    },
    outdoor_natural: {
      name: "Outdoor Natural",
      description: "Décor extérieur avec lumière naturelle et textures organiques.",
    },
    holiday_seasonal: {
      name: "Holiday Seasonal",
      description: "Ambiance festive pour les campagnes saisonnières.",
    },
    custom: {
      name: "Personnalisé",
      description: "Décrivez votre style avec un langage naturel.",
    },
  },
  pt: {
    clean_studio: {
      name: "Estúdio limpo",
      description: "Fundo limpo e visual premium para e-commerce.",
    },
    lifestyle_scene: {
      name: "Cena lifestyle",
      description: "Produto em um contexto de uso realista.",
    },
    ad_creative: {
      name: "Criativo publicitário",
      description: "Composição mais chamativa para marketing e ads.",
    },
    flat_lay: {
      name: "Flat Lay",
      description: "Vista superior para beauty, food e lifestyle.",
    },
    minimal_white: {
      name: "Minimal White",
      description: "Fundo branco puro com sombra suave e sem distrações.",
    },
    outdoor_natural: {
      name: "Outdoor Natural",
      description: "Ambiente externo com luz natural e texturas orgânicas.",
    },
    holiday_seasonal: {
      name: "Holiday Seasonal",
      description: "Ambientação festiva para campanhas sazonais.",
    },
    custom: {
      name: "Personalizado",
      description: "Escreva seu próprio estilo com linguagem natural.",
    },
  },
  de: {
    clean_studio: {
      name: "Clean Studio",
      description: "Sauberer Hintergrund und Premium-Look für E-Commerce.",
    },
    lifestyle_scene: {
      name: "Lifestyle-Szene",
      description: "Produkt in einem realistischen Nutzungskontext.",
    },
    ad_creative: {
      name: "Ad Creative",
      description: "Auffälligere Komposition für Marketing und Ads.",
    },
    flat_lay: {
      name: "Flat Lay",
      description: "Top-down-Ansicht für Beauty, Food und Lifestyle.",
    },
    minimal_white: {
      name: "Minimal White",
      description: "Reiner weißer Hintergrund mit sanftem Schatten ohne Ablenkungen.",
    },
    outdoor_natural: {
      name: "Outdoor Natural",
      description: "Außenumgebung mit natürlichem Licht und organischen Texturen.",
    },
    holiday_seasonal: {
      name: "Holiday Seasonal",
      description: "Festive Gestaltung für saisonale Kampagnen.",
    },
    custom: {
      name: "Benutzerdefiniert",
      description: "Beschreiben Sie Ihren eigenen Stil in natürlicher Sprache.",
    },
  },
};

export function getPresetById(id: string): PresetDefinition | undefined {
  return PRESETS.find((preset) => preset.id === id);
}

export function getLocalizedPresetById(
  id: string,
  language: Language,
): LocalizedPreset | undefined {
  const preset = getPresetById(id);
  if (!preset) return undefined;

  const localized = PRESET_TRANSLATIONS[language]?.[preset.id] ?? PRESET_TRANSLATIONS.en[preset.id];
  return {
    ...preset,
    name: localized.name,
    description: localized.description,
  };
}

export function getLocalizedPresets(language: Language) {
  return PRESETS.map((preset) => getLocalizedPresetById(preset.id, language) ?? preset);
}
