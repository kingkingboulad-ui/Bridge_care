"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ForgotPasswordPage() {
  const { t, dir } = useLanguage();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || t("somethingWentWrong"));
      }
    } catch {
      setErrorMsg(t("failedToConnect"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#EDFCFF] flex items-center justify-center p-4"
    >
      <div className="bg-white max-w-md w-full p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">

        <Link
          href="/Sign-in"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#00535B] hover:underline"
        >
          <ArrowLeft size={16} />
          {t("backToLogin")}
        </Link>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              {t("checkYourEmail")}
            </h2>

            <p className="text-sm text-slate-500 leading-relaxed">
              {t("resetEmailSent")}{" "}
              <strong className="text-slate-700">{email}</strong>{" "}
              {t("exists")}
            </p>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {t("forgotPassword")}
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                {t("forgotPasswordDescription")}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  {t("emailAddress")}
                </label>

                <div className="relative">
                  <Mail
                    className={`w-4 h-4 text-slate-400 absolute top-3.5 pointer-events-none ${
                      dir === "rtl" ? "right-3" : "left-3"
                    }`}
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
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
                  t("sendResetLink")
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
