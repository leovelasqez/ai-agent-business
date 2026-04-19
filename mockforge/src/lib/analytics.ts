"use client";

import posthog from "posthog-js";

let _initialized = false;

export function initAnalytics() {
  if (_initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
    persistence: "localStorage",
  });
  _initialized = true;
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(event, properties);
}

export function identifyUser(distinctId: string, traits?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.identify(distinctId, traits);
}
