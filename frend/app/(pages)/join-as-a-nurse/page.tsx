"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Camera, FileText } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const AVAILABLE_CATEGORIES = [
  {
    value: "Home Care",
    key: "homeCare",
  },
  {
    value: "Elderly Care",
    key: "elderlyCare",
  },
  {
    value: "Pediatric Care",
    key: "pediatricCare",
  },
  {
    value: "Post-Surgery Care",
    key: "postSurgeryCare",
  },
  {
    value: "Wound Dressing",
    key: "woundDressing",
  },
  {
    value: "IV Therapy & Injections",
    key: "ivTherapy",
  },
  {
    value: "Palliative Care",
    key: "palliativeCare",
  },
  {
    value: "ICU Support",
    key: "icuSupport",
  },
  {
    value: "Physical Therapy Assistance",
    key: "physicalTherapy",
  },
];

export default function CreateNurseAccountPage() {
  const router = useRouter();
  const { t, dir } = useLanguage();

  // ================= PERSONAL INFORMATION =================
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ================= PROFESSIONAL PROFILE =================
  const [specialization, setSpecialization] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    []
  );

  // ================= FILE UPLOAD =================
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  // ================= GENERAL STATE =================
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ================= CATEGORY =================
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  // ================= IMAGE =================
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;

    setImageFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  // ================= CV =================
  const handleCvChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCvFile(e.target.files?.[0] ?? null);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    // Profile photo validation
    if (!imageFile) {
      setErrorMessage(t("uploadProfilePhoto"));
      return;
    }

    // CV validation
    if (!cvFile) {
      setErrorMessage(t("uploadCv"));
      return;
    }

    // Category validation
    if (selectedCategories.length === 0) {
      setErrorMessage(t("selectAtLeastOneCategory"));
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);

      formData.append("specialization", specialization);
      formData.append("experience", yearsExperience);
      formData.append("location", location);
      formData.append("price", price);

      formData.append("role", "nurse");

      // Send categories to backend
      formData.append(
        "categories",
        JSON.stringify(selectedCategories)
      );

      // Upload files
      formData.append("image", imageFile);
      formData.append("cvFile", cvFile);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/nurses/register-nurse`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        router.push(
          "/join-as-a-nurse/license-verification"
        );
      }
    } catch (error: any) {
      console.error("Nurse registration error:", error);

      const message =
        error.response?.data?.message ||
        t("nurseRegistrationError");

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir={dir}
      className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-8"
    >
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">

        {/* ================= LEFT INTRO ================= */}
        <div className="space-y-4 lg:pt-2">

          <h1 className="text-sm font-bold tracking-wide text-slate-800">
            {t("accountCreation")}
          </h1>

          <p className="text-xs text-slate-500 leading-relaxed">
            {t("joinTrustedProfessionals")}
          </p>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {t("nurseApplicationDescription")}
          </p>

        </div>

        {/* ================= RIGHT FORM ================= */}
        <div className="space-y-6">

          {/* ERROR MESSAGE */}
          {errorMessage && (
            <div className="p-3 text-xs text-red-700 bg-red-100 border border-red-200 rounded-xl text-center">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* ================================================= */}
            {/* 01 PERSONAL INFORMATION */}
            {/* ================================================= */}

            <section className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">

              <h2 className="text-sm font-bold text-[#0d7c7b]">
                {t("personalInformation")}
              </h2>

              {/* Full Name */}
              <div className="space-y-1.5">

                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wide">
                  {t("fullLegalName")}
                </label>

                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  placeholder={t("fullNamePlaceholder")}
                  className="w-full px-3.5 py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all"
                />

              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Email */}
                <div className="space-y-1.5">

                  <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wide">
                    {t("emailAddress")}
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="jane.doe@example.com"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all"
                  />

                </div>

                {/* Phone */}
                <div className="space-y-1.5">

                  <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wide">
                    {t("phoneNumber")}
                  </label>

                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="+961 70 000 000"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all"
                  />

                </div>

              </div>

              {/* Password */}
              <div className="space-y-1.5">

                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wide">
                  {t("password")}
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    dir="ltr"
                    className={`w-full ${
                      dir === "rtl"
                        ? "pl-10 pr-3.5"
                        : "pl-3.5 pr-10"
                    } py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className={`absolute inset-y-0 ${
                      dir === "rtl"
                        ? "left-0 pl-3.5"
                        : "right-0 pr-3.5"
                    } flex items-center text-slate-400 hover:text-slate-600`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7z"
                      />
                    </svg>
                  </button>

                </div>

              </div>

            </section>

            {/* ================================================= */}
            {/* 02 PROFESSIONAL PROFILE */}
            {/* ================================================= */}

            <section className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">

              <h2 className="text-sm font-bold text-[#0d7c7b]">
                {t("professionalProfile")}
              </h2>

              {/* Specialization + Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Specialization */}
                <div className="space-y-1.5">

                  <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wide">
                    {t("primarySpecialization")}
                  </label>

                  <select
                    required
                    value={specialization}
                    onChange={(e) =>
                      setSpecialization(e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all appearance-none"
                  >
                    <option value="" disabled>
                      {t("selectSpecialization")}
                    </option>

                    <option value="general">
                      {t("generalHomeCare")}
                    </option>

                    <option value="pediatric">
                      {t("pediatricCare")}
                    </option>

                    <option value="geriatric">
                      {t("geriatricCare")}
                    </option>

                    <option value="icu">
                      {t("icuCriticalCare")}
                    </option>

                    <option value="postop">
                      {t("postOperativeCare")}
                    </option>

                    <option value="palliative">
                      {t("palliativeCare")}
                    </option>
                  </select>

                </div>

                {/* Experience */}
                <div className="space-y-1.5">

                  <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wide">
                    {t("yearsOfExperience")}
                  </label>

                  <select
                    required
                    value={yearsExperience}
                    onChange={(e) =>
                      setYearsExperience(e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all appearance-none"
                  >
                    <option value="" disabled>
                      {t("selectYears")}
                    </option>

                    <option value="0-1">
                      {t("lessThanOneYear")}
                    </option>

                    <option value="1-3">
                      {t("oneToThreeYears")}
                    </option>

                    <option value="3-5">
                      {t("threeToFiveYears")}
                    </option>

                    <option value="5-10">
                      {t("fiveToTenYears")}
                    </option>

                    <option value="10+">
                      {t("tenPlusYears")}
                    </option>
                  </select>

                </div>

              </div>

              {/* Location + Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Location */}
                <div className="space-y-1.5">

                  <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wide">
                    {t("currentLocation")}
                  </label>

                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    placeholder={t("locationPlaceholder")}
                    className="w-full px-3.5 py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all"
                  />

                </div>

                {/* Price */}
                <div className="space-y-1.5">

                  <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wide">
                    {t("hourlyRate")}
                  </label>

                  <div className="relative">

                    <span
                      className={`absolute inset-y-0 ${
                        dir === "rtl"
                          ? "right-0 pr-3.5"
                          : "left-0 pl-3.5"
                      } flex items-center text-slate-400 text-xs font-semibold`}
                    >
                      $
                    </span>

                    <input
                      type="number"
                      required
                      min="0"
                      step="0.5"
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value)
                      }
                      placeholder="50.00"
                      dir="ltr"
                      className={`w-full ${
                        dir === "rtl"
                          ? "pr-7 pl-3.5"
                          : "pl-7 pr-3.5"
                      } py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all`}
                    />

                  </div>

                </div>

              </div>

              {/* Categories */}
              <div className="space-y-2 pt-2 border-t border-slate-100">

                <div className="flex items-center justify-between gap-3">

                  <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wide">
                    {t("selectCareCategories")}
                  </label>

                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {selectedCategories.length}{" "}
                    {t("selected")}
                  </span>

                </div>

                <div className="flex flex-wrap gap-2 pt-1">

                  {AVAILABLE_CATEGORIES.map(
                    (category) => {
                      const isSelected =
                        selectedCategories.includes(
                          category.value
                        );

                      return (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() =>
                            toggleCategory(
                              category.value
                            )
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border ${
                            isSelected
                              ? "bg-[#0d7c7b] text-white border-[#0d7c7b] shadow-sm"
                              : "bg-[#e8f8f8] text-slate-700 border-transparent hover:border-[#0d7c7b]/30"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3.5 h-3.5" />
                          )}

                          <span>
                            {t(category.key)}
                          </span>
                        </button>
                      );
                    }
                  )}

                </div>

              </div>

            </section>

            {/* ================================================= */}
            {/* 03 PHOTO + CV */}
            {/* ================================================= */}

            <section className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                <h2 className="text-sm font-bold text-[#0d7c7b]">
                  {t("profilePhotoCvUpload")}
                </h2>

                <span className="text-[10px] text-slate-400">
                  {t("acceptedFormats")}
                </span>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* PROFILE IMAGE */}
                <label className="cursor-pointer block">

                  <span className="block text-[11px] font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    {t("profilePicture")}
                  </span>

                  <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-4 bg-[#fafcfc] hover:bg-[#e8f8f8] transition-colors text-center min-h-[140px]">

                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt={t("profilePicture")}
                        width={64}
                        height={64}
                        unoptimized
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#0d7c7b]"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-slate-400" />
                    )}

                    <span className="text-[11px] text-slate-600 font-medium truncate max-w-[180px]">
                      {imageFile
                        ? imageFile.name
                        : t("clickToUploadPhoto")}
                    </span>

                  </div>

                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>

                {/* CV */}
                <label className="cursor-pointer block">

                  <span className="block text-[11px] font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    {t("curriculumVitae")}
                  </span>

                  <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-4 bg-[#fafcfc] hover:bg-[#e8f8f8] transition-colors text-center min-h-[140px]">

                    <FileText className="w-6 h-6 text-slate-400" />

                    <span className="text-[11px] text-slate-600 font-medium truncate max-w-[180px]">
                      {cvFile
                        ? cvFile.name
                        : t("clickToUploadCv")}
                    </span>

                  </div>

                  <input
                    type="file"
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleCvChange}
                    className="hidden"
                  />

                </label>

              </div>

            </section>

            {/* ================================================= */}
            {/* SUBMIT */}
            {/* ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#0f5454] hover:bg-[#0b4242] disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {loading
                ? t("submitting")
                : t("submitRegistration")}

              {!loading && (
                <svg
                  className={`w-3.5 h-3.5 ${
                    dir === "rtl" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7-7 7M5 12h16"
                  />
                </svg>
              )}
            </button>

            {/* LOGIN */}
            <p className="text-center text-xs text-slate-500">
              {t("alreadyHaveAccount")}{" "}

              <a
                href="/Sign-in"
                className="font-semibold text-[#0d7c7b] hover:underline"
              >
                {t("logIn")}
              </a>
            </p>

          </form>

        </div>
      </div>
    </main>
  );
}