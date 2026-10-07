"use client";

import React, { useState } from "react";
import {
  MapPin,
  Star,
  CheckCircle2,
  Loader2,
  FileText,
  ArrowRight,
  X,
  ExternalLink,
  ShieldAlert,
  Activity,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

// واجهات البيانات المحدثة لتطابق الـ Backend
export interface AIAnalysis {
  assessment: string;
  careType: string;
  urgencyLevel: string;
  isEmergency?: boolean;
  vitalsToMonitor?: string[];
  keyRecommendations: string[];
  recommendedNurseId: number;
  matchReason: string;
}

export interface NurseData {
  id: number;
  full_name: string;
  specialization: string;
  experience: string;
  location: string;
  price: number;
  rating: number;
  image?: string;
  cv_file?: string;
  categories?: string;
}

export interface AnalysisResponse {
  analysis: AIAnalysis;
  nurse: NurseData;
  backupNurse?: NurseData | null;
}

interface ResultsPlaceholderProps {
  loading: boolean;
  result: AnalysisResponse | null;
}

export default function ResultsPlaceholder({
  loading,
  result,
}: ResultsPlaceholderProps) {
  const { t } = useLanguage();

  const [activeCvUrl, setActiveCvUrl] = useState<string | null>(null);
  const [activeCvNurseName, setActiveCvNurseName] =
    useState<string>("");

  // =========================
  // Loading State
  // =========================
  if (loading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 min-h-[420px] flex flex-col items-center justify-center text-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0d7c7b]" />

        <h3 className="text-sm font-bold text-slate-800">
          {t("aiClinicalTriage")}
        </h3>

        <p className="text-xs text-slate-400 max-w-xs">
          {t("aiClinicalTriageDescription")}
        </p>
      </div>
    );
  }

  // =========================
  // Empty State
  // =========================
  if (!result) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#eef2ff] text-[#4f46e5] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2 className="text-sm font-bold text-slate-800 mb-1.5">
          {t("aiResultsWillAppearHere")}
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
          {t("aiResultsDescription")}
        </p>
      </div>
    );
  }

  // =========================
  // CV URL Helper
  // =========================
  const getCleanCvUrl = (path?: string | null) => {
    if (!path || path.trim() === "") {
      return null;
    }
    return path.startsWith("http")
    ? path
    : `${process.env.NEXT_PUBLIC_API_URL}/${path.replace(/^\/+/, "")}`;
  };

  const primaryCvUrl = getCleanCvUrl(result.nurse.cv_file);
  const backupCvUrl = getCleanCvUrl(result.backupNurse?.cv_file);

  const isCvImage = activeCvUrl
    ? /\.(jpg|jpeg|png|webp)$/i.test(activeCvUrl)
    : false;

  // =========================
  // Results
  // =========================
  return (
    <div className="space-y-4">

      {/* =========================
          Emergency Alert
      ========================= */}
      {result.analysis.isEmergency && (
        <div className="p-4 bg-rose-600 text-white rounded-2xl shadow-md space-y-1.5 animate-pulse">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />

            <span>{t("urgentMedicalAttention")}</span>
          </div>

          <p className="text-xs text-rose-100 leading-relaxed">
            {t("urgentMedicalAttentionDescription")}
          </p>
        </div>
      )}

      {/* =========================
          Care Assessment
      ========================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">

        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-[#0d7c7b] uppercase tracking-wider">
            {t("careProtocol")}: {result.analysis.careType}
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              result.analysis.urgencyLevel
                .toLowerCase()
                .includes("emergency") ||
              result.analysis.urgencyLevel
                .toLowerCase()
                .includes("high")
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {t("priority")}: {result.analysis.urgencyLevel}
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {result.analysis.assessment}
        </p>

        {/* =========================
            Vital Signs
        ========================= */}
        {result.analysis.vitalsToMonitor &&
          result.analysis.vitalsToMonitor.length > 0 && (
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">

              <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-700" />

                <span>
                  {t("criticalParametersToMonitor")}:
                </span>
              </p>

              <div className="flex flex-wrap gap-1.5">
                {result.analysis.vitalsToMonitor.map(
                  (vital, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-amber-900 border border-amber-200 text-[11px] px-2.5 py-0.5 rounded-lg font-medium shadow-2xs"
                    >
                      {vital}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

        {/* =========================
            Recommendations
        ========================= */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">

          <p className="text-[11px] font-bold text-slate-500 mb-1.5">
            {t("immediateActionSteps")}:
          </p>

          <ul className="space-y-1">
            {result.analysis.keyRecommendations.map(
              (rec, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-600 flex items-start gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0d7c7b] shrink-0 mt-0.5" />

                  <span>{rec}</span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* =========================
          Primary Recommended Nurse
      ========================= */}
      <div className="bg-white border border-teal-200 rounded-2xl p-5 shadow-sm space-y-4 border-l-4 border-l-[#0d7c7b]">

        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {t("primaryRecommendedNurse")}:
          </span>

          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            {result.analysis.matchReason}
          </p>
        </div>

        {/* Nurse Information */}
        <div className="flex items-center gap-3.5 pt-1">

          <Image
            src={
              result.nurse.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                result.nurse.full_name
              )}&background=0d7c7b&color=fff`
            }
            alt={result.nurse.full_name}
            width={56}
            height={56}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
          />

          <div className="flex-1">

            <h4 className="text-sm font-bold text-slate-900">
              {result.nurse.full_name}
            </h4>

            <p className="text-xs font-semibold text-[#0d7c7b]">
              {result.nurse.specialization}
            </p>

            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">

              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {result.nurse.location}
              </span>

              <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                <Star className="w-3 h-3 fill-amber-400" />
                {result.nurse.rating || 5.0}
              </span>

              <span className="font-bold text-slate-800">
                ${result.nurse.price}/hr
              </span>

            </div>
          </div>
        </div>

        {/* =========================
            Action Buttons
        ========================= */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">

          {/* View CV */}
          {primaryCvUrl ? (
            <button
              type="button"
              onClick={() => {
                setActiveCvUrl(primaryCvUrl);
                setActiveCvNurseName(
                  result.nurse.full_name
                );
              }}
              className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#0d7c7b]" />

              <span>{t("viewNurseCV")}</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-400 px-3 py-1">
              {t("noCVAvailable")}
            </span>
          )}

          {/* Book Appointment */}
          <Link
            href={`/book?nurseId=${result.nurse.id}`}
            className="flex-1 py-2 px-3 bg-[#0d7c7b] hover:bg-[#095f5e] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>{t("bookAppointment")}</span>

            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* =========================
          Backup Nurse
      ========================= */}
      {result.backupNurse &&
        result.backupNurse.id !== result.nurse.id && (
          <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">

            <div className="flex items-center justify-between">

              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">

                <UserCheck className="w-3.5 h-3.5 text-slate-400" />

                {t("secondaryAlternativeMatch")}:
              </span>

              <span className="text-xs font-bold text-slate-700">
                ${result.backupNurse.price}/hr
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">

              <div>
                <p className="text-xs font-bold text-slate-800">
                  {result.backupNurse.full_name}
                </p>

                <p className="text-[11px] text-slate-500">
                  {result.backupNurse.specialization} •{" "}
                  {result.backupNurse.location}
                </p>
              </div>

              <div className="flex items-center gap-2">

                {/* Backup CV */}
                {backupCvUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCvUrl(backupCvUrl);
                      setActiveCvNurseName(
                        result.backupNurse!.full_name
                      );
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg text-xs"
                    title={t("viewAlternateCV")}
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Select Backup */}
                <Link
                  href={`/book-appointment?nurseId=${result.backupNurse.id}`}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
                >
                  {t("selectBackup")}
                </Link>

              </div>
            </div>
          </div>
        )}

      {/* =========================
          CV Modal
      ========================= */}
      {activeCvUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">

          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">

            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">

              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {activeCvNurseName} — {t("cv")}
                </h4>

                <p className="text-[11px] text-slate-500">
                  {t("officialRegisteredCredentials")}
                </p>
              </div>

              <div className="flex items-center gap-2">

                {/* Open CV */}
                <a
                  href={activeCvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />

                  {t("open")}
                </a>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setActiveCvUrl(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl"
                  title={t("close")}
                >
                  <X className="w-5 h-5" />
                </button>

              </div>
            </div>

            {/* CV Content */}
            <div className="flex-1 bg-slate-100 p-3 overflow-auto flex items-center justify-center">

              {isCvImage ? (
                <img
                  src={activeCvUrl}
                  alt={t("nurseCV")}
                  className="max-h-full max-w-full rounded-xl object-contain shadow bg-white"
                />
              ) : (
                <iframe
                  src={activeCvUrl}
                  title={t("nurseCV")}
                  className="w-full h-full rounded-xl border border-slate-200 bg-white"
                />
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}