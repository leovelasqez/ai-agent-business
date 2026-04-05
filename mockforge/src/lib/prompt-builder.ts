import { getPresetById, type PresetId } from "@/lib/presets";

interface BuildPromptInput {
  preset: PresetId;
  category?: string;
  productName?: string;
  format?: string;
}

const presetInstructions: Record<PresetId, string> = {
  clean_studio:
    "Replace ONLY the background with a premium ecommerce studio look: clean white or light neutral surface, soft directional lighting, subtle shadow beneath the product. The product bottle must remain completely untouched.",
  lifestyle_scene:
    "Replace ONLY the background with a realistic lifestyle scene that fits the product context. Keep the composition commercial, brand-safe, and believable. The product bottle must remain completely untouched.",
  ad_creative:
    "Replace ONLY the background with a bold advertising-style scene: vibrant solid or gradient color, dramatic lighting, high visual contrast. You may add a short advertising tagline in Spanish (2 to 4 words maximum, bold typography) placed in empty space away from the product. The product bottle must remain completely untouched.",
};

function sanitizeTextInput(value: string, maxLength = 100): string {
  return value.replace(/[^a-zA-Z0-9 ,.'()\-áéíóúüñÁÉÍÓÚÜÑ]/g, "").slice(0, maxLength).trim();
}

export function buildPrompt({ preset, category, productName, format }: BuildPromptInput) {
  const selectedPreset = getPresetById(preset);
  const safeProductName = productName ? sanitizeTextInput(productName) : null;
  const safeCategory = category ? sanitizeTextInput(category) : null;

  return [
    safeProductName ? `Product: ${safeProductName}.` : null,
    safeCategory ? `Category: ${safeCategory}.` : null,
    format ? `Output format: ${format}.` : null,
    selectedPreset ? `Style: ${selectedPreset.name}.` : null,
    presetInstructions[preset],
    "CRITICAL RULES: (1) The product bottle is sacred — do not alter, distort, rewrite, translate, or hallucinate any text on its label. Every word on the packaging must appear exactly as in the source image. (2) Only modify the background and environment. (3) Any text added to the composition must be in Spanish only.",
  ]
    .filter(Boolean)
    .join(" ");
}
