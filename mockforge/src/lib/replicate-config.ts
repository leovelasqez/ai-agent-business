import type { PresetId } from "@/lib/presets";

export interface ReplicateModelConfig {
  model: `${string}/${string}` | `${string}/${string}:${string}`;
  defaults: Record<string, string | number | boolean>;
}

const DEFAULT_MODEL =
  (process.env.REPLICATE_MODEL as `${string}/${string}` | `${string}/${string}:${string}` | undefined) ||
  "black-forest-labs/flux-kontext-dev";

export const replicatePresetConfig: Record<PresetId, ReplicateModelConfig> = {
  clean_studio: {
    model: DEFAULT_MODEL,
    defaults: {
      output_format: "jpg",
      aspect_ratio: "1:1",
      safety_tolerance: 2,
    },
  },
  lifestyle_scene: {
    model: DEFAULT_MODEL,
    defaults: {
      output_format: "jpg",
      aspect_ratio: "4:5",
      safety_tolerance: 2,
    },
  },
  ad_creative: {
    model: DEFAULT_MODEL,
    defaults: {
      output_format: "jpg",
      aspect_ratio: "4:5",
      safety_tolerance: 2,
    },
  },
  custom: {
    model: DEFAULT_MODEL,
    defaults: {
      output_format: "jpg",
      aspect_ratio: "1:1",
      safety_tolerance: 2,
    },
  },
};

export function mapFormatToAspectRatio(format?: string) {
  if (!format) return "1:1";

  const normalized = format.toLowerCase();

  if (normalized.includes("4:5")) return "4:5";
  return "1:1";
}
