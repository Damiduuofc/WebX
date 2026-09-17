"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  Train,
  Bus,
  Footprints,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16 space-y-12 sm:space-y-16">
      {/* 1. Hero & Mission */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#72222B]/10 border border-[#72222B]/20 text-[#72222B] text-xs font-semibold tracking-wide">
          <Compass size={13} className="text-[#72222B]" />
          <span>The Rider-First Mobility Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          Built for the daily commuter who values clarity over clutter.
        </h1>
        <p className="text-base sm:text-lg text-[#5A6B85] leading-relaxed">
          NEXA was born to solve a universal commuter problem: transit apps are often cluttered, slow, and overwhelming when you are on the move. We stripped away the noise to deliver pure, actionable transit intelligence.
        </p>
      </div>

      {/* 2. Key Commuter Impact Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { metric: "120,000+", label: "Daily Commuter Trips", detail: "Planned across rail, bus, & ferry" },
          { metric: "99.4%", label: "Schedule Prediction Accuracy", detail: "Validated with real-time GPS telemetry" },
          { metric: "42", label: "Connected Transit Hubs", detail: "Synchronized transfer terminals" },
          { metric: "< 1.5s", label: "Route Computation Time", detail: "Sub-second offline & live calculations" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[#D6DAE3] p-6 text-center shadow-sm"
          >
            <div className="text-3xl sm:text-4xl font-extrabold text-[#72222B] tracking-tight">
              {item.metric}
            </div>
            <div className="text-sm font-bold text-black mt-2">
              {item.label}
            </div>
            <div className="text-xs text-[#5A6B85] mt-1">
              {item.detail}
            </div>
          </div>
        ))}
      </div>

      {/* 3. NEXA Design System Principles (from Design.md) */}
      <div className="bg-white rounded-2xl border border-[#D6DAE3] p-6 sm:p-10 shadow-sm space-y-8">
        <div>
          <div className="text-xs font-bold text-[#5A6B85] uppercase tracking-wider">
            Our Architectural Foundations
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            The NEXA Rider Design System
          </h2>
          <p className="text-sm text-[#5A6B85] mt-1 max-w-2xl">
            When you are running between platforms or checking a bus arrival in bright sunlight, every pixel matters. Here is how our design system protects your transit experience:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-[#F7F8FA] border border-[#D6DAE3]/70 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#72222B] text-white flex items-center justify-center font-bold text-sm">
                1
              </span>
              <h3 className="font-bold text-[#0F172A] text-base">One Accent Color</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5A6B85] leading-relaxed pl-11">
              Architectural Crimson (<code className="text-[#72222B] font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-[#D6DAE3]">#72222B</code>) carries brand identity and primary interactive focus. Headings and body text remain crisp neutral slate for effortless reading.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#F7F8FA] border border-[#D6DAE3]/70 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#72222B] text-white flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h3 className="font-bold text-[#0F172A] text-base">Function Over Decoration</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5A6B85] leading-relaxed pl-11">
              Colors like Success Green (<code className="text-[#2E7D5B] font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-[#D6DAE3]">#2E7D5B</code>) and Alert Amber (<code className="text-[#B8860B] font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-[#D6DAE3]">#B8860B</code>) convey vehicle status and transit delays only — never as decorative flourishes.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#F7F8FA] border border-[#D6DAE3]/70 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#72222B] text-white flex items-center justify-center font-bold text-sm">
                3
              </span>
              <h3 className="font-bold text-[#0F172A] text-base">Breathing Room</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5A6B85] leading-relaxed pl-11">
              Minimalism is enforced through purposeful 8px grid spacing and clear typographic hierarchy, not by hiding useful commuter data. One clear action per screen eliminates confusion.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#F7F8FA] border border-[#D6DAE3]/70 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#72222B] text-white flex items-center justify-center font-bold text-sm">
                4
              </span>
              <h3 className="font-bold text-[#0F172A] text-base">Predictable Consistency</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5A6B85] leading-relaxed pl-11">
              Buttons, input fields, cards, and navigation behave identically everywhere so the app feels instinctive during transit, especially when commuters are rushed or distracted.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Multimodal Transit Network Integration */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            Seamless Multi-Transit Coverage
          </h2>
          <p className="text-sm text-[#5A6B85] mt-1">
            How NEXA unites separate transit authorities into a single, cohesive rider view.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-[#D6DAE3] p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#72222B] text-white flex items-center justify-center">
              <Train size={20} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-lg">Metropolitan Rail</h3>
            <p className="text-xs sm:text-sm text-[#5A6B85] leading-relaxed">
              Live platform track assignments, train car crowd occupancy levels, and automated transfer notifications right before your interchange stop.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#D6DAE3] p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#72222B] text-white flex items-center justify-center">
              <Bus size={20} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-lg">City & Feeder Buses</h3>
            <p className="text-xs sm:text-sm text-[#5A6B85] leading-relaxed">
              Real-time vehicle GPS pinging every 3 seconds, bypass warnings, and stop-request alerts so you never miss your destination in heavy traffic.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#D6DAE3] p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#72222B] text-white flex items-center justify-center">
              <Footprints size={20} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-lg">Pedestrian Linkways</h3>
            <p className="text-xs sm:text-sm text-[#5A6B85] leading-relaxed">
              Optimized walking connections between stations with step-free accessibility options, covered concourse routing, and realistic transfer timings.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Rider Call to Action */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-8 sm:p-12 border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Ready to experience effortless urban travel?
          </h3>
          <p className="text-sm text-[#D6DAE3] leading-relaxed">
            Plan your next journey with NEXA now, or reach out to our commuter support team for route feedback.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-[#72222B] hover:bg-[#5B1B22] text-white font-bold text-sm text-center transition-colors shadow-sm"
          >
            Plan a Journey
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl border border-white/30 hover:border-white text-white font-semibold text-sm text-center transition-colors"
          >
            Contact Dispatch
          </Link>
        </div>
      </div>
    </div>
  );
}
