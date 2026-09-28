"use client";

import axios from "axios";
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

type LoginType = "patient" | "nurse";

export default function SignInPage() {
  const { t, dir } = useLanguage();

  const [loginType, setLoginType] = useState<LoginType>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 1. Normal login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
          role: loginType,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        const user = res.data?.user;

        if (user?.role === "admin") {
          window.location.href = "/admin";
        } else if (user?.role === "nurse") {
          window.location.href = "/profile";
        } else {
          window.location.href = "/";
        }
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        t("loginError");

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Google login
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setErrorMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          credential: credentialResponse.credential,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        const user = res.data?.user;

        if (user?.role === "admin") {
          window.location.href = "/admin";
        } else if (user?.role === "nurse") {
          window.location.href = "/profile";
        } else {
          window.location.href = "/";
        }
      }
    } catch (error: any) {
      console.error("Google login error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          t("googleLoginFailed")
      );
    }
  };

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#f8fafc] flex flex-col"
    >
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative min-h-[320px] lg:min-h-full w-full bg-slate-900 overflow-hidden flex items-end p-8 sm:p-12 lg:p-16">

          <Image
            src="/images/signin.jpg"
            alt={t("medicalStaffAlt")}
            fill
            priority
            className="object-cover object-center opacity-85"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          <div className="relative z-10 max-w-lg text-white">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3">
              {t("compassionateCareTitle")}
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed opacity-90">
              {t("compassionateCareDescription")}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-[#f5fafa]">

          <div className="w-full max-w-md space-y-6">

            {/* HEADER */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#0f3d3e]">
                {t("welcomeBack")}
              </h2>

              <p className="text-slate-500 text-xs mt-1">
                {t("pleaseSignIn")}
              </p>
            </div>

            {/* PATIENT / NURSE TOGGLE */}
            <div className="grid grid-cols-2 bg-[#e8f8f8] rounded-xl p-1">

              <button
                type="button"
                onClick={() => setLoginType("patient")}
                className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
                  loginType === "patient"
                    ? "bg-[#0f5454] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {t("patientLogin")}
              </button>

              <button
                type="button"
                onClick={() => setLoginType("nurse")}
                className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
                  loginType === "nurse"
                    ? "bg-[#0f5454] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {t("nurseLogin")}
              </button>

            </div>

            {/* FORM CARD */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">

              {/* ERROR */}
              {errorMessage && (
                <div className="p-3 text-xs text-red-700 bg-red-100 border border-red-200 rounded-xl text-center">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* EMAIL */}
                <div className="space-y-1.5">

                  <label className="block text-[11px] font-medium text-slate-600">
                    {t("emailAddress")}
                  </label>

                  <div className="relative">

                    <div
                      className={`absolute inset-y-0 ${
                        dir === "rtl"
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
                      className={`w-full ${
                        dir === "rtl"
                          ? "pr-10 pl-4"
                          : "pl-10 pr-4"
                      } py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all`}
                    />

                  </div>
                </div>

                {/* PASSWORD */}
                <div className="space-y-1.5">

                  <div className="flex items-center justify-between">

                    <label className="block text-[11px] font-medium text-slate-600">
                      {t("password")}
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-medium text-[#0d7c7b] hover:underline"
                    >
                      {t("forgotPassword")}
                    </Link>

                  </div>

                  <div className="relative">

                    <div
                      className={`absolute inset-y-0 ${
                        dir === "rtl"
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
                      className={`w-full ${
                        dir === "rtl"
                          ? "pr-10 pl-10"
                          : "pl-10 pr-10"
                      } py-2.5 bg-[#e8f8f8] border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d7c7b] transition-all`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>

                  </div>
                </div>

                {/* REMEMBER ME */}
                <div className="flex items-center gap-2 pt-1">

                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-slate-300 text-[#0d7c7b] focus:ring-[#0d7c7b] cursor-pointer"
                  />

                  <label
                    htmlFor="remember"
                    className="text-xs text-slate-600 cursor-pointer select-none"
                  >
                    {t("rememberMe")}
                  </label>

                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#0f5454] hover:bg-[#0b4242] disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-colors shadow-sm mt-2"
                >
                  {loading
                    ? t("signingIn")
                    : t("signIn")}
                </button>

              </form>

              {/* DIVIDER */}
              <div className="relative my-4">

                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>

                <div className="relative flex justify-center text-[10px] text-slate-400 uppercase">
                  <span className="bg-white px-2">
                    {t("orContinueWith")}
                  </span>
                </div>

              </div>

              {/* GOOGLE LOGIN */}
              <div className="flex justify-center w-full">

                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    setErrorMessage(
                      t("googleLoginUnavailable")
                    )
                  }
                  theme="outline"
                  shape="pill"
                  text="continue_with"
                  width="100%"
                />

              </div>

            </div>

            {/* BOTTOM BANNER */}
            <div className="bg-[#e8f8f8] border border-[#d2f0f0] rounded-xl p-3.5 text-center">

              {loginType === "patient" ? (
                <p className="text-xs text-slate-600">

                  {t("dontHaveAccount")}{" "}

                  <a
                    href="/Sign-Up"
                    className="font-semibold text-[#0d7c7b] hover:underline"
                  >
                    {t("createAccount")}
                  </a>

                </p>
              ) : (
                <p className="text-xs text-slate-600">

                  {t("wantToJoinNetwork")}{" "}

                  <a
                    href="/join-as-a-nurse"
                    className="font-semibold text-[#0d7c7b] hover:underline"
                  >
                    {t("joinAsNurse")}
                  </a>

                </p>
              )}

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}