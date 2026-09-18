"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Navigation,
  Bus,
  ArrowLeftRight,
  Footprints,
  Star,
  Share2,
  Download,
  Home,
  Sparkles,
} from "lucide-react";

// =========================================================================
// JOURNEY SUMMARY DATA (would normally come from the completed trip state)
// =========================================================================

interface JourneySummary {
  origin: string;
  destination: string;
  totalTimeMinutes: number;
  distanceKm: number;
  transportUsed: { mode: string; label: string }[];
  transfers: number;
  walkingDistanceMeters: number;
  fare: number;
}

const JOURNEY: JourneySummary = {
  origin: "Makumbura (MMC) Terminal",
  destination: "Kadawatha Multimodal Hub",
  totalTimeMinutes: 47,
  distanceKm: 24.8,
  transportUsed: [
    { mode: "bus", label: "SmartMetro CM01" },
    { mode: "rail", label: "SkyRail Line 02" },
  ],
  transfers: 1,
  walkingDistanceMeters: 420,
  fare: 210,
};

const FEEDBACK_TAGS = [
  "On time",
  "Clean vehicle",
  "Friendly driver",
  "Easy transfer",
  "Comfortable seat",
  "Good value",
];

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
}

export default function JourneyCompletePage() {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDone = () => {
    setSubmitted(true);
  };

  const isHovering = hoverRating > 0;
  const displayRating = isHovering ? hoverRating : rating;
  const ratingLabel = RATING_LABELS[displayRating];
  const ratingLabelColorClass = isHovering ? "text-[#F59E0B]" : "text-[#72222B]";

  const stats = [
    {
      icon: Clock,
      label: "Total Journey Time",
      value: formatDuration(JOURNEY.totalTimeMinutes),
    },
    {
      icon: Navigation,
      label: "Distance",
      value: `${JOURNEY.distanceKm} km`,
    },
    {
      icon: Bus,
      label: "Transport Used",
      value: JOURNEY.transportUsed.map((t) => t.label).join(" + "),
    },
    {
      icon: ArrowLeftRight,
      label: "Transfers",
      value: `${JOURNEY.transfers} ${JOURNEY.transfers === 1 ? "Transfer" : "Transfers"}`,
    },
    {
      icon: Footprints,
      label: "Walking Distance",
      value:
        JOURNEY.walkingDistanceMeters >= 1000
          ? `${(JOURNEY.walkingDistanceMeters / 1000).toFixed(1)} km`
          : `${JOURNEY.walkingDistanceMeters} m`,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F7F8FA] text-[#0F172A] flex items-center justify-center px-4 sm:px-6 lg:px-10 pt-24 pb-10 lg:pt-28 lg:pb-12">
      <div className="w-full max-w-<number> grid grid-cols-1 gap-6">
        {/* ===================================================================== */}
        {/* CELEBRATORY HEADER                                                     */}
        {/* ===================================================================== */}
        <div className="bg-white rounded-3xl border border-[#D6DAE3] p-7 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(114,34,43,0.04)] text-center space-y-4">
          <div className="mx-auto w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
            <CheckCircle2 size={34} className="text-[#22C55E] lg:w-11 lg:h-11" strokeWidth={2} />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#72222B]/5 text-[#72222B] text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles size={12} />
              <span>Journey Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0F172A]">
              You&apos;ve arrived 🎉
            </h1>
            <p className="text-sm lg:text-base text-[#5A6B85] text-bold" >
              {JOURNEY.origin.split(" ")[0]} to {JOURNEY.destination.split(" ")[0]}
            </p>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* TRIP SUMMARY STATS                                                     */}
        {/* ===================================================================== */}
        <div className="bg-white rounded-3xl border border-[#D6DAE3] p-6 sm:p-7 lg:p-8 shadow-[0_4px_20px_rgba(85,0,0,0.06)] space-y-5">
          <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wide">
            Trip Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#D6DAE3]/60 flex flex-col gap-2"
                >
                  <Icon size={18} className="text-[#72222B]" strokeWidth={1.75} />
                  <div>
                    <div className="text-[10px] font-bold text-[#5A6B85] uppercase tracking-wide">
                      {stat.label}
                    </div>
                    <div className="text-sm font-extrabold text-[#0F172A] mt-0.5 leading-snug">
                      {stat.value}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Fare card fills the grid nicely and echoes the TapPass style used elsewhere */}
            <div className="p-4 rounded-2xl bg-[#0F172A] text-white flex flex-col gap-2 justify-center">
              <div className="text-[10px] font-bold text-[#D6DAE3] uppercase tracking-wide">
                Fare Charged
              </div>
              <div className="text-lg font-black">LKR {JOURNEY.fare}.00</div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RATING & FEEDBACK                                                      */}
        {/* ===================================================================== */}
        {!submitted ? (
            <div className="bg-white rounded-3xl border border-[#D6DAE3] p-6 sm:p-7 lg:p-9 shadow-[0_4px_20px_rgba(85,0,0,0.06)] space-y-5">
              <div className="space-y-1">
                <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wide">
                  Rate Your Trip
                </h2>
                <p className="text-xs text-[#5A6B85]">
                  Your feedback helps improve service on this route.
                </p>
              </div>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 lg:gap-3 py-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= displayRating;

                const starColorClass = isFilled
                  ? "text-[#F59E0B] fill-[#F59E0B]"
                  : "text-[#D6DAE3] fill-[#D6DAE3]";

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="cursor-pointer transition-transform active:scale-90 hover:scale-110"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      size={28}
                      className={starColorClass}
                    />
                  </button>
                );
              })}
            </div>

            {/* Rating Label */}
            {displayRating > 0 && (
              <p className="text-center text-xs font-bold -mt-3 text-[#F59E0B]">
                {ratingLabel}
              </p>
            )}

              {/* Quick Feedback Tags */}
              <div className="flex flex-wrap gap-2 justify-center">
                {FEEDBACK_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#0F172A] text-white border-[#72222B]"
                          : "bg-[#F7F8FA] text-[#5A6B85] border-[#D6DAE3] hover:border-[#72222B] hover:text-[#0F172A]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Optional Comment */}
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add a comment (optional)..."
                rows={3}
                className="w-full p-3.5 rounded-2xl border border-[#D6DAE3] bg-[#F7F8FA] text-xs font-semibold text-[#0F172A] placeholder:text-[#5A6B85]/70 focus:outline-none focus:border-[#72222B] focus:bg-white transition-all resize-none"
              />

              {/* Done Button */}
              <div className="flex justify-center">
              <button
                type="button"
                onClick={handleDone}
                className="w-full max-w-64 mx-auto flex justify-center py-3.5 rounded-2xl bg-[#72222B] hover:bg-[#5B1B22] text-white font-extrabold text-sm transition-all cursor-pointer shadow-[0_6px_18px_rgba(114,34,43,0.25)] active:scale-[0.99]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ===================================================================== */
          /* POST-SUBMIT CONFIRMATION                                               */
          /* ===================================================================== */
          <div className="bg-white rounded-3xl border border-[#D6DAE3] p-7 sm:p-10 shadow-[0_4px_20px_rgba(85,0,0,0.06)] text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-[#72222B]/10 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-[#72222B]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0F172A]">Thanks for riding NEXA</h3>
              <p className="text-xs text-[#5A6B85]">
                {rating > 0
                  ? "Your rating has been submitted."
                  : "Have a great day ahead."}
              </p>
            </div>

            <div className="flex justify-center flex flex-col sm:flex-row gap-2.5 pt-2 w-full ">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <Link
                  href="/"
                  className="w-[90%] sm:w-64 py-3 rounded-2xl bg-[#72222B] hover:bg-[#5B1B22] text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Home size={16} />
                  <span>Back to Home</span>
                </Link>

                <button
                  type="button"
                  onClick={() => alert("Receipt downloaded.")}
                  className="w-[90%] sm:w-64 py-3 rounded-2xl bg-white border border-[#D6DAE3] hover:border-[#72222B] text-[#0F172A] font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={16} />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Journey (subtle secondary action) */}
        {!submitted && (
          <button
            type="button"
            onClick={() => alert("Journey summary link copied.")}
            className="w-[80%] sm:w-auto sm:min-w-56 mx-auto py-3 px-6 rounded-2xl bg-white border border-[#D6DAE3] hover:border-[#72222B] text-[#5A6B85] hover:text-[#0F172A] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 size={14} />
            <span>Share Journey Summary</span>
          </button>
        )}
      </div>
    </div>
  );
}
