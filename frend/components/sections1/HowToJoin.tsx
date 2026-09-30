"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const steps = [
  {
    step: 1,
    title: "createAccount",
    description: "createAccountDescription",
  },
  {
    step: 2,
    title: "buildProfile",
    description: "buildProfileDescription",
  },
  {
    step: 3,
    title: "passVerification",
    description: "passVerificationDescription",
  },
  {
    step: 4,
    title: "startConnecting",
    description: "startConnectingDescription",
  },
];

export default function HowToJoin() {
  const { t, dir } = useLanguage();

  return (
    <section
	id="howtoapply"
      dir={dir}
      className="bg-[#F8FCFD] py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#12343B] md:text-3xl">
            {t("howToJoin")}
          </h2>

          <p className="mt-2 text-xs text-gray-500 md:text-sm">
            {t("gettingStarted")}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <div
              key={item.step}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00535B] text-lg font-bold text-white shadow-md">
                {item.step}
              </div>

              <h3 className="mt-4 text-sm font-bold text-[#12343B]">
                {t(item.title)}
              </h3>

              <p className="mt-1 max-w-[200px] text-xs leading-relaxed text-gray-500">
                {t(item.description)}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial Card */}
        <div className="mt-16 overflow-hidden rounded-2xl bg-white shadow-xl shadow-teal-900/5">
          <div className="grid grid-cols-1 items-center lg:grid-cols-12">

            {/* Left Nurse Image */}
            <div className="relative h-64 min-h-[260px] w-full overflow-hidden rounded-2xl sm:h-72 lg:col-span-5 lg:h-full">
              <Image
                src="/images/emma.png"
                alt={t("nurseTestimonial")}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="object-cover"
              />
            </div>

            {/* Right Review Content */}
            <div className="p-6 sm:p-8 lg:col-span-7 lg:p-10">

              {/* Star Rating */}
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mt-4 text-sm font-medium italic leading-relaxed text-[#12343B] sm:text-base">
                &ldquo;{t("nurseTestimonialQuote")}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9FF0FB] text-xs font-bold text-[#00535B]">
                  M
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#12343B]">
                    Maria Santos, LPN
                  </h4>

                  <p className="text-[10px] text-gray-400">
                    {t("nurseExperienceLocation")}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
