"use client";

import { useEffect, useState, Suspense } from "react";
import {
  User,
  Baby,
  Accessibility,
  Heart,
  Users,
  ArrowRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useBooking } from "./BookingContext";
import { getNurseById } from "@/data/nursesDirectory";
import { useLanguage } from "@/context/LanguageContext";

type CareOption = {
  id: string;
  labelKey: string;
  icon: React.ElementType;
  color: string;
};

const careOptions: CareOption[] = [
  {
    id: "myself",
    labelKey: "myself",
    icon: User,
    color: "#22C55E",
  },
  {
    id: "parent",
    labelKey: "parent",
    icon: Users,
    color: "#006D77",
  },
  {
    id: "child",
    labelKey: "child",
    icon: Baby,
    color: "#FACC15",
  },
  {
    id: "disability",
    labelKey: "personWithDisability",
    icon: Accessibility,
    color: "#0EA5E9",
  },
  {
    id: "spouse",
    labelKey: "spousePartner",
    icon: Heart,
    color: "#DC2626",
  },
  {
    id: "other",
    labelKey: "other",
    icon: Users,
    color: "#A21CAF",
  },
];

// 1. المكون الداخلي الذي يحتوي على منطق useSearchParams وواجهة الصفحة
function BookFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, update, isHydrated } = useBooking();
  const { t, dir } = useLanguage();

  const [selected, setSelected] = useState<string | null>(null);

  // Restore selected care option after hydration
  useEffect(() => {
    if (data.careForId) {
      setSelected(data.careForId);
    }
  }, [data.careForId]);

  // Handle nurse ID from URL or previously saved data
  useEffect(() => {
    if (!isHydrated) return;

    const nurseIdParam = searchParams.get("nurseId");

    if (nurseIdParam) {
      const numericId = Number(nurseIdParam);

      if (!isNaN(numericId)) {
        if (data.preferredNurseId !== numericId) {
          const nurse = getNurseById(numericId);
          update({
            preferredNurseId: numericId,
            preferredNurseName: nurse ? nurse.name : `Nurse #${numericId}`,
          });
        }
      }
    } else if (!data.preferredNurseId) {
      alert(t("selectNurseToContinue"));
      router.push("/find-a-nurses");
    }
  }, [
    searchParams,
    isHydrated,
    data.preferredNurseId,
    router,
    t,
  ]);

  // Continue to Type of Care page
  const handleContinue = () => {
    if (!selected) return;

    const option = careOptions.find(
      (opt) => opt.id === selected
    );

    update({
      careForId: selected,
      careForLabel: option
        ? t(option.labelKey)
        : null,
    });

    router.push("/book/type-of-care");
  };

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#F1F8FB]"
    >
      <main className="min-h-[650px] px-4 py-6 sm:px-6 sm:py-8">

        {/* ================= STEPS ================= */}
        <div className="mx-auto mb-7 flex w-full max-w-[500px] items-center justify-center">

          {/* Step 1 */}
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#006D77] text-xs font-semibold text-white">
              1
            </div>
            <div className="h-[3px] w-full bg-[#C7DADD]" />
          </div>

          {/* Step 2 */}
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C7DADD] text-xs font-semibold text-[#456268]">
              2
            </div>
            <div className="h-[3px] w-full bg-[#C7DADD]" />
          </div>

          {/* Step 3 */}
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C7DADD] text-xs font-semibold text-[#456268]">
              3
            </div>
            <div className="h-[3px] w-full bg-[#C7DADD]" />
          </div>

          {/* Step 4 */}
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C7DADD] text-xs font-semibold text-[#456268]">
              4
            </div>
            <div className="h-[3px] w-full bg-[#C7DADD]" />
          </div>

          {/* Step 5 */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C7DADD] text-xs font-semibold text-[#456268]">
            5
          </div>

        </div>

        {/* ================= MAIN CARD ================= */}
        <section className="mx-auto w-full max-w-[620px] rounded-xl bg-white px-4 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:px-8 sm:py-7">

          {/* Title */}
          <h1 className="text-[20px] font-bold text-[#092F35] sm:text-[22px]">
            {t("whoNeedsCare")}
          </h1>

          {/* Description */}
          <p className="mt-1 max-w-[520px] text-[11px] leading-5 text-gray-600 sm:text-[12px]">
            {t("selectPrimaryPerson")}
          </p>

          {/* ================= CARE OPTIONS ================= */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">

            {careOptions.map((option) => {
              const Icon = option.icon;

              const isSelected = selected === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelected(option.id)}
                  className={`flex min-h-[82px] w-full flex-col items-center justify-center rounded-lg border px-2 py-3 text-center transition-all sm:h-[84px] ${
                    isSelected
                      ? "border-[#006D77] bg-[#E8F7F8] shadow-sm"
                      : "border-[#62AAB2] bg-white hover:bg-[#F5FBFC]"
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={2.5}
                    style={{
                      color: option.color,
                    }}
                    className="shrink-0"
                  />

                  <span className="mt-1.5 text-[10px] font-semibold leading-4 text-[#17363B] sm:text-[10px]">
                    {t(option.labelKey)}
                  </span>
                </button>
              );
            })}

          </div>

          {/* ================= CONTINUE ================= */}
          <div
            className={`mt-7 flex sm:mt-9 ${
              dir === "rtl"
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <button
              type="button"
              disabled={!selected}
              onClick={handleContinue}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-lg px-8 text-[13px] font-semibold transition-all sm:h-12 sm:w-[150px] ${
                selected
                  ? "bg-[#006D77] text-white hover:bg-[#00535B]"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              {t("common.continue")}

              <ArrowRight
                size={17}
                strokeWidth={2.5}
                className={
                  dir === "rtl"
                    ? "rotate-180"
                    : ""
                }
              />
            </button>
          </div>

        </section>
      </main>
    </div>
  );
}

// 2. الصفحة المصدرة مع تغليف Suspense لحماية قراءة الرابط
export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F1F8FB]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#006D77] border-t-transparent" />
        </div>
      }
    >
      <BookFormContent />
    </Suspense>
  );
}