"use client";

import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Accessibility,
  Map as MapIcon,
  ListOrdered,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  JourneyOption,
  DEFAULT_JOURNEY_KDU_TO_AIRPORT,
} from "./journeyData";

interface Step2RouteDetailsProps {
  journeyPlan?: JourneyOption;
  onBack: () => void;
  onStartJourney: (plan: JourneyOption) => void;
}

export default function Step2RouteDetails({
  journeyPlan = DEFAULT_JOURNEY_KDU_TO_AIRPORT,
  onBack,
  onStartJourney,
}: Step2RouteDetailsProps) {
  // View mode: map, timeline, or combined
  const [viewMode, setViewMode] = useState<"combined" | "map" | "timeline">("combined");
  // Active segment highlighted on the map
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number | null>(null);

  const activePlan = journeyPlan;

  // Determine route style based on selected vehicle
  const isDirectEco = activePlan.id === "journey-eco-pod";
  const isDirectBus = activePlan.id === "journey-bus-highway";
  const isMaglevExpress = activePlan.id === "journey-skyrail-express";
  const isMultiModal = !isDirectEco && !isDirectBus && !isMaglevExpress;

  return (
    <div className="space-y-5 text-slate-900">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & VIEW MODE CONTROLS                                        */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer shrink-0"
            title="Back to Search"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0F172A] tracking-tight">
                Route Details
              </h2>
              <span className="text-[11px] font-bold text-[#72222B] bg-[#72222B]/10 px-2.5 py-0.5 rounded-full border border-[#72222B]/20">
                {activePlan.title}
              </span>
            </div>
            <p className="text-xs text-[#5A6B85] truncate max-w-[280px] sm:max-w-[420px]">
              {activePlan.from} → {activePlan.to}
            </p>
          </div>
        </div>

        {/* View Mode Switcher (Map / Timeline / Combined) */}
        <div className="flex items-center bg-[#F7F8FA] p-1 rounded-xl border border-[#D6DAE3] text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("combined")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "combined"
                ? "bg-[#72222B] text-white shadow-xs font-bold"
                : "text-[#5A6B85] hover:text-[#0F172A]"
            }`}
          >
            <Layers size={13} />
            <span>Combined</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "map"
                ? "bg-[#72222B] text-white shadow-xs font-bold"
                : "text-[#5A6B85] hover:text-[#0F172A]"
            }`}
          >
            <MapIcon size={13} />
            <span>Map Only</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("timeline")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "timeline"
                ? "bg-[#72222B] text-white shadow-xs font-bold"
                : "text-[#5A6B85] hover:text-[#0F172A]"
            }`}
          >
            <ListOrdered size={13} />
            <span>Timeline</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 4 MANDATORY METRIC BLOCKS                                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-[#D6DAE3] text-center space-y-0.5 shadow-2xs">
          <span className="text-xs text-[#5A6B85] font-semibold block">Price</span>
          <div className="text-xl font-extrabold text-[#72222B]">LKR {activePlan.fareLkr}</div>
          <span className="text-xs text-[#5A6B85]">{activePlan.farePoints} pts</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#D6DAE3] text-center space-y-0.5 shadow-2xs">
          <span className="text-xs text-[#5A6B85] font-semibold block">Arrival</span>
          <div className="text-xl font-bold text-[#0F172A]">{activePlan.arrivalTime}</div>
          <span className="text-xs text-[#5A6B85]">Departs {activePlan.departureTime}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#D6DAE3] text-center space-y-0.5 shadow-2xs">
          <span className="text-xs text-[#5A6B85] font-semibold block">Duration</span>
          <div className="text-xl font-bold text-[#0F172A]">{activePlan.totalDurationMins} min</div>
          <span className="text-xs text-[#5A6B85]">{activePlan.distanceKm} km</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#D6DAE3] text-center space-y-0.5 shadow-2xs">
          <span className="text-xs text-[#5A6B85] font-semibold block">Transfers</span>
          <div className="text-xl font-bold text-[#0F172A]">{activePlan.transfersCount}</div>
          <span className="text-xs text-[#5A6B85]">{activePlan.walkingMins} min walk</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SELECTED VEHICLE ROUTE MAP                                             */}
      {/* ========================================================================= */}
      {(viewMode === "combined" || viewMode === "map") && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Selected Vehicle Route Map
              </span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                ● {activePlan.vehicleName.split("+")[0].trim()}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {activePlan.distanceKm} km Corridor
            </span>
          </div>

          {/* SVG Route Map Canvas for the Selected Vehicle */}
          <div className="relative w-full rounded-xl bg-[#0F172A] border border-slate-800 p-3 overflow-hidden select-none">
            <div className="flex items-center justify-between text-[11px] text-slate-300 pb-2 border-b border-slate-800/80">
              <span className="font-mono text-cyan-400">{activePlan.title}</span>
              <span className="text-slate-400">Network: <strong className="text-emerald-400">Synchronized & On-Time</strong></span>
            </div>

            <div className="relative w-full h-[155px] sm:h-[170px] my-1">
              <svg viewBox="0 0 760 170" className="w-full h-full">
                {/* Gridlines */}
                <g opacity="0.08" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 4">
                  <line x1="0" y1="40" x2="760" y2="40" />
                  <line x1="0" y1="85" x2="760" y2="85" />
                  <line x1="0" y1="130" x2="760" y2="130" />
                </g>

                {/* Base Route Track */}
                <path
                  d="M 60 125 C 180 125, 230 85, 360 85 C 490 85, 540 45, 700 45"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Dynamic Route Tracks specific to Selected Vehicle */}
                {isDirectEco ? (
                  // Direct Eco Pod Coastal Path
                  <path
                    d="M 60 125 C 220 155, 500 135, 700 45"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                ) : isDirectBus ? (
                  // Direct Highway Bus Route
                  <path
                    d="M 60 125 C 220 110, 480 70, 700 45"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                ) : isMaglevExpress ? (
                  // Direct Maglev Express Guideway
                  <>
                    <path
                      d="M 60 125 C 140 125, 170 95, 200 95"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 200 95 C 380 95, 520 45, 700 45"
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  // Multi-Modal (Bus + SkyRail + Aeropod)
                  <>
                    <path
                      d="M 60 125 C 180 125, 230 85, 270 85"
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity={selectedSegmentIndex === null || selectedSegmentIndex === 1 ? 1 : 0.4}
                    />
                    <path
                      d="M 270 85 C 360 85, 430 55, 500 55"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="5.5"
                      strokeLinecap="round"
                      strokeDasharray="8 4"
                      opacity={selectedSegmentIndex === null || selectedSegmentIndex === 2 ? 1 : 0.4}
                    />
                    <path
                      d="M 500 55 C 570 55, 620 45, 700 45"
                      fill="none"
                      stroke="#A855F7"
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity={selectedSegmentIndex === null || selectedSegmentIndex === 3 ? 1 : 0.4}
                    />
                  </>
                )}

                {/* Stations */}
                {/* Station 1: Origin */}
                <g transform="translate(60, 125)">
                  <circle r="7" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2.5" />
                  <rect x="-35" y="14" width="70" height="18" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
                  <text x="0" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold">Origin (KDU)</text>
                </g>

                {/* Interchanges (only if multi-modal or transfer exists) */}
                {activePlan.transfersCount > 0 && (
                  <>
                    <g transform="translate(270, 85)">
                      <circle r="6" fill="#192841" stroke="#38BDF8" strokeWidth="2" />
                      <rect x="-42" y="-22" width="84" height="16" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="0.8" />
                      <text x="0" y="-11" textAnchor="middle" fill="#38BDF8" fontSize="8" fontWeight="600">Central Hub (T1)</text>
                    </g>

                    <g transform="translate(500, 55)">
                      <circle r="6" fill="#192841" stroke="#A855F7" strokeWidth="2" />
                      <rect x="-38" y="-22" width="76" height="16" rx="4" fill="#0F172A" stroke="#A855F7" strokeWidth="0.8" />
                      <text x="0" y="-11" textAnchor="middle" fill="#C084FC" fontSize="8" fontWeight="600">SkyPort (T2)</text>
                    </g>
                  </>
                )}

                {/* Station 4: Destination */}
                <g transform="translate(700, 45)">
                  <circle r="8" fill="#22C55E" stroke="#FFFFFF" strokeWidth="2.5" />
                  <rect x="-42" y="14" width="84" height="18" rx="4" fill="#0F172A" stroke="#22C55E" strokeWidth="1" />
                  <text x="0" y="26" textAnchor="middle" fill="#4ADE80" fontSize="8.5" fontWeight="bold">Airport (BIA)</text>
                </g>

                {/* Live Vehicle Markers for Selected Route */}
                {isDirectEco ? (
                  <g transform="translate(380, 105)">
                    <circle r="12" fill="#10B981" opacity="0.25" className="animate-ping" />
                    <circle r="6.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                    <g transform="translate(0, -18)">
                      <rect x="-34" y="0" width="68" height="14" rx="4" fill="#1E293B" stroke="#10B981" strokeWidth="1" />
                      <text x="0" y="10" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">🚗 EcoPod 110</text>
                    </g>
                  </g>
                ) : isDirectBus ? (
                  <g transform="translate(360, 85)">
                    <circle r="12" fill="#F97316" opacity="0.25" className="animate-ping" />
                    <circle r="6.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />
                    <g transform="translate(0, -18)">
                      <rect x="-35" y="0" width="70" height="14" rx="4" fill="#1E293B" stroke="#F97316" strokeWidth="1" />
                      <text x="0" y="10" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">🚍 Bus 245-EX</text>
                    </g>
                  </g>
                ) : isMaglevExpress ? (
                  <g transform="translate(420, 68)">
                    <circle r="12" fill="#0284C7" opacity="0.25" className="animate-ping" />
                    <circle r="6.5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
                    <g transform="translate(0, -18)">
                      <rect x="-38" y="0" width="76" height="14" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                      <text x="0" y="10" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">🚆 Maglev Express</text>
                    </g>
                  </g>
                ) : (
                  <>
                    <g transform="translate(155, 110)">
                      <circle r="10" fill="#F97316" opacity="0.25" className="animate-ping" />
                      <circle r="6" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />
                      <g transform="translate(0, -18)">
                        <rect x="-30" y="0" width="60" height="14" rx="4" fill="#1E293B" stroke="#F97316" strokeWidth="1" />
                        <text x="0" y="10" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">🚍 Bus U-204</text>
                      </g>
                    </g>
                    <g transform="translate(385, 70)">
                      <circle r="6" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
                      <g transform="translate(0, -18)">
                        <rect x="-32" y="0" width="64" height="14" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <text x="0" y="10" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">🚆 SkyRail 02</text>
                      </g>
                    </g>
                    <g transform="translate(600, 50)">
                      <circle r="6" fill="#A855F7" stroke="#FFFFFF" strokeWidth="1.5" />
                      <g transform="translate(0, -18)">
                        <rect x="-32" y="0" width="64" height="14" rx="4" fill="#1E293B" stroke="#A855F7" strokeWidth="1" />
                        <text x="0" y="10" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">🚡 Aeropod 12</text>
                      </g>
                    </g>
                  </>
                )}
              </svg>
            </div>

            {/* Selected Route Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Boarding Point:</span>
                <span className="font-semibold text-white">{activePlan.boardingLocation}</span>
              </div>
              <span className="text-emerald-400 font-mono text-[10px] font-semibold">
                ● {activePlan.liveHeadway}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. STEP-BY-STEP JOURNEY TIMELINE                                          */}
      {/* ========================================================================= */}
      {(viewMode === "combined" || viewMode === "timeline") && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Step-by-Step Journey Timeline
            </span>
            <span className="text-xs text-slate-400">
              {activePlan.departureTime} → {activePlan.arrivalTime}
            </span>
          </div>

          {/* Clean Minimal Timeline */}
          <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activePlan.segments.map((seg, idx) => {
              const isWalk = seg.mode === "walk";
              const isLast = idx === activePlan.segments.length - 1;

              return (
                <div key={seg.id} className="relative flex items-start justify-between text-xs">
                  <span
                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full ${
                      isWalk ? "bg-slate-300" : isLast ? "bg-emerald-600" : "bg-[#192841]"
                    }`}
                  />
                  <div>
                    <strong className="text-slate-900 block flex items-center gap-1.5">
                      <span>{seg.title}</span>
                      {seg.platform && (
                        <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                          {seg.platform}
                        </span>
                      )}
                    </strong>
                    <span className="text-slate-500 text-[11px]">
                      {seg.fromStop} → {seg.toStop} {seg.distance && `(${seg.distance})`}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-700 shrink-0">
                    {seg.departureTime} → {seg.arrivalTime}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ACTION BUTTONS                                                         */}
      {/* ========================================================================= */}
      <div className="pt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3.5 rounded-2xl bg-[#F7F8FA] hover:bg-[#D6DAE3]/50 text-[#0F172A] border border-[#D6DAE3] text-sm font-bold transition-all cursor-pointer shadow-xs"
        >
          Back
        </button>

        <button
          type="button"
          onClick={() => onStartJourney(activePlan)}
          className="relative group flex-1 py-4 rounded-2xl bg-[#72222B] hover:bg-[#5B1B22] text-white text-sm sm:text-base font-bold transition-all duration-300 shadow-[0_8px_20px_-3px_rgba(114,34,43,0.35)] hover:shadow-[0_12px_26px_-3px_rgba(114,34,43,0.45)] hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer ring-2 ring-[#72222B]/20 overflow-hidden"
        >
          {/* Dynamic Light Sweep Highlight on hover */}
          <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />
          
          <span className="tracking-wide">Proceed to Payment • LKR {activePlan.fareLkr}</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

