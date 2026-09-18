"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Navigation,
  Search,
  Mic,
  Clock,
  Zap,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Radio,
  Train,
  Bus,
  Plane,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import JourneyPlanModal from "./JourneyPlanModal";
import LiveJourneyMap from "./LiveJourneyMap";
import {
  RECENT_DESTINATIONS,
  DEFAULT_JOURNEY_KDU_TO_AIRPORT,
  PresetDestination,
} from "./journeyData";

export default function LiveRoutePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStep, setModalInitialStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedDestinationName, setSelectedDestinationName] = useState("Bandaranaike International Airport (BIA)");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceNotification, setVoiceNotification] = useState<string | null>(null);

  // Background map simulation progress
  const [ambientProgress, setAmbientProgress] = useState(0.28);

  useEffect(() => {
    const interval = setInterval(() => {
      setAmbientProgress((prev) => (prev >= 0.95 ? 0.05 : prev + 0.01));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleOpenPlanModal = (step: 1 | 2 | 3 | 4 | 5 = 1, dest?: string) => {
    if (dest) {
      setSelectedDestinationName(dest);
    }
    setModalInitialStep(step);
    setIsModalOpen(true);
  };

  const handleSelectRecentDest = (dest: PresetDestination) => {
    setSelectedDestinationName(dest.address);
    setModalInitialStep(2);
    setIsModalOpen(true);
  };

  const handleVoiceAssistant = () => {
    if (isVoiceListening) {
      setIsVoiceListening(false);
      return;
    }
    setIsVoiceListening(true);
    setVoiceNotification("Listening: 'Take me to Airport'...");

    setTimeout(() => {
      setVoiceNotification('Recognized: "Take me to Bandaranaike Airport"');
    }, 1200);

    setTimeout(() => {
      setIsVoiceListening(false);
      setSelectedDestinationName("Bandaranaike International Airport (BIA)");
      setModalInitialStep(2);
      setIsModalOpen(true);
    }, 2400);
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-slate-900 font-sans pt-24 pb-20 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16">
      
      {/* ========================================================================= */}
      {/* 5-STEP JOURNEY POPUP MODAL                                                */}
      {/* ========================================================================= */}
      <JourneyPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialStep={modalInitialStep}
        initialDestination={selectedDestinationName}
      />

      <div className="max-w-[1360px] mx-auto space-y-10 sm:space-y-12">
        
        {/* ========================================================================= */}
        {/* HERO SECTION                                                              */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading & CTA */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Univa Live Route Navigation</span>
                </span>
                <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
                  Network On Time
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Plan & Track Your <br />
                  <span className="text-[#192841]">Multi-Modal Journey</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed">
                  Seamlessly connect Autonomous Bus fleets, SkyRail Maglev, and Aeropod air shuttles into one synchronized journey with real-time GPS tracking.
                </p>
              </div>

              {/* Primary Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                
                {/* Plan Your Journey CTA */}
                <button
                  type="button"
                  onClick={() => handleOpenPlanModal(1)}
                  className="px-8 py-4 rounded-xl bg-[#192841] hover:bg-[#111C2E] text-white font-bold text-base transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>Plan Your Journey</span>
                  <ArrowRight size={16} />
                </button>

                {/* Tell Univa Voice Button */}
                <button
                  type="button"
                  onClick={handleVoiceAssistant}
                  className={`px-6 py-4 rounded-xl font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 border cursor-pointer ${
                    isVoiceListening
                      ? "bg-[#192841] text-white animate-pulse"
                      : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200"
                  }`}
                >
                  <Mic size={18} className={isVoiceListening ? "animate-pulse" : "text-slate-600"} />
                  <span>{isVoiceListening ? "Listening..." : "Tell Univa (Voice)"}</span>
                </button>
              </div>

              {/* Voice Notification */}
              {voiceNotification && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                  <Sparkles size={14} className="text-emerald-600" />
                  <span>{voiceNotification}</span>
                </div>
              )}
            </div>

            {/* Right Column: Destination Search Card */}
            <div className="lg:col-span-5 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Quick Search
                </span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <MapPin size={12} /> KDU, Ratmalana
                </span>
              </div>

              {/* Search Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleOpenPlanModal(1, searchQuery || "Bandaranaike International Airport (BIA)");
                }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-200 focus-within:border-[#192841] transition-colors shadow-2xs">
                  <Search size={18} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search destination (Airport, University...)"
                    className="w-full text-sm font-semibold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#192841] hover:bg-[#111C2E] text-white font-bold text-xs sm:text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Search & View Routes</span>
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* Popular destinations */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span className="text-xs font-medium text-slate-500 block">
                  Popular:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {RECENT_DESTINATIONS.slice(0, 4).map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => handleSelectRecentDest(dest)}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{dest.icon}</span>
                      <span>{dest.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: LIVE CORRIDOR MAP RADAR                                        */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Active Transit Corridor Radar
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Real-time synchronized tracking along the Colombo-Katunayake corridor
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenPlanModal(1)}
              className="px-4 py-2 rounded-xl bg-[#192841] hover:bg-[#111C2E] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Journey Planner</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <LiveJourneyMap
            progress={ambientProgress}
            activeMode="bus"
            currentVehicleName="Bus U-204 • KDU to BIA Airport Corridor"
            speedKmH={74}
            fromLocation="KDU, Ratmalana"
            toLocation="Bandaranaike International Airport (BIA)"
          />
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: CORE SCREEN WORKFLOW PREVIEW                                   */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              One Platform. Every Journey.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Search size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  1. Search & Select Vehicle
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your destination or speak naturally. Compare vehicle departure times, durations, and pricing at a glance.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenPlanModal(1)}
                className="w-full py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
              >
                <span>Open Search</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Clock size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  2. Route Details & Timeline
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  View fare (LKR 180), arrival time (10:42 AM), multi-modal timeline (Bus → SkyRail → Aeropod), and accessibility features.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenPlanModal(2)}
                className="w-full py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
              >
                <span>View Route</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Radio size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  3. Live Trip & Arrival
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Follow live GPS vehicle tracking with Next Stop alerts, transfer warnings, and celebratory 5-star feedback upon arrival.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenPlanModal(4)}
                className="w-full py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
              >
                <span>Launch Live Tracking</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
