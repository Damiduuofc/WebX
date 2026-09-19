"use client";

import React, { useState, Suspense } from "react";
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
  PartyPopper,
} from "lucide-react";
import { AuthGuard, useAuth } from "../context/auth";

// =========================================================================
// JOURNEY SUMMARY DATA & PROTOTYPE DEFAULTS
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

const DEFAULT_JOURNEY: JourneySummary = {
  origin: "KDU, Ratmalana",
  destination: "Bandaranaike International Airport (BIA)",
  totalTimeMinutes: 42,
  distanceKm: 18.4,
  transportUsed: [
    { mode: "bus", label: "Autonomous Bus 245" },
    { mode: "rail", label: "SkyRail Line 02" },
    { mode: "pod", label: "Smart Road Pod" },
  ],
  transfers: 2,
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

function JourneyCompleteContent() {
  const { journey, updateJourney } = useAuth();

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Dynamic origin & destination from user journey state
  const origin = journey?.origin || DEFAULT_JOURNEY.origin;
  const destination = journey?.destination || DEFAULT_JOURNEY.destination;

  const currentJourney: JourneySummary = {
    ...DEFAULT_JOURNEY,
    origin,
    destination,
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDone = () => {
    updateJourney({
      rating,
      feedback: feedback || selectedTags.join(", "),
    });
    setSubmitted(true);
  };

  const isHovering = hoverRating > 0;
  const displayRating = isHovering ? hoverRating : rating;
  const ratingLabel = RATING_LABELS[displayRating];

  const stats = [
    {
      icon: Clock,
      label: "Total Journey Time",
      value: formatDuration(currentJourney.totalTimeMinutes),
    },
    {
      icon: Navigation,
      label: "Distance",
      value: `${currentJourney.distanceKm} km`,
    },
    {
      icon: Bus,
      label: "Transport Used",
      value: currentJourney.transportUsed.map((t) => t.label).join(" + "),
    },
    {
      icon: ArrowLeftRight,
      label: "Transfers",
      value: `${currentJourney.transfers} ${currentJourney.transfers === 1 ? "Transfer" : "Transfers"}`,
    },
    {
      icon: Footprints,
      label: "Walking Distance",
      value:
        currentJourney.walkingDistanceMeters >= 1000
          ? `${(currentJourney.walkingDistanceMeters / 1000).toFixed(1)} km`
          : `${currentJourney.walkingDistanceMeters} m`,
    },
  ];

  return (
    <div className="w-full min-h-screen text-[#0F172A] flex items-center justify-center px-4 sm:px-6 lg:px-10 pt-24 pb-12 lg:pt-28 lg:pb-16">
      <div className="w-full max-w-3xl grid grid-cols-1 gap-6">
        {/* ===================================================================== */}
        {/* CELEBRATORY HEADER                                                     */}
        {/* ===================================================================== */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-7 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(25,40,65,0.06)] text-center space-y-4 u-surface u-hud">
          <div className="mx-auto w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
            <CheckCircle2 size={34} className="text-[#22C55E] lg:w-11 lg:h-11" strokeWidth={2} />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#192841]/10 text-[#192841] text-[11px] font-extrabold uppercase tracking-wider u-mono">
              <span>Journey Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0F172A] u-title flex items-center justify-center gap-2.5">
              <span>You&apos;ve arrived!</span>
            </h1>
            <div className="u-accent-line w-16 mx-auto" />
            <p className="text-sm lg:text-base text-[#64748B] font-bold">
              {currentJourney.origin.split(",")[0]} to {currentJourney.destination.split(",")[0]}
            </p>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* TRIP SUMMARY STATS                                                     */}
        {/* ===================================================================== */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 lg:p-8 shadow-[0_4px_20px_rgba(25,40,65,0.06)] space-y-5 u-surface u-hud">
          <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wide">
            Trip Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0] flex flex-col gap-2"
                >
                  <Icon size={18} className="text-[#192841]" strokeWidth={1.75} />
                  <div>
                    <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide">
                      {stat.label}
                    </div>
                    <div className="text-sm font-extrabold text-[#0F172A] mt-0.5 leading-snug u-digital-num">
                      {stat.value}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Fare card with clean dark slate TapPass theme */}
            <div className="p-4 rounded-2xl bg-[#0F172A] text-white flex flex-col gap-2 justify-center shadow-xs">
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                Fare Charged
              </div>
              <div className="text-lg font-black u-digital-num">LKR {currentJourney.fare}.00</div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RATING & FEEDBACK                                                      */}
        {/* ===================================================================== */}
        {!submitted ? (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 lg:p-9 shadow-[0_4px_20px_rgba(25,40,65,0.06)] space-y-5 u-surface u-hud">
            <div className="space-y-1">
              <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wide">
                Rate Your Trip
              </h2>
              <p className="text-xs text-[#64748B]">
                Your feedback helps improve service on this route.
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 lg:gap-3 py-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= displayRating;

                const starColorClass = isFilled
                  ? "text-[#F59E0B] fill-[#F59E0B]"
                  : "text-[#E2E8F0] fill-[#E2E8F0]";

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
                    <Star size={28} className={starColorClass} />
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
                        ? "bg-[#192841] text-white border-[#192841]"
                        : "bg-[#F7F9FC] text-[#64748B] border-[#E2E8F0] hover:border-[#192841] hover:text-[#0F172A]"
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
              className="w-full p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] text-xs font-semibold text-[#0F172A] placeholder:text-[#64748B]/70 focus:outline-none focus:border-[#192841] focus:bg-white transition-all resize-none"
            />

            {/* Done Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleDone}
                className="w-full max-w-64 mx-auto flex justify-center py-3.5 rounded-2xl bg-[#192841] hover:bg-[#111C2E] u-btn text-white font-extrabold text-sm transition-all cursor-pointer shadow-[0_4px_16px_rgba(25,40,65,0.25)] active:scale-[0.99]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ===================================================================== */
          /* POST-SUBMIT CONFIRMATION                                               */
          /* ===================================================================== */
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-7 sm:p-10 shadow-[0_4px_20px_rgba(25,40,65,0.06)] text-center space-y-4 u-surface u-hud">
            <div className="mx-auto w-14 h-14 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-[#22C55E]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0F172A]">Thanks for riding Univa</h3>
              <p className="text-xs text-[#64748B]">
                {rating > 0
                  ? "Your rating has been submitted."
                  : "Have a great day ahead."}
              </p>
            </div>

            <div className="flex justify-center flex-col sm:flex-row gap-2.5 pt-2 w-full">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <Link
                  href="/"
                  className="w-[90%] sm:w-64 py-3 rounded-2xl bg-[#192841] hover:bg-[#111C2E] u-btn text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Home size={16} />
                  <span>Back to Home</span>
                </Link>

                <button
                  type="button"
                  onClick={() => alert("Receipt downloaded.")}
                  className="w-[90%] sm:w-64 py-3 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#192841] text-[#0F172A] font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
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
            onClick={() => alert("Journey summary link copied to clipboard.")}
            className="w-[80%] sm:w-auto sm:min-w-56 mx-auto py-3 px-6 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#192841] text-[#64748B] hover:text-[#0F172A] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Share2 size={14} />
            <span>Share Journey Summary</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <AuthGuard message="Please sign in or create an account to view journey completion metrics.">
      <Suspense fallback={<div className="p-10 text-center text-sm font-semibold text-[#64748B]">Loading completion summary...</div>}>
        <JourneyCompleteContent />
      </Suspense>
    </AuthGuard>
  );
}
