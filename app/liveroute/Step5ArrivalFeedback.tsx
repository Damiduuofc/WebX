"use client";

import React, { useState } from "react";
import {
  Star,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { JourneyOption, DEFAULT_JOURNEY_KDU_TO_AIRPORT } from "./journeyData";

interface Step5ArrivalFeedbackProps {
  journeyPlan?: JourneyOption;
  onDone: () => void;
  onPlanAnother: () => void;
}

export default function Step5ArrivalFeedback({
  journeyPlan = DEFAULT_JOURNEY_KDU_TO_AIRPORT,
  onDone,
  onPlanAnother,
}: Step5ArrivalFeedbackProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleDoneClick = () => {
    setSubmitted(true);
    setTimeout(() => {
      onDone();
    }, 800);
  };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Celebratory Hero Card */}
      <div className="text-center py-6 px-4 bg-[#F7F8FA] rounded-2xl border border-[#D6DAE3] space-y-2 shadow-xs">
        <span className="text-xs text-[#192841] font-bold uppercase tracking-wider block">
          Journey Completed
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
          You&apos;ve arrived!
        </h2>
        <p className="text-xs sm:text-sm text-[#5A6B85]">
          Welcome to <strong className="text-[#0F172A]">{journeyPlan.to}</strong>.
        </p>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-[#D6DAE3] text-center shadow-2xs">
          <span className="text-xs text-[#5A6B85] font-semibold block">Duration</span>
          <div className="text-lg font-extrabold text-[#0F172A] mt-0.5">{journeyPlan.totalDurationMins} min</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#D6DAE3] text-center shadow-2xs">
          <span className="text-xs text-[#5A6B85] font-semibold block">Distance</span>
          <div className="text-lg font-extrabold text-[#0F172A] mt-0.5">{journeyPlan.distanceKm} km</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#D6DAE3] text-center shadow-2xs">
          <span className="text-xs text-[#5A6B85] font-semibold block">Transfers</span>
          <div className="text-lg font-extrabold text-[#0F172A] mt-0.5">{journeyPlan.transfersCount}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#D6DAE3] text-center shadow-2xs">
          <span className="text-xs text-[#5A6B85] font-semibold block">Walking</span>
          <div className="text-lg font-extrabold text-[#0F172A] mt-0.5">{journeyPlan.walkingMins} min</div>
        </div>
      </div>

      {/* 5-Star Rating Card */}
      <div className="bg-white rounded-2xl border border-[#D6DAE3] p-5 text-center space-y-3 shadow-xs">
        <h3 className="text-sm font-bold text-[#0F172A]">
          How was your journey?
        </h3>

        {/* 5 Stars with amber gold glow */}
        <div className="flex items-center justify-center gap-2 py-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = (hoverRating !== null ? hoverRating : rating) >= star;
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => setRating(star)}
                className="p-1 cursor-pointer transition-transform duration-150 hover:scale-125"
              >
                <Star
                  size={28}
                  className={`transition-colors ${
                    active ? "text-[#F59E0B] fill-[#F59E0B] drop-shadow-sm" : "text-[#D6DAE3]"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Feedback Input */}
        <input
          type="text"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Tell us what we could improve (optional)..."
          className="w-full text-xs p-3.5 rounded-xl border border-[#D6DAE3] focus:border-[#192841] focus:ring-2 focus:ring-[#192841]/10 focus:outline-none bg-[#F7F8FA] placeholder:text-[#5A6B85]/60 text-[#0F172A] font-medium"
        />
      </div>

      {/* Action Buttons with website styling */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={onPlanAnother}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#F7F8FA] hover:bg-[#D6DAE3]/50 text-[#0F172A] border border-[#D6DAE3] text-sm font-bold transition-all cursor-pointer shadow-xs"
        >
          Plan Another Journey
        </button>

        <button
          type="button"
          onClick={handleDoneClick}
          className="relative group flex-1 w-full py-4 rounded-2xl bg-[#192841] hover:bg-[#111C2E] text-white font-bold text-sm sm:text-base transition-all duration-300 shadow-[0_8px_20px_-3px_rgba(25,40,65,0.35)] hover:shadow-[0_12px_26px_-3px_rgba(25,40,65,0.45)] hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer ring-2 ring-[#192841]/20 overflow-hidden"
        >
          {/* Dynamic Light Sweep Highlight on hover */}
          <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

          {submitted ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#22C55E]" />
              <span>Feedback Saved! Returning...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Done (Return to Home)</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
