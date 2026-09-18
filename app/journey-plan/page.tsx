"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Footprints,
  Train,
  Zap,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { AuthGuard, useAuth } from "../context/auth";

function JourneyPlanContent() {
  const router = useRouter();
  const { journey } = useAuth();

  const handleStartJourney = () => {
    router.push("/live-journey");
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <Link
            href="/preferences"
            className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#192841] text-[#0F172A] transition-all shadow-xs"
            title="Back to Route Preferences"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Your Journey
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#192841]/10 text-[#192841] text-xs font-bold">
                Step 2 of 4
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Review your synchronized multi-modal itinerary before starting live transit.
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
          <CheckCircle2 size={14} className="text-emerald-600" />
          <span>Synchronized & On Time</span>
        </div>
      </div>

      {/* From & To Route Card */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-[#192841] border-2 border-white ring-2 ring-[#192841]/30" />
            <div className="w-0.5 h-10 bg-[#E2E8F0] border-dashed" />
            <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-500/30" />
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                From
              </span>
              <div className="text-base font-bold text-[#0F172A]">
                {journey.origin}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                To
              </span>
              <div className="text-base font-bold text-[#0F172A]">
                {journey.destination}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/preferences"
            className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-xs font-bold text-[#192841] transition-all"
          >
            Change Destination
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 16: JOURNEY SUMMARY (Arrival, Time, Transfers, Walking)           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Arrival */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#192841]/10 text-[#192841] flex items-center justify-center mb-3">
            <Clock size={18} />
          </div>
          <div className="text-2xl font-black text-[#0F172A] tracking-tight">
            {journey.arrivalTime}
          </div>
          <div className="text-xs font-semibold text-[#64748B] mt-0.5">
            Arrival Time
          </div>
        </div>

        {/* Journey Time */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#192841]/10 text-[#192841] flex items-center justify-center mb-3">
            <Zap size={18} />
          </div>
          <div className="text-2xl font-black text-[#0F172A] tracking-tight">
            {journey.durationMins} min
          </div>
          <div className="text-xs font-semibold text-[#64748B] mt-0.5">
            Journey Time
          </div>
        </div>

        {/* Transfers */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#192841]/10 text-[#192841] flex items-center justify-center mb-3">
            <Train size={18} />
          </div>
          <div className="text-2xl font-black text-[#0F172A] tracking-tight">
            {journey.transfersCount}
          </div>
          <div className="text-xs font-semibold text-[#64748B] mt-0.5">
            Transfers
          </div>
        </div>

        {/* Walking */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#192841]/10 text-[#192841] flex items-center justify-center mb-3">
            <Footprints size={18} />
          </div>
          <div className="text-2xl font-black text-[#0F172A] tracking-tight">
            {journey.walkingMins} min
          </div>
          <div className="text-xs font-semibold text-[#64748B] mt-0.5">
            Walking (350m)
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 17: JOURNEY TIMELINE (Exact Specification from AGENTS.md)          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">
              Journey Timeline
            </h3>
            <p className="text-xs text-[#64748B]">
              Step-by-step synchronized connection timeline
            </p>
          </div>
          <span className="text-xs font-bold text-[#192841] bg-[#192841]/10 px-3 py-1 rounded-full">
            All Legs Confirmed
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6">
          {/* Vertical timeline spine */}
          <div className="absolute left-2.5 sm:left-3 top-3 bottom-3 w-0.5 bg-[#192841]/20" />

          {/* ITEM 1: Current Location */}
          <div className="relative flex items-start gap-4">
            <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-[#192841] text-white flex items-center justify-center text-[10px] ring-4 ring-white">
              📍
            </div>
            <div>
              <span className="text-xs font-black text-[#192841]">09:58 AM</span>
              <h4 className="text-sm font-bold text-[#0F172A]">Current Location</h4>
              <p className="text-xs text-[#64748B]">{journey.origin}</p>
            </div>
          </div>

          {/* ITEM 2: Walk */}
          <div className="relative flex items-start gap-4">
            <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] ring-4 ring-white">
              🚶
            </div>
            <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0] w-full max-w-lg">
              <span className="text-xs font-bold text-[#0F172A] block">Walk — 3 min (180m)</span>
              <span className="text-[11px] text-[#64748B]">Head to Autonomous Bus Bay 4 • Step-free concourse</span>
            </div>
          </div>

          {/* ITEM 3: Autonomous Bus 245 */}
          <div className="relative flex items-start gap-4">
            <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-[#192841] text-white flex items-center justify-center text-[10px] ring-4 ring-white">
              🚌
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs w-full max-w-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#192841]">10:01 AM → 10:16 AM</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  15 min
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#0F172A]">Autonomous Bus 245</h4>
              <p className="text-xs text-[#64748B]">
                Board at Ratmalana Concourse Bay 4 • Precision curb docking
              </p>
            </div>
          </div>

          {/* ITEM 4: Central Station Transfer */}
          <div className="relative flex items-start gap-4">
            <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] ring-4 ring-white">
              🔄
            </div>
            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 w-full max-w-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900">10:16 AM</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-amber-800">
                  Transfer Hub
                </span>
              </div>
              <h4 className="text-sm font-bold text-amber-950">Central Station Interchange</h4>
              <p className="text-xs text-amber-800">
                Change to SkyRail Line 02. Walk 120m to Platform 2 (Elevator access available).
              </p>
            </div>
          </div>

          {/* ITEM 5: SkyRail Line 02 */}
          <div className="relative flex items-start gap-4">
            <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-[#192841] text-white flex items-center justify-center text-[10px] ring-4 ring-white">
              🚄
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs w-full max-w-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#192841]">10:28 AM → 10:34 AM</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  10 min • 180 km/h
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#0F172A]">SkyRail Line 02 Maglev</h4>
              <p className="text-xs text-[#64748B]">
                High-speed elevated guideway directly bypassing urban traffic
              </p>
            </div>
          </div>

          {/* ITEM 6: Smart Road Autonomous Pod */}
          <div className="relative flex items-start gap-4">
            <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-[#192841] text-white flex items-center justify-center text-[10px] ring-4 ring-white">
              🛣
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs w-full max-w-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#192841]">10:34 AM → 10:42 AM</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  8 min
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#0F172A]">Smart Road Autonomous Pod</h4>
              <p className="text-xs text-[#64748B]">
                Doorstep micro-mobility pod with direct terminal curb drop
              </p>
            </div>
          </div>

          {/* ITEM 7: Destination */}
          <div className="relative flex items-start gap-4">
            <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] ring-4 ring-white">
              🏁
            </div>
            <div>
              <span className="text-xs font-black text-emerald-700">10:42 AM</span>
              <h4 className="text-sm font-bold text-[#0F172A]">Destination Reached</h4>
              <p className="text-xs text-[#64748B]">{journey.destination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 18: TRANSPORT INFORMATION & ACTIONS (CTAs)                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
              Digital Transit Pass
            </span>
            <div className="text-xl font-extrabold text-[#0F172A] mt-0.5">
              Fare: LKR {journey.fareLkr}.00
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck size={16} />
            <span>Integrated All-Mode Pass Included</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={handleStartJourney}
            className="w-full sm:flex-1 py-4 px-8 rounded-2xl bg-[#192841] hover:bg-[#111C2E] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Start Journey</span>
            <ArrowRight size={18} />
          </button>

          <Link
            href="/preferences"
            className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-[#192841] text-[#192841] font-bold text-sm transition-colors text-center"
          >
            View Other Routes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function JourneyPlanPage() {
  return (
    <AuthGuard message="Please sign in or create an account to view your journey plan.">
      <Suspense fallback={<div className="p-10 text-center text-sm font-semibold text-[#64748B]">Loading journey itinerary...</div>}>
        <JourneyPlanContent />
      </Suspense>
    </AuthGuard>
  );
}
