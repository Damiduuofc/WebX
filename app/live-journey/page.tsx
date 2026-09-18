"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Train,
  Bus,
  Zap,
  Mic,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Navigation,
  Accessibility,
} from "lucide-react";
import { AuthGuard, useAuth } from "../context/auth";

function LiveJourneyContent() {
  const router = useRouter();
  const { journey } = useAuth();

  // Progress along the route (0.0 to 1.0)
  const [progress, setProgress] = useState(0.18);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5>(2);
  const [forceTransferAlert, setForceTransferAlert] = useState(false);

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

  // Navigate to complete screen when journey finishes
  useEffect(() => {
    if (progress >= 1) {
      const timer = setTimeout(() => {
        router.push("/complete");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [progress, router]);

  // Derive current transport leg, vehicle, stops, and transfer status
  const currentLeg = useMemo(() => {
    if (progress < 0.42) {
      // Leg 1: Autonomous Bus 245
      const legProg = progress / 0.42;
      const isApproachingTransfer = legProg > 0.65 || forceTransferAlert;
      return {
        legIndex: 1,
        vehicleName: "Autonomous Bus 245",
        mode: "bus" as const,
        icon: Bus,
        currentStop: "KDU Concourse Platform 4",
        nextStop: "Central Station Multimodal Interchange",
        stopsAway: isApproachingTransfer ? "Approaching Central Station" : "2 stops away",
        etaMins: Math.max(1, Math.round(15 * (1 - legProg))),
        remainingTotalMins: Math.max(1, Math.round(38 * (1 - progress))),
        speedKmH: 52,
        status: "On Time",
        showTransferAlert: isApproachingTransfer,
      };
    } else if (progress < 0.8) {
      // Leg 2: SkyRail Line 02
      const legProg = (progress - 0.42) / 0.38;
      const isApproachingTransfer = legProg > 0.75;
      return {
        legIndex: 2,
        vehicleName: "SkyRail Line 02 Maglev",
        mode: "skyrail" as const,
        icon: Train,
        currentStop: "Central Station Platform 2",
        nextStop: "SkyPort Gateway Station",
        stopsAway: isApproachingTransfer ? "Approaching SkyPort Gateway" : "1 stop away",
        etaMins: Math.max(1, Math.round(10 * (1 - legProg))),
        remainingTotalMins: Math.max(1, Math.round(38 * (1 - progress))),
        speedKmH: 180,
        status: "High Speed Transit",
        showTransferAlert: false,
      };
    } else {
      // Leg 3: Smart Road Pod EV
      const legProg = (progress - 0.8) / 0.2;
      return {
        legIndex: 3,
        vehicleName: "Smart Road Autonomous Pod",
        mode: "pod" as const,
        icon: Zap,
        currentStop: "SkyPort Terminal Concourse",
        nextStop: journey.destination,
        stopsAway: "Final Destination",
        etaMins: Math.max(1, Math.round(8 * (1 - legProg))),
        remainingTotalMins: Math.max(1, Math.round(38 * (1 - progress))),
        speedKmH: 45,
        status: "Approaching Curb",
        showTransferAlert: false,
      };
    }
  }, [progress, forceTransferAlert, journey.destination]);

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
        "Tell Univa: Get off at Central Station in 2 minutes. Change to SkyRail Line 02 on Platform 2. Elevator link is step-free."
      );
    }, 2200);
  };

  const handleArriveNow = () => {
    setProgress(1);
    router.push("/complete");
  };

  // Interpolate GPS coordinates for visual map
  const mapCoords = useMemo(() => {
    // Bus leg (0.0 - 0.42): from (80, 360) to (240, 220)
    // SkyRail leg (0.42 - 0.8): from (240, 220) to (460, 110)
    // Pod leg (0.8 - 1.0): from (460, 110) to (580, 50)
    let x = 80;
    let y = 360;

    if (progress < 0.42) {
      const t = progress / 0.42;
      x = 80 + (240 - 80) * t;
      y = 360 + (220 - 360) * t;
    } else if (progress < 0.8) {
      const t = (progress - 0.42) / 0.38;
      x = 240 + (460 - 240) * t;
      y = 220 + (110 - 220) * t;
    } else {
      const t = (progress - 0.8) / 0.2;
      x = 460 + (580 - 460) * t;
      y = 110 + (50 - 110) * t;
    }

    return { x, y };
  }, [progress]);

  const VehicleIcon = currentLeg.icon;

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      {/* ========================================================================= */}
      {/* SECTION 19: HEADER WITH ON-TIME STATUS                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <Link
            href="/journey-plan"
            className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#192841] text-[#0F172A] transition-all shadow-xs"
            title="Back to Journey Plan"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Your Journey
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#192841]/10 text-[#192841] text-xs font-bold">
                Step 3 of 4 • Live Transit
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Real-time telemetry and GPS position tracking.
            </p>
          </div>
        </div>

        {/* Status Indicator (Section 19: Status: 🟢 On Time) */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span>🟢 On Time • Synchronized Telemetry</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 24: TRANSFER ALERT (Prominent notification when approaching hub)   */}
      {/* ========================================================================= */}
      {(currentLeg.showTransferAlert || forceTransferAlert) && (
        <div className="bg-amber-50 rounded-3xl border-2 border-amber-300 p-5 sm:p-6 shadow-md animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 animate-bounce">
                🔄
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">
                  Transfer Coming Up
                </span>
                <h3 className="text-lg sm:text-xl font-black text-amber-950">
                  Change to SkyRail Line 02
                </h3>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                  Get off at <strong>Central Station</strong> in <strong>2 minutes</strong>. Walk 120m to Platform 2.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950 pt-1">
                  <Accessibility size={14} className="text-blue-600" />
                  <span>Step-free elevator connection on North Concourse</span>
                </div>
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
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
          <span>Start (KDU)</span>
          <span className={progress >= 0.2 ? "text-[#192841]" : ""}>Bus 245</span>
          <span className={progress >= 0.42 ? "text-[#192841]" : ""}>Central Hub</span>
          <span className={progress >= 0.6 ? "text-[#192841]" : ""}>SkyRail 02</span>
          <span className={progress >= 0.85 ? "text-[#192841]" : ""}>Smart Pod</span>
          <span className={progress >= 0.98 ? "text-emerald-600" : ""}>Destination</span>
        </div>

        {/* Progress Bar Track */}
        <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#192841] via-sky-600 to-[#22C55E] transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#64748B]">
          <span>{Math.round(progress * 100)}% route completed</span>
          <span>{currentLeg.remainingTotalMins} min remaining until destination</span>
        </div>
      </div>

      {/* Main Grid: Live Map + Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* SECTION 20: LIVE MAP (Main portion of the screen)                         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 bg-[#0F172A] rounded-3xl border border-[#E2E8F0] p-4 sm:p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[440px] sm:min-h-[500px]">
          {/* Subtle Grid Map Canvas Pattern */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#94A3B8 1px, transparent 1px), radial-gradient(#94A3B8 1px, #0F172A 1px)",
              backgroundSize: "28px 28px",
              backgroundPosition: "0 0, 14px 14px",
            }}
          />

          {/* SVG Map Path Representation */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 640 440"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Planned Route Line */}
            <path
              d="M 80 360 C 140 320, 180 280, 240 220"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="5"
              strokeDasharray="6 6"
            />
            <path
              d="M 240 220 C 320 180, 390 140, 460 110"
              fill="none"
              stroke="#22C55E"
              strokeWidth="6"
            />
            <path
              d="M 460 110 C 510 80, 540 65, 580 50"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="5"
            />

            {/* Completed Path dynamic highlight */}
            <circle cx="80" cy="360" r="7" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="3" />
            <circle cx="240" cy="220" r="10" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="4" />
            <circle cx="460" cy="110" r="9" fill="#FFFFFF" stroke="#22C55E" strokeWidth="4" />
            <circle cx="580" cy="50" r="8" fill="#FFFFFF" stroke="#EF4444" strokeWidth="4" />

            {/* Live Moving Vehicle Marker */}
            <g transform={`translate(${mapCoords.x}, ${mapCoords.y})`}>
              <circle r="18" fill="#38BDF8" opacity="0.3" className="animate-ping" />
              <circle r="12" fill="#192841" stroke="#FFFFFF" strokeWidth="3" />
              <circle r="5" fill="#22C55E" />
            </g>
          </svg>

          {/* Map Top Floating Controls */}
          <div className="relative z-10 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 font-bold flex items-center gap-1.5 shadow-sm">
                <Navigation size={13} className="text-sky-400" />
                <span>GPS Telemetry Active</span>
              </span>
              <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-[#192841]/90 backdrop-blur-md border border-white/20 font-semibold text-slate-300">
                Speed: {currentLeg.speedKmH} km/h
              </span>
            </div>

            {/* Simulation controls */}
            <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                type="button"
                onClick={() => setSimSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 5 : 1))}
                className="px-2 py-1 rounded-lg hover:bg-white/20 text-[11px] font-bold text-white transition-colors cursor-pointer"
                title="Simulation speed"
              >
                {simSpeed}x
              </button>
              <button
                type="button"
                onClick={() => setProgress(0.05)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Restart"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Map Bottom Station Callouts */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4">
            <div className="bg-black/80 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-white text-xs space-y-0.5">
              <span className="text-[10px] text-sky-400 font-bold uppercase block">Origin</span>
              <div className="font-bold truncate">{journey.origin}</div>
              <div className="text-[11px] text-slate-400">Boarded Autonomous Bus 245</div>
            </div>

            <div className="bg-black/80 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-white text-xs space-y-0.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase block">Transfer Point</span>
              <div className="font-bold truncate">Central Station Hub</div>
              <div className="text-[11px] text-slate-400">Connecting to SkyRail Line 02</div>
            </div>

            <div className="bg-black/80 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-white text-xs space-y-0.5">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Destination</span>
              <div className="font-bold truncate">{journey.destination}</div>
              <div className="text-[11px] text-slate-400">ETA: {journey.arrivalTime}</div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: VEHICLE CARD & NEXT STOP (4 Cols)                           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* SECTION 21: CURRENT VEHICLE CARD */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Current Vehicle
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                {currentLeg.status}
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#192841] text-white flex items-center justify-center shrink-0 shadow-sm">
                <VehicleIcon size={22} />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-[#0F172A] truncate">
                  {currentLeg.vehicleName}
                </h3>
                <p className="text-xs font-bold text-emerald-600">
                  You&apos;re on this vehicle
                </p>
                <div className="text-xs text-[#64748B] pt-0.5">
                  <strong className="text-[#0F172A]">{currentLeg.etaMins} min</strong> remaining on this leg
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Boarded At:</span>
                <span className="font-semibold text-[#0F172A] truncate max-w-[180px]">
                  {currentLeg.currentStop}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Guideway Speed:</span>
                <span className="font-bold text-[#192841]">{currentLeg.speedKmH} km/h</span>
              </div>
            </div>
          </div>

          {/* SECTION 22: NEXT STOP CARD (Highly visible) */}
          <div className="bg-white rounded-3xl border-2 border-[#192841] p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#192841] uppercase tracking-wider">
                Next Stop
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#192841] text-white">
                {currentLeg.stopsAway}
              </span>
            </div>
            <div className="text-xl font-black text-[#0F172A] tracking-tight">
              {currentLeg.nextStop}
            </div>
            <p className="text-xs text-[#64748B]">
              Prepare your personal belongings. Doors open on the right side.
            </p>
          </div>

          {/* SECTION 25: VOICE ASSISTANCE ("TELL UNIVA") */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A]">
                Tell Univa Voice Co-Pilot
              </span>
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
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
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
                className="py-2 px-3 rounded-xl bg-[#192841] hover:bg-[#111C2E] text-[11px] font-bold text-white transition-colors flex items-center justify-center gap-1"
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
