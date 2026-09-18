"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Clock,
  Radio,
  ArrowRight,
  MapPin,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import LiveJourneyMap from "./LiveJourneyMap";
import { JourneyOption, TransportModeType } from "./journeyData";

interface Step4LiveTripProps {
  journeyPlan: JourneyOption;
  onTripAutoCompleted: () => void;
  onReroute: () => void;
}

export default function Step4LiveTrip({
  journeyPlan,
  onTripAutoCompleted,
  onReroute,
}: Step4LiveTripProps) {
  const [progress, setProgress] = useState(0.08);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5>(2);

  // Dynamic Telemetry calculation
  const currentLegState = useMemo(() => {
    if (progress < 0.38) {
      const isApproaching = progress > 0.25;
      return {
        mode: "bus" as TransportModeType,
        vehicleName: "Autonomous Bus U-204",
        speedKmH: 54,
        fromStop: "KDU, Ratmalana",
        nextStop: "Central Station Multimodal Hub",
        stopsAway: isApproaching ? "Approaching Central Station" : "2 stops away",
        etaMinutes: Math.max(1, Math.round(15 * (1 - progress / 0.38))),
        remainingTotalMinutes: Math.max(1, Math.round(38 * (1 - progress))),
        transferAlert: isApproaching
          ? {
              hub: "Central Station Interchange",
              nextVehicle: "SkyRail Line 02 (Platform 2)",
              timeMins: 2,
            }
          : null,
      };
    } else if (progress < 0.72) {
      const legProgress = (progress - 0.38) / 0.34;
      const isApproaching = legProgress > 0.65;
      return {
        mode: "skyrail" as TransportModeType,
        vehicleName: "SkyRail Line 02 Maglev",
        speedKmH: 180,
        fromStop: "Central Station Platform 2",
        nextStop: "SkyPort Interchange Gateway",
        stopsAway: isApproaching ? "Approaching SkyPort Gate A1" : "1 stop away",
        etaMinutes: Math.max(1, Math.round(10 * (1 - legProgress))),
        remainingTotalMinutes: Math.max(1, Math.round(38 * (1 - progress))),
        transferAlert: isApproaching
          ? {
              hub: "SkyPort Aviation Gateway",
              nextVehicle: "Aeropod Air Shuttle (Gate A1)",
              timeMins: 1,
            }
          : null,
      };
    } else {
      const legProgress = (progress - 0.72) / 0.28;
      return {
        mode: "air" as TransportModeType,
        vehicleName: "Aeropod Air Transport Shuttle",
        speedKmH: 110,
        fromStop: "SkyPort Gateway Gate A1",
        nextStop: "Bandaranaike International Airport (BIA)",
        stopsAway: "Direct Aerial Guideway",
        etaMinutes: Math.max(1, Math.round(8 * (1 - legProgress))),
        remainingTotalMinutes: Math.max(1, Math.round(38 * (1 - progress))),
        transferAlert: null,
      };
    }
  }, [progress]);

  // Simulation timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.014 * simSpeed;
        if (next >= 1.0) {
          clearInterval(interval);
          setTimeout(() => onTripAutoCompleted(), 500);
          return 1.0;
        }
        return next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying, simSpeed, onTripAutoCompleted]);

  return (
    <div className="space-y-5 text-slate-900">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live GPS Navigation • On Time</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            You&apos;re on your way
          </h2>
        </div>

        <button
          type="button"
          onClick={onReroute}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 transition-colors cursor-pointer"
        >
          Reroute
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. LIVE TRACKING MAP (EMBEDDED INSIDE STEP 4 HERO SCREEN)                 */}
      {/* ========================================================================= */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-[240px] sm:h-[280px]">
        <LiveJourneyMap
          progress={progress}
          activeMode={currentLegState.mode}
          currentVehicleName={currentLegState.vehicleName}
          speedKmH={currentLegState.speedKmH}
          fromLocation={journeyPlan.from}
          toLocation={journeyPlan.to}
          className="w-full h-full"
        />
      </div>

      {/* Transfer Alert (Subtle Notification) */}
      {currentLegState.transferAlert && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <strong className="text-xs font-semibold text-slate-900">
              Transfer in {currentLegState.transferAlert.timeMins} min
            </strong>
            <span className="text-xs text-slate-500">
              {currentLegState.transferAlert.hub}
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Alight and change to <strong>{currentLegState.transferAlert.nextVehicle}</strong>.
          </p>
        </div>
      )}

      {/* Current Vehicle Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <strong className="text-base font-bold text-slate-900 block">
              {currentLegState.vehicleName}
            </strong>
            <span className="text-xs text-slate-500">
              You&apos;re on this vehicle
            </span>
          </div>

          <div className="text-right">
            <span className="text-xl font-bold text-[#192841] block">
              {currentLegState.etaMinutes} min
            </span>
            <span className="text-xs text-slate-400">this leg</span>
          </div>
        </div>

        {/* Origin -> Next Stop */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">From</span>
            <strong className="text-slate-800 block truncate mt-0.5">{currentLegState.fromStop}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Next Stop ({currentLegState.stopsAway})</span>
            <strong className="text-slate-900 block truncate mt-0.5">{currentLegState.nextStop}</strong>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D6DAE3] space-y-2 shadow-xs">
        <div className="flex items-center justify-between text-xs text-[#5A6B85]">
          <span className="font-semibold">Trip Progress</span>
          <span className="font-bold text-[#0F172A]">
            {currentLegState.remainingTotalMinutes} min remaining to {journeyPlan.to}
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#F7F8FA] border border-[#D6DAE3]/50 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#72222B] to-[#9E303D] rounded-full transition-all duration-300 shadow-xs"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="p-3 bg-[#F7F8FA] rounded-2xl border border-[#D6DAE3] flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#D6DAE3] text-[#0F172A] hover:bg-[#F7F8FA] font-bold cursor-pointer shadow-2xs transition-colors"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => setSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 5 : 1)}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#D6DAE3] text-[#5A6B85] font-semibold cursor-pointer shadow-2xs hover:text-[#0F172A] transition-colors"
          >
            {simSpeed}x Speed
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setProgress(1.0);
            onTripAutoCompleted();
          }}
          className="px-4 py-2 rounded-xl bg-[#72222B] hover:bg-[#5B1B22] text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
        >
          Arrive Now
        </button>
      </div>
    </div>
  );
}
