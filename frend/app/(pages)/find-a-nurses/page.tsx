"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Star, X, Loader2 } from "lucide-react";

import PageHeader from "../../../components/nurse-search/PageHeader";
import SearchAndFilter from "../../../components/nurse-search/SearchAndFilter";
import ResultsCount from "../../../components/nurse-search/ResultsCount";
import NurseCard, { Nurse } from "../../../components/nurse-search/NurseCard";
import { useLanguage } from "@/context/LanguageContext";

const NURSES_PER_PAGE = 6;

/* ========================================================
   RATE NURSE MODAL
======================================================== */
interface RateModalProps {
  nurseId: number;
  nurseName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newRating: number, newReviewsCount: number) => void;
}

function RateNurseModal({
  nurseId,
  nurseName,
  isOpen,
  onClose,
  onSuccess,
}: RateModalProps) {
  const { t } = useLanguage();

  const [selectedRating, setSelectedRating] = useState(5);//store evaluation li e5taru user
  const [hoveredRating, setHoveredRating] = useState(0);//store la 3aded star li f2asun 
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/nurses/${nurseId}/rate`,
        {
          rating: selectedRating,
          comment,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        onSuccess(Number(res.data.rating), Number(res.data.reviews));
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || t("failedSubmitRating")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">
            {t("rateNurse")}{" "}
            <span className="text-[#00535B]">{nurseName}</span>
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-600">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">

          <div className="flex flex-col items-center justify-center gap-1.5 py-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={`${(hoveredRating || selectedRating) >= star
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200"
                      } transition-colors`}
                  />
                </button>
              ))}
            </div>

            <span className="text-xs font-semibold text-slate-600">
              {selectedRating} {t("outOfFiveStars")}
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">
              {t("feedbackReview")} ({t("optional")})
            </label>

            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("writeExperience")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00535B] focus:outline-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-[#00535B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#00737D] transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading && (
                <Loader2 size={14} className="animate-spin" />
              )}

              <span>{t("submitRating")}</span>
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

/* ========================================================
   MAIN SEARCH PAGE
======================================================== */
export default function NurseSearchPage() {
  const { t } = useLanguage();

  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ratingNurse, setRatingNurse] = useState<Nurse | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("top-rated");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filters
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState("any");
  const [experienceRange, setExperienceRange] = useState("any");
  const [locationFilter, setLocationFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  /* =========================
     GET NURSES
  ========================= */
  useEffect(() => {
    const fetchNurses = async () => {
      try {
        setLoading(true);
        setError(null);


        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/nurses/getall`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setNurses(data.nurses || []);
        } else {
          setError(data.message || t("failedToLoadNurses"));
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(t("errorConnectingBackend"));
      } finally {
        setLoading(false);
      }
    };

    fetchNurses();
  }, []);

  /* =========================
     SEARCH + FILTERS + SORT
  ========================= */
  const filteredNurses = useMemo(() => {
    let result = [...nurses];

    const searchValue = searchTerm.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((nurse: any) => {
        const name =
          nurse.name ||
          nurse.fullName ||
          `${nurse.first_name || ""} ${nurse.last_name || ""}`;

        const role =
          nurse.role ||
          nurse.specialization ||
          "";

        const location = nurse.location || "";

        const categoriesText = Array.isArray(nurse.categories)
          ? nurse.categories.join(" ")
          : "";

        return (
          name.toLowerCase().includes(searchValue) ||
          role.toLowerCase().includes(searchValue) ||
          location.toLowerCase().includes(searchValue) ||
          categoriesText.toLowerCase().includes(searchValue)
        );
      });
    }

    if (selectedCategory !== "All") {
      result = result.filter((nurse: any) => {
        if (!Array.isArray(nurse.categories)) {
          return false;
        }

        return nurse.categories.some(
          (category: string) =>
            category.toLowerCase().trim() ===
            selectedCategory.toLowerCase().trim()
        );
      });
    }

    if (minRating > 0) {
      result = result.filter(
        (nurse: any) =>
          Number(nurse.rating || 0) >= minRating
      );
    }

    if (priceRange === "under50") {
      result = result.filter(
        (nurse: any) =>
          Number(nurse.price || 0) < 50
      );
    }

    if (priceRange === "50-65") {
      result = result.filter((nurse: any) => {
        const price = Number(nurse.price || 0);

        return price >= 50 && price <= 65;
      });
    }

    if (priceRange === "upper65") {
      result = result.filter(
        (nurse: any) =>
          Number(nurse.price || 0) > 65
      );
    }

    if (experienceRange === "1-3") {
      result = result.filter((nurse: any) => {
        const years =
          parseInt(String(nurse.experience || 0)) || 0;

        return years >= 1 && years <= 3;
      });
    }

    if (experienceRange === "3-5") {
      result = result.filter((nurse: any) => {
        const years =
          parseInt(String(nurse.experience || 0)) || 0;

        return years >= 3 && years <= 5;
      });
    }

    if (experienceRange === "5+") {
      result = result.filter((nurse: any) => {
        const years =
          parseInt(String(nurse.experience || 0)) || 0;

        return years >= 5;
      });
    }

    if (locationFilter.trim()) {
      const locationValue =
        locationFilter.trim().toLowerCase();

      result = result.filter((nurse: any) =>
        (nurse.location || "")
          .toLowerCase()
          .includes(locationValue)
      );
    }

    if (sortBy === "top-rated") {
      result.sort(
        (a: any, b: any) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    if (sortBy === "price-low") {
      result.sort(
        (a: any, b: any) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a: any, b: any) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sortBy === "name") {
      result.sort((a: any, b: any) => {
        const nameA =
          a.name ||
          a.fullName ||
          `${a.first_name || ""} ${a.last_name || ""}`;

        const nameB =
          b.name ||
          b.fullName ||
          `${b.first_name || ""} ${b.last_name || ""}`;

        return nameA
          .toLowerCase()
          .localeCompare(nameB.toLowerCase());
      });
    }

    if (sortBy === "experience") {
      result.sort((a: any, b: any) => {
        const aYears =
          parseInt(String(a.experience || 0)) || 0;

        const bYears =
          parseInt(String(b.experience || 0)) || 0;

        return bYears - aYears;
      });
    }

    return result;
  }, [
    nurses,
    searchTerm,
    sortBy,
    selectedCategory,
    minRating,
    priceRange,
    experienceRange,
    locationFilter,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    sortBy,
    selectedCategory,
    minRating,
    priceRange,
    experienceRange,
    locationFilter,
  ]);

  const clearFilters = () => {
    setMinRating(0);
    setPriceRange("any");
    setExperienceRange("any");
    setLocationFilter("");
    setSelectedCategory("All");
  };

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.ceil(
    filteredNurses.length / NURSES_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * NURSES_PER_PAGE;

  const currentNurses = filteredNurses.slice(
    startIndex,
    startIndex + NURSES_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* HEADER */}
        <PageHeader />

        {/* SEARCH + FILTERS + SORT */}
        <div className="mt-6">
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            minRating={minRating}
            setMinRating={setMinRating}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            experienceRange={experienceRange}
            setExperienceRange={setExperienceRange}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            clearFilters={clearFilters}
          />
        </div>

        {/* RESULT COUNT */}
        {!loading && !error && (
          <div className="mt-8">
            <ResultsCount count={filteredNurses.length} />
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#00535B]" />

            <p className="text-sm text-slate-500">
              {t("loadingNurses")}
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="py-20 text-center">
            <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-6">
              <p className="font-medium text-red-600">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading &&
          !error &&
          filteredNurses.length === 0 && (
            <div className="py-20 text-center">
              <h2 className="text-xl font-bold text-slate-800">
                {t("noNursesFound")}
              </h2>

              <p className="mt-2 text-slate-500">
                {t("tryAnotherSearch")}
              </p>
            </div>
          )}

        {/* NURSE CARDS */}
        {!loading &&
          !error &&
          currentNurses.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">

                {currentNurses.map((nurse: any) => (
                  <div
                    key={nurse.id}
                    className="relative group"
                  >
                    <NurseCard nurse={nurse} />

                    {/* RATE BUTTON */}
                    <button
                      type="button"
                      onClick={() =>
                        setRatingNurse(nurse)
                      }
                      className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-amber-600 shadow-sm hover:bg-amber-50 transition-all border border-amber-200/60"
                    >
                      <Star
                        size={12}
                        className="fill-amber-400 text-amber-400"
                      />

                      <span>{t("rate")}</span>
                    </button>
                  </div>
                ))}

              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-2 pb-6">

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
                  >
                    {t("previous")}
                  </button>

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium transition sm:h-10 sm:w-10 ${currentPage === page
                        ? "bg-[#00535B] text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
                  >
                    {t("next")}
                  </button>

                </div>
              )}
            </>
          )}
      </div>

      {/* RATE MODAL */}
      {ratingNurse && (
        <RateNurseModal
          nurseId={Number(ratingNurse.id)}
          nurseName={
            ratingNurse.name ||
            (ratingNurse as any).fullName ||
            `${(ratingNurse as any).first_name || ""} ${(ratingNurse as any).last_name || ""
              }`.trim() ||
            t("nurse")
          }
          isOpen={Boolean(ratingNurse)}
          onClose={() => setRatingNurse(null)}
          onSuccess={(newRating, newReviewsCount) => {
            setNurses((prev) =>
              prev.map((n) =>
                n.id === ratingNurse.id
                  ? {
                    ...n,
                    rating: newRating,
                    reviews: newReviewsCount,
                  }
                  : n
              )
            );
          }}
        />
      )}
    </main>
  );
}