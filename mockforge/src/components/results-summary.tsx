import { getPresetById } from "@/lib/presets";

interface ResultsSummaryProps {
  preset: string;
  category?: string;
  format?: string;
  productName?: string;
}

export function ResultsSummary({ preset, category, format, productName }: ResultsSummaryProps) {
  const presetData = getPresetById(preset);

  return (
    <section className="grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Preset</div>
        <div className="mt-2 text-sm font-medium text-white">{presetData?.name ?? preset}</div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Categoría</div>
        <div className="mt-2 text-sm font-medium text-white">{category || "Sin categoría"}</div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Formato</div>
        <div className="mt-2 text-sm font-medium text-white">{format || "1:1 square"}</div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Producto</div>
        <div className="mt-2 text-sm font-medium text-white">{productName || "Producto sin nombre"}</div>
      </div>
    </section>
  );
}
