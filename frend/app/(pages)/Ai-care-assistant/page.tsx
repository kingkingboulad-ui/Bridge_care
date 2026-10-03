"use client";

import React, { useState } from "react";
import axios from "axios";
import HeaderSection from "../../../components/sections/HeaderSection";
import CareAssistantForm from "../../../components/sections/CareAssistantForm";
import ResultsPlaceholder from "../../../components/sections/ResultsPlaceholder";

export interface AIAnalysis {
  assessment: string;//analyis lal status 
  careType: string;
  urgencyLevel: string;//low meduim high 
  keyRecommendations: string[];//array of string mumkn ykun hk 
//[
//  "Monitor blood pressure",
//  "Give medication",
// "Help with mobility"
//]
  recommendedNurseId: number;
  matchReason: string;//lech hal nurse munsebeh la hal haleh  
}
//chakel mumarda li ha trja3 mn backend 
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
  const [loading, setLoading] = useState(false);//false by default mafi rquest bs tkun true fi req 
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] =useState<AnalysisResponse | null>(null);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;//eza mafi prompt e3mel return 

    try {
		//abel ma neb3at req mne2ul talab balach 
		//fa CareAssistantForm bi8ayer chakel analyze la analyzing ...
      setLoading(true);
      setError(null);
     //aam neb3at req lal backend 
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/care-assistant`,
        { prompt }
      );
//eza natijeh nejhet 7afezun bi alba 
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