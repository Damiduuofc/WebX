"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Mic,
  Search,
  Zap,
  CheckCircle2,
  Train,
  Bus,
  ShieldCheck,
  Radio,
  MapPin,
} from "lucide-react";

interface TransitCardItem {
  src: string;
  title: string;
  badge: string;
  status: string;
  alt: string;
  type: "skyrail" | "bus" | "pod";
}

const column1Items: TransitCardItem[] = [
  {
    src: "/images/skyrail.jpg",
    title: "SkyRail Line 02",
    badge: "180 km/h Maglev",
    status: "On Time",
    alt: "Futuristic SkyRail magnetic levitation train on elevated guideway",
    type: "skyrail",
  },
  {
    src: "/images/bus.jpg",
    title: "Autonomous Bus 245",
    badge: "Precision Docking",
    status: "Arriving Now",
    alt: "Electric autonomous public transit bus at boarding station",
    type: "bus",
  },
  {
    src: "/images/pod.jpg",
    title: "Smart Road Pod EV",
    badge: "Micro-Mobility Pod",
    status: "Zero Emissions",
    alt: "Autonomous smart road electric pod on coastal highway",
    type: "pod",
  },
  {
    src: "/images/skyrail.jpg",
    title: "Airport SkyExpress",
    badge: "Direct BIA Terminal",
    status: "18 min Direct",
    alt: "Elevated SkyRail line connecting downtown to international airport",
    type: "skyrail",
  },
];

const column2Items: TransitCardItem[] = [
  {
    src: "/images/bus.jpg",
    title: "Campus Feeder 255",
    badge: "Step-Free Ramp",
    status: "3 min Headway",
    alt: "Autonomous feeder bus route connecting KDU campus",
    type: "bus",
  },
  {
    src: "/images/pod.jpg",
    title: "Coastal Autonet",
    badge: "On-Demand Cabin",
    status: "Instant Dispatch",
    alt: "Smart road autonomous pod with panoramic glass cabin",
    type: "pod",
  },
  {
    src: "/images/skyrail.jpg",
    title: "Central Interchange",
    badge: "Synchronized Transfer",
    status: "Platform 3",
    alt: "SkyRail multimodal terminal hub",
    type: "skyrail",
  },
  {
    src: "/images/bus.jpg",
    title: "Autonomous Bus 245",
    badge: "Smart Road Grid",
    status: "High Frequency",
    alt: "Autonomous transit fleet on smart city municipal road",
    type: "bus",
  },
];

export function HeroImageGrid() {
  const shouldReduceMotion = useReducedMotion();

  const renderCard = (item: TransitCardItem, key: string | number) => (
    <div
      key={key}
      className="group relative w-full h-44 sm:h-52 md:h-60 lg:h-72 rounded-2xl overflow-hidden shrink-0 shadow-md sm:shadow-lg border border-white/60 bg-white transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 40vw, 360px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Visual Depth Gradient Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

      {/* Top Badge: Mode Category */}
      <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between pointer-events-none">
        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#ffffff]/90 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-bold text-white shadow-sm">
          {item.type === "skyrail" && <Train size={11} className="text-[000000]" />}
          {item.type === "bus" && <Bus size={11} className="text-[#000000]" />}
          {item.type === "pod" && <Zap size={11} className="text-[#000000]" />}
          <span>{item.badge}</span>
        </span>

        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[9px] sm:text-[10px] font-extrabold text-[#000000] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          <span>{item.status}</span>
        </span>
      </div>

      {/* Bottom Title Bar */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 pointer-events-none">
        <h4 className="text-xs sm:text-sm lg:text-base font-extrabold text-white leading-tight drop-shadow-md">
          {item.title}
        </h4>
        <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium truncate">
          Year  Autonomous Network
        </p>
      </div>
    </div>
  );

  if (shouldReduceMotion) {
    return (
      <div className="w-full max-w-[720px] mx-auto grid grid-cols-2 gap-3 sm:gap-5">
        <div className="flex flex-col gap-3 sm:gap-5">
          {column1Items.slice(0, 2).map((item, i) => renderCard(item, `static-c1-${i}`))}
        </div>
        <div className="flex flex-col gap-3 sm:gap-5">
          {column2Items.slice(0, 2).map((item, i) => renderCard(item, `static-c2-${i}`))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[720px] mx-auto">
      {/* Container with liquid depth & responsive viewport framing */}
      <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] lg:h-[580px] xl:h-[620px] overflow-hidden rounded-2xl sm:rounded-3xl">
        {/* Soft edge masking gradients blending seamlessly into page bg #F7F8FA */}
        <div className="absolute top-0 inset-x-0 h-10 sm:h-14 bg-gradient-to-b from-[#F7F8FA] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-12 sm:h-16 bg-gradient-to-t from-[#F7F8FA] to-transparent z-20 pointer-events-none" />

        <div className="grid grid-cols-2 gap-3 sm:gap-5 h-full">
          {/* LEFT COLUMN: Scrolls Up */}
          <div className="overflow-hidden h-full">
            <motion.div
              className="flex flex-col gap-3 sm:gap-5"
              animate={{ y: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 26,
              }}
            >
              {[...column1Items, ...column1Items].map((item, i) =>
                renderCard(item, `c1-${i}`)
              )}
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Scrolls Down */}
          <div className="overflow-hidden h-full">
            <motion.div
              className="flex flex-col gap-3 sm:gap-5"
              animate={{ y: ["-50%", "0%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 26,
              }}
            >
              {[...column2Items, ...column2Items].map((item, i) =>
                renderCard(item, `c2-${i}`)
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface HeroSectionProps {
  onOpenAuth?: (mode: "login" | "signup") => void;
  onVoiceClick?: () => void;
  isVoiceListening?: boolean;
  onExploreClick?: () => void;
  searchFrom?: string;
  setSearchFrom?: (val: string) => void;
  searchTo?: string;
  setSearchTo?: (val: string) => void;
  searchMode?: string;
  setSearchMode?: (val: string) => void;
  searchPriority?: string;
  setSearchPriority?: (val: string) => void;
  onSearchSubmit?: () => void;
}

export default function HeroSection({
  onOpenAuth,
  onVoiceClick,
  isVoiceListening = false,
  onExploreClick,
  searchFrom = "KDU, Ratmalana",
  setSearchFrom,
  searchTo = "Bandaranaike International Airport",
  setSearchTo,
  searchMode = "Autonomous Bus + SkyRail",
  setSearchMode,
  searchPriority = "Fastest Route",
  setSearchPriority,
  onSearchSubmit,
}: HeroSectionProps) {
  const handlePrimaryCTA = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el =
        document.getElementById("routes-section") ||
        document.getElementById("planner-section");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleVoiceCTA = () => {
    if (onVoiceClick) {
      onVoiceClick();
    } else {
      const el = document.getElementById("planner-section");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit();
    } else {
      handlePrimaryCTA();
    }
  };

  return (
    <section className="relative w-full overflow-x-hidden overflow-y-hidden bg-[#F7F8FA] font-sans text-[#0F172A] pt-20 sm:pt-24 lg:pt-24 pb-8 sm:pb-12 lg:pb-14 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16">
      {/* Full-width Background Liquid Glass Artwork */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/HeroBG.png"
          alt="Univa  Fluid Transport Ribbon"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-65 sm:opacity-75"
        />
      </div>

      {/* Responsive Ambient Liquid Color Blurs with Fluid Animations */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-16 left-[2%] h-[300px] w-[300px] sm:h-[480px] sm:w-[480px] rounded-full bg-gradient-to-br from-[#192841]/10 via-[#192841]/5 to-transparent blur-[80px] sm:blur-[120px] z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -25, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-20 right-[2%] h-[340px] w-[340px] sm:h-[580px] sm:w-[580px] rounded-full bg-gradient-to-tl from-slate-400/10 via-[#192841]/5 to-transparent blur-[90px] sm:blur-[140px] z-0"
      />

      {/* Translucent Overlays for High Contrast Readability */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#F7F8FA] via-[#F7F8FA]/60 to-transparent z-0 pointer-events-none" />

      {/* Main Centered Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-start lg:items-center">
          {/* ========================================================================= */}
          {/* LEFT CONTENT COLUMN (5-6 Cols)                                            */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-5 flex flex-col justify-start text-left"
          >

            {/* Title with Restrained Crimson & Neutral Typography */}
            <h1 className="font-sans font-black text-3xl sm:text-5xl md:text-[54px] lg:text-[52px] xl:text-[54px] uppercase leading-[1.08] sm:leading-[1.05] tracking-tight mb-4 sm:mb-6 flex flex-col gap-1 select-none">
              <span className="text-[#0F172A] block">
                One Platform.
              </span>

              <div className="flex items-center gap-2.5 sm:gap-3 my-1 sm:my-1.5">
                <div className="h-[2px] w-6 sm:w-8 bg-gradient-to-r from-transparent to-[#192841]/30" />
                <span className="text-[#64748B] text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em]">
                  EVERY JOURNEY
                </span>
                <div className="h-[2px] w-6 sm:w-8 bg-gradient-to-l from-transparent to-[#192841]/30" />
              </div>

              <span className="text-[#192841] block leading-tight">
                UNIVA{" "}
                <span className="italic font-black text-2xl sm:text-4xl md:text-[46px] lg:text-[46px] xl:text-[48px]">
                   NETWORK
                </span>
              </span>
            </h1>

            {/* Narrative Description */}
            <p className="text-[#64748B] text-xs sm:text-sm md:text-base leading-relaxed max-w-[580px] mb-6 sm:mb-8 font-normal">
              Connecting autonomous buses, elevated magnetic SkyRail, and smart-road vehicle pods into one seamless journey. Built for students, workers, tourists, and daily commuters — simple, accessible, and synchronized in real time.
            </p>

            {/* ========================================================================= */}
            {/* PROMINENTLY HIGHLIGHTED CTA BUTTONS (Mobile-first responsive layout)      */}
            {/* ========================================================================= */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 w-full sm:w-auto">
              {/* PRIMARY HIGHLIGHTED CTA: Plan Your Journey */}
              <button
                type="button"
                onClick={handlePrimaryCTA}
                className="relative group w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#192841] hover:bg-[#111C2E] text-white font-bold text-sm sm:text-base transition-all duration-300 shadow-[0_8px_20px_-3px_rgba(25,40,65,0.25)] hover:shadow-[0_12px_26px_-3px_rgba(25,40,65,0.35)] hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-2.5 sm:gap-3 ring-2 ring-[#192841]/20 cursor-pointer overflow-hidden min-h-[48px]"
              >
                {/* Dynamic Light Sweep Highlight on hover */}
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

                {/* Luminous Pulsing Badge */}
                <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-[#22C55E]" />
                </span>

                <span className="tracking-wide">Plan Your Journey</span>

                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shrink-0">
                  <ArrowRight size={15} className="text-white" />
                </div>
              </button>

              {/* SECONDARY HIGHLIGHTED CTA: Tell Univa Voice Assistant */}
              <button
                type="button"
                onClick={handleVoiceCTA}
                className={`relative group w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer min-h-[48px] ${
                  isVoiceListening
                    ? "bg-[#192841] text-white ring-4 ring-[#192841]/20 scale-[1.02] shadow-md"
                    : "bg-white hover:bg-[#F7F9FC] text-[#0F172A] border border-[#E2E8F0] hover:border-[#192841] shadow-xs hover:-translate-y-0.5 active:scale-[0.99]"
                }`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                    isVoiceListening
                      ? "bg-white text-[#192841]"
                      : "bg-[#192841]/10 text-[#192841] group-hover:bg-[#192841] group-hover:text-white"
                  }`}
                >
                  <Mic size={15} className={isVoiceListening ? "animate-pulse" : ""} />
                </div>

                <span>{isVoiceListening ? "Listening..." : "Tell Univa (Voice)"}</span>
              </button>
            </div>

            {/* ========================================================================= */}
            {/* INTEGRATED DOCKED QUICK SEARCH BAR ("Where do you want to go?")           */}
            {/* ========================================================================= */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-[620px] bg-white rounded-2xl border border-[#E2E8F0] p-2.5 sm:p-3 shadow-md mb-4 sm:mb-5 flex flex-col gap-2"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]/60">
                  <Search size={18} className="text-[#192841] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                      Where do you want to go?
                    </span>
                    <input
                      type="text"
                      value={searchTo}
                      onChange={(e) => setSearchTo?.(e.target.value)}
                      placeholder="Search places, stations, universities..."
                      className="w-full text-base sm:text-sm font-semibold text-[#0F172A] bg-transparent focus:outline-none placeholder:text-[#64748B]/60 truncate"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#192841] hover:bg-[#111C2E] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0 min-h-[44px]"
                >
                  <span>Find Routes</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Sub-bar: Departure Point & Quick Filters */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1.5 border-t border-[#E2E8F0]/50 text-[11px] text-[#64748B]">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin size={12} className="text-[#192841] shrink-0" />
                  <span>From:</span>
                  <input
                    type="text"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom?.(e.target.value)}
                    className="font-bold text-[#0F172A] bg-transparent focus:outline-none border-b border-dashed border-[#192841]/40 max-w-[130px] sm:max-w-[170px] truncate"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {searchMode && (
                    <select
                      value={searchMode}
                      onChange={(e) => setSearchMode?.(e.target.value)}
                      className="bg-transparent font-semibold text-[#0F172A] focus:outline-none cursor-pointer text-[11px]"
                    >
                      <option value="Autonomous Bus + SkyRail">Bus + SkyRail</option>
                      <option value="SkyRail Express">SkyRail Express</option>
                      <option value="Smart Road Pods">Smart Road Pods</option>
                      <option value="All Modes">All Modes</option>
                    </select>
                  )}

                  {searchPriority && (
                    <select
                      value={searchPriority}
                      onChange={(e) => setSearchPriority?.(e.target.value)}
                      className="bg-transparent font-semibold text-[#0F172A] focus:outline-none cursor-pointer text-[11px]"
                    >
                      <option value="Fastest Route">⚡ Fastest</option>
                      <option value="Eco-Friendly">🌱 Eco</option>
                      <option value="Most Accessible"> Step-Free</option>
                      <option value="Less Walking">🚶 Min Walk</option>
                    </select>
                  )}
                </div>
              </div>
            </form>

            {/* Quick Commuter Action Links: Pass Signup & Login */}
            {onOpenAuth && (
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#64748B] mb-4">
                <span>New passenger?</span>
                <button
                  type="button"
                  onClick={() => onOpenAuth("signup")}
                  className="text-[#192841] font-bold underline hover:text-[#111C2E] cursor-pointer"
                >
                  Create Passenger Account
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onOpenAuth("login")}
                  className="text-[#192841] font-bold hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </div>
            )}

            {/* Accessibility & High Reliability Trust Badges */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-semibold text-[#64748B] pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#22C55E]" />
                <span>100% Step-Free Accessible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Radio size={13} className="text-[#192841]" />
                <span>Live GPS Telemetry</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#22C55E]" />
                <span>Zero-Emission Fleet</span>
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* RIGHT SCROLLING IMAGE GRID COLUMN (6-7 Cols)                               */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-7 w-full"
          >
            <HeroImageGrid />
          </motion.div>
        </div>
      </div>
    </section>
  );
}