"use client";

import React, { useState } from "react";
import Link from "next/link";
import LoadingAnimation from "./components/loadingAnimation";
import {
  Search,
  Mic,
  MapPin,
  Clock,
  Navigation,
  Footprints,
  Train,
  Bus,
  ArrowRight,
  Sparkles,
  Volume2,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Building,
  GraduationCap,
  Briefcase,
  Plane,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface JourneyPlan {
  id: string;
  name: string;
  destination: string;
  fromLocation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  transfers: number;
  walkingMins: number;
  walkingDistance: string;
  modes: { type: "train" | "bus" | "walk"; line: string; time: string }[];
  fare: string;
  status: "on-time" | "delay";
  statusText: string;
}

const PRESET_DESTINATIONS: Record<string, JourneyPlan> = {
  University: {
    id: "univ",
    name: "University",
    destination: "General Sir John Kotelawala Defence University (KDU)",
    fromLocation: "Colombo Fort Central Terminal (Platform 3)",
    departureTime: "08:15 AM",
    arrivalTime: "08:42 AM",
    duration: "27 mins",
    transfers: 1,
    walkingMins: 4,
    walkingDistance: "320m",
    modes: [
      { type: "train", line: "Southern Express Line", time: "18 mins" },
      { type: "walk", line: "Transfer Linkway", time: "2 mins" },
      { type: "bus", line: "Campus Feeder Route 255", time: "7 mins" },
    ],
    fare: "LKR 120",
    status: "on-time",
    statusText: "On schedule • Next departure in 4 mins",
  },
  Home: {
    id: "home",
    name: "Home",
    destination: "Marine Drive Promenade, Kollupitiya",
    fromLocation: "Colombo Fort Central Terminal",
    departureTime: "08:20 AM",
    arrivalTime: "08:34 AM",
    duration: "14 mins",
    transfers: 0,
    walkingMins: 3,
    walkingDistance: "210m",
    modes: [
      { type: "train", line: "Coastal Commuter Rail", time: "11 mins" },
    ],
    fare: "LKR 80",
    status: "on-time",
    statusText: "On schedule • Platform 2",
  },
  Work: {
    id: "work",
    name: "Work",
    destination: "World Trade Center, Echelon Square",
    fromLocation: "Colombo Fort Central Terminal",
    departureTime: "08:12 AM",
    arrivalTime: "08:21 AM",
    duration: "9 mins",
    transfers: 0,
    walkingMins: 6,
    walkingDistance: "450m",
    modes: [
      { type: "walk", line: "Skybridge Pedestrian Route", time: "9 mins" },
    ],
    fare: "Free (Walking)",
    status: "on-time",
    statusText: "Direct pedestrian connection",
  },
  Airport: {
    id: "airport",
    name: "Airport",
    destination: "Bandaranaike International Airport (BIA)",
    fromLocation: "Colombo Fort Central Terminal",
    departureTime: "08:30 AM",
    arrivalTime: "09:05 AM",
    duration: "35 mins",
    transfers: 0,
    walkingMins: 2,
    walkingDistance: "150m",
    modes: [
      { type: "bus", line: "Expressway Highway Bus 187-E", time: "33 mins" },
    ],
    fare: "LKR 350",
    status: "delay",
    statusText: "Slight traffic delay (+5 mins)",
  },
};

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<string>("University");
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);

  const activePlan = PRESET_DESTINATIONS[selectedDestination] || PRESET_DESTINATIONS["University"];

  const handleSplashComplete = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 600);
  };

  const handleSelectChip = (name: string) => {
    setSelectedDestination(name);
    setSearchQuery(PRESET_DESTINATIONS[name].destination);
  };

  const handleVoiceClick = () => {
    if (isVoiceListening) {
      setIsVoiceListening(false);
      return;
    }

    setIsVoiceListening(true);
    setVoiceTranscript("Listening for rider command...");

    setTimeout(() => {
      setVoiceTranscript('Heard: "Take me to University by 9 AM"');
    }, 1200);

    setTimeout(() => {
      setSelectedDestination("University");
      setSearchQuery(PRESET_DESTINATIONS["University"].destination);
      setIsVoiceListening(false);
      setVoiceTranscript("Route calculated: KDU Campus via Southern Line (27 min)");
    }, 2500);
  };

  return (
    <>
      {/* Starting Website Animation */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-[100] bg-[#FFFFFF] transition-opacity duration-600 ${
            isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <LoadingAnimation
            loop={false}
            loopDuration={3.0}
            onComplete={handleSplashComplete}
          />
        </div>
      )}

      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-10 sm:space-y-14">
        {/* 1. Rider Location Pill & Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#192841]/5 border border-[#192841]/15 text-[#192841] text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#192841] animate-ping" />
                <MapPin size={13} className="text-[#192841]" />
                <span>Current Departure: Central Terminal • Concourse Level</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsFadingOut(false);
                  setShowSplash(true);
                }}
                className="text-xs text-[#5A6B85] hover:text-[#192841] font-semibold underline underline-offset-2 ml-1 cursor-pointer transition-colors"
              >
                Replay Intro
              </button>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#192841] tracking-tight">
              Where are you heading today?
            </h1>
            <p className="text-sm sm:text-base text-[#5A6B85] mt-1">
              Real-time urban transit navigation built for seamless rider mobility.
            </p>
          </div>

        {/* Rider Digital Pass Preview Quick Badge */}
        <div className="self-start sm:self-auto bg-white border border-[#D6DAE3] rounded-2xl p-3.5 px-4 shadow-[0_4px_12px_rgba(25,40,65,0.06)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#192841] text-white flex items-center justify-center shrink-0">
            <CreditCard size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#192841]">NEXA TapPass</span>
              <span className="text-[10px] bg-[#2E7D5B]/10 text-[#2E7D5B] font-semibold px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-[#5A6B85]">Balance: <span className="font-semibold text-black">LKR 1,840.00</span></p>
          </div>
        </div>
      </div>

      {/* 2. Destination Search & Prominent Voice Action ("Tell NEXA") */}
      <div className="relative">
        <div className="bg-white rounded-2xl border border-[#D6DAE3] shadow-[0_4px_16px_rgba(25,40,65,0.08)] p-2 sm:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 flex items-center">
            <Search size={20} className="absolute left-4 text-[#5A6B85] pointer-events-none" />
            <input
              type="text"
              placeholder="Search station, route number, or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 text-base text-black placeholder:text-[#5A6B85] bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#192841]/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-[#5A6B85] hover:text-[#192841] px-3 py-1 mr-2"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-between md:justify-end border-t md:border-t-0 border-[#D6DAE3] pt-2 md:pt-0">
            {/* Primary Plan Button */}
            <button
              type="button"
              onClick={() => {
                if (searchQuery.trim()) {
                  setSelectedDestination("Custom");
                }
              }}
              className="flex-1 md:flex-initial px-6 py-3.5 rounded-xl bg-[#192841] hover:bg-[#1E2E4D] text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>Plan Journey</span>
              <ArrowRight size={16} />
            </button>

            {/* Circular Voice Button: "Tell NEXA" - Section 5.3 focal element */}
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={handleVoiceClick}
                title="Tell NEXA - Voice Trip Planner"
                className={`w-13 h-13 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                  isVoiceListening
                    ? "bg-[#1E2E4D] ring-4 ring-[#192841]/30 scale-105"
                    : "bg-[#192841] hover:bg-[#1E2E4D] hover:scale-105"
                } text-white`}
              >
                <Mic size={22} className={isVoiceListening ? "animate-pulse" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Voice Feedback Banner */}
        {voiceTranscript && (
          <div className="mt-2.5 px-4 py-2 bg-white rounded-xl border border-[#D6DAE3] shadow-sm flex items-center gap-2 text-xs text-[#192841]">
            <Volume2 size={15} className="text-[#192841]" />
            <span className="font-medium">{voiceTranscript}</span>
          </div>
        )}
      </div>

      {/* 3. Recent Destinations Chips (University / Home / Work / Airport) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#5A6B85]">
            Frequent Commuter Stops
          </h2>
          <span className="text-xs text-[#192841] font-semibold cursor-pointer hover:underline">
            Manage Presets
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: "University", label: "University", icon: GraduationCap, detail: "KDU Campus • 27m" },
            { key: "Home", label: "Home", icon: Building, detail: "Marine Drive • 14m" },
            { key: "Work", label: "Work", icon: Briefcase, detail: "WTC Towers • 9m" },
            { key: "Airport", label: "Airport", icon: Plane, detail: "BIA Hub • 35m" },
          ].map((item) => {
            const isSelected = selectedDestination === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSelectChip(item.key)}
                className={`p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-white border-[#192841] shadow-[0_4px_16px_rgba(25,40,65,0.12)] ring-1 ring-[#192841]"
                    : "bg-white border-[#D6DAE3] hover:border-[#192841]/50 shadow-[0_2px_8px_rgba(25,40,65,0.04)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-[#192841] text-white" : "bg-[#192841]/5 text-[#192841]"
                  }`}>
                    <Icon size={16} />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#192841]" />
                  )}
                </div>
                <div className="font-bold text-sm text-[#192841]">{item.label}</div>
                <div className="text-xs text-[#5A6B85] mt-0.5">{item.detail}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Live Journey Plan Summary Card (Section 5.5 of Design.md) */}
      <div className="bg-white rounded-2xl border border-[#D6DAE3] p-6 sm:p-8 shadow-[0_4px_20px_rgba(25,40,65,0.08)] space-y-6">
        
        {/* Header: Destination & Live Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#D6DAE3]">
          <div>
            <div className="text-xs font-semibold text-[#5A6B85] uppercase tracking-wide">
              Selected Route Preview
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#192841] mt-0.5">
              {activePlan.destination}
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6B85] mt-1 flex items-center gap-1.5">
              <Navigation size={14} className="text-[#192841]" />
              <span>Departing from: <strong className="text-black">{activePlan.fromLocation}</strong></span>
            </p>
          </div>

          <div className="self-start sm:self-auto flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                activePlan.status === "on-time"
                  ? "bg-[#2E7D5B]/10 text-[#2E7D5B]"
                  : "bg-[#B8860B]/10 text-[#B8860B]"
              }`}
            >
              {activePlan.status === "on-time" ? (
                <CheckCircle2 size={13} />
              ) : (
                <AlertCircle size={13} />
              )}
              <span>{activePlan.statusText}</span>
            </span>
          </div>
        </div>

        {/* 4 Key Stats: 2x2 on mobile, 4-row on desktop with Navy icons and Navy 60% labels */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-2">
          
          <div className="bg-[#F7F8FA] rounded-xl p-4 border border-[#D6DAE3]/60">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#D6DAE3] flex items-center justify-center text-[#192841] mb-2 shadow-xs">
              <Clock size={16} />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
              {activePlan.arrivalTime}
            </div>
            <div className="text-xs font-medium text-[#5A6B85] mt-0.5">
              Estimated Arrival
            </div>
          </div>

          <div className="bg-[#F7F8FA] rounded-xl p-4 border border-[#D6DAE3]/60">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#D6DAE3] flex items-center justify-center text-[#192841] mb-2 shadow-xs">
              <Zap size={16} />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
              {activePlan.duration}
            </div>
            <div className="text-xs font-medium text-[#5A6B85] mt-0.5">
              Total Travel Time
            </div>
          </div>

          <div className="bg-[#F7F8FA] rounded-xl p-4 border border-[#D6DAE3]/60">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#D6DAE3] flex items-center justify-center text-[#192841] mb-2 shadow-xs">
              <Train size={16} />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
              {activePlan.transfers === 0 ? "Direct" : `${activePlan.transfers} Transfer`}
            </div>
            <div className="text-xs font-medium text-[#5A6B85] mt-0.5">
              Connection Complexity
            </div>
          </div>

          <div className="bg-[#F7F8FA] rounded-xl p-4 border border-[#D6DAE3]/60">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#D6DAE3] flex items-center justify-center text-[#192841] mb-2 shadow-xs">
              <Footprints size={16} />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
              {activePlan.walkingDistance}
            </div>
            <div className="text-xs font-medium text-[#5A6B85] mt-0.5">
              Walking Distance ({activePlan.walkingMins} min)
            </div>
          </div>
        </div>

        {/* Transit Segment Steps */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-[#5A6B85] uppercase tracking-wide mb-3">
            Journey Leg Breakdown
          </div>

          <div className="space-y-3">
            {activePlan.modes.map((segment, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#D6DAE3] hover:border-[#192841]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#192841] text-white flex items-center justify-center">
                    {segment.type === "train" && <Train size={16} />}
                    {segment.type === "bus" && <Bus size={16} />}
                    {segment.type === "walk" && <Footprints size={16} />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#192841]">
                      {segment.line}
                    </div>
                    <div className="text-xs text-[#5A6B85]">
                      Estimated leg time: {segment.time}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#192841]/5 text-[#192841]">
                    Leg #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D6DAE3]">
          <div className="text-sm text-[#5A6B85]">
            Estimated Standard Rider Fare: <strong className="text-black text-base">{activePlan.fare}</strong>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/contact"
              className="flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-xl border border-[#D6DAE3] hover:border-[#192841] text-xs font-semibold text-[#192841] bg-white transition-colors"
            >
              Report Delay
            </Link>
            <button
              type="button"
              onClick={() => alert(`Starting live GPS guidance for ${activePlan.destination}!`)}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#192841] hover:bg-[#1E2E4D] text-xs font-bold text-white transition-colors shadow-sm"
            >
              Start Live Navigation
            </button>
          </div>
        </div>
      </div>

      {/* 5. Rider Live Transit Network Health Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#192841]">
              Live Rider Network Status
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6B85]">
              Real-time dispatch metrics across primary metropolitan lines.
            </p>
          </div>
          <Link
            href="/about"
            className="text-xs font-bold text-[#192841] hover:underline flex items-center gap-1"
          >
            <span>Network Details</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-[#D6DAE3] p-5 shadow-[0_2px_10px_rgba(25,40,65,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#192841] text-white flex items-center justify-center">
                  <Train size={16} />
                </div>
                <span className="font-bold text-sm text-[#192841]">Metro Blue Line</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D5B]" />
            </div>
            <p className="text-xs text-[#5A6B85]">
              Operating on normal 6-minute headways. All stations cleared.
            </p>
            <div className="mt-3 text-xs font-semibold text-[#2E7D5B]">
              Status: 100% On Time
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#D6DAE3] p-5 shadow-[0_2px_10px_rgba(25,40,65,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#192841] text-white flex items-center justify-center">
                  <Bus size={16} />
                </div>
                <span className="font-bold text-sm text-[#192841]">City Express 138</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D5B]" />
            </div>
            <p className="text-xs text-[#5A6B85]">
              High rider flow during peak hours. Additional relief buses dispatched.
            </p>
            <div className="mt-3 text-xs font-semibold text-[#2E7D5B]">
              Status: Active Flow
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#D6DAE3] p-5 shadow-[0_2px_10px_rgba(25,40,65,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#192841] text-white flex items-center justify-center">
                  <Train size={16} />
                </div>
                <span className="font-bold text-sm text-[#192841]">Coastal Line</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B]" />
            </div>
            <p className="text-xs text-[#5A6B85]">
              Track maintenance near Wellawatte. Speeds reduced to 30 km/h.
            </p>
            <div className="mt-3 text-xs font-semibold text-[#B8860B]">
              Delay: ~8 mins
            </div>
          </div>
        </div>
      </div>

      {/* 6. Rider Pillars & Trust Banner */}
      <div className="bg-white rounded-2xl border border-[#D6DAE3] p-6 sm:p-8 shadow-[0_4px_16px_rgba(25,40,65,0.06)] grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#192841]/5 text-[#192841] flex items-center justify-center font-bold">
            <Sparkles size={18} />
          </div>
          <h3 className="font-bold text-[#192841] text-base">Radical Visual Clarity</h3>
          <p className="text-xs text-[#5A6B85] leading-relaxed">
            Distraction-free interface engineered for riders on the move. High contrast typography and strict color coding ensure readability in bright sunlight or crowded stations.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#192841]/5 text-[#192841] flex items-center justify-center font-bold">
            <Zap size={18} />
          </div>
          <h3 className="font-bold text-[#192841] text-base">Multimodal Sync</h3>
          <p className="text-xs text-[#5A6B85] leading-relaxed">
            Synchronized coordination between trains, feeder buses, and walking routes so you never miss a connection or run for an already departed vehicle.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#192841]/5 text-[#192841] flex items-center justify-center font-bold">
            <ShieldCheck size={18} />
          </div>
          <h3 className="font-bold text-[#192841] text-base">24/7 Rider Safety</h3>
          <p className="text-xs text-[#5A6B85] leading-relaxed">
            Direct link to transit operations dispatch, verified delay reporting, and emergency platform assistance available at every stage of your trip.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
