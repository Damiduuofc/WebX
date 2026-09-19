"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock,
  Navigation,
  Footprints,
  Train,
  Bus,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { AuthGuard, useAuth } from "../context/auth";

function CompleteContent() {
  const router = useRouter();
  const { journey } = useAuth();

  const handleGiveFeedback = () => {
    router.push("/feedback");
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* ========================================================================= */}
      {/* SECTION 26: CELEBRATORY SUCCESS HERO                                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-8 sm:p-12 shadow-[0_12px_40px_rgba(25,40,65,0.06)] text-center space-y-4 relative overflow-hidden">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#192841]/10 text-4xl flex items-center justify-center shadow-inner u-glow">
          🎉
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Trip Successfully Completed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            You&apos;ve arrived!
          </h1>
          <div className="u-accent-line w-16 mx-auto" />
          <p className="text-sm sm:text-base text-[#64748B] max-w-md mx-auto">
            Welcome to <strong className="text-[#0F172A]">{journey.destination}</strong>.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 27: JOURNEY SUMMARY METRICS (Total 42 min, 18.4 km, 2 transfers)  */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#64748B] uppercase tracking-wider">
          Journey Summary
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0] text-center">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center mx-auto text-[#192841] mb-2 shadow-xs">
              <Clock size={16} />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#0F172A] u-digital-num">
              42 min
            </div>
            <div className="text-xs font-semibold text-[#64748B] mt-0.5">
              Total Journey
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0] text-center">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center mx-auto text-[#192841] mb-2 shadow-xs">
              <Navigation size={16} />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#0F172A] u-digital-num">
              18.4 km
            </div>
            <div className="text-xs font-semibold text-[#64748B] mt-0.5">
              Distance
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0] text-center">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center mx-auto text-[#192841] mb-2 shadow-xs">
              <Train size={16} />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#0F172A] u-digital-num">
              2
            </div>
            <div className="text-xs font-semibold text-[#64748B] mt-0.5">
              Transfers
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0] text-center">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center mx-auto text-[#192841] mb-2 shadow-xs">
              <Footprints size={16} />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#0F172A] u-digital-num">
              6 min
            </div>
            <div className="text-xs font-semibold text-[#64748B] mt-0.5">
              Walking
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 28: TRANSPORTATION MODES USED                                     */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#64748B] uppercase tracking-wider">
          Transportation Modes Used
        </h2>

        <div className="space-y-3">
          {/* Autonomous Bus */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#192841] text-white flex items-center justify-center shadow-xs">
                <Bus size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  Autonomous Bus 245
                </h3>
                <p className="text-xs text-[#64748B]">
                  KDU Concourse → Central Station (15 min)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Completed
            </span>
          </div>

          <div className="flex justify-center text-[#64748B]">
            ↓
          </div>

          {/* SkyRail */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#192841] text-white flex items-center justify-center shadow-xs">
                <Train size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  SkyRail Line 02 Maglev
                </h3>
                <p className="text-xs text-[#64748B]">
                  Central Station Platform 2 → SkyPort Gateway (10 min)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Completed
            </span>
          </div>

          <div className="flex justify-center text-[#64748B]">
            ↓
          </div>

          {/* Smart Road */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#192841] text-white flex items-center justify-center shadow-xs">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  Smart Road Autonomous Pod
                </h3>
                <p className="text-xs text-[#64748B]">
                  SkyPort Gateway → Airport Terminal Curb (8 min)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Completed
            </span>
          </div>
        </div>
      </div>

      {/* Primary CTA: Give Feedback */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGiveFeedback}
          className="w-full py-4 px-8 rounded-2xl bg-[#4F6EF7] hover:bg-[#3B4FE0] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>How was your journey? Give Feedback</span>
          <ArrowRight size={18} />
        </button>

        <Link
          href="/"
          className="w-full py-3 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#192841] font-semibold text-xs transition-colors block text-center"
        >
          Return to Home Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <AuthGuard message="Please sign in or create an account to view journey completion metrics.">
      <Suspense fallback={<div className="p-10 text-center text-sm font-semibold text-[#64748B]">Loading completion summary...</div>}>
        <CompleteContent />
      </Suspense>
    </AuthGuard>
  );
}
