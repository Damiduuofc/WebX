"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Train,
  Bus,
  Zap,
  Mic,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Radio,
  Accessibility,
} from "lucide-react";
import { AuthGuard, useAuth } from "../context/auth";
import LiveRouteMap, { LiveBus } from "../components/LiveRouteMap";
import { TRANSIT_ROUTES, INITIAL_BUSES, UN01_LEGS } from "../data/smartMetroData";
import FlowHeader from "../components/FlowHeader";

// The trip screen runs on the same SmartMetro route, stops and fleet as the
// Live Route page, so both always show the same route and telemetry.
const ROUTE = TRANSIT_ROUTES.UN01;
const STOPS = ROUTE.stops;
const LAST_STOP = STOPS.length - 1;

interface JourneyLeg {
  name: string;
  vehicleType: string;
  plate: string;
  icon: React.ElementType;
  /** Indices into STOPS where this leg starts and ends (its end is the transfer point). */
  fromIdx: number;
  toIdx: number;
  mins: number;
  speedKmH: number;
  nextVehicle: string | null;
}

const LEGS: JourneyLeg[] = [
  {
    name: "Autonomous Bus 245",
    vehicleType: "Bus",
    plate: "UN-245",
    icon: Bus,
    fromIdx: UN01_LEGS[0].fromIdx,
    toIdx: UN01_LEGS[0].toIdx,
    mins: UN01_LEGS[0].mins,
    speedKmH: 52,
    nextVehicle: "SkyRail Line 02",
  },
  {
    name: "SkyRail Line 02 Maglev",
    vehicleType: "SkyRail",
    plate: "SKY-02",
    icon: Train,
    fromIdx: UN01_LEGS[1].fromIdx,
    toIdx: UN01_LEGS[1].toIdx,
    mins: UN01_LEGS[1].mins,
    speedKmH: 180,
    nextVehicle: "Smart Road Autonomous Pod",
  },
  {
    name: "Smart Road Autonomous Pod",
    vehicleType: "Pod",
    plate: "POD-EV",
    icon: Zap,
    fromIdx: UN01_LEGS[2].fromIdx,
    toIdx: UN01_LEGS[2].toIdx,
    mins: UN01_LEGS[2].mins,
    speedKmH: 45,
    nextVehicle: null,
  },
];

const RIDER_BUS_ID = "you";
const TOTAL_TRIP_MINS = 38;

function LiveJourneyContent() {
  const router = useRouter();
  const { journey } = useAuth();

  // Progress along the whole route (0.0 to 1.0)
  const [progress, setProgress] = useState(0.18);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5>(2);
  const [forceTransferAlert, setForceTransferAlert] = useState(false);

  // Map state
  const [selectedBusId, setSelectedBusId] = useState<string | null>(RIDER_BUS_ID);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [showTraffic, setShowTraffic] = useState(true);

  // Other vehicles on the route, ticking along like the Live Route page
  const [fleet, setFleet] = useState<LiveBus[]>(() =>
    INITIAL_BUSES.UN01.filter((bus) => bus.direction === "outbound")
  );

  // Voice Interaction state
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceSpeechMessage, setVoiceSpeechMessage] = useState<string | null>(null);

  // Live timer tick
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return Math.min(1, prev + 0.006 * simSpeed);
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  // Fleet telemetry simulation (same cadence as the Live Route page)
  useEffect(() => {
    const interval = setInterval(() => {
      setFleet((prev) =>
        prev.map((bus) => {
          const nextProgress = bus.progress + 0.08;
          if (nextProgress < 1) return { ...bus, progress: nextProgress };
          const nextIdx = (bus.currentStopIndex + 1) % STOPS.length;
          return {
            ...bus,
            currentStopIndex: nextIdx,
            progress: 0.02,
            speed: Math.floor(38 + Math.random() * 22),
            nextStopName: STOPS[Math.min(nextIdx + 1, LAST_STOP)].name,
            etaMinutes: Math.max(1, Math.floor(Math.random() * 4) + 1),
            status: Math.random() > 0.7 ? "At Station" : "In Transit",
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Navigate to complete screen when journey finishes
  useEffect(() => {
    if (progress >= 1) {
      const timer = setTimeout(() => {
        router.push("/complete");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [progress, router]);

  // Where the rider is on the route, and everything derived from it
  const trip = useMemo(() => {
    const pos = progress * LAST_STOP;
    const legIndex = pos < LEGS[0].toIdx ? 0 : pos < LEGS[1].toIdx ? 1 : 2;
    const leg = LEGS[legIndex];
    const legProg = Math.min(1, Math.max(0, (pos - leg.fromIdx) / (leg.toIdx - leg.fromIdx)));

    const stopIdx = Math.min(LAST_STOP - 1, Math.floor(pos));
    const segProgress = Math.min(1, pos - stopIdx);
    const nextStop = STOPS[stopIdx + 1];
    const transferStop = STOPS[leg.toIdx];
    const stopsToLegEnd = leg.toIdx - (stopIdx + 1);

    const legEtaMins = Math.max(1, Math.round(leg.mins * (1 - legProg)));
    const minsPerStop = leg.mins / (leg.toIdx - leg.fromIdx);
    const nextStopEta = Math.max(1, Math.round(minsPerStop * (1 - segProgress)));

    const riderBus: LiveBus = {
      id: RIDER_BUS_ID,
      plate: leg.plate,
      vehicleType: leg.vehicleType,
      routeId: ROUTE.id,
      direction: "outbound",
      currentStopIndex: stopIdx,
      progress: segProgress,
      speed: leg.speedKmH,
      nextStopName: nextStop.name,
      etaMinutes: nextStopEta,
      occupancyPercent: 38,
      seatsAvailable: 32,
      wheelchairBay: true,
      driver: "Univa AI Autonomous Co-Pilot",
      status: segProgress > 0.8 ? "Approaching Stop" : "In Transit",
      heading: 0,
    };

    return {
      leg,
      legProg,
      boardedAt: STOPS[leg.fromIdx].name,
      nextStop,
      transferStop,
      stopsToLegEnd,
      legEtaMins,
      remainingTotalMins: Math.max(1, Math.round(TOTAL_TRIP_MINS * (1 - progress))),
      isApproachingTransfer: leg.nextVehicle !== null && legProg > 0.65,
      riderBus,
    };
  }, [progress]);

  const { leg, transferStop, nextStop } = trip;
  const VehicleIcon = leg.icon;
  const showTransferAlert = trip.isApproachingTransfer || forceTransferAlert;

  const nextStopBadge =
    trip.stopsToLegEnd <= 0
      ? leg.nextVehicle
        ? "Transfer point"
        : "Final destination"
      : `${trip.stopsToLegEnd} stop${trip.stopsToLegEnd === 1 ? "" : "s"} to ${
          leg.nextVehicle ? "transfer" : "destination"
        }`;

  const mapBuses = useMemo(() => [trip.riderBus, ...fleet], [trip.riderBus, fleet]);

  const handleVoiceQuery = () => {
    if (isVoiceListening) {
      setIsVoiceListening(false);
      return;
    }
    setIsVoiceListening(true);
    setVoiceSpeechMessage("Listening to rider...");

    setTimeout(() => {
      setVoiceSpeechMessage('Heard: "Where is my next transfer?"');
    }, 1000);

    setTimeout(() => {
      setIsVoiceListening(false);
      setVoiceSpeechMessage(
        leg.nextVehicle
          ? `Tell Univa: Get off at ${transferStop.name} in ${trip.legEtaMins} minutes. Change to ${leg.nextVehicle} at ${
              transferStop.landmark ?? "the interchange"
            }. The connection is step-free.`
          : `Tell Univa: Your last stop is ${transferStop.name}, about ${trip.legEtaMins} minutes away. No more transfers.`
      );
    }, 2200);
  };

  const handleArriveNow = () => {
    setProgress(1);
    router.push("/complete");
  };

  const markerClass = (reached: boolean, arrived = false) =>
    reached ? (arrived ? "text-emerald-600" : "text-[#192841]") : "";

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      {/* ========================================================================= */}
      {/* SECTION 19: HEADER WITH ON-TIME STATUS                                    */}
      {/* ========================================================================= */}
      <FlowHeader
        backHref="/journey-plan"
        backTitle="Back to Journey Plan"
        title="Your Journey"
        step="Step 3 of 4 • Live Transit"
        subtitle={`Live route telemetry from the SmartMetro grid • ${ROUTE.title}`}
        status="On Time • Synchronized Telemetry"
      />

      {/* ========================================================================= */}
      {/* SECTION 24: TRANSFER ALERT (Prominent notification when approaching hub)   */}
      {/* ========================================================================= */}
      {showTransferAlert && (
        <div className="bg-amber-50 rounded-3xl border-2 border-amber-300 p-5 sm:p-6 shadow-md animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 animate-bounce">
                🔄
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider u-mono">
                  {leg.nextVehicle ? "Transfer Coming Up" : "Arriving Soon"}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-amber-950">
                  {leg.nextVehicle ? `Change to ${leg.nextVehicle}` : "Approaching your destination"}
                </h3>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                  Get off at <strong>{transferStop.name}</strong> in{" "}
                  <strong>
                    {trip.legEtaMins} minute{trip.legEtaMins === 1 ? "" : "s"}
                  </strong>
                  .{" "}
                  {leg.nextVehicle
                    ? `Head to ${transferStop.landmark ?? "the interchange platform"}.`
                    : "This is your final stop."}
                </p>
                {transferStop.stepFreeAccessible && (
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-950 pt-1">
                    <Accessibility size={14} className="text-blue-600" />
                    <span>Step-free connection available</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setForceTransferAlert(false)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900 transition-colors"
              >
                Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 23: JOURNEY PROGRESS BAR                                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-2 u-surface">
        <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
          <span className="text-[#192841]">Start (KDU)</span>
          <span className={markerClass(progress >= 0.05)}>Bus 245</span>
          <span className={markerClass(progress >= LEGS[0].toIdx / LAST_STOP)}>Colombo Fort</span>
          <span className={markerClass(progress >= (LEGS[0].toIdx + 1) / LAST_STOP)}>SkyRail 02</span>
          <span className={markerClass(progress >= LEGS[1].toIdx / LAST_STOP)}>Ja-Ela Port</span>
          <span className={markerClass(progress >= 0.98, true)}>Destination</span>
        </div>

        {/* Progress Bar Track */}
        <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#192841] via-sky-600 to-[#22C55E] transition-all duration-300 rounded-full u-shimmer"
            style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#64748B]">
          <span className="u-digital-num">{Math.round(progress * 100)}% route completed</span>
          <span className="u-digital-num">{trip.remainingTotalMins} min remaining until destination</span>
        </div>
      </div>

      {/* Main Grid: Live Map + Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* SECTION 20: LIVE MAP (SmartMetro route + telemetry)                       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-4">
          {/* Simulation controls */}
          <div className="flex items-center justify-between gap-3 bg-white rounded-2xl border border-[#E2E8F0] px-4 py-2.5 shadow-xs u-surface">
            <div className="flex items-center gap-2 text-xs font-bold text-[#192841] min-w-0">
              <Radio size={14} className="text-[#22C55E] shrink-0 animate-pulse" />
              <span className="truncate">SmartMetro live feed • Your vehicle: {leg.vehicleType} {leg.plate}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 bg-[#F7F9FC] p-1 rounded-xl border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg hover:bg-white text-[#192841] transition-colors cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                type="button"
                onClick={() => setSimSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 5 : 1))}
                className="px-2 py-1 rounded-lg hover:bg-white text-[11px] font-bold text-[#192841] transition-colors cursor-pointer"
                title="Simulation speed"
              >
                {simSpeed}x
              </button>
              <button
                type="button"
                onClick={() => setProgress(0.05)}
                className="p-1.5 rounded-lg hover:bg-white text-[#192841] transition-colors cursor-pointer"
                title="Restart"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          <LiveRouteMap
            stops={STOPS}
            buses={mapBuses}
            routeName={ROUTE.title}
            routeId={ROUTE.id}
            selectedBusId={selectedBusId}
            onSelectBus={setSelectedBusId}
            selectedStopId={selectedStopId}
            onSelectStop={setSelectedStopId}
            showTraffic={showTraffic}
            onToggleTraffic={() => setShowTraffic((v) => !v)}
            isSimulating={isPlaying}
          />

          {/* Origin / Transfer / Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-white rounded-2xl p-3 border border-[#E2E8F0] text-xs space-y-0.5 shadow-xs u-surface">
              <span className="text-[10px] text-sky-600 font-bold uppercase block">Origin</span>
              <div className="font-bold text-[#0F172A] truncate">{journey.origin}</div>
              <div className="text-[11px] text-[#64748B]">Boarded {LEGS[0].name}</div>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-[#E2E8F0] text-xs space-y-0.5 shadow-xs u-surface">
              <span className="text-[10px] text-amber-600 font-bold uppercase block">Transfer Point</span>
              <div className="font-bold text-[#0F172A] truncate">{STOPS[LEGS[0].toIdx].name}</div>
              <div className="text-[11px] text-[#64748B]">Connecting to {LEGS[0].nextVehicle}</div>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-[#E2E8F0] text-xs space-y-0.5 shadow-xs u-surface">
              <span className="text-[10px] text-emerald-600 font-bold uppercase block">Destination</span>
              <div className="font-bold text-[#0F172A] truncate">{journey.destination}</div>
              <div className="text-[11px] text-[#64748B]">ETA: {journey.arrivalTime}</div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: VEHICLE CARD & NEXT STOP (4 Cols)                           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* SECTION 21: CURRENT VEHICLE CARD */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm space-y-4 u-surface u-hud">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider u-mono">
                Current Vehicle
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                {trip.riderBus.status}
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#192841] text-white flex items-center justify-center shrink-0 shadow-sm">
                <VehicleIcon size={22} />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-[#0F172A] truncate">{leg.name}</h3>
                <p className="text-xs font-bold text-emerald-600">You&apos;re on this vehicle</p>
                <div className="text-xs text-[#64748B] pt-0.5">
                  <strong className="text-[#0F172A] u-digital-num">{trip.legEtaMins} min</strong> remaining on this leg
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Boarded At:</span>
                <span className="font-semibold text-[#0F172A] truncate max-w-[180px]">{trip.boardedAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Live Speed:</span>
                <span className="font-bold text-[#192841] u-digital-num">{leg.speedKmH} km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Seats Free:</span>
                <span className="font-bold text-[#192841] u-digital-num">{trip.riderBus.seatsAvailable}</span>
              </div>
            </div>
          </div>

          {/* SECTION 22: NEXT STOP CARD (Highly visible) */}
          <div className="bg-white rounded-3xl border-2 border-[#192841] p-6 shadow-sm space-y-2 u-glow">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#192841] uppercase tracking-wider u-mono">Next Stop</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#192841] text-white text-right">
                {nextStopBadge}
              </span>
            </div>
            <div className="text-xl font-black text-[#0F172A] tracking-tight">{nextStop.name}</div>
            <p className="text-xs text-[#64748B]">
              {nextStop.landmark ? `${nextStop.landmark} • ` : ""}Arriving in{" "}
              <strong className="text-[#0F172A] u-digital-num">{trip.riderBus.etaMinutes} min</strong>. Doors open on the right side.
            </p>
          </div>

          {/* SECTION 25: VOICE ASSISTANCE ("TELL UNIVA") */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-sm space-y-3 u-surface u-hud">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A]">Tell Univa Voice Co-Pilot</span>
              <span className="text-[10px] text-[#64748B] font-semibold">Hands-Free</span>
            </div>

            <button
              type="button"
              onClick={handleVoiceQuery}
              className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isVoiceListening
                  ? "bg-[#192841] text-white ring-4 ring-[#192841]/20 animate-pulse"
                  : "bg-[#F7F9FC] hover:bg-slate-100 text-[#192841] border border-[#E2E8F0]"
              }`}
            >
              <Mic size={16} className={isVoiceListening ? "animate-pulse" : ""} />
              <span>{isVoiceListening ? "Listening..." : 'Ask "Where is my transfer?"'}</span>
            </button>

            {voiceSpeechMessage && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A] flex items-start gap-2">
                <Volume2 size={16} className="text-[#192841] shrink-0 mt-0.5" />
                <p className="leading-relaxed">{voiceSpeechMessage}</p>
              </div>
            )}
          </div>

          {/* Manual Simulation Controls for Evaluation */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-[#E2E8F0] space-y-2">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block u-mono">
              Evaluation Shortcuts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForceTransferAlert(!forceTransferAlert)}
                className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-[11px] font-bold text-[#192841] border border-[#E2E8F0] transition-colors"
              >
                Toggle Transfer Alert
              </button>
              <button
                type="button"
                onClick={handleArriveNow}
                className="py-2 px-3 rounded-xl bg-[#192841] hover:bg-[#111C2E] u-btn text-[11px] font-bold text-white transition-colors flex items-center justify-center gap-1"
              >
                <span>Fast-forward Arrive</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveJourneyPage() {
  return (
    <AuthGuard message="Please sign in or create an account to access live journey telemetry.">
      <Suspense fallback={<div className="p-10 text-center text-sm font-semibold text-[#64748B]">Loading live transit telemetry...</div>}>
        <LiveJourneyContent />
      </Suspense>
    </AuthGuard>
  );
}
