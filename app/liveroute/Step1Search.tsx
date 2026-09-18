"use client";

import React, { useState } from "react";
import {
  Search,
  MapPin,
  ArrowUpDown,
  Mic,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Bus,
  Train,
  Plane,
  Car,
  Navigation,
} from "lucide-react";
import {
  RECENT_DESTINATIONS,
  AVAILABLE_VEHICLE_OPTIONS,
  JourneyOption,
  JourneyPreference,
  PresetDestination,
} from "./journeyData";

interface Step1SearchProps {
  fromLocation: string;
  setFromLocation: (loc: string) => void;
  toLocation: string;
  setToLocation: (loc: string) => void;
  selectedPreference: JourneyPreference;
  setSelectedPreference: (pref: JourneyPreference) => void;
  onSelectRecentDestination: (dest: PresetDestination) => void;
  onProceedToDetails: (selectedPlan?: JourneyOption) => void;
}

export default function Step1Search({
  fromLocation,
  setFromLocation,
  toLocation,
  setToLocation,
  selectedPreference,
  setSelectedPreference,
  onSelectRecentDestination,
  onProceedToDetails,
}: Step1SearchProps) {
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceSpeechResult, setVoiceSpeechResult] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(AVAILABLE_VEHICLE_OPTIONS[0].id);

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleVoiceClick = () => {
    if (isVoiceListening) {
      setIsVoiceListening(false);
      setVoiceSpeechResult(null);
      return;
    }
    setIsVoiceListening(true);
    setVoiceSpeechResult("Listening for destination: 'Take me to Airport'...");

    setTimeout(() => {
      setVoiceSpeechResult('Recognized: "Take me to Bandaranaike Airport"');
    }, 1000);

    setTimeout(() => {
      setToLocation("Bandaranaike International Airport (BIA)");
      setVoiceSpeechResult("Destination set: Bandaranaike International Airport (BIA)");
      setIsVoiceListening(false);
    }, 2000);
  };

  const handleSelectPreset = (dest: PresetDestination) => {
    setToLocation(dest.address);
    setSelectedVehicleId(dest.defaultPlan.id);
  };

  const handleSelectVehicle = (option: JourneyOption) => {
    setSelectedVehicleId(option.id);
    onProceedToDetails(option);
  };

  // Derive route profile based on destination
  const destLower = toLocation.toLowerCase();
  const routeProfile = destLower.includes("trade") || destLower.includes("wtc") || destLower.includes("work")
    ? {
        name: "Financial Center Express Corridor",
        distance: "12.8 km",
        origin: "Origin: KDU",
        stop1: "Nugegoda Hub",
        stop2: "Kollupitiya",
        destination: "WTC Financial",
        vehicles: [
          { name: "🚆 SkyRail 02", x: 200, y: 105, color: "#38BDF8" },
          { name: "🚗 Coastal Pod", x: 420, y: 70, color: "#10B981" },
          { name: "🚍 Bus 138-EX", x: 590, y: 50, color: "#F97316" },
        ],
        tags: [
          { label: "SkyRail Line 02", color: "#38BDF8" },
          { label: "Coastal Pod EV", color: "#10B981" },
          { label: "Bus 138 Express", color: "#F97316" },
        ],
      }
    : destLower.includes("marine") || destLower.includes("home")
    ? {
        name: "Coastal Promenade Corridor",
        distance: "9.4 km",
        origin: "Origin: KDU",
        stop1: "Wellawatte",
        stop2: "Bambalapitiya",
        destination: "Marine Drive",
        vehicles: [
          { name: "🚗 Coastal Pod", x: 220, y: 110, color: "#10B981" },
          { name: "🚆 SkyRail Coastal", x: 460, y: 70, color: "#38BDF8" },
        ],
        tags: [
          { label: "Coastal Pod EV", color: "#10B981" },
          { label: "SkyRail Coastal", color: "#38BDF8" },
        ],
      }
    : destLower.includes("kdu") || destLower.includes("univ")
    ? {
        name: "Campus Multi-Modal Feeder",
        distance: "14.2 km",
        origin: "Fort Terminal",
        stop1: "Dehiwala",
        stop2: "Ratmalana Bay",
        destination: "KDU Campus",
        vehicles: [
          { name: "🚍 Feeder 255", x: 200, y: 105, color: "#F97316" },
          { name: "🚆 Southern Rail", x: 440, y: 70, color: "#38BDF8" },
          { name: "🚗 Campus Pod", x: 600, y: 50, color: "#10B981" },
        ],
        tags: [
          { label: "Campus Feeder 255", color: "#F97316" },
          { label: "Southern Line", color: "#38BDF8" },
          { label: "Campus Pod", color: "#10B981" },
        ],
      }
    : destLower.includes("hospital") || destLower.includes("apeksha")
    ? {
        name: "Medical Priority Transit Corridor",
        distance: "8.6 km",
        origin: "Origin: KDU",
        stop1: "Navinna Hub",
        stop2: "Maharagama",
        destination: "Apeksha Hospital",
        vehicles: [
          { name: "🚍 Medical Bus", x: 220, y: 110, color: "#F97316" },
          { name: "🚗 Health Pod", x: 480, y: 70, color: "#10B981" },
        ],
        tags: [
          { label: "Priority Medical Bus", color: "#F97316" },
          { label: "Health Pod EV", color: "#10B981" },
        ],
      }
    : destLower.includes("tech") || destLower.includes("orion")
    ? {
        name: "Tech Innovation Hub Corridor",
        distance: "15.0 km",
        origin: "Origin: KDU",
        stop1: "Narahenpita",
        stop2: "Borella Hub",
        destination: "Orion Tech Park",
        vehicles: [
          { name: "🚆 Tech Link 01", x: 200, y: 105, color: "#38BDF8" },
          { name: "🚍 Orion Shuttle", x: 440, y: 70, color: "#F97316" },
        ],
        tags: [
          { label: "SkyRail Tech Link", color: "#38BDF8" },
          { label: "Orion Shuttle", color: "#F97316" },
        ],
      }
    : {
        name: "BIA Airport Super-Express Corridor",
        distance: "18.4 km",
        origin: "Origin: KDU",
        stop1: "Central Hub (T1)",
        stop2: "SkyPort (T2)",
        destination: "Airport (BIA)",
        vehicles: [
          { name: "🚍 Bus U-204", x: 155, y: 110, color: "#F97316" },
          { name: "🚆 SkyRail 02", x: 385, y: 70, color: "#38BDF8" },
          { name: "🚡 Aeropod 12", x: 600, y: 50, color: "#A855F7" },
          { name: "🚗 EcoPod EV", x: 420, y: 120, color: "#10B981" },
        ],
        tags: [
          { label: "Bus U-204 (2m away)", color: "#F97316" },
          { label: "SkyRail (180 km/h)", color: "#38BDF8" },
          { label: "Aeropod Shuttle", color: "#A855F7" },
          { label: "EcoPod Direct", color: "#10B981" },
        ],
      };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* ========================================================================= */}
      {/* 1. LOCATION SEARCH CARD (MATCHING WEB DESIGN LANGUAGE)                    */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl p-5 border border-[#D6DAE3] shadow-sm space-y-4">
        
        {/* Origin Row */}
        <div className="flex items-center gap-3 bg-[#F7F8FA] px-4 py-3 rounded-xl border border-[#D6DAE3] focus-within:bg-white focus-within:border-[#72222B] focus-within:ring-2 focus-within:ring-[#72222B]/10 transition-all">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D5B] shrink-0 shadow-xs" />
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-bold text-[#5A6B85] uppercase tracking-wider">From</span>
            <input
              type="text"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full text-sm font-semibold text-[#0F172A] bg-transparent focus:outline-none"
              placeholder="Enter starting location"
            />
          </div>
          <span className="text-[11px] text-[#5A6B85] bg-white px-2.5 py-1 rounded-md border border-[#D6DAE3] shrink-0 font-medium">
            Current Location
          </span>
        </div>

        {/* Destination Row */}
        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border-2 border-[#72222B] shadow-sm focus-within:ring-2 focus-within:ring-[#72222B]/20 transition-all">
          <span className="w-2.5 h-2.5 rounded-full bg-[#72222B] shrink-0 shadow-xs" />
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-bold text-[#72222B] uppercase tracking-wider">To</span>
            <input
              type="text"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="w-full text-sm font-semibold text-[#0F172A] bg-transparent focus:outline-none"
              placeholder="Where do you want to go?"
            />
          </div>

          {/* Voice Button */}
          <button
            type="button"
            onClick={handleVoiceClick}
            className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs ${
              isVoiceListening
                ? "bg-[#72222B] text-white ring-2 ring-[#72222B]/30 animate-pulse"
                : "bg-[#72222B]/10 hover:bg-[#72222B] text-[#72222B] hover:text-white"
            }`}
            title="Tell Univa (Voice Search)"
          >
            <Mic size={14} className={isVoiceListening ? "animate-pulse" : ""} />
            <span>{isVoiceListening ? "Listening..." : "Voice"}</span>
          </button>
        </div>

        {/* Voice Feedback Notification */}
        {voiceSpeechResult && (
          <div className="p-2.5 bg-[#F7F8FA] border border-[#D6DAE3] rounded-xl text-xs text-[#0F172A] flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#2E7D5B] shrink-0" />
            <span className="font-medium">{voiceSpeechResult}</span>
          </div>
        )}

        {/* Popular Destination Chips */}
        <div className="space-y-2 pt-1 border-t border-[#D6DAE3]/60">
          <span className="text-xs text-[#5A6B85] font-semibold block">
            Popular Destinations:
          </span>
          <div className="flex flex-wrap gap-2">
            {RECENT_DESTINATIONS.map((dest) => {
              const isSelected =
                toLocation.toLowerCase().includes(dest.name.toLowerCase()) ||
                toLocation.toLowerCase().includes(dest.category.toLowerCase());
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleSelectPreset(dest)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? "bg-[#72222B] text-white border-[#72222B] shadow-sm font-bold scale-[1.02]"
                      : "bg-white hover:bg-[#F7F8FA] text-[#5A6B85] hover:text-[#0F172A] border-[#D6DAE3] hover:border-[#72222B]/40 font-medium"
                  }`}
                >
                  <span>{dest.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC ROUTE & AVAILABLE VEHICLES SECTION                             */}
      {/* ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
              <span>Route & Available Vehicles</span>
              <span className="w-2 h-2 rounded-full bg-[#2E7D5B] animate-pulse" />
            </h3>
            <p className="text-xs text-[#5A6B85]">
              Live transit corridor from {fromLocation.split(",")[0]} to {toLocation.split("(")[0].trim()}
            </p>
          </div>
          <span className="text-xs font-bold text-[#72222B] bg-[#72222B]/10 px-2.5 py-1 rounded-full border border-[#72222B]/20">
            4 options ready
          </span>
        </div>

        {/* Route & Available Vehicles Map Card */}
        <div className="relative w-full rounded-2xl bg-[#0F172A] border border-slate-800 shadow-md overflow-hidden p-4 select-none">
          
          {/* Map Corridor Header */}
          <div className="flex items-center justify-between text-xs text-white pb-2 border-b border-slate-800/80 z-10 relative">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-200 tracking-wide">
                {routeProfile.name}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                Live GPS Active
              </span>
            </div>
            <div className="text-[11px] font-mono text-cyan-400">
              {routeProfile.distance} • 0 min network delay
            </div>
          </div>

          {/* SVG Route Corridor with Dynamic Stations & Available Vehicles */}
          <div className="relative w-full h-[160px] sm:h-[175px] my-1">
            <svg viewBox="0 0 760 170" className="w-full h-full">
              {/* Gridlines */}
              <g opacity="0.07" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 4">
                <line x1="0" y1="40" x2="760" y2="40" />
                <line x1="0" y1="85" x2="760" y2="85" />
                <line x1="0" y1="130" x2="760" y2="130" />
              </g>

              {/* Base Inactive Track */}
              <path
                d="M 60 125 C 180 125, 230 85, 360 85 C 490 85, 540 45, 700 45"
                fill="none"
                stroke="#1E293B"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Multi-modal route segments */}
              <path
                d="M 60 125 C 180 125, 230 85, 270 85"
                fill="none"
                stroke="#F97316"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 270 85 C 360 85, 430 55, 500 55"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeDasharray="8 4"
              />
              <path
                d="M 500 55 C 570 55, 620 45, 700 45"
                fill="none"
                stroke="#A855F7"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Alternative Pod Guideway */}
              <path
                d="M 60 125 C 200 155, 500 135, 700 45"
                fill="none"
                stroke="#10B981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="6 3"
                opacity="0.4"
              />

              {/* Station 1: Origin */}
              <g transform="translate(60, 125)">
                <circle r="7" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2.5" />
                <rect x="-40" y="14" width="80" height="18" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
                <text x="0" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
                  {routeProfile.origin}
                </text>
              </g>

              {/* Station 2 */}
              <g transform="translate(270, 85)">
                <circle r="6" fill="#192841" stroke="#38BDF8" strokeWidth="2" />
                <rect x="-42" y="-22" width="84" height="16" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="0.8" />
                <text x="0" y="-11" textAnchor="middle" fill="#38BDF8" fontSize="8" fontWeight="600">
                  {routeProfile.stop1}
                </text>
              </g>

              {/* Station 3 */}
              <g transform="translate(500, 55)">
                <circle r="6" fill="#192841" stroke="#A855F7" strokeWidth="2" />
                <rect x="-40" y="-22" width="80" height="16" rx="4" fill="#0F172A" stroke="#A855F7" strokeWidth="0.8" />
                <text x="0" y="-11" textAnchor="middle" fill="#C084FC" fontSize="8" fontWeight="600">
                  {routeProfile.stop2}
                </text>
              </g>

              {/* Station 4: Destination */}
              <g transform="translate(700, 45)">
                <circle r="8" fill="#22C55E" stroke="#FFFFFF" strokeWidth="2.5" />
                <rect x="-48" y="14" width="96" height="18" rx="4" fill="#0F172A" stroke="#22C55E" strokeWidth="1" />
                <text x="0" y="26" textAnchor="middle" fill="#4ADE80" fontSize="8" fontWeight="bold">
                  {routeProfile.destination}
                </text>
              </g>

              {/* Active Vehicles Pins on Route */}
              {routeProfile.vehicles.map((veh, vIdx) => (
                <g key={vIdx} transform={`translate(${veh.x}, ${veh.y})`} className="cursor-pointer">
                  <circle r="10" fill={veh.color} opacity="0.25" className="animate-ping" />
                  <circle r="6" fill={veh.color} stroke="#FFFFFF" strokeWidth="1.5" />
                  <g transform="translate(0, -18)">
                    <rect x="-35" y="0" width="70" height="15" rx="4" fill="#1E293B" stroke={veh.color} strokeWidth="1" />
                    <text x="0" y="10.5" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">
                      {veh.name}
                    </text>
                  </g>
                </g>
              ))}
            </svg>
          </div>

          {/* Map Footer / Vehicle Legend Chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
            <div className="flex flex-wrap items-center gap-3">
              {routeProfile.tags.map((tag, tIdx) => (
                <span key={tIdx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tag.color }} />
                  <span className="text-slate-300 font-medium">{tag.label}</span>
                </span>
              ))}
            </div>
            <span className="text-emerald-400 font-mono text-[10px] font-semibold">
              ● All Systems Synchronized
            </span>
          </div>
        </div>

        {/* Available Vehicle Cards List */}
        <div className="space-y-2.5 pt-1">
          {AVAILABLE_VEHICLE_OPTIONS.map((opt) => {
            const isSelected = selectedVehicleId === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectVehicle(opt)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-white border-[#72222B] ring-2 ring-[#72222B]/15 shadow-md"
                    : "bg-white hover:bg-[#F7F8FA] border-[#D6DAE3] hover:border-[#72222B]/40 shadow-xs"
                }`}
              >
                {/* Left: Info */}
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0F172A] truncate">
                      {opt.title}
                    </span>
                    {opt.transfersCount === 0 ? (
                      <span className="text-[11px] text-[#2E7D5B] bg-[#2E7D5B]/10 px-2 py-0.5 rounded-full border border-[#2E7D5B]/20 font-bold">
                        Direct
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#5A6B85] bg-[#F7F8FA] px-2 py-0.5 rounded-full border border-[#D6DAE3] font-semibold">
                        {opt.transfersCount} transfers
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#5A6B85]">
                    <span className="text-[#0F172A] font-semibold">
                      {opt.departureTime} → {opt.arrivalTime}
                    </span>
                    <span>•</span>
                    <span>{opt.totalDurationMins} min</span>
                    <span>•</span>
                    <span className="text-[#2E7D5B] font-semibold">{opt.liveHeadway}</span>
                  </div>
                </div>

                {/* Right: Fare */}
                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-[#72222B] block">
                    LKR {opt.fareLkr}
                  </span>
                  <span className="text-xs text-[#5A6B85] font-medium">
                    {opt.farePoints} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Proceed CTA Button (With matching hover light sweep & shadow) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => onProceedToDetails()}
          className="relative group w-full py-4 rounded-2xl bg-[#72222B] hover:bg-[#5B1B22] text-white font-bold text-sm sm:text-base transition-all duration-300 shadow-[0_8px_20px_-3px_rgba(114,34,43,0.35)] hover:shadow-[0_12px_26px_-3px_rgba(114,34,43,0.45)] hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer ring-2 ring-[#72222B]/20 overflow-hidden"
        >
          {/* Dynamic Light Sweep Highlight on hover */}
          <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />
          
          <span className="tracking-wide">Select Route & View Details</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
