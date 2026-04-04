import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">
        MockForge
      </Link>
      <nav className="flex items-center gap-3">
        <Link href="/upload" className="text-sm text-neutral-400 transition hover:text-white">
          Upload
        </Link>
        <Link
          href="/upload"
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30"
        >
          Open MVP
        </Link>
      </nav>
    </header>
  );
}
