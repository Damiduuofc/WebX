"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  ArrowUpDown,
  Zap,
  Leaf,
  Accessibility,
  Coins,
  Footprints,
  Train,
  Bus,
  Search,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import { AuthGuard, useAuth, RoutePreference } from "../context/auth";

const PREFERENCE_OPTIONS: {
  id: RoutePreference;
  title: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  stats: string;
  iconColor: string;
}[] = [
  {
    id: "fastest",
    title: "Fastest",
    badge: "38 min",
    icon: Zap,
    description: "Prioritize shortest travel time with synchronized SkyRail express link.",
    stats: "2 transfers • 6 min walk",
    iconColor: "text-amber-500",
  },
  {
    id: "eco",
    title: "Eco-Friendly",
    badge: "Zero Tailpipe",
    icon: Leaf,
    description: "Prioritize 100% renewable electric pod and solar magnetic guideway.",
    stats: "Lowest carbon index • 44 min",
    iconColor: "text-emerald-500",
  },
  {
    id: "accessible",
    title: "Most Accessible",
    badge: "100% Step-Free",
    icon: Accessibility,
    description: "Prioritize elevators, level-platform boarding, automated ramps, and priority seating.",
    stats: "Step-free • Level boarding • 42 min",
    iconColor: "text-blue-500",
  },
  {
    id: "cost",
    title: "Lowest Cost",
    badge: "LKR 120",
    icon: Coins,
    description: "Prioritize municipal high-capacity routes with the most affordable digital fare.",
    stats: "Subsidized commuter fare • 48 min",
    iconColor: "text-emerald-600",
  },
  {
    id: "walking",
    title: "Less Walking",
    badge: "150m walk",
    icon: Footprints,
    description: "Minimize foot transfer distance using doorstep micro-mobility pods.",
    stats: "Door-to-concourse connection • 40 min",
    iconColor: "text-purple-500",
  },
];

function PreferencesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { journey, updateJourney } = useAuth();

  const paramTo = searchParams.get("to") || searchParams.get("dest");
  const [fromLocation, setFromLocation] = useState(journey.origin || "KDU, Ratmalana");
  const [toLocation, setToLocation] = useState(paramTo || journey.destination || "Bandaranaike International Airport (BIA)");
  const [selectedPref, setSelectedPref] = useState<RoutePreference>(journey.preference || "fastest");
  const [isChangingFrom, setIsChangingFrom] = useState(false);

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleFindRoutes = () => {
    // Determine stats dynamically based on preference
    let duration = 38;
    let transfers = 2;
    let walking = 6;
    let fare = 320;

    if (selectedPref === "fastest") {
      duration = 38;
      transfers = 2;
      walking = 6;
      fare = 320;
    } else if (selectedPref === "eco") {
      duration = 44;
      transfers = 1;
      walking = 5;
      fare = 260;
    } else if (selectedPref === "accessible") {
      duration = 42;
      transfers = 2;
      walking = 4;
      fare = 300;
    } else if (selectedPref === "cost") {
      duration = 48;
      transfers = 2;
      walking = 8;
      fare = 120;
    } else if (selectedPref === "walking") {
      duration = 40;
      transfers = 2;
      walking = 2;
      fare = 350;
    }

    updateJourney({
      origin: fromLocation,
      destination: toLocation,
      preference: selectedPref,
      durationMins: duration,
      transfersCount: transfers,
      walkingMins: walking,
      fareLkr: fare,
    });

    router.push("/journey-plan");
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#192841] text-[#0F172A] transition-all shadow-xs"
            title="Return to Home Dashboard"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Plan your Journey
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#192841]/10 text-[#192841] text-xs font-bold">
                Step 1 of 4
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Define starting point, destination, and multi-modal routing preferences.
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
          <span className="u-pulse-dot" style={{ "--pulse-color": "#22C55E" } as React.CSSProperties} />
          <span>Autonomous Network Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: LOCATIONS & ROUTE PREFERENCES (7 Cols)                       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Origin & Destination Inputs Card */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Origin & Destination
              </span>
              <button
                type="button"
                onClick={handleSwap}
                className="text-xs font-bold text-[#192841] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowUpDown size={14} />
                <span>Swap</span>
              </button>
            </div>

            <div className="space-y-3 relative">
              {/* Line connector between From and To */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#192841] via-slate-300 to-[#192841] pointer-events-none z-0" />

              {/* FROM FIELD */}
              <div className="relative z-10 flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
                <div className="w-8 h-8 rounded-xl bg-[#192841] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                    From (Current Location)
                  </span>
                  {isChangingFrom ? (
                    <input
                      type="text"
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      onBlur={() => setIsChangingFrom(false)}
                      autoFocus
                      className="w-full text-sm font-bold text-[#0F172A] bg-white border border-[#192841] rounded-lg px-2 py-1 outline-none"
                    />
                  ) : (
                    <div className="text-sm font-bold text-[#0F172A] truncate">
                      {fromLocation}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangingFrom(!isChangingFrom)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#192841] text-xs font-bold text-[#192841] transition-all cursor-pointer shrink-0"
                >
                  {isChangingFrom ? "Done" : "Change"}
                </button>
              </div>

              {/* TO FIELD */}
              <div className="relative z-10 flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#192841] text-[#192841] flex items-center justify-center shrink-0 shadow-xs">
                  <Search size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                    To (Destination)
                  </span>
                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Where do you want to go?"
                    className="w-full text-sm font-bold text-[#0F172A] bg-transparent outline-none truncate placeholder:text-[#64748B]/60"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Route Preferences Selection (Section 14) */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Route Preferences
                </h3>
                <p className="text-xs text-[#64748B]">
                  Choose how you want to travel today. Univa optimizes every transfer.
                </p>
              </div>
              <SlidersHorizontal size={18} className="text-[#192841]" />
            </div>

            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {PREFERENCE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedPref === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedPref(opt.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? "bg-[#F7F9FC] border-[#192841] ring-2 ring-[#192841]/10 shadow-xs"
                        : "bg-white border-[#E2E8F0] hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-[#192841] text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#0F172A]">
                          {opt.title}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-[#192841] text-white"
                              : "bg-slate-100 text-[#64748B]"
                          }`}
                        >
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        {opt.description}
                      </p>
                      <div className="text-[11px] font-semibold text-[#192841] mt-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{opt.stats}</span>
                      </div>
                    </div>

                    {/* Radio Indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        isSelected
                          ? "border-[#192841] bg-[#192841] text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary CTA Button: Find Routes */}
          <button
            type="button"
            onClick={handleFindRoutes}
            className="w-full py-4 px-8 rounded-2xl bg-[#4F6EF7] hover:bg-[#3B4FE0] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Find Routes</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: MAP PREVIEW & TRANSIT CONNECTIONS (5 Cols)                   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Map Preview Card (Section 13) */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Synchronized Map Preview
              </span>
              <span className="text-xs font-semibold text-[#192841]">18.4 km Total</span>
            </div>

            {/* Simplified Map Visual */}
            <div className="relative w-full h-72 sm:h-80 rounded-2xl bg-[#0F172A] border border-[#E2E8F0] overflow-hidden p-4 flex flex-col justify-between u-glow-strong">
              {/* Subtle Grid Map Canvas Pattern */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(#94A3B8 1px, transparent 1px), radial-gradient(#94A3B8 1px, #0F172A 1px)",
                  backgroundSize: "24px 24px",
                  backgroundPosition: "0 0, 12px 12px",
                }}
              />

              {/* Vector SVG Transit Route overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Autonomous Bus Route (Origin to Interchange) — laser beam */}
                <path
                  d="M 60 220 C 100 180, 120 160, 180 150"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="10"
                  opacity={0.35}
                  style={{ filter: "blur(5px)" }}
                />
                <path
                  d="M 60 220 C 100 180, 120 160, 180 150"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray="10 14"
                  strokeLinecap="round"
                  className="u-laser-flow"
                  style={{ filter: "drop-shadow(0 0 4px #38BDF8)" }}
                />
                <path
                  d="M 60 220 C 100 180, 120 160, 180 150"
                  fill="none"
                  stroke="#E6F6FF"
                  strokeWidth="1"
                  opacity={0.9}
                />

                {/* SkyRail Guideway Line (Interchange to Destination) — laser beam */}
                <path
                  d="M 180 150 C 230 140, 270 90, 320 60"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="11"
                  opacity={0.35}
                  style={{ filter: "blur(5px)" }}
                />
                <path
                  d="M 180 150 C 230 140, 270 90, 320 60"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="3"
                  strokeDasharray="10 14"
                  strokeLinecap="round"
                  className="u-laser-flow"
                  style={{ filter: "drop-shadow(0 0 4px #22C55E)", animationDirection: "reverse" }}
                />
                <path
                  d="M 180 150 C 230 140, 270 90, 320 60"
                  fill="none"
                  stroke="#E9FFF1"
                  strokeWidth="1"
                  opacity={0.9}
                />

                {/* Stations */}
                {/* Origin */}
                <circle cx="60" cy="220" r="7" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="3" />
                {/* Interchange */}
                <circle cx="180" cy="150" r="9" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="4" />
                {/* Destination */}
                <circle cx="320" cy="60" r="8" fill="#FFFFFF" stroke="#22C55E" strokeWidth="4" />
              </svg>

              {/* Floating Map Badges */}
              <div className="relative z-10 flex items-center justify-between text-white text-xs">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 font-bold flex items-center gap-1.5">
                  <span className="u-pulse-dot" style={{ "--pulse-color": "#34D399" } as React.CSSProperties} />
                  Live GPS Corridor
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#192841]/90 backdrop-blur-md border border-white/20 text-[11px] font-semibold">
                  2 Transfers
                </span>
              </div>

              {/* Station Map Overlay Tags */}
              <div className="relative z-10 space-y-2 pointer-events-none">
                <div className="bg-black/75 backdrop-blur-md rounded-xl p-2.5 border border-white/10 text-white text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1 text-sky-400">
                      <Bus size={13} /> Bus 245
                    </span>
                    <span className="text-[#64748B]">→</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Train size={13} /> SkyRail 02
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Step-free transfer at <strong>Central Station Hub</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Micro Details */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[11px]">Primary Guideway</span>
                <span className="font-bold text-[#0F172A] mt-0.5 block">SkyRail Maglev Line 02</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[11px]">Feeder Fleet</span>
                <span className="font-bold text-[#0F172A] mt-0.5 block">Autonomous Bus 245</span>
              </div>
            </div>
          </div>

          {/* Accessibility & Guarantee Note */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-[#192841] text-xs flex items-start gap-3">
            <Info size={16} className="text-[#192841] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>100% Transfer Guarantee:</strong> In the event of a guideway adjustment, Univa immediately synchronizes connecting pods and SkyRail boarding times automatically.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreferencesPage() {
  return (
    <AuthGuard message="Please sign in or create an account to configure journey preferences.">
      <Suspense fallback={<div className="p-10 text-center text-sm font-semibold text-[#64748B]">Loading journey preferences...</div>}>
        <PreferencesContent />
      </Suspense>
    </AuthGuard>
  );
}
