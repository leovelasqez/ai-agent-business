import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal — MockForge",
  description: "Legal documents for MockForge.",
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <main className="mx-auto max-w-3xl px-6 py-16 leading-relaxed text-white/70">
        {children}
      </main>
    </div>
  );
}
