export const PRESETS = [
  {
    id: "clean_studio",
    name: "Clean Studio",
    description: "Fondo limpio y look premium para ecommerce.",
  },
  {
    id: "lifestyle_scene",
    name: "Lifestyle Scene",
    description: "Producto en un contexto de uso realista.",
  },
  {
    id: "ad_creative",
    name: "Ad Creative",
    description: "Composición más llamativa para marketing y ads.",
  },
  {
    id: "flat_lay",
    name: "Flat Lay",
    description: "Vista cenital para beauty, food y lifestyle.",
  },
  {
    id: "minimal_white",
    name: "Minimal White",
    description: "Fondo blanco puro con sombra suave y sin distracciones.",
  },
  {
    id: "outdoor_natural",
    name: "Outdoor Natural",
    description: "Entorno exterior con luz natural y texturas orgánicas.",
  },
  {
    id: "holiday_seasonal",
    name: "Holiday Seasonal",
    description: "Ambientación festiva para campañas de temporada.",
  },
  {
    id: "custom",
    name: "Personalizado",
    description: "Escribe tu propio estilo con lenguaje natural.",
  },
] as const;

export type PresetId = (typeof PRESETS)[number]["id"];

export function getPresetById(id: string) {
  return PRESETS.find((preset) => preset.id === id);
}
