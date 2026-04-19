"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAnalytics, track } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    track("$pageview", { path: pathname, search: searchParams.toString() });
  }, [pathname, searchParams]);

  return <>{children}</>;
}
