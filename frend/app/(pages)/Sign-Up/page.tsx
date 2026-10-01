"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartPulse } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function CreatePatientAccountPage() {
  const router = useRouter();
  const { t, dir } = useLanguage();

  // State Management
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          password: password,
          role: "patient",
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200 || res.status === 201) {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Register error:", error);

      const message =
        error.response?.data?.message ||
        t("registrationError");

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir={dir}
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f8fafc]"
    >
      {/* ================= LEFT SIDE ================= */}
      <div className="relative min-h-[320px] lg:min-h-screen w-full bg-slate-900 overflow-hidden flex items-end p-8 sm:p-12 lg:p-16">
        <Image
          src="/images/signin.jpg"
          alt={t("medicalStaffAlt")}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center opacity-85"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        <div className="relative z-10 max-w-lg text-white space-y-3">
          {/* Trusted & Secure */}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-200 bg-white/10 border border-white/20 rounded-full px-3 py-1">
            <HeartPulse className="w-3 h-3" />
            {t("trustedSecure")}
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            {t("empoweringHealthcareJourney")}
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed opacity-90">
            {t("healthcareJourneyDescription")}
          </p>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-md space-y-6">

          {/* Header */}
          <div className="space-y-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0f5454]">
              <HeartPulse className="w-4 h-4 text-white" />
            </span>

            <h2 className="text-2xl font-bold text-[#0f3d3e] leading-snug">
              {t("findCareFamilyDeserves")}
            </h2>

            <p className="text-slate-500 text-xs leading-relaxed">
              {t("joinNurseConnectDescription")}
            </p>
          </div>

          {/* Form Card */}
          <div className="space-y-4">

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 text-xs text-red-700 bg-red-100 border border-red-200 rounded-xl text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* First / Last Name */}
              <div className="grid grid-cols-2 gap-3">

                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium text-slate-600">
                    {t("firstName")}
                  </label>

                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t("firstNamePlaceholder")}
                    className="w-full px-3.5 py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium text-slate-600">
                    {t("lastName")}
                  </label>

                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t("lastNamePlaceholder")}
                    className="w-full px-3.5 py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-slate-600">
                  {t("emailAddress")}
                </label>

                <div className="relative">
                  <div
                    className={`absolute inset-y-0 ${dir === "rtl"
                        ? "right-0 pr-3.5"
                        : "left-0 pl-3.5"
                      } flex items-center pointer-events-none text-slate-400`}
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className={`w-full ${dir === "rtl"
                        ? "pr-10 pl-4"
                        : "pl-10 pr-4"
                      } py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-slate-600">
                  {t("phoneNumber")}
                </label>

                <div className="relative">
                  <div
                    className={`absolute inset-y-0 ${dir === "rtl"
                        ? "right-0 pr-3.5"
                        : "left-0 pl-3.5"
                      } flex items-center pointer-events-none text-slate-400`}
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
                        d="M3 5a2 2 0 012-2h2.28a1 1 0 01.97.76l1.1 4.39a1 1 0 01-.27.95l-1.5 1.5a11 11 0 005.5 5.5l1.5-1.5a1 1 0 01.95-.27l4.39 1.1a1 1 0 01.76.97V19a2 2 0 01-2 2h-1C9.16 21 3 14.84 3 7V5z"
                      />
                    </svg>
                  </div>

                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("phonePlaceholder")}
                    dir="ltr"
                    className={`w-full ${dir === "rtl"
                        ? "pr-10 pl-4"
                        : "pl-10 pr-4"
                      } py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-slate-600">
                  {t("password")}
                </label>

                <div className="relative">
                  <div
                    className={`absolute inset-y-0 ${dir === "rtl"
                        ? "right-0 pr-3.5"
                        : "left-0 pl-3.5"
                      } flex items-center pointer-events-none text-slate-400`}
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className={`w-full ${dir === "rtl"
                        ? "pr-10 pl-10"
                        : "pl-10 pr-10"
                      } py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 ${dir === "rtl"
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
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0f5454] hover:bg-[#0b4242] disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-colors shadow-sm mt-2 flex items-center justify-center gap-2"
              >
                {loading
                  ? t("creatingAccount")
                  : t("createPatientAccount")}

                {!loading && (
                  <svg
                    className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""
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
            </form>

            {/* Secure & Private Notice */}
            <div className="bg-[#e8f8f8] border border-[#d2f0f0] rounded-xl p-3.5 flex items-start gap-2.5">

              <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-[#0d7c7b] flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-700">
                  {t("securePrivate")}
                </span>{" "}
                {t("securePrivateDescription")}
              </p>

            </div>

            {/* Sign In */}
            <p className="text-center text-xs text-slate-500">
              {t("alreadyHaveAccount")}{" "}

              <a
                href="/Sign-in"
                className="font-semibold text-[#0d7c7b] hover:underline"
              >
                {t("signIn")}
              </a>
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}