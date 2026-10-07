"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Briefcase } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface Nurse {
  id: number | string;
  user_id: number | string;
  name?: string;
  fullName?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  specialization?: string;
  categories?: string[];
  price?: number | string;
  location?: string;
  experience?: string | number;
  rating?: string | number;
  reviews?: string | number;
  image?: string | null;
}

interface NurseCardProps {
  nurse: Nurse;
  onRateClick?: () => void;
}

export default function NurseCard({ nurse, onRateClick }: NurseCardProps) {
  const { t } = useLanguage();

  /* =========================
      NAME
  ========================= */
  const nurseName =
    nurse.name ||
    nurse.fullName ||
    `${nurse.first_name || ""} ${nurse.last_name || ""}`.trim() ||
    t("nurseProfessional");

  /* =========================
      ROLE
  ========================= */
  const nurseRole =
    nurse.role || nurse.specialization || t("generalHealthcare");

  /* =========================
      IMAGE HANDLING
  ========================= */
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    nurseName
  )}&background=00535B&color=fff&size=300`;

  let nurseImage = fallbackAvatar;

  if (
    nurse.image &&
    typeof nurse.image === "string" &&
    nurse.image.trim() !== ""
  ) {
    const img = nurse.image.trim();

    if (img.startsWith("http")) {
      nurseImage = img;
    } else if (img.startsWith("/uploads/")) {
      nurseImage = `${process.env.NEXT_PUBLIC_API_URL}${img}`;
    } else {
      nurseImage = img.startsWith("/") ? img : `/${img}`;
    }
  }

  /* =========================
      PRICE
  ========================= */
  const nurseRate =
    nurse.price !== undefined && nurse.price !== null
      ? `$${nurse.price}`
      : "$25";

  return (
    <article
      className="
        group
        bg-white
        rounded-2xl
        border border-slate-200
        overflow-hidden
        flex flex-col
        h-full
        shadow-sm
        hover:shadow-lg
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      {/* =========================
          IMAGE
      ========================= */}
      <div
        className="
          relative
          w-full
          h-52
          sm:h-56
          bg-slate-100
          overflow-hidden
          flex
          items-center
          justify-center
        "
      >
        <Image
          src={nurseImage}
          alt={nurseName}
          fill
          // loading="lazy"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="
            object-cover
            object-center
            group-hover:scale-105
            transition-transform
            duration-300
          "
      
        />
      </div>

      {/* =========================
          CONTENT
      ========================= */}
      <div className="flex flex-col flex-1">
        <div className="p-4 sm:p-5 flex-1">
          {/* NAME + PRICE */}
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3
                className="
                  text-base
                  sm:text-lg
                  font-bold
                  text-slate-900
                  leading-tight
                  truncate
                "
                title={nurseName}
              >
                {nurseName}
              </h3>

              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {nurseRole}
              </p>
            </div>

            {/* PRICE */}
            <div className="shrink-0 text-right">
              <span
                className="
                  text-base
                  sm:text-lg
                  font-bold
                  text-[#00535B]
                "
              >
                {nurseRate}
              </span>

              <span className="text-[11px] sm:text-xs text-slate-400">
                /hr
              </span>
            </div>
          </div>

          {/* CATEGORIES */}
          {nurse.categories && nurse.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {nurse.categories.map((category, index) => (
                <span
                  key={`${category}-${index}`}
                  className="
                    inline-flex
                    items-center
                    px-2.5
                    py-1
                    rounded-full
                    bg-[#E6F4F1]
                    text-[#00535B]
                    text-[11px]
                    sm:text-xs
                    font-medium
                    leading-none
                  "
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* LOCATION */}
          <div className="flex items-start gap-2 mt-4 text-xs sm:text-sm text-slate-500">
            <MapPin
              size={16}
              className="shrink-0 mt-0.5 text-[#0d7c7b]"
            />

            <span className="line-clamp-2">
              {nurse.location || t("locationNotAvailable")}
            </span>
          </div>

          {/* EXPERIENCE */}
          <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-slate-500">
            <Briefcase
              size={16}
              className="shrink-0 text-[#0d7c7b]"
            />

            <span>
              {nurse.experience
                ? `${nurse.experience} ${t("yrsExperience")}`
                : t("experienceNotSpecified")}
            </span>
          </div>
        </div>

        {/* =========================
            BOTTOM BAR
        ========================= */}
        <div
          className="
            border-t
            border-slate-100
            px-4
            sm:px-5
            py-3.5
            flex
            items-center
            justify-between
            gap-3
          "
        >
          {/* RATING + RATE BUTTON */}
          <div className="flex items-center gap-1.5">
            <Star
              size={16}
              className="fill-amber-400 text-amber-400 shrink-0"
            />

            <span className="text-sm font-bold text-slate-800">
              {Number(nurse.rating || 0).toFixed(1)}
            </span>

            <span className="text-xs text-slate-400">
              ({nurse.reviews ?? 0})
            </span>

            <button
              type="button"
              onClick={onRateClick}
              className="ml-2 text-xs font-semibold text-[#00535B] hover:text-[#00737D] hover:underline"
            >
              {t("rate")}
            </button>
          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-2">
            <Link
              href={`/find-a-nurses/${nurse.user_id}`}
              className="
                px-3
                py-1.5
                rounded-lg
                border
                border-slate-200
                text-xs
                font-medium
                text-slate-700
                hover:bg-slate-50
                transition-colors
              "
            >
              {t("profile")}
            </Link>

            <Link
              href={`/book?nurseId=${nurse.id}`}
              className="
                px-3.5
                py-1.5
                rounded-lg
                bg-[#00535B]
                text-white
                text-xs
                font-medium
                hover:bg-[#00737D]
                transition-colors
              "
            >
              {t("book")}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}