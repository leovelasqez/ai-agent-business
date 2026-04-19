import { getPresetById, type PresetId } from "@/lib/presets";

interface BuildPromptInput {
  preset: PresetId;
  category?: string;
  productName?: string;
  format?: string;
  customPrompt?: string;
  bgColor?: string;
  bgTexture?: string;
}

const presetInstructions: Partial<Record<PresetId, string>> = {
  clean_studio:
    "Replace ONLY the background with a premium ecommerce studio look: clean white or light neutral surface, soft directional lighting, subtle shadow beneath the product. The product bottle must remain completely untouched.",
  lifestyle_scene:
    "Replace ONLY the background with a realistic lifestyle scene that fits the product context. Keep the composition commercial, brand-safe, and believable. The product bottle must remain completely untouched.",
  ad_creative:
    "Replace ONLY the background with a bold advertising-style scene: vibrant solid or gradient color, dramatic lighting, high visual contrast. You may add a short advertising tagline in Spanish (2 to 4 words maximum, bold typography) placed in empty space away from the product. The product bottle must remain completely untouched.",
  flat_lay:
    "Recompose the scene as a top-down flat-lay shot. Place the product on a clean, textured surface (marble, linen, or natural wood). Surround it with complementary props appropriate to the product category (e.g. botanical elements for skincare, utensils for food). The product label must remain completely untouched.",
  minimal_white:
    "Replace ONLY the background with a pure white seamless backdrop. Add a single soft ground shadow beneath the product for depth. No props, no gradients, no textures — just clean white space. The product must remain completely untouched.",
  outdoor_natural:
    "Replace ONLY the background with an outdoor natural setting: sunlit park, beach, forest, or garden, depending on the product category. Use soft golden-hour or diffused natural light. Keep depth of field shallow so the product stays sharp. The product must remain completely untouched.",
  holiday_seasonal:
    "Replace ONLY the background with a festive holiday scene: warm bokeh lights, subtle seasonal decorations (pine branches, ornaments, ribbons), soft warm tones. The ambience should feel premium and gift-ready. The product must remain completely untouched.",
  custom: undefined,
};

function sanitizeTextInput(value: string, maxLength = 100): string {
  return value.replace(/[^a-zA-Z0-9 ,.'()\-áéíóúüñÁÉÍÓÚÜÑ]/g, "").slice(0, maxLength).trim();
}

export function buildPrompt({ preset, category, productName, format, customPrompt, bgColor, bgTexture }: BuildPromptInput) {
  if (preset === "custom") {
    return customPrompt ?? "";
  }

  const selectedPreset = getPresetById(preset);
  const safeProductName = productName ? sanitizeTextInput(productName) : null;
  const safeCategory = category ? sanitizeTextInput(category) : null;
  const safeBgColor = bgColor ? sanitizeTextInput(bgColor, 40) : null;
  const safeBgTexture = bgTexture ? sanitizeTextInput(bgTexture, 40) : null;

  const bgHint = [
    safeBgColor ? `Background color: ${safeBgColor}.` : null,
    safeBgTexture ? `Background texture: ${safeBgTexture}.` : null,
  ].filter(Boolean).join(" ");

  return [
    safeProductName ? `Product: ${safeProductName}.` : null,
    safeCategory ? `Category: ${safeCategory}.` : null,
    format ? `Output format: ${format}.` : null,
    selectedPreset ? `Style: ${selectedPreset.name}.` : null,
    bgHint || null,
    presetInstructions[preset],
    "CRITICAL RULES: (1) The product bottle is sacred — do not alter, distort, rewrite, translate, or hallucinate any text on its label. Every word on the packaging must appear exactly as in the source image. (2) Only modify the background and environment. (3) Any text added to the composition must be in Spanish only.",
  ]
    .filter(Boolean)
    .join(" ");
}
