"use client";

import React, { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
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
  ArrowLeftRight,
  X,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  MapPin,
  ShieldCheck,
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
  fromIdx: number;
  toIdx: number;
  mins: number;
  speedKmH: number;
  nextVehicle: string | null;
}

const INITIAL_LEGS: JourneyLeg[] = [
  {
    name: "Autonomous Bus 245",
    vehicleType: "Bus",
    plate: "UN-245",
    icon: Bus,
    fromIdx: UN01_LEGS[0].fromIdx,
    toIdx: UN01_LEGS[0].toIdx,
    mins: UN01_LEGS[0].mins,
    speedKmH: 52,
    nextVehicle: "SkyRail Line 02 Maglev",
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

interface DisruptionState {
  active: boolean;
  phase: "idle" | "alert" | "rebooking" | "confirmed";
  cancelledVehicle: string;
  cancelledReason: string;
  rebookedVehicle: string;
  rebookedPlate: string;
  rebookedPlatform: string;
  timeAdjustment: string;
  fareNote: string;
}

function LiveJourneyContent() {
  const router = useRouter();
  const { journey } = useAuth();

  // Dynamic legs state so auto-rebooking can replace legs seamlessly
  const [legs, setLegs] = useState<JourneyLeg[]>(INITIAL_LEGS);

  // Disruption and automated rebooking state
  const [disruption, setDisruption] = useState<DisruptionState>({
    active: false,
    phase: "idle",
    cancelledVehicle: "SkyRail Line 02 Maglev",
    cancelledReason: "Elevated Guideway Track Calibration at Fort Central Hub",
    rebookedVehicle: "Express HyperPod XP-09",
    rebookedPlate: "POD-XP09",
    rebookedPlatform: "Platform Bay 6 (Direct Autonomous Guideway)",
    timeAdjustment: "+2 min adjustment",
    fareNote: "LKR 0.00 (Univa Fare Guarantee)",
  });

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

  // Text-to-speech helper for accessibility
  const speakText = useCallback((text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Keyboard accessibility: Escape key closes active modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setForceTransferAlert(false);
        setDisruption((prev) => ({ ...prev, active: false }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  // Fleet telemetry simulation
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

  // Derived trip telemetry
  const trip = useMemo(() => {
    const pos = progress * LAST_STOP;
    const legIndex = pos < legs[0].toIdx ? 0 : pos < legs[1].toIdx ? 1 : 2;
    const currentLeg = legs[legIndex];
    const legProg = Math.min(1, Math.max(0, (pos - currentLeg.fromIdx) / (currentLeg.toIdx - currentLeg.fromIdx)));

    const stopIdx = Math.min(LAST_STOP - 1, Math.floor(pos));
    const segProgress = Math.min(1, pos - stopIdx);
    const nextStop = STOPS[stopIdx + 1];
    const transferStop = STOPS[currentLeg.toIdx];
    const stopsToLegEnd = currentLeg.toIdx - (stopIdx + 1);

    const legEtaMins = Math.max(1, Math.round(currentLeg.mins * (1 - legProg)));
    const minsPerStop = currentLeg.mins / (currentLeg.toIdx - currentLeg.fromIdx);
    const nextStopEta = Math.max(1, Math.round(minsPerStop * (1 - segProgress)));

    const riderBus: LiveBus = {
      id: RIDER_BUS_ID,
      plate: currentLeg.plate,
      vehicleType: currentLeg.vehicleType,
      routeId: ROUTE.id,
      direction: "outbound",
      currentStopIndex: stopIdx,
      progress: segProgress,
      speed: currentLeg.speedKmH,
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
      leg: currentLeg,
      legProg,
      boardedAt: STOPS[currentLeg.fromIdx].name,
      nextStop,
      transferStop,
      stopsToLegEnd,
      legEtaMins,
      remainingTotalMins: Math.max(1, Math.round(TOTAL_TRIP_MINS * (1 - progress))),
      isApproachingTransfer: currentLeg.nextVehicle !== null && legProg > 0.65,
      riderBus,
    };
  }, [progress, legs]);

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

  // Voice Query Handler
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
      const vocalText = leg.nextVehicle
        ? `Get off at ${transferStop.name} in ${trip.legEtaMins} minutes. Change to ${leg.nextVehicle} at ${
            transferStop.landmark ?? "the interchange platform"
          }. The connection is step-free.`
        : `Your last stop is ${transferStop.name}, about ${trip.legEtaMins} minutes away. No more transfers.`;

      setVoiceSpeechMessage(`Tell Univa: ${vocalText}`);
      speakText(vocalText);
    }, 2200);
  };

  // Voice read aloud for Transfer Alert
  const handleVoiceTransferGuidance = () => {
    const text = `Transfer coming up. Please change to ${leg.nextVehicle ?? "your next service"}. Get off at ${
      transferStop.name
    } in ${trip.legEtaMins} minutes. Follow the step-free Platform 3 SkyGuideway link.`;
    speakText(text);
  };

  // Trigger Disruption & Autonomous Rebooking Simulation
  const handleSimulateDisruption = () => {
    setDisruption({
      active: true,
      phase: "alert",
      cancelledVehicle: "SkyRail Line 02 Maglev",
      cancelledReason: "Elevated Guideway Track Calibration at Fort Central Hub",
      rebookedVehicle: "Express HyperPod XP-09",
      rebookedPlate: "POD-XP09",
      rebookedPlatform: "Platform Bay 6 (Direct Autonomous Guideway)",
      timeAdjustment: "+2 min adjustment",
      fareNote: "LKR 0.00 (Univa Fare Guarantee)",
    });

    speakText("Service alert: SkyRail Line 02 is suspended due to track calibration. Univa Autonomous Grid is auto-rebooking your connection.");

    setTimeout(() => {
      setDisruption((prev) => ({ ...prev, phase: "rebooking" }));
    }, 1500);

    setTimeout(() => {
      setDisruption((prev) => ({ ...prev, phase: "confirmed" }));

      setLegs((prev) => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          nextVehicle: "Express HyperPod XP-09",
        };
        updated[1] = {
          ...updated[1],
          name: "Express HyperPod XP-09",
          vehicleType: "HyperPod",
          plate: "POD-XP09",
          icon: Zap,
          speedKmH: 145,
          nextVehicle: "Smart Road Autonomous Pod",
        };
        return updated;
      });

      speakText("Auto-rebooking confirmed. Your journey has been re-routed to Express HyperPod XP-09 from Platform Bay 6 with zero extra fare.");
    }, 3200);
  };

  const handleResetDisruption = () => {
    setDisruption((prev) => ({ ...prev, active: false, phase: "idle" }));
    setLegs(INITIAL_LEGS);
  };

  const handleArriveNow = () => {
    setProgress(1);
    router.push("/complete");
  };

  const handleRecenterMap = () => {
    setSelectedBusId(RIDER_BUS_ID);
  };

  const markerClass = (reached: boolean, arrived = false) =>
    reached ? (arrived ? "text-emerald-600" : "text-[#192841]") : "text-slate-400";

  return (
    <div className="relative w-full">
      {/* ========================================================================= */}
      {/* FULL-SCREEN TRANSFER ALERT POPUP (Accessibility & Usability)               */}
      {/* ========================================================================= */}
      {showTransferAlert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="transfer-alert-title"
          className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E2E8F0] shadow-2xl space-y-6 relative my-auto">
            {/* Close / Dismiss button */}
            <button
              type="button"
              onClick={() => setForceTransferAlert(false)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close transfer alert"
            >
              <X size={20} />
            </button>

            {/* Top Badge & Icon with NO emojis */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <ArrowLeftRight size={28} className="text-white animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full inline-block">
                  Transfer Coming Up
                </span>
                <h2 id="transfer-alert-title" className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1">
                  {leg.nextVehicle ? `Change to ${leg.nextVehicle}` : "Approaching Destination"}
                </h2>
              </div>
            </div>

            {/* Key Connection Details Card */}
            <div className="bg-[#F7F9FC] rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#192841] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] uppercase block u-mono">Get Off At</span>
                  <div className="text-base sm:text-lg font-bold text-[#0F172A]">{transferStop.name}</div>
                  <div className="text-xs text-[#64748B] pt-0.5">
                    In <strong className="text-[#0F172A] u-mono">{trip.legEtaMins} minute{trip.legEtaMins === 1 ? "" : "s"}</strong> • Doors open on platform concourse
                  </div>
                </div>
              </div>

              {leg.nextVehicle && (
                <div className="flex items-start gap-3 pt-3 border-t border-[#E2E8F0]">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Train size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] uppercase block u-mono">Next Vehicle</span>
                    <div className="text-base sm:text-lg font-bold text-[#0F172A]">{leg.nextVehicle}</div>
                    <div className="text-xs text-[#64748B] pt-0.5">
                      {transferStop.landmark ?? "Platform 3 SkyGuideway Link"} • Direct express connection
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accessibility & Audio Guidance Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <Accessibility size={18} className="text-blue-600 shrink-0" />
                <span className="font-semibold">Step-free elevator & concourse path confirmed</span>
              </div>
              <button
                type="button"
                onClick={handleVoiceTransferGuidance}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1 cursor-pointer self-end sm:self-auto min-h-[36px]"
              >
                <Volume2 size={15} />
                <span>Hear Voice Guidance</span>
              </button>
            </div>

            {/* Large Accessible Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => setForceTransferAlert(false)}
                className="w-full py-4 px-6 rounded-2xl bg-[#192841] hover:bg-[#111C2E] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[50px]"
              >
                <span>I&apos;m Ready to Transfer</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => setForceTransferAlert(false)}
                className="w-full py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#192841] font-semibold text-xs transition-colors cursor-pointer min-h-[44px]"
              >
                Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SERVICE CANCELLATION & AUTOMATED REBOOKING MODAL                          */}
      {/* ========================================================================= */}
      {disruption.active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="disruption-modal-title"
          className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E2E8F0] shadow-2xl space-y-6 relative my-auto">
            <button
              type="button"
              onClick={handleResetDisruption}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close disruption dialog"
            >
              <X size={20} />
            </button>

            {/* Disruption Phase 1: Alert */}
            {disruption.phase === "alert" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
                    <AlertTriangle size={28} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-amber-700 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full inline-block">
                      Service Disruption Detected
                    </span>
                    <h3 id="disruption-modal-title" className="text-xl font-black text-[#0F172A] mt-1">
                      {disruption.cancelledVehicle} Cancelled
                    </h3>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-1">
                  <p className="font-bold">Reason: {disruption.cancelledReason}</p>
                  <p className="text-amber-800">
                    Univa Autonomous Grid has detected the delay before your arrival at Fort Hub.
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-[#192841]">
                  <RefreshCw size={18} className="text-[#192841] animate-spin shrink-0" />
                  <span className="font-bold">
                    Autonomous Grid is searching 24 active fleet pods for zero-friction rebooking...
                  </span>
                </div>
              </div>
            )}

            {/* Disruption Phase 2: Searching / Rebooking */}
            {disruption.phase === "rebooking" && (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-[#192841] text-white flex items-center justify-center mx-auto shadow-md">
                  <RefreshCw size={32} className="animate-spin text-sky-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0F172A]">
                    Rebooking in Progress
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    Matching your destination, step-free access requirements, and synchronized arrival window...
                  </p>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#192841] w-3/4 animate-pulse rounded-full" />
                </div>
              </div>
            )}

            {/* Disruption Phase 3: Rebooking Confirmed */}
            {disruption.phase === "confirmed" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full inline-block">
                      Auto-Rebooking Confirmed
                    </span>
                    <h3 id="disruption-modal-title" className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1">
                      New Vehicle Assigned
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#64748B]">
                  Your journey has been automatically re-synchronized with zero manual action required.
                </p>

                {/* Rebooked Details Card */}
                <div className="bg-[#F7F9FC] rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <span className="text-[#64748B] font-medium">Replacement Service:</span>
                    <span className="font-black text-[#0F172A]">{disruption.rebookedVehicle}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <span className="text-[#64748B] font-medium">Boarding Point:</span>
                    <span className="font-bold text-[#192841]">{disruption.rebookedPlatform}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <span className="text-[#64748B] font-medium">Time Adjustment:</span>
                    <span className="font-bold text-amber-600">{disruption.timeAdjustment}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] font-medium">Fare Adjustment:</span>
                    <span className="font-black text-emerald-600">{disruption.fareNote}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>Univa Transit Guarantee: 100% covered with no extra ticket needed.</span>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDisruption((prev) => ({ ...prev, active: false }))}
                    className="w-full py-4 px-6 rounded-2xl bg-[#192841] hover:bg-[#111C2E] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[50px]"
                  >
                    <span>Continue with Rebooked Route</span>
                    <ArrowRight size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDisruption}
                    className="w-full py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#64748B] font-semibold text-xs transition-colors cursor-pointer min-h-[44px]"
                  >
                    Reset Simulation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MOBILE VIEW: IMMERSIVE FULL-SCREEN NAVIGATION (Like Reference Image)       */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed inset-0 z-40 flex flex-col bg-[#0B0F17] overflow-hidden">
        {/* Floating Top Controls over the Map */}
        <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
          {/* Floating Round Back Button */}
          <Link
            href="/journey-plan"
            className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-200/80 flex items-center justify-center text-[#192841] hover:bg-white active:scale-95 transition-all pointer-events-auto cursor-pointer"
            title="Back to Journey Plan"
            aria-label="Back to Journey Plan"
          >
            <ArrowLeft size={20} />
          </Link>

          {/* Floating Status Badge */}
          <div className="flex items-center gap-2 bg-[#0F141C]/90 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full shadow-lg text-white text-xs font-bold pointer-events-auto">
            <span className="u-pulse-dot" style={{ "--pulse-color": "#22C55E" } as React.CSSProperties} />
            <span>On Time • Autonomous Grid</span>
          </div>

          {/* Floating Voice Button */}
          <button
            type="button"
            onClick={handleVoiceQuery}
            className={`w-11 h-11 rounded-full shadow-lg border flex items-center justify-center transition-all pointer-events-auto cursor-pointer active:scale-95 ${
              isVoiceListening
                ? "bg-[#192841] text-white border-white animate-pulse"
                : "bg-white/95 backdrop-blur-md text-[#192841] border-slate-200/80 hover:bg-white"
            }`}
            title="Tell Univa Voice Co-Pilot"
            aria-label="Tell Univa Voice Co-Pilot"
          >
            <Mic size={20} />
          </button>
        </div>

        {/* Floating Action Buttons above the Bottom Sheet */}
        <div className="absolute right-4 bottom-[calc(240px+1.5rem)] z-30 flex flex-col gap-2.5 pointer-events-auto">
          <button
            type="button"
            onClick={handleRecenterMap}
            className="w-11 h-11 rounded-full bg-white shadow-xl border border-slate-200/90 flex items-center justify-center text-[#192841] hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            title="Recenter Map"
            aria-label="Recenter Map"
          >
            <Navigation size={18} />
          </button>
          <button
            type="button"
            onClick={handleSimulateDisruption}
            className="w-11 h-11 rounded-full bg-amber-500 shadow-xl border border-amber-600 flex items-center justify-center text-white hover:bg-amber-600 active:scale-95 transition-all cursor-pointer"
            title="Simulate Disruption & Auto-Rebooking"
            aria-label="Simulate Disruption"
          >
            <AlertTriangle size={18} />
          </button>
        </div>

        {/* Map Container: Fills upper viewport edge-to-edge */}
        <div className="flex-1 w-full relative min-h-[300px]">
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
            heightClass="h-full"
            className="rounded-none border-0 shadow-none"
            hideTopOverlay={true}
          />
        </div>

        {/* DOCKED BOTTOM SHEET (Styled after the uploaded reference image) */}
        <div className="relative z-30 w-full bg-white rounded-t-[28px] border-t border-slate-200/80 shadow-[0_-12px_36px_rgba(15,23,42,0.16)] px-4 pt-3 pb-6 space-y-3 shrink-0">
          {/* Drag handle pill */}
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />

          {/* Current Vehicle & Next Stop Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-[#192841] text-white flex items-center justify-center shrink-0 shadow-xs">
                <VehicleIcon size={20} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-[#0F172A] truncate">{leg.name}</div>
                <div className="text-xs text-[#64748B] truncate">
                  Next: <strong className="text-[#0F172A]">{nextStop.name}</strong> ({trip.riderBus.etaMinutes} min)
                </div>
              </div>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
              {trip.riderBus.status}
            </span>
          </div>

          {/* Prominent Tell Univa Voice Assistant Button on Mobile */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleVoiceQuery}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm min-h-[46px] ${
                isVoiceListening
                  ? "bg-[#192841] text-white ring-4 ring-[#192841]/20 animate-pulse"
                  : "bg-[#192841] hover:bg-[#111C2E] text-white active:scale-[0.99]"
              }`}
              title="Tell Univa Voice Assistant"
              aria-label="Tell Univa Voice Assistant"
            >
              <Mic size={18} className={isVoiceListening ? "animate-pulse text-sky-400" : "text-white"} />
              <span>{isVoiceListening ? "Listening to rider..." : "🎙 Tell Univa — Ask Voice Assistant"}</span>
            </button>

            {/* Vocal response message on mobile */}
            {voiceSpeechMessage && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A] flex items-start gap-2.5 animate-fadeIn">
                <Volume2 size={16} className="text-[#192841] shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{voiceSpeechMessage}</p>
              </div>
            )}
          </div>

          {/* Transfer Alert Preview Pill (if approaching transfer) */}
          {trip.isApproachingTransfer && (
            <button
              type="button"
              onClick={() => setForceTransferAlert(true)}
              className="w-full p-2.5 rounded-2xl bg-amber-50 border border-amber-300 text-left flex items-center justify-between text-xs text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <ArrowLeftRight size={15} className="text-amber-600 shrink-0" />
                <span className="truncate font-bold">Transfer Coming Up: Change to {leg.nextVehicle}</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full shrink-0">
                View
              </span>
            </button>
          )}

          {/* ========================================================================= */}
          {/* PROCESS BAR AT BOTTOM (As specified in user request)                       */}
          {/* ========================================================================= */}
          <div className="pt-2 space-y-1.5 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
              <span className="text-[#192841] truncate max-w-[130px]">KDU, Ratmalana</span>
              <span className="text-[#192841] u-mono font-black">{Math.round(progress * 100)}%</span>
              <span className="text-emerald-700 truncate max-w-[130px]">BIA Airport</span>
            </div>

            {/* Progress Bar Track */}
            <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#192841] via-sky-600 to-[#22C55E] transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#64748B]">
              <span>{nextStopBadge}</span>
              <span className="font-bold text-[#0F172A]">{trip.remainingTotalMins} min remaining</span>
            </div>
          </div>

          {/* Mobile Bottom Quick Actions */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setForceTransferAlert(true)}
              className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#192841] font-bold text-xs transition-colors text-center cursor-pointer min-h-[44px]"
            >
              Transfer Alert
            </button>
            <button
              type="button"
              onClick={handleSimulateDisruption}
              className="py-2.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs transition-colors text-center cursor-pointer min-h-[44px]"
            >
              Auto-Rebook
            </button>
            <button
              type="button"
              onClick={handleArriveNow}
              className="py-2.5 px-2 rounded-xl bg-[#192841] hover:bg-[#111C2E] text-white font-bold text-xs transition-colors text-center cursor-pointer min-h-[44px]"
            >
              Arrive Now
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP VIEW: PROPORTIONED DASHBOARD WITH TELEMETRY                       */}
      {/* ========================================================================= */}
      <div className="hidden lg:block min-h-screen pt-24 pb-16 px-6 max-w-6xl mx-auto space-y-6">
        {/* Flow Header */}
        <FlowHeader
          backHref="/journey-plan"
          backTitle="Back to Journey Plan"
          title="Your Journey"
          step="Step 3 of 4 • Live Transit"
          subtitle={`Live route telemetry from the SmartMetro grid • ${ROUTE.title}`}
          status="On Time • Synchronized Telemetry"
        />

        {/* Top Progress Bar (Desktop) */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm space-y-3 u-surface">
          <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
            <span className="text-[#192841] font-extrabold">Start (KDU)</span>
            <span className={markerClass(progress >= 0.05)}>Bus 245</span>
            <span className={markerClass(progress >= legs[0].toIdx / LAST_STOP)}>Colombo Fort Hub</span>
            <span className={markerClass(progress >= (legs[0].toIdx + 1) / LAST_STOP)}>{legs[1].name}</span>
            <span className={markerClass(progress >= legs[1].toIdx / LAST_STOP)}>Ja-Ela Interchange</span>
            <span className={markerClass(progress >= 0.98, true)}>Destination (BIA)</span>
          </div>

          <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#192841] via-sky-600 to-[#22C55E] transition-all duration-300 rounded-full u-shimmer"
              style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="u-mono font-bold text-[#192841]">{Math.round(progress * 100)}% route completed</span>
            <span className="u-mono font-bold text-[#0F172A]">{trip.remainingTotalMins} min remaining until destination</span>
          </div>
        </div>

        {/* Main Grid: Live Map (8 cols) + Telemetry Cards (4 cols) */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Live Map Column */}
          <div className="col-span-8 space-y-4">
            {/* Simulation controls */}
            <div className="flex items-center justify-between gap-3 bg-white rounded-2xl border border-[#E2E8F0] px-4 py-2.5 shadow-xs u-surface">
              <div className="flex items-center gap-2 text-xs font-bold text-[#192841] min-w-0">
                <Radio size={14} className="text-[#22C55E] shrink-0 animate-pulse" />
                <span className="truncate">SmartMetro live feed • Active: {leg.vehicleType} {leg.plate}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Desktop Quick Voice Button */}
                <button
                  type="button"
                  onClick={handleVoiceQuery}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isVoiceListening
                      ? "bg-[#192841] text-white ring-2 ring-[#192841]/30 animate-pulse"
                      : "bg-[#192841] hover:bg-[#111C2E] text-white"
                  }`}
                  title="Tell Univa Voice Co-Pilot"
                  aria-label="Tell Univa Voice Co-Pilot"
                >
                  <Mic size={14} className={isVoiceListening ? "animate-pulse text-sky-400" : "text-white"} />
                  <span>{isVoiceListening ? "Listening..." : "🎙 Tell Univa"}</span>
                </button>

                <div className="flex items-center gap-1.5 bg-[#F7F9FC] p-1 rounded-xl border border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-lg hover:bg-white text-[#192841] transition-colors cursor-pointer min-w-[32px] flex items-center justify-center"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 5 : 1))}
                    className="px-2.5 py-1 rounded-lg hover:bg-white text-xs font-bold text-[#192841] transition-colors cursor-pointer"
                    title="Simulation speed"
                  >
                    {simSpeed}x
                  </button>
                  <button
                    type="button"
                    onClick={() => setProgress(0.05)}
                    className="p-2 rounded-lg hover:bg-white text-[#192841] transition-colors cursor-pointer min-w-[32px] flex items-center justify-center"
                    title="Restart"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Vector Map */}
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
              heightClass="h-[540px] lg:h-[580px]"
            />

            {/* Origin / Transfer / Destination Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-3.5 border border-[#E2E8F0] text-xs space-y-0.5 shadow-xs u-surface">
                <span className="text-[10px] text-sky-600 font-bold uppercase block u-mono">Origin</span>
                <div className="font-bold text-[#0F172A] truncate">{journey.origin}</div>
                <div className="text-[11px] text-[#64748B]">Boarded {legs[0].name}</div>
              </div>

              <div className="bg-white rounded-2xl p-3.5 border border-[#E2E8F0] text-xs space-y-0.5 shadow-xs u-surface">
                <span className="text-[10px] text-amber-600 font-bold uppercase block u-mono">Transfer Point</span>
                <div className="font-bold text-[#0F172A] truncate">{STOPS[legs[0].toIdx].name}</div>
                <div className="text-[11px] text-[#64748B]">Connecting to {legs[0].nextVehicle}</div>
              </div>

              <div className="bg-white rounded-2xl p-3.5 border border-[#E2E8F0] text-xs space-y-0.5 shadow-xs u-surface">
                <span className="text-[10px] text-emerald-600 font-bold uppercase block u-mono">Destination</span>
                <div className="font-bold text-[#0F172A] truncate">{journey.destination}</div>
                <div className="text-[11px] text-[#64748B]">ETA: {journey.arrivalTime}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry Cards & Shortcuts */}
          <div className="col-span-4 space-y-4">
            {/* Current Vehicle Card */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm space-y-4 u-surface u-hud">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider u-mono">
                  Current Vehicle
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
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
                    <strong className="text-[#0F172A] u-mono">{trip.legEtaMins} min</strong> remaining on this leg
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
                  <span className="font-bold text-[#192841] u-mono">{leg.speedKmH} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Seats Free:</span>
                  <span className="font-bold text-[#192841] u-mono">{trip.riderBus.seatsAvailable}</span>
                </div>
              </div>
            </div>

            {/* Next Stop Card */}
            <div className="bg-white rounded-3xl border-2 border-[#192841] p-5 sm:p-6 shadow-sm space-y-2 u-glow">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#192841] uppercase tracking-wider u-mono">Next Stop</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#192841] text-white text-right">
                  {nextStopBadge}
                </span>
              </div>
              <div className="text-xl font-black text-[#0F172A] tracking-tight">{nextStop.name}</div>
              <p className="text-xs text-[#64748B]">
                {nextStop.landmark ? `${nextStop.landmark} • ` : ""}Arriving in{" "}
                <strong className="text-[#0F172A] u-mono">{trip.riderBus.etaMinutes} min</strong>. Doors open on platform side.
              </p>
            </div>

            {/* Voice Assistance Card */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-sm space-y-3 u-surface u-hud">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">Tell Univa Voice Co-Pilot</span>
                <span className="text-[10px] text-[#64748B] font-semibold">Hands-Free</span>
              </div>

              <button
                type="button"
                onClick={handleVoiceQuery}
                className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[46px] ${
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

            {/* Evaluation & Simulation Shortcuts */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-[#E2E8F0] space-y-2.5">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block u-mono">
                Evaluation Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForceTransferAlert(!forceTransferAlert)}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-[#192841] border border-[#E2E8F0] transition-colors cursor-pointer text-center min-h-[40px]"
                >
                  Transfer Alert Pop
                </button>
                <button
                  type="button"
                  onClick={handleSimulateDisruption}
                  className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-900 border border-amber-200 transition-colors cursor-pointer text-center min-h-[40px]"
                >
                  Simulate Rebooking
                </button>
              </div>
              <button
                type="button"
                onClick={handleArriveNow}
                className="w-full py-2.5 px-3 rounded-xl bg-[#192841] hover:bg-[#111C2E] u-btn text-xs font-bold text-white transition-colors flex items-center justify-center gap-1 cursor-pointer min-h-[40px]"
              >
                <span>Fast-forward Arrive</span>
                <ArrowRight size={14} />
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
