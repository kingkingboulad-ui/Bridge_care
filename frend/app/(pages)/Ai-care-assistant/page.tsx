"use client";

import React, { useState } from "react";
import axios from "axios";
import HeaderSection from "../../../components/sections/HeaderSection";
import CareAssistantForm from "../../../components/sections/CareAssistantForm";
import ResultsPlaceholder from "../../../components/sections/ResultsPlaceholder";

export interface AIAnalysis {
  assessment: string;
  careType: string;
  urgencyLevel: string;
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
}

export default function AICareAssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] =
    useState<AnalysisResponse | null>(null);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/care-assistant`,
        { prompt }
      );

      if (res.data.success) {
        setResult({
          analysis: res.data.analysis,
          nurse: res.data.nurse,
        });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to analyze condition, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <HeaderSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <CareAssistantForm
            prompt={prompt}
            setPrompt={setPrompt}
            loading={loading}
            error={error}
            onAnalyze={handleAnalyze}
          />

          <ResultsPlaceholder
            loading={loading}
            result={result}
          />
        </div>
      </div>
    </main>
  );
}