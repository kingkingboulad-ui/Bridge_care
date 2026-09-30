
"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function ResetPasswordForm() {
  const { t, dir } = useLanguage();

  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg(t("passwordsDoNotMatch"));
      return;
    }

    if (password.length < 6) {
      setErrorMsg(t("passwordMinLength"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);

        setTimeout(() => {
          router.push("/Sign-in");
        }, 3000);
      } else {
        setErrorMsg(data.message || t("invalidResetLink"));
      }
    } catch {
      setErrorMsg(t("failedToConnect"));
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div
        dir={dir}
        className="text-center space-y-3"
      >
        <p className="text-red-500 font-semibold text-sm">
          {t("invalidMissingToken")}
        </p>

        <Link
          href="/forgot-password"
          className="text-xs text-[#00535B] underline"
        >
          {t("requestNewLink")}
        </Link>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className="bg-white max-w-md w-full p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
    >
      {success ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            {t("passwordReset")}
          </h2>

          <p className="text-sm text-slate-500">
            {t("passwordResetSuccess")}
          </p>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t("setNewPassword")}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {t("setNewPasswordDescription")}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            {/* New Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                {t("newPassword")}
              </label>

              <div className="relative">
                <Lock
                  className={`w-4 h-4 text-slate-400 absolute top-3.5 pointer-events-none ${
                    dir === "rtl" ? "right-3" : "left-3"
                  }`}
                />

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00535B] ${
                    dir === "rtl"
                      ? "pr-9 pl-4"
                      : "pl-9 pr-4"
                  }`}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                {t("confirmPassword")}
              </label>

              <div className="relative">
                <Lock
                  className={`w-4 h-4 text-slate-400 absolute top-3.5 pointer-events-none ${
                    dir === "rtl" ? "right-3" : "left-3"
                  }`}
                />

                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00535B] ${
                    dir === "rtl"
                      ? "pr-9 pl-4"
                      : "pl-9 pr-4"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#00535B] hover:bg-[#003d42] text-white font-semibold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t("updatePassword")
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#EDFCFF] flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-slate-400 text-sm">
            {t("loading")}
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
