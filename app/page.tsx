"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import AuthModal from "./components/AuthModal";
import HeroSection from "./components/HeroSection";
import { useAuth } from "./context/auth";
import {
  Mic,
  Volume2,
  Navigation,
  Train,
  Bus,
  ArrowRight,
  CheckCircle2,
  Zap,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Plus,
  Building,
  Home as HomeIcon,
  Briefcase,
  Plane,
} from "lucide-react";

interface OrbitVehicle {
  key: string;
  /** Container width per breakpoint = length of the vehicle, so sizes differ. */
  sizeClass: string;
  /**
   * Per-breakpoint orbit inputs as custom properties: --half (half the rendered
   * width incl. depth scale), --ry / --rxmax (orbit radii) and --ph (start phase).
   */
  vars: string;
  /** Offsets the hover bob so the vehicles don't bob in unison. */
  bobDelaySec: number;
}

interface VehicleView {
  src: string;
  width: number;
  height: number;
  /** Rendered width as a % of the vehicle length; every view shares one body height. */
  widthPct: number;
  /** Top offset (% of the container) that puts the body's centre on the container's centre. */
  topPct: number;
}

// Views of the Gravity Weaver concept vehicle, cut out from the reference poster.
// Widths and offsets are measured so the body keeps the same size and the same
// height above the ground in every view - otherwise the vehicle would appear to
// jump when the angle changes.
const VEHICLE_VIEWS: Record<"front" | "hero" | "side" | "rear", VehicleView> = {
  front: { src: "/images/vehicle-front.webp", width: 326, height: 175, widthPct: 67.8, topPct: 9.7 },
  hero: { src: "/images/vehicle-hero.webp", width: 637, height: 284, widthPct: 100, topPct: 1.1 },
  side: { src: "/images/vehicle-side.webp", width: 365, height: 133, widthPct: 100, topPct: 12.4 },
  rear: { src: "/images/vehicle-rear.webp", width: 350, height: 158, widthPct: 80.7, topPct: 9.7 },
};

// Heading sequence over one lap: front -> 3/4 -> side (moving right) -> rear ->
// side (moving left) -> 3/4 -> front. Right-facing views are the same vehicle
// seen from its other side. "fa"/"fb" are the same front view, duplicated so the
// loop point is seamless. Each id matches the .u-vo-* / .u-vs-* keyframes.
const VEHICLE_LAYERS: { id: string; view: keyof typeof VEHICLE_VIEWS; mirror: boolean }[] = [
  { id: "fa", view: "front", mirror: false },
  { id: "h1", view: "hero", mirror: true },
  { id: "s1", view: "side", mirror: true },
  { id: "r", view: "rear", mirror: false },
  { id: "s2", view: "side", mirror: false },
  { id: "h2", view: "hero", mirror: false },
  { id: "fb", view: "front", mirror: false },
];

// One shared orbit period and fixed phase offsets keep the vehicles a constant
// distance apart in time, so they can never meet (verified for 320px-1920px).
const ORBIT_SECONDS = 40;

const ORBIT_VEHICLES: OrbitVehicle[] = [
  {
    key: "large",
    sizeClass: "w-[110px] sm:w-[200px] lg:w-[250px]",
    vars: "[--ph:0] [--rxmax:470px] [--half:64px] sm:[--half:116px] lg:[--half:145px] [--ry:40px] sm:[--ry:60px] lg:[--ry:86px]",
    bobDelaySec: 0,
  },
  {
    // Phones get a small second vehicle on its own, taller path (phase 0.5) so
    // the two stay clear of each other at every width from 320px up.
    key: "medium",
    sizeClass: "w-[56px] sm:w-[130px] lg:w-[170px]",
    vars: "[--ph:0.5] sm:[--ph:0.5417] [--rxmax:300px] sm:[--rxmax:420px] [--half:33px] sm:[--half:75px] lg:[--half:99px] [--ry:56px] sm:[--ry:46px] lg:[--ry:64px]",
    bobDelaySec: -1.2,
  },
  {
    key: "small",
    sizeClass: "hidden sm:block sm:w-[85px] lg:w-[110px]",
    vars: "sm:[--ph:0.2917] sm:[--rxmax:360px] sm:[--half:49px] lg:[--half:64px] sm:[--ry:78px] lg:[--ry:100px]",
    bobDelaySec: -2.4,
  },
];

/**
 * One vehicle flying an elliptical loop around the section heading. It is
 * never mirrored or flipped mid-flight: as it goes round it is shown from real
 * angles (front, front-3/4, side, rear) that blend in step with its heading,
 * so the turns read as a real vehicle banking round, and a slow bob keeps it
 * hovering. All motion is CSS (see .u-orbit-*, .u-vo-* and .u-vs-* in globals.css).
 */
function OrbitingVehicle({ vehicle }: { vehicle: OrbitVehicle }) {
  const style = {
    "--dur": `${ORBIT_SECONDS}s`,
    "--bd": `${vehicle.bobDelaySec}s`,
  } as React.CSSProperties;

  return (
    <div
      className={`u-orbit-z absolute left-1/2 top-[92px] sm:top-[126px] -translate-x-1/2 -translate-y-1/2 [--zf:0] sm:[--zf:20] ${vehicle.sizeClass} ${vehicle.vars}`}
      style={style}
    >
      <div className="u-orbit-x">
        <div className="u-orbit-ys">
          <div className="u-orbit-bob">
            <div className="relative w-full aspect-[2/1]">
              {VEHICLE_LAYERS.map((layer) => {
                const v = VEHICLE_VIEWS[layer.view];
                return (
                  <div
                    key={layer.id}
                    className={`u-vo-${layer.id} absolute left-1/2 -translate-x-1/2`}
                    style={{ width: `${v.widthPct}%`, top: `${v.topPct}%` }}
                  >
                    <div className={`u-vs-${layer.id}`}>
                      <Image
                        src={v.src}
                        alt=""
                        width={v.width}
                        height={v.height}
                        draggable={false}
                        className="w-full h-auto select-none"
                        style={{
                          filter: "drop-shadow(0 16px 18px rgba(15,23,42,0.12))",
                          transform: layer.mirror ? "scaleX(-1)" : undefined,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, updateJourney } = useAuth();

  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);

  // Search Bar state (docked hero bar)
  const [searchFrom, setSearchFrom] = useState("KDU, Ratmalana");
  const [searchTo, setSearchTo] = useState("Bandaranaike International Airport (BIA)");
  const [searchMode, setSearchMode] = useState("Autonomous Bus + SkyRail");
  const [searchPriority, setSearchPriority] = useState("Fastest Route");

  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  // Saved places state (AGENTS.md Section 12)
  const [savedPlaces] = useState([
    { name: "Home", address: "Marine Drive Promenade, Kollupitiya", icon: HomeIcon },
    { name: "Work", address: "World Trade Center, Echelon Square", icon: Briefcase },
    { name: "University", address: "KDU, Ratmalana", icon: Building },
    { name: "Airport", address: "Bandaranaike International Airport", icon: Plane },
  ]);

  const feedbackSubmitted = searchParams.get("feedback_submitted");

  /**
   * Core Workflow Router:
   * If passenger is NOT logged in / signed up -> navigate to /signup (or /login) with redirect param!
   * If passenger IS logged in -> navigate to dedicated /preferences separate page!
   */
  const handleStartPlanning = (destination?: string) => {
    const targetDest = destination || searchTo || "Bandaranaike International Airport (BIA)";
    updateJourney({
      origin: searchFrom || "KDU, Ratmalana",
      destination: targetDest,
    });

    if (!isAuthenticated) {
      // Direct navigation to Sign Up page as requested by the user
      const redirectUrl = `/preferences?to=${encodeURIComponent(targetDest)}`;
      router.push(`/signup?redirect=${encodeURIComponent(redirectUrl)}`);
    } else {
      // Logged-in passenger navigates directly to separate Route Preferences page
      router.push(`/preferences?to=${encodeURIComponent(targetDest)}`);
    }
  };

  const handleVoiceClick = () => {
    if (isVoiceListening) {
      setIsVoiceListening(false);
      return;
    }

    setIsVoiceListening(true);
    setVoiceTranscript("Listening for passenger destination...");

    setTimeout(() => {
      setVoiceTranscript('Heard: "Take me to Bandaranaike Airport"');
    }, 1200);

    setTimeout(() => {
      setIsVoiceListening(false);
      setVoiceTranscript("Destination recognized: Bandaranaike International Airport (BIA)");
      handleStartPlanning("Bandaranaike International Airport (BIA)");
    }, 2400);
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
      image: "/images/bus.jpg",
    },
    {
      title: "SkyRail Magnetic Lines",
      subtitle: "Elevated magnetic levitation bypassing urban congestion",
      badge: "High Speed 180 km/h",
      description: "Glide above traffic on frictionless magnetic guideways. Connecting outer suburban university campuses and international airport terminals directly to downtown stations.",
      specs: ["100% On-Time Guarantee", "Direct Hub-to-Hub", "Climate Sealed Pods"],
      icon: Train,
      tag: "SkyRail Line 02",
      image: "/images/skyrail.jpg",
    },
    {
      title: "Smart Road Autonomous Pods",
      subtitle: "On-demand door-to-station micro-mobility pods",
      badge: "Last-Mile Connect",
      description: "Summon a personal or shared autonomous pod directly to your doorstep. Pods merge seamlessly with the main SkyRail concourse for truly uninterrupted door-to-destination journeys.",
      specs: ["Instant Dispatch", "Private Work Cabins", "Smart Road Charging"],
      icon: Zap,
      tag: "Smart Pod EV",
      image: "/images/pod.jpg",
    },
    {
      title: "Voice Journey Co-Pilot",
      subtitle: "Hands-free real-time audio transit intelligence",
      badge: "Tell Univa AI",
      description: "Speak naturally while walking or changing platforms. Ask 'Where do I transfer?' or 'Is my SkyRail on time?' and receive immediate vocal transit guidance.",
      specs: ["Multilingual Voice", "Haptic Platform Alerts", "Offline Speech Mode"],
      icon: Mic,
      tag: "Tell Univa",
      image: "/images/skyrail.jpg",
    },
  ];

  return (
    <>
      {/* Global Auth Modal for quick modal switches */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitchMode={(mode) => setAuthModal(mode)}
        />
      )}

      {/* Feedback confirmation banner if returning from /feedback */}
      {feedbackSubmitted && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-emerald-50 border border-emerald-300 text-emerald-900 px-5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Thank you! Your feedback has helped improve Univa autonomous dispatch.</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: FULL-SIZE HERO WITH DUAL INFINITE SCROLL & HIGHLIGHTED CTAs    */}
      {/* ========================================================================= */}
      <HeroSection
        onOpenAuth={(mode) => {
          router.push(mode === "signup" ? "/signup" : "/login");
        }}
        onVoiceClick={handleVoiceClick}
        isVoiceListening={isVoiceListening}
        onExploreClick={() => handleStartPlanning()}
        searchFrom={searchFrom}
        setSearchFrom={setSearchFrom}
        searchTo={searchTo}
        setSearchTo={setSearchTo}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        searchPriority={searchPriority}
        setSearchPriority={setSearchPriority}
        onSearchSubmit={() => handleStartPlanning(searchTo)}
      />

      {voiceTranscript && (
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-3.5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-2.5 text-xs text-[#0F172A] u-surface">
            <Volume2 size={16} className="text-[#192841] shrink-0" />
            <span className="font-semibold">{voiceTranscript}</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pt-10 sm:pt-16 pb-20">
        
        {/* ========================================================================= */}
        {/* SECTIONS 11 & 12: RECENT DESTINATIONS & SAVED PLACES (AGENTS.md)          */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#192841]/10 text-[#192841] text-xs font-bold uppercase tracking-wider mb-2 u-mono">
                <Navigation size={14} className="text-[#192841]" />
                <span>Quick Transit Access</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Recent & Saved Destinations
              </h2>
            </div>

            {/* Passenger Authentication Status Card */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs text-xs u-surface">
                  <div className="w-7 h-7 rounded-xl bg-[#192841] text-white flex items-center justify-center font-bold">
                    {user?.name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <span className="font-bold text-[#0F172A] block">{user?.name}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold inline-flex items-center gap-1.5">
                      <span className="u-pulse-dot" style={{ "--pulse-color": "#22C55E" } as React.CSSProperties} />
                      Passenger Account Active
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/signup"
                    className="px-4 py-2 rounded-xl bg-[#192841] text-white text-xs font-bold shadow-xs hover:bg-[#111C2E] u-btn transition-all"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl bg-white text-[#192841] border border-[#E2E8F0] text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 11: RECENT DESTINATIONS CHIPS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "University", sub: "KDU Ratmalana", icon: Building, dest: "General Sir John Kotelawala Defence University (KDU)" },
              { label: "Home", sub: "Marine Drive Promenade", icon: HomeIcon, dest: "Marine Drive Promenade, Kollupitiya" },
              { label: "Work", sub: "World Trade Center", icon: Briefcase, dest: "World Trade Center, Echelon Square" },
              { label: "Airport", sub: "Bandaranaike Int. Airport", icon: Plane, dest: "Bandaranaike International Airport (BIA)" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleStartPlanning(item.dest)}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-4 text-left shadow-xs hover:border-[#192841] hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#192841]/10 group-hover:bg-[#192841] text-[#192841] group-hover:text-white flex items-center justify-center mb-3 transition-colors">
                    <Icon size={18} />
                  </div>
                  <div className="text-sm font-bold text-[#0F172A] group-hover:text-[#192841]">
                    {item.label}
                  </div>
                  <div className="text-xs text-[#64748B] truncate mt-0.5">
                    {item.sub}
                  </div>
                </button>
              );
            })}
          </div>

          {/* SECTION 12: SAVED PLACES */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm space-y-4 u-surface u-hud">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#192841] text-white flex items-center justify-center shrink-0">
                  <Bookmark size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Saved Places</h3>
                  <p className="text-xs text-[#64748B]">
                    Access frequent destinations with one tap. Synchronized with your profile.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push("/signup?redirect=/");
                  } else {
                    alert("Add place feature: select a location to pin to your passenger favorites.");
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-[#F7F9FC] hover:bg-slate-100 border border-[#E2E8F0] text-xs font-bold text-[#192841] transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus size={14} />
                <span>+ Add place</span>
              </button>
            </div>

            {/* Render Saved Places Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {savedPlaces.map((place) => {
                const PlaceIcon = place.icon;
                return (
                  <button
                    key={place.name}
                    type="button"
                    onClick={() => handleStartPlanning(place.address)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#F7F9FC] hover:bg-slate-100 border border-[#E2E8F0] text-left transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white text-[#192841] border border-[#E2E8F0] flex items-center justify-center shrink-0 shadow-xs">
                      <PlaceIcon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-[#0F172A] block truncate">
                        {place.name}
                      </span>
                      <span className="text-[11px] text-[#64748B] block truncate">
                        {place.address}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: RIDER SERVICES SHOWCASE & BRAND STATEMENT                      */}
        {/* ========================================================================= */}
        <section className="space-y-10 u-grid-bg">
          {/* Vehicles flying around the brand statement */}
          <div
            className="u-orbit-stage absolute inset-x-0 top-0 h-[200px] sm:h-[240px] pointer-events-none"
            aria-hidden="true"
          >
            {ORBIT_VEHICLES.map((vehicle) => (
              <OrbitingVehicle key={vehicle.key} vehicle={vehicle} />
            ))}
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0F172A] leading-tight">
              Univa means <br />
              <span className="text-[#192841] relative inline-block">
                Effortless Movement
              </span>
            </h2>

            {/* Waypoint Path Illustration */}
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

          {/* Services Showcase Cards */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
            {/* Left Narrative */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 u-surface u-hud">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#192841]/10 text-[#192841] text-xs font-bold uppercase tracking-wider u-mono">
                  <span className="w-2 h-2 rounded-full bg-[#192841]" />
                  <span>01 Rider Services</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-snug">
                  Integrated Future Transit
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  We coordinate autonomous bus lines, elevated magnetic SkyRail, and on-demand vehicle pods into a single reliable schedule. No multiple ticketing, zero unexpected transfers.
                </p>

                <div className="relative w-full h-36 rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0] group">
                  <Image
                    src="/images/skyrail.jpg"
                    alt="Univa Multimodal Transit System"
                    fill
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white pointer-events-none">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block u-mono">Unified Fleet</span>
                      <span className="text-xs font-bold">Synchronized Autonomous Grid</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => handleStartPlanning()}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#192841] hover:bg-[#111C2E] u-btn text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Plan Your Journey</span>
                  <ArrowRight size={16} />
                </button>
                <div className="text-[11px] text-center text-[#64748B]">
                  Step-free accessibility • Instant NFC tap boarding
                </div>
              </div>
            </div>

            {/* Right Interactive Services Cards */}
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
                          ? "border-[#192841] shadow-md ring-2 ring-[#192841]/20 u-glow"
                          : "border-[#E2E8F0] shadow-xs hover:border-[#192841]/40"
                      } p-5 flex flex-col justify-between space-y-4 transition-all group`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#192841]/10 text-[#192841]">
                            {svc.badge}
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-[#192841] text-white flex items-center justify-center shadow-xs">
                            <Icon size={16} />
                          </div>
                        </div>

                        <div className="w-full h-36 rounded-2xl relative overflow-hidden group-hover:scale-[1.02] transition-transform shadow-sm bg-slate-900">
                          <Image
                            src={svc.image}
                            alt={svc.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 280px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
                          <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block u-mono">
                              {svc.tag}
                            </span>
                            <h4 className="text-sm font-extrabold text-white leading-tight drop-shadow-sm truncate">
                              {svc.title}
                            </h4>
                          </div>
                        </div>

                        <p className="text-xs text-[#64748B] leading-relaxed">
                          {svc.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E2E8F0]">
                        <ul className="space-y-1">
                          {svc.specs.map((spec, sIdx) => (
                            <li key={sIdx} className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-[#64748B]">
                  Showing 3 primary autonomous transit modes
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveServiceIndex((prev) => (prev > 0 ? prev - 1 : riderServices.length - 1))}
                    className="w-8 h-8 rounded-full border border-[#E2E8F0] bg-white hover:bg-[#F7F9FC] hover:border-[#192841] flex items-center justify-center text-[#0F172A] shadow-xs cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveServiceIndex((prev) => (prev + 1) % riderServices.length)}
                    className="w-8 h-8 rounded-full border border-[#E2E8F0] bg-white hover:bg-[#F7F9FC] hover:border-[#192841] flex items-center justify-center text-[#0F172A] shadow-xs cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: POPULAR COMMUTER ROUTES (Direct Navigation to Pages)           */}
        {/* ========================================================================= */}
        <section id="routes-section" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#192841]/10 text-[#192841] text-xs font-bold uppercase tracking-wider u-mono">
                <span className="w-2 h-2 rounded-full bg-[#192841]" />
                <span>Popular Commuter Routes</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
                Pick the Place
              </h2>
            </div>

            <p className="text-sm text-[#64748B] max-w-md">
              Great options for students, workers, tourists, and daily commuters with guaranteed connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CARD 1: KDU Campus */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#192841]/60 transition-all u-surface u-surface-hover u-hud">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">KDU Defence University</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    4 Seats Left
                  </span>
                </div>
                <div className="text-xs text-[#64748B]">Ratmalana Campus Concourse</div>

                <div className="w-full h-44 rounded-2xl relative overflow-hidden shadow-sm group bg-slate-900">
                  <Image
                    src="/images/bus.jpg"
                    alt="Autonomous Bus to KDU Ratmalana Campus"
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none" />
                  <div className="absolute inset-0 p-4 text-white flex flex-col justify-between pointer-events-none">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[11px] font-bold">Bus 245 + SkyRail</span>
                      <span className="text-[#22C55E] bg-white/95 px-2 py-0.5 rounded-full font-bold shadow-xs text-[10px] inline-flex items-center gap-1.5">
                        <span className="u-pulse-dot" style={{ "--pulse-color": "#22C55E" } as React.CSSProperties} />
                        On Time
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-2xl font-black drop-shadow-sm">27 min</div>
                      <div className="text-[11px] text-white/90">Departure: 08:15 AM • Bay 4</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]/60">
                    <div className="text-[10px] text-[#64748B]">Fare</div>
                    <div className="text-xs font-bold text-black">LKR 120</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]/60">
                    <div className="text-[10px] text-[#64748B]">Transfer</div>
                    <div className="text-xs font-bold text-black">1 Hub</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]/60">
                    <div className="text-[10px] text-[#64748B]">Walking</div>
                    <div className="text-xs font-bold text-black">320m</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartPlanning("General Sir John Kotelawala Defence University (KDU)")}
                className="w-full py-3 rounded-xl bg-[#192841] hover:bg-[#111C2E] u-btn text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Select & Plan Journey</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* CARD 2: Airport */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#192841]/60 transition-all u-surface u-surface-hover u-hud">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">Bandaranaike Airport</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#192841]/10 text-[#192841]">
                    SuperLink Express
                  </span>
                </div>
                <div className="text-xs text-[#64748B]">Katunayake SkyRail Terminal</div>

                <div className="w-full h-44 rounded-2xl relative overflow-hidden shadow-sm group bg-slate-900">
                  <Image
                    src="/images/skyrail.jpg"
                    alt="SkyRail Express to Bandaranaike International Airport"
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none" />
                  <div className="absolute inset-0 p-4 text-white flex flex-col justify-between pointer-events-none">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[11px] font-bold">SkyRail Line 01</span>
                      <span className="text-[#22C55E] bg-white/95 px-2 py-0.5 rounded-full font-bold shadow-xs text-[10px] inline-flex items-center gap-1.5">
                        <span className="u-pulse-dot" style={{ "--pulse-color": "#22C55E" } as React.CSSProperties} />
                        Non-Stop
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-2xl font-black drop-shadow-sm">18 min</div>
                      <div className="text-[11px] text-white/90">Direct Airport Shuttles every 10 min</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]/60">
                    <div className="text-[10px] text-[#64748B]">Fare</div>
                    <div className="text-xs font-bold text-black">LKR 350</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]/60">
                    <div className="text-[10px] text-[#64748B]">Luggage</div>
                    <div className="text-xs font-bold text-black">Auto-Sync</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]/60">
                    <div className="text-[10px] text-[#64748B]">Walking</div>
                    <div className="text-xs font-bold text-black">150m</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartPlanning("Bandaranaike International Airport (BIA)")}
                className="w-full py-3 rounded-xl bg-[#192841] hover:bg-[#111C2E] u-btn text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Select & Plan Journey</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* CARD 3: Marine Drive */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#192841]/60 transition-all u-surface u-surface-hover u-hud">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">Marine Drive Promenade</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    Eco Pod Fleet
                  </span>
                </div>
                <div className="text-xs text-[#64748B]">Kollupitiya Ocean Concourse</div>

                <div className="w-full h-44 rounded-2xl relative overflow-hidden shadow-sm group bg-slate-900">
                  <Image
                    src="/images/pod.jpg"
                    alt="Smart Road Pod EV on Coastal Route"
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none" />
                  <div className="absolute inset-0 p-4 text-white flex flex-col justify-between pointer-events-none">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[11px] font-bold">Smart Road Pod</span>
                      <span className="text-[#22C55E] bg-white/95 px-2 py-0.5 rounded-full font-bold shadow-xs text-[10px] inline-flex items-center gap-1.5">
                        <span className="u-pulse-dot" style={{ "--pulse-color": "#22C55E" } as React.CSSProperties} />
                        Zero Emiss
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-2xl font-black drop-shadow-sm">14 min</div>
                      <div className="text-[11px] text-white/90">Coastal Route • Direct Curb Drop</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]/60">
                    <div className="text-[10px] text-[#64748B]">Fare</div>
                    <div className="text-xs font-bold text-black">LKR 80</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]/60">
                    <div className="text-[10px] text-[#64748B]">Transfer</div>
                    <div className="text-xs font-bold text-black">0 Direct</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]/60">
                    <div className="text-[10px] text-[#64748B]">Walking</div>
                    <div className="text-xs font-bold text-black">210m</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartPlanning("Marine Drive Promenade, Kollupitiya")}
                className="w-full py-3 rounded-xl bg-[#192841] hover:bg-[#111C2E] u-btn text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Select & Plan Journey</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm font-semibold text-[#64748B]">Loading Univa...</div>}>
      <HomeContent />
    </Suspense>
  );
}
