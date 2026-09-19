"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  CheckCircle2,
} from "lucide-react";
import { AuthGuard, useAuth } from "../context/auth";

const QUICK_TAGS = [
  "On-Time Synchronized Transit",
  "Smooth Step-Free Boarding",
  "Clean & Spacious Cabin",
  "Helpful Audio Navigation",
  "Fast SkyRail Maglev",
];

function FeedbackContent() {
  const router = useRouter();
  const { updateJourney, resetJourney } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(["On-Time Synchronized Transit"]);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDone = () => {
    updateJourney({
      rating,
      feedback: comments,
    });
    setSubmitted(true);

    setTimeout(() => {
      resetJourney();
      router.push("/?feedback_submitted=true");
    }, 900);
  };

  const currentDisplayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto space-y-6">
      {/* Brand & Step Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#192841] bg-[#192841]/10 px-3 py-1 rounded-full">
          Step 4 of 4 • Rider Feedback
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
          How was your journey?
        </h1>
        <div className="u-accent-line w-14 mx-auto" />
        <p className="text-xs sm:text-sm text-[#64748B]">
          Your feedback helps Univa optimize routes and autonomous fleet dispatches.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-8 text-center space-y-4 shadow-sm animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center u-glow">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">Thank You!</h2>
          <p className="text-xs text-[#64748B]">
            Your review has been recorded. Returning to Home Dashboard...
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm space-y-6">
          {/* 1-5 Star Interactive Selector */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 cursor-pointer transition-transform hover:scale-115 focus:outline-none"
                  aria-label={`${star} star rating`}
                >
                  <Star
                    size={36}
                    className={`transition-colors ${
                      star <= currentDisplayRating
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="text-xs font-bold text-[#192841]">
              {currentDisplayRating === 5 && "Excellent • Synchronized & Seamless"}
              {currentDisplayRating === 4 && "Very Good • Minor delay"}
              {currentDisplayRating === 3 && "Average • Transit met expectations"}
              {currentDisplayRating === 2 && "Needs Improvement"}
              {currentDisplayRating === 1 && "Poor Experience"}
            </div>
          </div>

          {/* Quick Experience Tags */}
          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            <span className="text-xs font-bold text-[#64748B] block">
              What went well?
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? "bg-[#192841] text-white shadow-xs"
                        : "bg-[#F7F9FC] text-[#64748B] hover:bg-slate-100 border border-[#E2E8F0]"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Text Field (Section 29) */}
          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            <label className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider">
              Tell us what we could improve (Optional)
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell us what we could improve..."
              className="w-full p-4 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0] focus:border-[#192841] focus:bg-white text-xs sm:text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#64748B]/60"
            />
          </div>

          {/* Primary CTA: Done (Section 29) */}
          <button
            type="button"
            onClick={handleDone}
            className="w-full py-4 px-8 rounded-2xl bg-[#4F6EF7] hover:bg-[#3B4FE0] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Done</span>
            <CheckCircle2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <AuthGuard message="Please sign in or create an account to record your journey feedback.">
      <Suspense fallback={<div className="p-10 text-center text-sm font-semibold text-[#64748B]">Loading feedback form...</div>}>
        <FeedbackContent />
      </Suspense>
    </AuthGuard>
  );
}
