import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/lib/language-context";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/lib/theme-context";
import { AnalyticsProvider } from "@/components/analytics-provider";
import type { Language } from "@/lib/i18n";
import "./globals.css";

const SUPPORTED_LANGS: Language[] = ["en", "es", "fr", "pt", "de"];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MockForge — AI Product Mockups in Seconds",
  description:
    "Turn one product photo into studio-quality mockups instantly. No photoshoot needed. Fire your photographer.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("mf_lang")?.value;
  const initialLanguage: Language = SUPPORTED_LANGS.includes(raw as Language)
    ? (raw as Language)
    : "en";

  return (
    <html
      suppressHydrationWarning
      lang={initialLanguage}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full bg-[color:var(--background)] text-[color:var(--foreground)]">
        <ThemeProvider>
          <LanguageProvider initialLanguage={initialLanguage}>
            <Suspense fallback={null}>
              <AnalyticsProvider>{children}</AnalyticsProvider>
            </Suspense>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
