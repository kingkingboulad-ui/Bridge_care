
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useBooking } from "../BookingContext";
import { useLanguage } from "@/context/LanguageContext";

const durationLabels: Record<string, string> = {
  "1-hour": "1 Hour",
  "2-hours": "2 Hours",
  "4-hours": "4 Hours",
  "8-hours": "8 Hours",
  "12-hours": "12 Hours",
  "24-hours": "24 Hours",
};

export default function ReviewPage() {
  const router = useRouter();
  const { data, reset, isHydrated } = useBooking();
  const { t, dir } = useLanguage();

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getDurationLabel = (duration: string) => {
    const durationTranslations: Record<string, string> = {
      "1-hour": t("review.oneHour"),
      "2-hours": t("review.twoHours"),
      "4-hours": t("review.fourHours"),
      "8-hours": t("review.eightHours"),
      "12-hours": t("review.twelveHours"),
      "24-hours": t("review.twentyFourHours"),
    };

    return durationTranslations[duration] ?? durationLabels[duration] ?? duration;
  };

  const summaryRows = [
    ...(data.preferredNurseName
      ? [
          {
            label: t("review.preferredNurse"),
            value: data.preferredNurseName,
          },
        ]
      : []),
    {
      label: t("review.careFor"),
      value: data.careForLabel,
    },
    {
      label: t("review.careType"),
      value: data.careTypeLabel,
    },
    {
      label: t("review.startDate"),
      value: data.startDate,
    },
    {
      label: t("review.duration"),
      value: getDurationLabel(data.careDuration),
    },
    {
      label: t("review.location"),
      value: data.careAddress,
    },
  ];

  const handleSubmit = async () => {
    if (!termsAgreed || submitting) return;

    if (!data.preferredNurseId) {
      setErrorMsg(t("review.nurseRequired"));

      setTimeout(() => {
        router.push("/find-a-nurses");
      }, 1500);

      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/care-requests`,
        data,
        { withCredentials: true }
      );

      if (response.data.success) {
        reset();
        router.push("/book/confirmation");
      }
    } catch (err: any) {
      console.error("Care request error:", err);

      setErrorMsg(
        err.response?.data?.message || t("review.submitError")
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#F1F8FB]"
        dir={dir}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#006D77] border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F1F8FB]"
      dir={dir}
    >
      <main className="min-h-[650px] px-4 py-6 sm:px-6 sm:py-8">

        {/* Steps */}
        <div className="mx-auto mb-6 flex w-full max-w-[400px] items-center justify-center">
          {[1, 2, 3, 4, 5].map((step, idx) => (
            <div
              key={step}
              className="flex min-w-0 flex-1 items-center last:flex-none"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#006D77] text-[10px] font-semibold text-white sm:h-8 sm:w-8 sm:text-xs">
                {step === 5 ? "5" : "✓"}
              </div>

              {idx < 4 && (
                <div className="h-[2px] w-full bg-[#006D77]" />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <section className="mx-auto w-full max-w-[620px] rounded-xl bg-white px-4 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:px-8 sm:py-7">

          {/* Title */}
          <h1 className="text-[20px] font-bold text-[#092F35] sm:text-[22px]">
            {t("review.title")}
          </h1>

          <p className="mt-1 max-w-[520px] text-[11px] leading-5 text-gray-600 sm:text-[12px]">
            {t("review.description")}
          </p>

          {/* Error */}
          {errorMsg && (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* Summary */}
          <dl className="mt-5 space-y-2 rounded-xl bg-[#F8FAFC] p-3 sm:space-y-2.5 sm:p-4">
            {summaryRows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-0.5 border-b border-gray-100 pb-2 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <dt className="shrink-0 text-[10px] text-gray-500 sm:text-sm">
                  {row.label}
                </dt>

                <dd
                  className={`break-words text-[11px] font-medium text-[#17363B] sm:max-w-[65%] sm:text-sm ${
                    dir === "rtl"
                      ? "text-right sm:text-left"
                      : "text-left sm:text-right"
                  }`}
                >
                  {row.value || "—"}
                </dd>
              </div>
            ))}
          </dl>

          {/* Notes */}
          {data.notes && (
            <div className="mt-3 rounded-xl bg-[#F8FAFC] p-3 sm:p-4">
              <p className="text-[10px] text-gray-500 sm:text-sm">
                {t("review.notes")}
              </p>

              <p className="mt-1 break-words text-[11px] leading-5 text-[#17363B] sm:text-sm">
                {data.notes}
              </p>
            </div>
          )}

          {/* Terms */}
          <label className="mt-4 flex w-full items-start gap-2 text-[10px] leading-5 text-gray-600 sm:text-xs">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-[#006D77] focus:ring-[#006D77]"
            />

            <span>
              {t("review.terms")}
            </span>
          </label>

          {/* Divider */}
          <div className="mt-6 border-t border-gray-100" />

          {/* Buttons */}
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">

            {/* Back */}
            <Link
              href="/book/describe-needs"
              className="flex h-10 w-full items-center justify-center gap-1 rounded-md border border-[#D5E0E2] bg-white px-4 text-[10px] font-medium text-[#31565C] transition hover:bg-gray-50 sm:h-auto sm:w-auto sm:py-2"
            >
              {dir === "rtl" ? "→" : "←"} {t("common.back")}
            </Link>

            {/* Submit */}
            <button
              type="button"
              disabled={!termsAgreed || submitting}
              onClick={handleSubmit}
              className={`flex h-10 w-full items-center justify-center gap-1 rounded-md px-5 text-[10px] font-medium transition sm:h-auto sm:w-auto sm:py-2 ${
                termsAgreed && !submitting
                  ? "bg-[#006D77] text-white hover:bg-[#00535B]"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              {submitting
                ? t("review.submitting")
                : t("review.submit")}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
