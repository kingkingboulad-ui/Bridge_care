"use client";

import React, { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import axios from "axios";

interface RateNurseModalProps {
  nurseId: number;
  nurseName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newRating: number, newReviewsCount: number) => void;
}

export default function RateNurseModal({
  nurseId,
  nurseName,
  isOpen,
  onClose,
  onSuccess,
}: RateNurseModalProps) {
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/nurses/${nurseId}/rate`,
        { rating: selectedRating, comment },
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data.success) {
        if (onSuccess) {
          onSuccess(Number(res.data.rating), Number(res.data.reviews));
        }
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to submit rating. Please make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Rate <span className="text-[#00535B]">{nurseName}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
          
          {/* Stars Picker */}
          <div className="flex flex-col items-center justify-center gap-1 py-1">
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
                    className={`${
                      (hoveredRating || selectedRating) >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              {selectedRating} out of 5 stars
            </span>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">
              Feedback / Comment (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your experience with this nurse..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00535B] focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-[#00535B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#00737D] disabled:opacity-50"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <span>Submit Rating</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}