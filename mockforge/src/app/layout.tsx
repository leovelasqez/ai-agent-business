import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { LanguageProvider } from "@/lib/language-context";
import { AnalyticsProvider } from "@/components/analytics-provider";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">
        <LanguageProvider>
          <Suspense fallback={null}>
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </Suspense>
        </LanguageProvider>
      </body>
    </html>
  );
}
