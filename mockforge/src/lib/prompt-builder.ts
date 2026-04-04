import { getPresetById, type PresetId } from "@/lib/presets";

interface BuildPromptInput {
  preset: PresetId;
  category?: string;
  productName?: string;
  format?: string;
}

const presetInstructions: Record<PresetId, string> = {
  clean_studio:
    "Create a premium ecommerce studio mockup with clean composition, soft lighting, subtle shadow, and a polished commercial product photography look. Preserve the product shape, packaging, label, and main colors.",
  lifestyle_scene:
    "Create a realistic lifestyle scene where the product remains the primary subject. Keep the composition commercial, brand-safe, premium, and believable. Preserve the product shape, packaging, label, and main colors.",
  ad_creative:
    "Create a bold advertising-style creative with strong composition, premium visual contrast, and high click appeal while keeping the product recognizable and commercially usable. Preserve the product shape, packaging, label, and main colors.",
};

export function buildPrompt({ preset, category, productName, format }: BuildPromptInput) {
  const selectedPreset = getPresetById(preset);

  return [
    productName ? `Product name: ${productName}.` : null,
    category ? `Product category: ${category}.` : null,
    format ? `Output format: ${format}.` : null,
    selectedPreset ? `Preset: ${selectedPreset.name}.` : null,
    presetInstructions[preset],
    "Do not distort the packaging. Avoid surreal elements, warped geometry, extra products, broken labels, or unrealistic text.",
  ]
    .filter(Boolean)
    .join(" ");
}
