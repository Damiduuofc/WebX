"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
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
  Search,
  SlidersHorizontal,
  Info,
  Mic,
  Navigation,
} from "lucide-react";
import { AuthGuard, useAuth, RoutePreference } from "../context/auth";
import RoutePreviewMap from "../components/RoutePreviewMap";
import LiveRouteMap from "../components/LiveRouteMap";
import FlowHeader from "../components/FlowHeader";
import { TRANSIT_ROUTES, INITIAL_BUSES } from "../data/smartMetroData";

const ROUTE = TRANSIT_ROUTES.UN01;
const STOPS = ROUTE.stops;
const BUSES = INITIAL_BUSES.UN01;

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
  const toInputRef = useRef<HTMLInputElement>(null);

  const focusDestination = () => {
    toInputRef.current?.focus();
    toInputRef.current?.select();
  };

  // "Change Destination" on the journey plan lands here with the destination ready to edit
  const shouldFocusDestination = searchParams.get("focus") === "destination";
  useEffect(() => {
    if (shouldFocusDestination) focusDestination();
  }, [shouldFocusDestination]);

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

  const selectedPrefObj = PREFERENCE_OPTIONS.find((p) => p.id === selectedPref) || PREFERENCE_OPTIONS[0];

  return (
    <div className="relative w-full">
      {/* ========================================================================= */}
      {/* 1. MOBILE VIEW: IMMERSIVE FULL-VIEW MAP & ERGONOMIC BOTTOM SHEET           */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed inset-0 z-40 flex flex-col bg-[#0B0F17] overflow-hidden">
        {/* Floating Top Controls over the Map */}
        <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
          {/* Floating Round Back Button */}
          <Link
            href="/"
            className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-200/80 flex items-center justify-center text-[#192841] hover:bg-white active:scale-95 transition-all pointer-events-auto cursor-pointer"
            title="Return to Home"
            aria-label="Return to Home"
          >
            <ArrowLeft size={20} />
          </Link>

          {/* Floating Route Status Badge */}
          <div className="flex items-center gap-2 bg-[#0F141C]/90 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-full shadow-lg text-white text-xs font-bold pointer-events-auto">
            <span className="u-pulse-dot" style={{ "--pulse-color": "#22C55E" } as React.CSSProperties} />
            <span>Plan Journey • 18.4 km</span>
          </div>

          {/* Floating Search / Focus Button */}
          <button
            type="button"
            onClick={focusDestination}
            className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-200/80 flex items-center justify-center text-[#192841] hover:bg-white active:scale-95 transition-all pointer-events-auto cursor-pointer"
            title="Search Destination"
            aria-label="Search Destination"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Map Container: Fills upper viewport edge-to-edge */}
        <div className="flex-1 w-full relative min-h-[280px]">
          <LiveRouteMap
            stops={STOPS}
            buses={BUSES}
            routeName={ROUTE.title}
            routeId={ROUTE.id}
            selectedBusId={null}
            onSelectBus={() => {}}
            selectedStopId={null}
            onSelectStop={() => {}}
            showTraffic={true}
            isSimulating={true}
            heightClass="h-full"
            className="rounded-none border-0 shadow-none"
            hideTopOverlay={true}
          />
        </div>

        {/* DOCKED BOTTOM SHEET: Compact, accessible inputs & preferences */}
        <div className="relative z-30 w-full bg-white rounded-t-[28px] border-t border-slate-200/80 shadow-[0_-12px_36px_rgba(15,23,42,0.16)] px-4 pt-3 pb-5 space-y-3 shrink-0 max-h-[60vh] overflow-y-auto">
          {/* Drag Handle Pill */}
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />

          {/* From & To Card with Swap */}
          <div className="bg-[#F7F9FC] rounded-2xl border border-[#E2E8F0] p-3 space-y-2 relative">
            {/* Line connector */}
            <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#192841] via-slate-300 to-[#192841] pointer-events-none" />

            {/* From Input */}
            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-7 h-7 rounded-lg bg-[#192841] text-white flex items-center justify-center shrink-0 shadow-xs">
                <MapPin size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold text-[#64748B] uppercase block u-mono">From</span>
                {isChangingFrom ? (
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    onBlur={() => setIsChangingFrom(false)}
                    onKeyDown={(e) => e.key === "Enter" && setIsChangingFrom(false)}
                    autoFocus
                    className="w-full text-xs font-bold text-[#0F172A] bg-white border border-[#192841] rounded px-1.5 py-0.5 outline-none"
                  />
                ) : (
                  <div className="text-xs font-bold text-[#0F172A] truncate">{fromLocation}</div>
                )}
              </div>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setIsChangingFrom(!isChangingFrom)}
                className="text-[11px] font-bold text-[#192841] px-2 py-1 rounded-lg bg-white border border-[#E2E8F0] shrink-0 cursor-pointer"
              >
                {isChangingFrom ? "Done" : "Change"}
              </button>
            </div>

            {/* To Input */}
            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-7 h-7 rounded-lg bg-white border border-[#192841] text-[#192841] flex items-center justify-center shrink-0 shadow-xs">
                <Search size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold text-[#64748B] uppercase block u-mono">To</span>
                <input
                  ref={toInputRef}
                  type="text"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  placeholder="Where do you want to go?"
                  className="w-full text-xs font-bold text-[#0F172A] bg-transparent outline-none truncate placeholder:text-[#64748B]/60"
                />
              </div>
              <button
                type="button"
                onClick={handleSwap}
                className="text-[11px] font-bold text-[#192841] px-2 py-1 rounded-lg bg-white border border-[#E2E8F0] flex items-center gap-1 shrink-0 cursor-pointer"
                title="Swap locations"
              >
                <ArrowUpDown size={11} />
                <span>Swap</span>
              </button>
            </div>
          </div>

          {/* Route Preferences Selection (Horizontal scrollable pill list) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#0F172A]">Route Preference</span>
              <span className="text-[11px] text-[#22C55E] font-semibold">100% Step-Free</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {PREFERENCE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedPref === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedPref(opt.id)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border transition-all shrink-0 cursor-pointer text-left min-h-[44px] ${
                      isSelected
                        ? "bg-[#192841] text-white border-[#192841] shadow-sm"
                        : "bg-[#F7F9FC] text-[#0F172A] border-[#E2E8F0] hover:border-slate-300"
                    }`}
                  >
                    <Icon size={16} className={isSelected ? "text-amber-300" : opt.iconColor} />
                    <div>
                      <div className="text-xs font-extrabold leading-tight">{opt.title}</div>
                      <div className={`text-[10px] font-medium leading-tight ${isSelected ? "text-slate-200" : "text-[#64748B]"}`}>
                        {opt.badge}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Stats Banner */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#F1F5F9] rounded-xl text-xs font-semibold text-[#192841]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" />
              <span className="truncate">{selectedPrefObj.stats}</span>
            </div>
            <span className="font-extrabold u-mono shrink-0 ml-2">{selectedPrefObj.badge}</span>
          </div>

          {/* Primary CTA: Find Routes */}
          <button
            type="button"
            onClick={handleFindRoutes}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#192841] hover:bg-[#111C2E] u-btn text-white font-bold text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            <span>Find Routes</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP VIEW: 2-COLUMN SPATIOUS LAYOUT (hidden lg:block)               */}
      {/* ========================================================================= */}
      <div className="hidden lg:block min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        {/* Top Header & Breadcrumb */}
        <FlowHeader
          backHref="/"
          backTitle="Return to Home Dashboard"
          title="Plan your Journey"
          step="Step 1 of 4"
          subtitle="Define starting point, destination, and multi-modal routing preferences."
          status="Autonomous Network Active"
        />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: LOCATIONS & ROUTE PREFERENCES (7 Cols)                       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Origin & Destination Inputs Card */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm space-y-4 u-surface u-hud">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider u-mono">
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
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block u-mono">
                    From (Current Location)
                  </span>
                  {isChangingFrom ? (
                    <input
                      type="text"
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      onBlur={() => setIsChangingFrom(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setIsChangingFrom(false);
                      }}
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
                  // Keep the input focused until the click lands; otherwise its blur
                  // closes the editor first and this click would reopen it ("Done" did nothing).
                  onMouseDown={(e) => e.preventDefault()}
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
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block u-mono">
                    To (Destination)
                  </span>
                  <input
                    ref={toInputRef}
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Where do you want to go?"
                    className="w-full text-sm font-bold text-[#0F172A] bg-transparent outline-none truncate placeholder:text-[#64748B]/60"
                  />
                </div>
                <button
                  type="button"
                  onClick={focusDestination}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#192841] text-xs font-bold text-[#192841] transition-all cursor-pointer shrink-0"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Route Preferences Selection (Section 14) */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm space-y-4 u-surface u-hud">
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
            className="w-full py-4 px-8 rounded-2xl bg-[#192841] hover:bg-[#111C2E] u-btn text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer"
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
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm space-y-4 u-surface u-hud">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider u-mono">
                Synchronized Map Preview
              </span>
              <span className="text-xs font-semibold text-[#192841]">18.4 km Total</span>
            </div>

            {/* Route preview, drawn from the same route data as the live map */}
            <RoutePreviewMap />

            {/* Micro Details */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[11px]">Primary Guideway</span>
                <span className="font-bold text-[#0F172A] mt-0.5 block">SkyRail Maglev Line 02</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
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
