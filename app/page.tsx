"use client";

import React, { useState } from "react";
import LoadingAnimation from "./components/loadingAnimation";
import AuthModal from "./components/AuthModal";
import HeroSection from "./components/HeroSection";
import {
  Mic,
  Clock,
  Navigation,
  Footprints,
  Train,
  Bus,
  ArrowRight,
  Volume2,
  AlertCircle,
  CheckCircle2,
  Zap,
  ChevronLeft,
  ChevronRight,
  Radio,
  SlidersHorizontal,
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
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);

  // Search Bar state (docked hero bar)
  const [searchFrom, setSearchFrom] = useState("KDU, Ratmalana");
  const [searchTo, setSearchTo] = useState("Bandaranaike Airport");
  const [searchMode, setSearchMode] = useState("Autonomous Bus + SkyRail");
  const [searchPriority, setSearchPriority] = useState("Fastest Route");

  // Selected route state
  const [selectedDestination, setSelectedDestination] = useState<string>("University");
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);

  // Services Carousel state
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  // Filter tab state
  const [routeCategory, setRouteCategory] = useState("All");

  const activePlan = PRESET_DESTINATIONS[selectedDestination] || PRESET_DESTINATIONS["University"];

  const handleSplashComplete = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 600);
  };

  const handleVoiceClick = () => {
    if (isVoiceListening) {
      setIsVoiceListening(false);
      return;
    }

    setIsVoiceListening(true);
    setVoiceTranscript("Listening for rider destination...");

    setTimeout(() => {
      setVoiceTranscript('Heard: "Take me to University by 9 AM"');
    }, 1200);

    setTimeout(() => {
      setSelectedDestination("University");
      setIsVoiceListening(false);
      setVoiceTranscript("Route calculated: KDU Campus via Southern Line (27 min)");
    }, 2500);
  };

  const riderServices = [
    {
      title: "Autonomous Bus Fleets",
      subtitle: "Smart road sensor grid with precision curb docking",
      badge: "High Frequency",
      description: "Quiet electric fleets equipped with autonomous collision avoidance, automated accessibility ramps, and seamless traffic-light priority across major municipal routes.",
      specs: ["3 min Headway", "Step-Free Boarding", "Zero Tailpipe Emissions"],
      icon: Bus,
      tag: "Bus 245 Express",
    },
    {
      title: "SkyRail Magnetic Lines",
      subtitle: "Elevated magnetic levitation bypassing urban congestion",
      badge: "High Speed 180 km/h",
      description: "Glide above traffic on frictionless magnetic guideways. Connecting outer suburban university campuses and international airport terminals directly to downtown stations.",
      specs: ["100% On-Time Guarantee", "Direct Hub-to-Hub", "Climate Sealed Pods"],
      icon: Train,
      tag: "SkyRail Line 02",
    },
    {
      title: "Smart Road Autonomous Pods",
      subtitle: "On-demand door-to-station micro-mobility pods",
      badge: "Last-Mile Connect",
      description: "Summon a personal or shared autonomous pod directly to your doorstep. Pods merge seamlessly with the main SkyRail concourse for truly uninterrupted door-to-destination journeys.",
      specs: ["Instant Dispatch", "Private Work Cabins", "Smart Road Charging"],
      icon: Zap,
      tag: "Smart Pod EV",
    },
    {
      title: "Voice Journey Co-Pilot",
      subtitle: "Hands-free real-time audio transit intelligence",
      badge: "Tell Univa AI",
      description: "Speak naturally while walking or changing platforms. Ask 'Where do I transfer?' or 'Is my SkyRail on time?' and receive immediate vocal transit guidance.",
      specs: ["Multilingual Voice", "Haptic Platform Alerts", "Offline Speech Mode"],
      icon: Mic,
      tag: "Tell Univa 2100",
    },
  ];

  return (
    <>
      {/* 0. Starting Website Kinetic Animation */}
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

      {/* Global Auth Modal for Hero and Action Buttons */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitchMode={(mode) => setAuthModal(mode)}
        />
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: FULL-SIZE HERO WITH DUAL INFINITE SCROLL & HIGHLIGHTED CTAs    */}
      {/* ========================================================================= */}
      <HeroSection
        onOpenAuth={(mode) => setAuthModal(mode)}
        onVoiceClick={handleVoiceClick}
        isVoiceListening={isVoiceListening}
        onExploreClick={() => {
          const el = document.getElementById("routes-section") || document.getElementById("planner-section");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
        searchFrom={searchFrom}
        setSearchFrom={setSearchFrom}
        searchTo={searchTo}
        setSearchTo={setSearchTo}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        searchPriority={searchPriority}
        setSearchPriority={setSearchPriority}
        onSearchSubmit={() => {
          const el = document.getElementById("routes-section") || document.getElementById("planner-section");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pt-10 sm:pt-16 pb-16">
        {/* ========================================================================= */}
        {/* SECTION 2: RIDER SERVICES SHOWCASE & BRAND STATEMENT (Matching Tier 2)    */}
        {/* ========================================================================= */}
        <section className="space-y-10">
          
          {/* Social Proof Bar & Avatar Stack */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6DAE3]">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#5A6B85]">
              <span className="text-[#192841] font-bold">💙 We are Univa</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#192841]">
                <span className="text-[#F59E0B]">★</span>
                <span>120K+ Commuters Satisfied</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-[#192841] text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
                  >
                    R{i}
                  </div>
                ))}
              </div>
              <span className="text-xs font-semibold text-[#5A6B85]">+50k Active</span>
            </div>
          </div>

          {/* Huge Statement Heading matching reference "Visa Travels means Going Places" */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-[#192841] leading-tight">
              Univa means <br />
              <span className="text-[#192841] relative inline-block">
                Effortless Movement
              </span>
            </h2>

            {/* Waypoint Path Illustration matching reference line dot graphic */}
            <div className="flex items-center justify-center gap-3 py-2 text-[#192841]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#192841]" />
              <div className="w-20 sm:w-32 h-[2px] bg-dashed border-b-2 border-dashed border-[#192841]/40" />
              <div className="w-5 h-5 rounded-full border-2 border-[#192841] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#192841]" />
              </div>
              <div className="w-20 sm:w-32 h-[2px] bg-dashed border-b-2 border-dashed border-[#192841]/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#192841]" />
            </div>
          </div>

          {/* Two-Column Services Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
            
            {/* Left Value Narrative Column */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-[#D6DAE3] p-6 sm:p-8 shadow-[0_4px_20px_rgba(25,40,65,0.06)] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#192841]/5 text-[#192841] text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#192841]" />
                  <span>01 Rider Services</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#192841] tracking-tight leading-snug">
                  Not Your Grandparent&apos;s Commute
                </h3>
                <p className="text-sm text-[#5A6B85] leading-relaxed">
                  We coordinate autonomous bus lines, elevated magnetic SkyRail, and on-demand vehicle pods into a single reliable schedule. No multiple ticketing, zero unexpected transfers.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#D6DAE3]">
                <button
                  type="button"
                  onClick={() => setAuthModal("signup")}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#192841] hover:bg-[#1E2E4D] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Rider Pass</span>
                  <ArrowRight size={16} />
                </button>
                <div className="text-[11px] text-center text-[#5A6B85]">
                  Step-free accessibility • Instant NFC tap boarding
                </div>
              </div>
            </div>

            {/* Right Interactive Services Cards Showcase */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {riderServices.slice(0, 3).map((svc, idx) => {
                  const Icon = svc.icon;
                  const isSelected = activeServiceIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveServiceIndex(idx)}
                      className={`cursor-pointer bg-white rounded-3xl border ${
                        isSelected
                          ? "border-[#192841] shadow-[0_8px_24px_rgba(25,40,65,0.14)] ring-2 ring-[#192841]"
                          : "border-[#D6DAE3] shadow-[0_4px_16px_rgba(25,40,65,0.06)] hover:border-[#192841]/50"
                      } p-5 flex flex-col justify-between space-y-4 transition-all group`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#192841]/5 text-[#192841]">
                            {svc.badge}
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-[#192841] text-white flex items-center justify-center shadow-xs">
                            <Icon size={16} />
                          </div>
                        </div>

                        {/* Visual Card Frame */}
                        <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-[#192841] via-[#1E2E4D] to-[#0A1F44] text-white p-4 flex flex-col justify-end relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                          <div className="absolute top-3 right-3 text-white/10 font-black text-4xl select-none">
                            2100
                          </div>
                          <span className="text-xs font-bold text-[#D6DAE3] uppercase tracking-wide">
                            {svc.tag}
                          </span>
                          <h4 className="text-base font-bold text-white leading-tight">
                            {svc.title}
                          </h4>
                        </div>

                        <p className="text-xs text-[#5A6B85] leading-relaxed">
                          {svc.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#D6DAE3]/70">
                        <ul className="space-y-1">
                          {svc.specs.map((spec, sIdx) => (
                            <li key={sIdx} className="text-[11px] font-semibold text-[#192841] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5B]" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Slider Navigation Row matching reference (< Prev, Next >) */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-[#5A6B85]">
                  Showing 3 primary autonomous transit modes • Year 2100 Grid
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveServiceIndex((prev) => (prev > 0 ? prev - 1 : riderServices.length - 1))}
                    className="w-8 h-8 rounded-full border border-[#D6DAE3] bg-white hover:bg-[#F7F8FA] flex items-center justify-center text-[#192841] shadow-xs cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveServiceIndex((prev) => (prev + 1) % riderServices.length)}
                    className="w-8 h-8 rounded-full border border-[#D6DAE3] bg-white hover:bg-[#F7F8FA] flex items-center justify-center text-[#192841] shadow-xs cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: "PICK THE PLACE" / POPULAR 2100 ROUTES (Matching Tier 3)       */}
        {/* ========================================================================= */}
        <section id="routes-section" className="space-y-8">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#192841]/5 text-[#192841] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#192841]" />
                <span>Popular Commuter Routes • 2100</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#192841] tracking-tight">
                Pick the Place
              </h2>
            </div>

            <p className="text-sm text-[#5A6B85] max-w-md">
              We have great options for students, workers, tourists, and daily commuters with guaranteed connections.
            </p>
          </div>

          {/* Filter Pills Bar matching reference */}
          <div className="bg-white rounded-2xl border border-[#D6DAE3] p-2 sm:p-3 shadow-[0_2px_12px_rgba(25,40,65,0.04)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {["All", "SkyRail Express", "Autonomous Bus", "Smart Road Pods", "Airport Direct"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setRouteCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    routeCategory === cat
                      ? "bg-[#192841] text-white shadow-xs"
                      : "bg-transparent text-[#5A6B85] hover:text-[#192841] hover:bg-[#F7F8FA]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 px-2 text-xs font-semibold text-[#5A6B85]">
              <SlidersHorizontal size={14} />
              <span>Real-Time Seat Feed</span>
            </div>
          </div>

          {/* 3 Rich Destination Cards matching reference 3-card layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARD 1 */}
            <div className="bg-white rounded-3xl border border-[#D6DAE3] p-5 shadow-[0_4px_20px_rgba(25,40,65,0.08)] flex flex-col justify-between space-y-4 hover:border-[#192841] transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#192841]">General Sir John Kotelawala Defence University</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2E7D5B]/10 text-[#2E7D5B]">
                    4 Seats Left
                  </span>
                </div>
                <div className="text-xs text-[#5A6B85]">Ratmalana Campus Concourse</div>

                {/* Card Visual / Map Block */}
                <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-[#192841] to-[#274068] p-4 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">Bus 245 + SkyRail</span>
                    <span className="text-[#2E7D5B] bg-white px-2 py-0.5 rounded-full font-bold">On Time</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-black">27 min</div>
                    <div className="text-[11px] text-[#D6DAE3]">Departure: 08:15 AM • Bay 4</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#D6DAE3]/60">
                    <div className="text-[10px] text-[#5A6B85]">Fare</div>
                    <div className="text-xs font-bold text-black">LKR 120</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#D6DAE3]/60">
                    <div className="text-[10px] text-[#5A6B85]">Transfer</div>
                    <div className="text-xs font-bold text-black">1 Hub</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#D6DAE3]/60">
                    <div className="text-[10px] text-[#5A6B85]">Walking</div>
                    <div className="text-xs font-bold text-black">320m</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDestination("University");
                  const el = document.getElementById("planner-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-3 rounded-xl bg-[#192841] hover:bg-[#1E2E4D] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Select & Track Journey</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* CARD 2 */}
            <div className="bg-white rounded-3xl border border-[#D6DAE3] p-5 shadow-[0_4px_20px_rgba(25,40,65,0.08)] flex flex-col justify-between space-y-4 hover:border-[#192841] transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#192841]">Bandaranaike International Airport</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#192841]/10 text-[#192841]">
                    SuperLink Express
                  </span>
                </div>
                <div className="text-xs text-[#5A6B85]">Katunayake SkyRail Terminal</div>

                {/* Card Visual / Map Block */}
                <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-[#0F1D33] to-[#1E3A5F] p-4 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">SkyRail Line 01</span>
                    <span className="text-[#2E7D5B] bg-white px-2 py-0.5 rounded-full font-bold">Non-Stop</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-black">18 min</div>
                    <div className="text-[11px] text-[#D6DAE3]">Direct Airport Shuttles every 10 min</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#D6DAE3]/60">
                    <div className="text-[10px] text-[#5A6B85]">Fare</div>
                    <div className="text-xs font-bold text-black">LKR 350</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#D6DAE3]/60">
                    <div className="text-[10px] text-[#5A6B85]">Luggage</div>
                    <div className="text-xs font-bold text-black">Auto-Sync</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#D6DAE3]/60">
                    <div className="text-[10px] text-[#5A6B85]">Walking</div>
                    <div className="text-xs font-bold text-black">150m</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDestination("Airport");
                  const el = document.getElementById("planner-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-3 rounded-xl bg-[#192841] hover:bg-[#1E2E4D] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Select & Track Journey</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* CARD 3 */}
            <div className="bg-white rounded-3xl border border-[#D6DAE3] p-5 shadow-[0_4px_20px_rgba(25,40,65,0.08)] flex flex-col justify-between space-y-4 hover:border-[#192841] transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#192841]">Marine Drive Promenade</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2E7D5B]/10 text-[#2E7D5B]">
                    Eco Pod Fleet
                  </span>
                </div>
                <div className="text-xs text-[#5A6B85]">Kollupitiya Ocean Concourse</div>

                {/* Card Visual / Map Block */}
                <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-[#192841] to-[#1E293B] p-4 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">Smart Road Pod</span>
                    <span className="text-[#2E7D5B] bg-white px-2 py-0.5 rounded-full font-bold">Zero Emiss</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-black">14 min</div>
                    <div className="text-[11px] text-[#D6DAE3]">Coastal Route • Direct Curb Drop</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#D6DAE3]/60">
                    <div className="text-[10px] text-[#5A6B85]">Fare</div>
                    <div className="text-xs font-bold text-black">LKR 80</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#D6DAE3]/60">
                    <div className="text-[10px] text-[#5A6B85]">Transfer</div>
                    <div className="text-xs font-bold text-black">0 Direct</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#D6DAE3]/60">
                    <div className="text-[10px] text-[#5A6B85]">Walking</div>
                    <div className="text-xs font-bold text-black">210m</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDestination("Home");
                  const el = document.getElementById("planner-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-3 rounded-xl bg-[#192841] hover:bg-[#1E2E4D] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Select & Track Journey</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: INTERACTIVE LIVE JOURNEY PLANNER & "TELL UNIVA" VOICE ASSIST   */}
        {/* ========================================================================= */}
        <section id="planner-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#192841]/5 text-[#192841] text-xs font-bold uppercase tracking-wider mb-2">
                <Radio size={14} className="text-[#2E7D5B] animate-pulse" />
                <span>Live Route Telemetry & Voice Co-Pilot</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#192841] tracking-tight">
                Live Journey Control
              </h2>
            </div>

            {/* Tell Univa Voice Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleVoiceClick}
                className={`px-5 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                  isVoiceListening
                    ? "bg-[#1E2E4D] ring-4 ring-[#192841]/30 text-white scale-105"
                    : "bg-[#192841] hover:bg-[#1E2E4D] text-white"
                }`}
              >
                <Mic size={18} className={isVoiceListening ? "animate-pulse" : ""} />
                <span>{isVoiceListening ? "Listening..." : "Tell Univa (Voice)"}</span>
              </button>
            </div>
          </div>

          {voiceTranscript && (
            <div className="px-4 py-2.5 bg-white rounded-xl border border-[#D6DAE3] shadow-sm flex items-center gap-2 text-xs text-[#192841]">
              <Volume2 size={15} className="text-[#192841]" />
              <span className="font-semibold">{voiceTranscript}</span>
            </div>
          )}

          {/* Journey Plan Summary Card (Section 5.5 of Design.md) */}
          <div className="bg-white rounded-3xl border border-[#D6DAE3] p-6 sm:p-8 shadow-[0_4px_20px_rgba(25,40,65,0.08)] space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#D6DAE3]">
              <div>
                <div className="text-xs font-semibold text-[#5A6B85] uppercase tracking-wide">
                  Active Selected Route
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

            {/* 4 Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
              <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#D6DAE3]/60">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#D6DAE3] flex items-center justify-center text-[#192841] mb-2 shadow-xs">
                  <Clock size={16} />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
                  {activePlan.arrivalTime}
                </div>
                <div className="text-xs font-medium text-[#5A6B85] mt-0.5">
                  Arrival Time
                </div>
              </div>

              <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#D6DAE3]/60">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#D6DAE3] flex items-center justify-center text-[#192841] mb-2 shadow-xs">
                  <Zap size={16} />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
                  {activePlan.duration}
                </div>
                <div className="text-xs font-medium text-[#5A6B85] mt-0.5">
                  Journey Time
                </div>
              </div>

              <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#D6DAE3]/60">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#D6DAE3] flex items-center justify-center text-[#192841] mb-2 shadow-xs">
                  <Train size={16} />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
                  {activePlan.transfers}
                </div>
                <div className="text-xs font-medium text-[#5A6B85] mt-0.5">
                  Transfers
                </div>
              </div>

              <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#D6DAE3]/60">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#D6DAE3] flex items-center justify-center text-[#192841] mb-2 shadow-xs">
                  <Footprints size={16} />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
                  {activePlan.walkingDistance}
                </div>
                <div className="text-xs font-medium text-[#5A6B85] mt-0.5">
                  Walking ({activePlan.walkingMins} min)
                </div>
              </div>
            </div>

            {/* Journey Leg Breakdown */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-[#5A6B85] uppercase tracking-wide mb-3">
                Synchronized Leg Breakdown
              </div>
              <div className="space-y-2.5">
                {activePlan.modes.map((segment, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#D6DAE3]"
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
                          Duration: {segment.time}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#192841]/5 text-[#192841]">
                      Leg #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D6DAE3]">
              <div className="text-sm text-[#5A6B85]">
                Digital Pass Fare: <strong className="text-black text-base">{activePlan.fare}</strong>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => alert(`Starting Live Journey Guidance to ${activePlan.destination}!`)}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#192841] hover:bg-[#1E2E4D] text-xs font-bold text-white transition-colors shadow-sm cursor-pointer"
                >
                  Start Live Journey
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
