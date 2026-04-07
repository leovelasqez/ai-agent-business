import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-300 transition hover:text-white">
        MockForge
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/history" className="text-sm text-neutral-400 transition hover:text-white">
          Historial
        </Link>
        <Link
          href="/upload"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/5"
        >
          Generar
        </Link>
      </nav>
    </header>
  );
}
