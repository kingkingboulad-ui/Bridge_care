"use client";

import {
  UserRoundPlus,
  CalendarDays,
  HeartPulse,
  MessageSquare,
  WalletCards,
  ShieldCheck,
  Award,
  LayoutGrid,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const benefits = [
  {
    icon: UserRoundPlus,
    title: "createYourProfile",
    description: "createYourProfileDescription",
  },
  {
    icon: CalendarDays,
    title: "setYourAvailability",
    description: "setYourAvailabilityDescription",
  },
  {
    icon: HeartPulse,
    title: "chooseYourCareTypes",
    description: "chooseYourCareTypesDescription",
  },
  {
    icon: MessageSquare,
    title: "receiveCareRequests",
    description: "receiveCareRequestsDescription",
  },
  {
    icon: ShieldCheck,
    title: "communicateSecurely",
    description: "communicateSecurelyDescription",
  },
  {
    icon: WalletCards,
    title: "trackYourEarnings",
    description: "trackYourEarningsDescription",
  },
  {
    icon: Award,
    title: "buildYourReputation",
    description: "buildYourReputationDescription",
  },
  {
    icon: LayoutGrid,
    title: "manageBookings",
    description: "manageBookingsDescription",
  },
];

export default function Benefits() {
  const { t, dir } = useLanguage();

  return (
    <section id="helpful"
      dir={dir}
      className="bg-[#F2F8FC] px-4 py-16 sm:px-6 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#00535B] sm:text-sm">
            {t("everythingYouNeed")}
          </p>

          <h2 className="text-2xl font-bold leading-tight text-[#12343B] sm:text-3xl md:text-4xl">
            {t("howNurseConnectSupportsYou")}
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            {t("nurseFeaturesDescription")}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="
                  min-h-[180px]
                  rounded-xl
                  border border-gray-100
                  bg-white
                  p-5
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                  sm:min-h-[190px]
                  md:p-6
                "
              >
                {/* Icon */}
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F4F1]">
                  <Icon
                    size={21}
                    strokeWidth={2}
                    className="text-[#00535B]"
                  />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-base font-bold leading-snug text-[#12343B] sm:text-lg">
                  {t(benefit.title)}
                </h3>

                {/* Description */}
                <p className="text-sm leading-6 text-gray-500">
                  {t(benefit.description)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

