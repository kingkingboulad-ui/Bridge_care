"use client";

import { steps } from "@/data/content";
import { useLanguage } from "@/context/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();

  const stepTitleKeys = [
    "tellUsYourNeeds",
    "getMatchedInstantly",
    "bookAndRelax",
  ];

  const stepDescriptionKeys = [
    "tellUsYourNeedsDescription",
    "getMatchedDescription",
    "bookAndRelaxDescription",
  ];

  return (
    <section id="Howitworks" className="bg-[#f0f6fa] py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* SUBTITLE BADGE */}
        <p className="text-center text-xs font-semibold tracking-widest text-[#064e52] uppercase">
          {t("simpleProcess")}
        </p>

        {/* MAIN TITLE */}
        <h2 className="mt-3 text-center text-3xl font-semibold text-[#0a192f] sm:text-4xl">
          {t("howNurseConnectWorks")}
        </h2>

        {/* CARDS GRID */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title || i}
              className="flex flex-col items-center rounded-2xl border border-white/60 bg-[#f7fbfd]/80 p-8 text-center shadow-sm"
            >
              {/* NUMBER BADGE */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#064e52] text-lg font-medium text-white shadow-md">
                0{i + 1}
              </div>

              {/* TITLE */}
              <h3 className="mt-8 text-lg font-semibold text-[#0a192f]">
                {t(stepTitleKeys[i])}
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {t(stepDescriptionKeys[i])}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}