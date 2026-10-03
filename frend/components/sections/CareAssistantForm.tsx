"use client";

import React, { useState, useEffect, useRef } from "react";//useRef bte7tfez bel 2imeh bs bala ma te3mel re-render 
import {
  Sparkles,
  AlertCircle,
  Loader2,
  Mic,
  MicOff,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const examples = [
  {
    en: "My mother is 75 and needs help with medication, walking, and daily activities after her hip surgery.",
    ar: "والدتي تبلغ من العمر 75 عامًا وتحتاج إلى المساعدة في تناول الأدوية والمشي والأنشطة اليومية بعد عملية الورك.",
  },
  {
    en: "I have MS and need daily support with personal care and mobility assistance.",
    ar: "أعاني من مرض التصلب المتعدد وأحتاج إلى دعم يومي في العناية الشخصية والمساعدة على الحركة.",
  },
  {
    en: "My father has Alzheimer's and needs full-time care and companionship.",
    ar: "والدي مصاب بمرض الزهايمر ويحتاج إلى رعاية بدوام كامل ومرافقة.",
  },
  {
    en: "I am recovering from knee surgery and need temporary nursing assistance for 3 weeks.",
    ar: "أتعافى من عملية في الركبة وأحتاج إلى مساعدة تمريضية مؤقتة لمدة 3 أسابيع.",
  },
];

interface CareAssistantFormProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  error: string | null;
  onAnalyze: () => void;
}

export default function CareAssistantForm({
  prompt,
  setPrompt,
  loading,
  error,
  onAnalyze,
}: CareAssistantFormProps) {
  const { t, lang } = useLanguage();

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    // Change speech recognition language based on selected language
    recognition.lang = lang === "ar" ? "ar-LB" : "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        currentTranscript += event.results[i][0].transcript;
      }

      setPrompt((prev: string) => {
        const separator =
          prev && !prev.endsWith(" ") ? " " : "";

        return `${prev}${separator}${currentTranscript}`;
      });
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "not-allowed") {
        setSpeechError(t("microphonePermissionDenied"));
      } else {
        setSpeechError(t("voiceCaptureError"));
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [setPrompt, lang, t]);

  const toggleListening = () => {
    if (!speechSupported) {
      alert(t("speechRecognitionNotSupported"));
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);

      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleExampleClick = (text: string) => {
    setPrompt(text);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      onAnalyze();
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden border-t-4 border-t-[#0d7c7b]">
        <div className="p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {t("describeTheSituation")}
            </label>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              title={
                isListening
                  ? t("stopRecording")
                  : t("startVoiceInput")
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all border shadow-2xs ${
                isListening
                  ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {isListening ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>

                  <MicOff className="w-3.5 h-3.5" />

                  <span>{t("listening")}</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#0d7c7b]" />

                  <span>{t("voiceInput")}</span>
                </>
              )}
            </button>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("careAssistantPlaceholder")}
            rows={6}
            className="w-full text-slate-700 text-sm placeholder-slate-300 resize-none focus:outline-none bg-transparent"
          />
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50/70 border-t border-slate-100 px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            ⌘ Ctrl + Enter {t("toAnalyze")}
          </span>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={loading || !prompt.trim()}
            className="inline-flex items-center gap-1.5 bg-[#e6f4f4] hover:bg-[#d5eded] text-[#0d7c7b] px-4 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 shadow-2xs"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}

            <span>
              {loading
                ? t("analyzing")
                : t("analyzeNeeds")}
            </span>
          </button>
        </div>
      </div>

      {/* Voice Recognition Error Alert */}
      {speechError && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />

          <span>{speechError}</span>
        </div>
      )}

      {/* API / Server Error Alert */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />

          <span>{error}</span>
        </div>
      )}

      {/* Try An Example Section */}
      <div>
        <h3 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-3">
          {t("tryAnExample")}
        </h3>

        <div className="space-y-2.5">
          {examples.map((item, index) => {
            const exampleText =
              lang === "ar" ? item.ar : item.en;

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(exampleText)}
                className="w-full text-left bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 transition-all text-xs text-slate-600 hover:text-slate-900 flex items-start gap-2.5 shadow-sm hover:shadow"
              >
                <svg
                  className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>

                <span>{exampleText}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}