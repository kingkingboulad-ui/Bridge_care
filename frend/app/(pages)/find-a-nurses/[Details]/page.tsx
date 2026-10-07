"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import {
  MapPin,
  Briefcase,
  Star,
  HeartPulse,
  ShieldCheck,
  CalendarDays,
  Award,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

interface ReviewItem {
  id: number;
  rating: number | string;
  comment?: string | null;
  created_at: string;
  patient_name: string;
}

interface Nurse {
  id: number | string;
  nurse_id?: number | string;
  user_id?: number | string;

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
  photo?: string | null;
  license_file?: string;

  bio?: string;
  about?: string;
  description?: string;

  reviews_list?: ReviewItem[];
}

export default function NurseDetailsPage() {
  const { t } = useLanguage();

  const params = useParams();
  const detailsId = params?.Details;

  const [nurse, setNurse] = useState<Nurse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!detailsId) return;

    const fetchNurse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/nurses/users/${detailsId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || t("nurseDetails.loadError")
          );
        }

        const nurseData =
          data?.nurse ||
          data?.data?.nurse ||
          data?.data ||
          data;

        setNurse(nurseData);
      } catch (err) {
        console.error("Error fetching nurse:", err);

        setError(
          err instanceof Error
            ? err.message
            : t("nurseDetails.loadError")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNurse();
  }, [detailsId, t]);

  /* =========================
      LOADING
  ========================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5FAFA]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mb-5 h-4 w-32 rounded bg-slate-200" />

            <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
              <div className="h-[600px] rounded-md bg-white" />
              <div className="h-[700px] rounded-md bg-white" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================
      ERROR
  ========================= */

  if (error || !nurse) {
    return (
      <main className="min-h-screen bg-[#F5FAFA]">
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <HeartPulse
              size={38}
              className="mx-auto text-red-500"
            />

            <h1 className="mt-4 text-xl font-bold text-slate-900">
              {t("nurseDetails.nurseNotFound")}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error || t("nurseDetails.nurseNotFoundDesc")}
            </p>

            <Link
              href="/find-a-nurses"
              className="mt-5 inline-flex rounded-md bg-[#00535B] px-5 py-2.5 text-sm font-semibold text-white"
            >
              {t("nurseDetails.backToFind")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* =========================
      DATA
  ========================= */

  const nurseName =
    nurse.name ||
    nurse.fullName ||
    `${nurse.first_name || ""} ${nurse.last_name || ""}`.trim() ||
    t("nurseDetails.nurseProfessional");

  const nurseRole =
    nurse.role ||
    nurse.specialization ||
    t("nurseDetails.registeredNurse");

  const rawImage = nurse.image || nurse.photo;
  const nurseImage = rawImage
  ? rawImage.startsWith("http")
    ? rawImage
    : `${process.env.NEXT_PUBLIC_API_URL}${
        rawImage.startsWith("/") ? "" : "/"
      }${rawImage}`
  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nurseName
    )}&background=00535B&color=fff&size=300`;
  const nursePrice =
    nurse.price !== undefined &&
    nurse.price !== null &&
    nurse.price !== ""
      ? nurse.price
      : "25";

  const nurseExperience =
    nurse.experience !== undefined &&
    nurse.experience !== null &&
    nurse.experience !== ""
      ? nurse.experience
      : "3";

  const reviewsList = Array.isArray(nurse.reviews_list)
    ? nurse.reviews_list
    : [];

  const nurseRating =
    nurse.rating !== undefined && nurse.rating !== null
      ? nurse.rating
      : "0.0";

  const nurseReviewsCount =
    nurse.reviews ?? reviewsList.length;

  const nurseAbout =
    nurse.bio ||
    nurse.about ||
    nurse.description ||
    t("nurseDetails.aboutDefault").replace(
      "{role}",
      nurseRole
    );

  const categories =
    nurse.categories && nurse.categories.length > 0
      ? nurse.categories
      : [
          t("nurseDetails.cat1"),
          t("nurseDetails.cat2"),
          t("nurseDetails.cat3"),
          t("nurseDetails.cat4"),
          t("nurseDetails.cat5"),
          t("nurseDetails.cat6"),
        ];

  const bookingTargetId = nurse.nurse_id || nurse.id;

  /* =========================
      AVAILABILITY
  ========================= */

  const availability = [
    {
      day: t("nurseDetails.mon"),
      times: ["09:00 AM - 12:00 PM", "02:00 PM - 05:00 PM"],
    },
    {
      day: t("nurseDetails.tue"),
      times: ["09:00 AM - 01:00 PM"],
    },
    {
      day: t("nurseDetails.wed"),
      times: ["10:00 AM - 02:00 PM", "04:00 PM - 07:00 PM"],
    },
    {
      day: t("nurseDetails.thu"),
      times: ["09:00 AM - 12:00 PM", "02:00 PM - 06:00 PM"],
    },
    {
      day: t("nurseDetails.fri"),
      times: ["10:00 AM - 03:00 PM"],
    },
    {
      day: t("nurseDetails.sat"),
      times: ["09:00 AM - 01:00 PM"],
    },
    {
      day: t("nurseDetails.sun"),
      times: [],
    },
  ];

  return (
    <main className="min-h-screen bg-[#F5FAFA]">
      <div className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-7 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
          <Link
            href="/find-a-nurses"
            className="hover:text-[#00535B]"
          >
            {t("nurseDetails.findANurse")}
          </Link>

          <span>/</span>

          <span className="text-slate-500">
            {t("nurseDetails.nurseProfile")}
          </span>
        </div>

        {/* MAIN GRID */}
        <div className="grid items-start gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">

          {/* LEFT SIDEBAR */}
          <aside className="overflow-hidden rounded-md border-2 border-slate-200 bg-white shadow-sm">

            {/* IMAGE */}
            <div className="relative h-[230px] w-full overflow-hidden bg-slate-100 sm:h-[250px] lg:h-[190px]">
              <Image
                src={nurseImage}
                alt={nurseName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 270px"
                className="object-cover"
              />

              <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded bg-white px-2.5 py-1.5 text-[9px] font-semibold text-[#00535B] shadow-sm">
                <ShieldCheck size={11} />
                {t("nurseDetails.verifiedNurse")}
              </div>
            </div>

            {/* PROFILE META */}
            <div className="p-4 sm:p-5 lg:p-4">
              <h2 className="text-base font-bold text-slate-900">
                {nurseName}
              </h2>

              <p className="mt-1 text-[10px] text-slate-500">
                {nurseRole}
              </p>

              <div className="mt-3 flex items-start gap-1.5 text-[10px] text-slate-500">
                <MapPin
                  size={12}
                  className="mt-0.5 shrink-0 text-[#0d7c7b]"
                />

                <span>
                  {nurse.location || t("nurseDetails.lebanon")}
                </span>
              </div>

              <div className="my-4 h-[2px] bg-slate-100" />

              <div className="space-y-3">

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-400">
                    {t("nurseDetails.experience")}
                  </span>

                  <span className="text-[10px] font-semibold text-slate-700">
                    {nurseExperience} {t("nurseDetails.years")}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-400">
                    {t("nurseDetails.rating")}
                  </span>

                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-700">
                    <Star
                      size={11}
                      fill="currentColor"
                      className="text-yellow-400"
                    />
                    {nurseRating}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-400">
                    {t("nurseDetails.hourlyRate")}
                  </span>

                  <span className="text-[10px] font-semibold text-[#00535B]">
                    ${nursePrice}
                  </span>
                </div>

              </div>

              {/* ACTION BUTTONS */}

              <Link
                href={`/book?nurseId=${bookingTargetId}`}
                className="mt-5 flex w-full items-center justify-center rounded bg-[#00535B] px-3 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#00454c]"
              >
                {t("nurseDetails.bookThisNurseUpper")}
              </Link>

              <Link
                href="/find-a-nurses"
                className="mt-2 flex w-full items-center justify-center rounded border-2 border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50"
              >
                {t("nurseDetails.backToNurses")}
              </Link>
            </div>

            <div className="h-[2px] bg-slate-100" />

            {/* CERTIFICATIONS */}
            <div className="bg-[#F8FCFC] p-4 sm:p-5 lg:p-4">
              <h3 className="text-[10px] font-bold text-slate-700">
                {t("nurseDetails.certifications")}
              </h3>

              <div className="mt-3 space-y-2.5">
                {[
                  t("nurseDetails.cert1"),
                  t("nurseDetails.cert2"),
                  t("nurseDetails.cert3"),
                  t("nurseDetails.cert4"),
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle2
                      size={11}
                      className="mt-0.5 shrink-0 text-[#0d7c7b]"
                    />

                    <span className="text-[9px] leading-4 text-slate-500">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN CONTENT */}
          <section className="min-w-0 space-y-4">

            {/* ABOUT */}
            <div className="rounded-md border-2 border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">

                    <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                      {t("nurseDetails.aboutName").replace(
                        "{name}",
                        nurseName
                      )}
                    </h1>

                    <span className="flex items-center gap-1 rounded-full bg-[#E6F4F1] px-2.5 py-1 text-[8px] font-semibold text-[#00535B]">
                      <ShieldCheck size={10} />
                      {t("nurseDetails.verified")}
                    </span>
                  </div>

                  <p className="mt-1 text-[10px] text-slate-400 sm:text-[11px]">
                    {nurseRole}
                  </p>
                </div>

                <div className="shrink-0 rounded-lg bg-[#E6F4F1] px-4 py-2.5 sm:text-right">
                  <p className="text-lg font-bold text-[#00535B]">
                    ${nursePrice}
                  </p>

                  <p className="text-[8px] text-slate-400">
                    {t("nurseDetails.perHour")}
                  </p>
                </div>
              </div>

              <div className="my-4 h-[2px] bg-slate-100" />

              <p className="text-[10px] leading-6 text-slate-600 sm:text-[11px]">
                {nurseAbout}
              </p>
            </div>

            {/* SPECIALIZATIONS */}
            <div className="rounded-md border-2 border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-sm font-bold text-slate-800">
                {t("nurseDetails.specializations")}
              </h2>

              <div className="my-3 h-[2px] bg-slate-100" />

              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <span
                    key={`${category}-${index}`}
                    className="rounded-full border border-[#BFE4E0] bg-[#F1FAF9] px-3 py-1.5 text-[8px] font-medium text-[#00535B] sm:text-[9px]"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* EXPERIENCE / SKILLS */}
            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-md border-2 border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6F4F1]">
                    <Briefcase
                      size={17}
                      className="text-[#00535B]"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-400">
                      {t("nurseDetails.professionalExperience")}
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-slate-800">
                      {nurseExperience} {t("nurseDetails.yearsCap")}
                    </p>
                  </div>
                </div>

                <div className="my-4 h-[2px] bg-slate-100" />

                <div className="space-y-2.5">
                  {[
                    t("nurseDetails.exp1"),
                    t("nurseDetails.exp2"),
                    t("nurseDetails.exp3"),
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex gap-2 text-[9px] text-slate-500"
                    >
                      <CheckCircle2
                        size={11}
                        className="shrink-0 text-[#0d7c7b]"
                      />

                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6F4F1]">
                    <Award
                      size={17}
                      className="text-[#00535B]"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-400">
                      {t("nurseDetails.professionalSkills")}
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-slate-800">
                      {t("nurseDetails.homeCareSpecialist")}
                    </p>
                  </div>
                </div>

                <div className="my-4 h-[2px] bg-slate-100" />

                <div className="flex flex-wrap gap-2">
                  {[
                    t("nurseDetails.skill1"),
                    t("nurseDetails.skill2"),
                    t("nurseDetails.skill3"),
                    t("nurseDetails.skill4"),
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-slate-50 px-2 py-1 text-[8px] text-slate-500"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AVAILABILITY */}
            <div className="rounded-md border-2 border-slate-200 bg-white p-4 shadow-sm sm:p-5">

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={16}
                    className="text-[#00535B]"
                  />

                  <h2 className="text-sm font-bold text-slate-800">
                    {t("nurseDetails.availabilityThisWeek")}
                  </h2>
                </div>

                <span className="text-[8px] text-slate-400">
                  {t("nurseDetails.availableForBooking")}
                </span>
              </div>

              <div className="my-4 h-[2px] bg-slate-100" />

              {/* DESKTOP */}
              <div className="hidden overflow-x-auto md:block">
                <div className="grid min-w-[700px] grid-cols-7 gap-2">

                  {availability.map((item) => (
                    <div
                      key={item.day}
                      className="min-h-[105px] rounded border-2 border-slate-100 bg-[#FAFCFC] p-2"
                    >
                      <p className="border-b border-slate-100 pb-2 text-center text-[9px] font-bold text-slate-600">
                        {item.day}
                      </p>

                      <div className="mt-2 space-y-1.5">
                        {item.times.length > 0 ? (
                          item.times.map((time) => (
                            <div
                              key={time}
                              className="rounded bg-[#E6F4F1] px-1.5 py-1.5 text-center"
                            >
                              <p className="text-[7px] font-medium leading-3 text-[#00535B]">
                                {time}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="pt-3 text-center text-[8px] text-slate-400">
                            {t("nurseDetails.off")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* MOBILE */}
              <div className="grid grid-cols-1 gap-2 md:hidden">

                {availability.map((item) => (
                  <div
                    key={item.day}
                    className="rounded border-2 border-slate-100 bg-[#FAFCFC] p-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      <p className="text-[10px] font-bold text-slate-700">
                        {item.day}
                      </p>

                      <div className="flex flex-wrap gap-1.5">

                        {item.times.length > 0 ? (
                          item.times.map((time) => (
                            <span
                              key={time}
                              className="rounded bg-[#E6F4F1] px-2 py-1 text-[8px] font-medium text-[#00535B]"
                            >
                              {time}
                            </span>
                          ))
                        ) : (
                          <span className="text-[8px] text-slate-400">
                            {t("nurseDetails.notAvailable")}
                          </span>
                        )}

                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* REVIEWS */}
            <div className="rounded-md border-2 border-slate-200 bg-white p-4 shadow-sm sm:p-5">

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-2">
                  <Star
                    size={16}
                    fill="currentColor"
                    className="text-yellow-400"
                  />

                  <h2 className="text-sm font-bold text-slate-800">
                    {t("nurseDetails.patientReviews")}
                  </h2>
                </div>

                <div className="flex items-center gap-1 text-[9px] text-slate-400">
                  <Star
                    size={11}
                    fill="currentColor"
                    className="text-yellow-400"
                  />

                  <span>
                    {nurseRating} · {nurseReviewsCount}{" "}
                    {t("nurseDetails.reviewsCount")}
                  </span>
                </div>

              </div>

              <div className="my-4 h-[2px] bg-slate-100" />

              {reviewsList.length === 0 ? (
                <div className="rounded-lg bg-slate-50 py-8 text-center">

                  <MessageSquare
                    size={28}
                    className="mx-auto mb-2 text-slate-300"
                  />

                  <p className="text-[10px] font-medium text-slate-500">
                    {t("nurseDetails.noReviews")}
                  </p>

                </div>
              ) : (
                <div className="divide-y-2 divide-slate-100">

                  {reviewsList.map((rev) => {

                    const initials = rev.patient_name
                      ? rev.patient_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()
                      : "P";

                    return (
                      <div
                        key={rev.id}
                        className="py-3 first:pt-0 last:pb-0"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-2">

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E6F4F1] text-[8px] font-bold text-[#00535B]">
                              {initials}
                            </div>

                            <div className="min-w-0">

                              <p className="text-[9px] font-semibold text-slate-700">
                                {rev.patient_name || "Patient"}
                              </p>

                              <p className="text-[8px] text-slate-400">
                                {new Date(
                                  rev.created_at
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>

                            </div>
                          </div>

                          <div className="flex shrink-0 gap-0.5">

                            {[1, 2, 3, 4, 5].map(
                              (starIndex) => (
                                <Star
                                  key={starIndex}
                                  size={10}
                                  className={
                                    starIndex <=
                                    Math.round(
                                      Number(rev.rating)
                                    )
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-slate-100 text-slate-200"
                                  }
                                />
                              )
                            )}

                          </div>

                        </div>

                        <p className="mt-2 pl-10 text-[9px] leading-5 text-slate-500">

                          {rev.comment ? (
                            rev.comment
                          ) : (
                            <span className="italic text-slate-400">
                              {t(
                                "nurseDetails.ratingWithoutComment"
                              )}
                            </span>
                          )}

                        </p>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>

            {/* BOOK CTA */}
            <div className="rounded-md bg-[#006D77] p-4 sm:p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-sm font-bold text-white sm:text-base">
                    {t("nurseDetails.readyToBook").replace(
                      "{name}",
                      nurseName
                    )}
                  </h2>

                  <p className="mt-1 text-[9px] leading-4 text-white/75">
                    {t("nurseDetails.readyToBookDesc")}
                  </p>
                </div>

                <Link
                  href={`/book?nurseId=${bookingTargetId}`}
                  className="flex w-full shrink-0 items-center justify-center gap-2 rounded bg-white px-5 py-2.5 text-[10px] font-bold text-[#00535B] sm:w-auto"
                >
                  <CalendarDays size={13} />
                  {t("nurseDetails.bookThisNurse")}
                </Link>

              </div>
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}