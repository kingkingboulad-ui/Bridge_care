"use client";

import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useBooking } from "../BookingContext";
import { useLanguage } from "@/context/LanguageContext";

// Leaflet must only load in the browser
const LocationMap = dynamic(() => import("../LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[220px] w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-400 sm:h-[280px]">
      Loading map…
    </div>
  ),
});

export default function WhenWherePage() {
  const router = useRouter();
  const { data, update } = useBooking();
  const { t, dir } = useLanguage();

  const [startDate, setStartDate] = useState(data.startDate);
  const [careDuration, setCareDuration] = useState(
    data.careDuration
  );
  const [careAddress, setCareAddress] = useState(
    data.careAddress
  );

  const [location, setLocation] = useState({
    lat: data.latitude,
    lng: data.longitude,
  });

  const [searching, setSearching] = useState(false);

  // ================= SEARCH ADDRESS =================

  const searchAddress = async () => {
    const address = careAddress.trim();

    if (!address) {
      alert(t("enterCareAddress"));
      return;
    }

    try {
      setSearching(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const results = await response.json();

      if (!results || results.length === 0) {
        alert(t("addressNotFound"));
        return;
      }

      setLocation({
        lat: Number(results[0].lat),
        lng: Number(results[0].lon),
      });
    } catch (error) {
      console.error("Address search error:", error);
      alert(t("addressSearchError"));
    } finally {
      setSearching(false);
    }
  };

  // ================= ADDRESS FORM =================

  const handleAddressSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    searchAddress();
  };

  // ================= MAP LOCATION =================

  const handleLocationChange = (
    lat: number,
    lng: number
  ) => {
    setLocation({
      lat,
      lng,
    });
  };

  // ================= CONTINUE =================

  const handleContinue = () => {
    if (!startDate) {
      alert(t("selectStartDate"));
      return;
    }

    if (!careDuration) {
      alert(t("selectCareDuration"));
      return;
    }

    if (!careAddress.trim()) {
      alert(t("enterCareAddress"));
      return;
    }

    update({
      startDate,
      careDuration,
      careAddress,
      latitude: location.lat,
      longitude: location.lng,
    });

    router.push("/book/describe-needs");
  };

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#F1F8FB]"
    >
     

      <main className="min-h-[650px] px-4 py-6 sm:px-6 sm:py-8">

        {/* ================= STEPS ================= */}

        <div className="mx-auto mb-6 flex w-full max-w-[400px] items-center justify-center">

          {/* Step 1 */}
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#006D77] text-[10px] font-semibold text-white sm:h-8 sm:w-8 sm:text-xs">
              ✓
            </div>

            <div className="h-[2px] w-full bg-[#006D77]" />
          </div>

          {/* Step 2 */}
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#006D77] text-[10px] font-semibold text-white sm:h-8 sm:w-8 sm:text-xs">
              ✓
            </div>

            <div className="h-[2px] w-full bg-[#006D77]" />
          </div>

          {/* Step 3 */}
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#006D77] text-[10px] font-semibold text-white sm:h-8 sm:w-8 sm:text-xs">
              3
            </div>

            <div className="h-[2px] w-full bg-[#C7DADD]" />
          </div>

          {/* Step 4 */}
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C7DADD] text-[10px] font-semibold text-[#456268] sm:h-8 sm:w-8 sm:text-xs">
              4
            </div>

            <div className="h-[2px] w-full bg-[#C7DADD]" />
          </div>

          {/* Step 5 */}
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C7DADD] text-[10px] font-semibold text-[#456268] sm:h-8 sm:w-8 sm:text-xs">
            5
          </div>
        </div>

        {/* ================= HEADER ================= */}

        <div className="mx-auto mb-5 w-full max-w-3xl">
          <h1 className="text-[22px] font-bold text-[#1C2E4A] sm:text-3xl">
            {t("whenAndWhere")}
          </h1>

          <p className="mt-1 text-[11px] leading-5 text-gray-500 sm:text-sm">
            {t("whenWhereDescription")}
          </p>
        </div>

        {/* ================= MAIN CARD ================= */}

        <div className="mx-auto w-full max-w-3xl rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">

          {/* ================= DATE + DURATION ================= */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="mb-1.5 block text-xs font-semibold text-[#1C2E4A] sm:text-sm"
              >
                {t("startDate")}
              </label>

              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(event.target.value)
                }
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-xs text-gray-700 outline-none transition focus:border-[#00535B] focus:ring-2 focus:ring-[#00535B]/10 sm:text-sm"
              />
            </div>

            {/* Care Duration */}
            <div>
              <label
                htmlFor="careDuration"
                className="mb-1.5 block text-xs font-semibold text-[#1C2E4A] sm:text-sm"
              >
                {t("careDuration")}
              </label>

              <select
                id="careDuration"
                value={careDuration}
                onChange={(event) =>
                  setCareDuration(event.target.value)
                }
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none transition focus:border-[#00535B] focus:ring-2 focus:ring-[#00535B]/10 sm:text-sm"
              >
                <option value="">
                  {t("selectDuration")}
                </option>

                <option value="1-hour">
                  {t("oneHour")}
                </option>

                <option value="2-hours">
                  {t("twoHours")}
                </option>

                <option value="4-hours">
                  {t("fourHours")}
                </option>

                <option value="8-hours">
                  {t("eightHours")}
                </option>

                <option value="12-hours">
                  {t("twelveHours")}
                </option>

                <option value="24-hours">
                  {t("twentyFourHours")}
                </option>
              </select>
            </div>
          </div>

          {/* ================= CARE ADDRESS ================= */}

          <div className="mt-5">

            <label
              htmlFor="careAddress"
              className="mb-1.5 block text-xs font-semibold text-[#1C2E4A] sm:text-sm"
            >
              {t("careAddress")}
            </label>

            <form
              onSubmit={handleAddressSubmit}
              className="flex w-full flex-col gap-2 sm:flex-row"
            >

              {/* Address Input */}
              <input
                id="careAddress"
                type="text"
                value={careAddress}
                onChange={(event) =>
                  setCareAddress(event.target.value)
                }
                placeholder={t("enterCareAddressPlaceholder")}
                className="h-12 w-full min-w-0 flex-1 rounded-lg border border-gray-200 px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#00535B] focus:ring-2 focus:ring-[#00535B]/10"
              />

              {/* Search Button */}
              <button
                type="submit"
                disabled={searching}
                className="h-12 w-full shrink-0 rounded-lg bg-[#00535B] px-6 text-xs font-semibold text-white transition hover:bg-[#006D77] disabled:cursor-not-allowed disabled:opacity-50 sm:w-[100px]"
              >
                {searching
                  ? t("searching")
                  : t("search")}
              </button>
            </form>

            <p className="mt-1.5 text-[10px] leading-4 text-gray-400 sm:text-[11px]">
              {t("addressSearchHint")}
            </p>
          </div>

          {/* ================= MAP TITLE ================= */}

          <div className="mb-2 mt-5">
            <h2 className="text-xs font-semibold text-[#1C2E4A] sm:text-sm">
              {t("careLocation")}
            </h2>

            <p className="mt-0.5 text-[10px] leading-4 text-gray-400 sm:text-xs">
              {t("mapLocationHint")}
            </p>
          </div>

          {/* ================= MAP ================= */}

          <LocationMap
            latitude={location.lat}
            longitude={location.lng}
            onLocationChange={handleLocationChange}
          />

          {/* ================= COORDINATES ================= */}

          <div className="mt-3 flex flex-col gap-1 rounded-lg bg-[#F0FDFA] px-3 py-2 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-1">

            <span className="text-[10px] text-gray-600 sm:text-xs">
              {t("latitude")}:{" "}
              <span className="font-semibold text-[#00535B]">
                {location.lat.toFixed(5)}
              </span>
            </span>

            <span className="text-[10px] text-gray-600 sm:text-xs">
              {t("longitude")}:{" "}
              <span className="font-semibold text-[#00535B]">
                {location.lng.toFixed(5)}
              </span>
            </span>

          </div>

          {/* ================= BUTTONS ================= */}

          <div
            className={`mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between ${
              dir === "rtl"
                ? "sm:flex-row-reverse"
                : ""
            }`}
          >

            {/* Back */}
            <Link
              href="/book/type-of-care"
              className="flex h-10 w-full items-center justify-center rounded-lg border border-gray-200 px-6 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 sm:h-auto sm:w-auto sm:py-2 sm:text-sm"
            >
              {dir === "rtl" ? "→" : "←"}{" "}
              {t("common.back")}
            </Link>

            {/* Continue */}
            <button
              type="button"
              onClick={handleContinue}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#00535B] px-7 text-xs font-semibold text-white transition hover:bg-[#006D77] sm:h-auto sm:w-auto sm:py-2 sm:text-sm"
            >
              {t("common.continue")}

              <ArrowRight
                size={14}
                className={
                  dir === "rtl"
                    ? "rotate-180"
                    : ""
                }
              />
            </button>

          </div>

        </div>
      </main>

    </div>
  );
}