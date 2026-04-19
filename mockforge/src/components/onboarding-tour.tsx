"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TOUR_KEY = "mockforge-tour-done";

const STEPS = [
  {
    title: "Upload your product photo",
    description: "Drop any JPG, PNG or WEBP. No white background needed — just a clear shot of your product.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="22" height="22" rx="5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 10v8M10 14l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Pick a style preset",
    description: "Choose from Clean Studio, Lifestyle Scene, Ad Creative, and more. Each preset is tuned for a different use case.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="15" y="3" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="15" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="15" y="15" width="10" height="10" rx="5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    title: "Get commercial-grade results",
    description: "Your AI-generated mockups are ready in under 2 minutes. Download, rate, or generate variations.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 4l2.5 7h7.5l-6 4.5 2.5 7-6.5-4.5-6.5 4.5 2.5-7-6-4.5H11.5L14 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(TOUR_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(TOUR_KEY, "1");
    setVisible(false);
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
      router.push("/upload");
    }
  }

  if (!visible) return null;

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-sm rounded-2xl border border-white/[0.1] bg-[#0a0a0a] p-8 shadow-2xl">
        {/* Close */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.06] hover:text-white/60"
          aria-label="Skip tour"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Step badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#05DF72]/25 bg-[#05DF72]/[0.07] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#05DF72]">
          Step {step + 1} of {STEPS.length}
        </div>

        {/* Icon */}
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white/60">
          {current.icon}
        </div>

        <h2 className="mb-2 text-xl font-black tracking-tight text-white">{current.title}</h2>
        <p className="mb-8 text-sm leading-relaxed text-white/45">{current.description}</p>

        {/* Progress dots */}
        <div className="mb-6 flex gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i <= step ? "bg-[#05DF72]" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          className="w-full rounded-xl bg-[#05DF72] py-3 text-sm font-bold text-black transition hover:bg-[#34e58a] active:scale-95"
        >
          {step < STEPS.length - 1 ? "Next →" : "Start generating →"}
        </button>
      </div>
    </div>
  );
}
