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
] as const;

export type PresetId = (typeof PRESETS)[number]["id"];

export function getPresetById(id: string) {
  return PRESETS.find((preset) => preset.id === id);
}
