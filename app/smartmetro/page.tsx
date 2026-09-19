"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Bus,
  MapPin,
  Clock,
  Search,
  ShieldCheck,
  Radio,
  ArrowRight,
  ArrowLeftRight,
  RefreshCw,
  CheckCircle2,
  Mic,
  Volume2,
  QrCode,
  CreditCard,
  Info,
} from "lucide-react";
import LiveRouteMap, { LiveBus } from "../components/LiveRouteMap";

import { TRANSIT_ROUTES, INITIAL_BUSES } from "../data/smartMetroData";

export default function SmartMetroLivePage() {
  const [selectedRouteKey, setSelectedRouteKey] = useState<string>("CM01");
  const [direction, setDirection] = useState<"outbound" | "inbound">("outbound");
  const [buses, setBuses] = useState<Record<string, LiveBus[]>>(INITIAL_BUSES);
  const [selectedBusIdState, setSelectedBusId] = useState<string | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"fleet" | "stops">("fleet");
  const [showTraffic, setShowTraffic] = useState(true);
  const [lastRefreshSeconds, setLastRefreshSeconds] = useState(2);
  const [refreshCountdown, setRefreshCountdown] = useState(6);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);
  const [customFareStopFrom, setFareStopFrom] = useState<string | null>(null);
  const [customFareStopTo, setFareStopTo] = useState<string | null>(null);

  const currentRoute = TRANSIT_ROUTES[selectedRouteKey] || TRANSIT_ROUTES.CM01;

  // Active stops according to direction
  const activeStops = useMemo(() => {
    const raw = [...currentRoute.stops];
    return direction === "outbound" ? raw : raw.reverse();
  }, [currentRoute, direction]);

  // Active buses for selected route & direction
  const currentBuses = useMemo(() => {
    return (buses[selectedRouteKey] || []).filter((b) => b.direction === direction);
  }, [buses, selectedRouteKey, direction]);

  const fareStopFrom =
    customFareStopFrom && activeStops.some((s) => s.name === customFareStopFrom)
      ? customFareStopFrom
      : activeStops[0]?.name || "";

  const fareStopTo =
    customFareStopTo && activeStops.some((s) => s.name === customFareStopTo)
      ? customFareStopTo
      : activeStops[Math.min(activeStops.length - 1, 8)]?.name || "";

  const selectedBusId =
    selectedBusIdState && currentBuses.some((b) => b.id === selectedBusIdState)
      ? selectedBusIdState
      : currentBuses[0]?.id || null;

  // Live Telemetry Simulation Engine: increments progress & updates countdown every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) => {
        const nextState: Record<string, LiveBus[]> = {};
        for (const [key, fleet] of Object.entries(prev)) {
          nextState[key] = fleet.map((bus) => {
            const newProgress = bus.progress + 0.08;
            if (newProgress >= 1) {
              const maxIdx = currentRoute.stops.length - 1;
              const nextIdx =
                bus.direction === "outbound"
                  ? (bus.currentStopIndex + 1) % (maxIdx + 1)
                  : bus.currentStopIndex <= 0
                  ? maxIdx
                  : bus.currentStopIndex - 1;

              const targetStop = currentRoute.stops[nextIdx] || currentRoute.stops[0];
              const speedFluctuation = Math.floor(38 + Math.random() * 22);

              return {
                ...bus,
                currentStopIndex: nextIdx,
                progress: 0.02,
                speed: speedFluctuation,
                nextStopName: targetStop.name,
                etaMinutes: Math.max(1, Math.floor(Math.random() * 4) + 1),
                status: Math.random() > 0.7 ? "At Station" : "In Transit",
              };
            }
            return {
              ...bus,
              progress: newProgress,
            };
          });
        }
        return nextState;
      });

      setLastRefreshSeconds(0);
      setRefreshCountdown((prev) => (prev <= 1 ? 6 : prev - 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [currentRoute.stops]);

  // Ticker timer for seconds display
  useEffect(() => {
    const ticker = setInterval(() => {
      setLastRefreshSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Filter stops by query
  const filteredStops = useMemo(() => {
    if (!searchFilter.trim()) return activeStops;
    const q = searchFilter.toLowerCase();
    return activeStops.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.landmark && s.landmark.toLowerCase().includes(q))
    );
  }, [activeStops, searchFilter]);

  // Fare calculation
  const calculatedFare = useMemo(() => {
    const idx1 = activeStops.findIndex((s) => s.name === fareStopFrom);
    const idx2 = activeStops.findIndex((s) => s.name === fareStopTo);
    if (idx1 === -1 || idx2 === -1) return currentRoute.fareBase;
    const diff = Math.abs(idx2 - idx1);
    return currentRoute.fareBase + diff * currentRoute.farePerStop;
  }, [activeStops, fareStopFrom, fareStopTo, currentRoute]);

  // Voice Interaction handler
  const handleVoiceAssistant = () => {
    if (isVoiceActive) {
      setIsVoiceActive(false);
      return;
    }
    setIsVoiceActive(true);
    setVoiceTranscript("Listening for stop or bus query...");

    setTimeout(() => {
      setVoiceTranscript('Heard: "Next bus to Nugegoda Supermarket"');
    }, 1200);

    setTimeout(() => {
      setIsVoiceActive(false);
      setVoiceTranscript("Bus ND-8921 arriving Nugegoda in 2 mins (42% capacity)");
      setSelectedBusId("b1");
      setSelectedStopId("cm01-9");
    }, 2800);
  };

  const handleManualRefresh = () => {
    setLastRefreshSeconds(0);
    setRefreshCountdown(6);
  };

  return (
    <div className="w-full min-h-screen text-[#0F172A] pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1520px] mx-auto space-y-6 sm:space-y-8">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & TELEMETRY CONTROL BAR                                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-7 shadow-[0_4px_24px_rgba(25,40,65,0.04)] space-y-5 u-surface u-hud">
        
        {/* Row 1: Brand Identifier & Real-Time Sync Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#192841] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs u-mono">
                <Radio size={12} className="text-[#22C55E] animate-pulse" />
                <span>SmartMetro™ Live Tracker</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold">
                <CheckCircle2 size={13} />
                <span>GPS Telemetry Calibrated</span>
              </span>

              <span className="text-xs text-[#64748B] font-semibold hidden sm:inline">
                Year 2100 Multimodal Transit Grid
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight u-title">
              Live Bus & Route Telemetry
            </h1>
            <div className="u-accent-line w-16 my-1.5" />
            <p className="text-xs sm:text-sm text-[#64748B]">
              Real-time vehicle GPS positions, active passenger occupancy, step-free access, and stop-by-stop arrival countdowns.
            </p>
          </div>

          {/* Refresh Timer & Manual Sync */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex flex-col text-right text-xs">
              <span className="font-bold text-[#0F172A] flex items-center justify-end gap-1.5">
                <span className="u-pulse-dot" style={{ "--pulse-color": "#22C55E" } as React.CSSProperties} />
                <span>Live Feed Active</span>
              </span>
              <span className="text-[11px] text-[#64748B]">
                Refreshed {lastRefreshSeconds}s ago • Auto-refresh in {refreshCountdown}s
              </span>
            </div>

            <button
              type="button"
              onClick={handleManualRefresh}
              title="Refresh Fleet Data"
              className="w-10 h-10 rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] hover:bg-white hover:border-[#192841] text-[#0F172A] flex items-center justify-center transition-all shadow-xs cursor-pointer active:rotate-180 duration-300"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Row 2: Route Switcher Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {Object.values(TRANSIT_ROUTES).map((r) => {
              const isSelected = selectedRouteKey === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRouteKey(r.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? "bg-[#192841] text-white shadow-sm scale-[1.01]"
                      : "bg-[#F7F9FC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-white"
                  }`}
                >
                  <Bus size={16} className={isSelected ? "text-white" : "text-[#64748B]"} />
                  <span>{r.code}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200/80 text-[#0F172A]"
                    }`}
                  >
                    {r.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Direction Toggle Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setDirection((prev) => (prev === "outbound" ? "inbound" : "outbound"))
              }
              className="px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#192841] text-xs font-bold text-[#0F172A] flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeftRight size={14} className="text-[#192841]" />
              <span>
                Direction:{" "}
                <strong className="text-[#192841] uppercase">
                  {direction === "outbound" ? "Outbound" : "Inbound"}
                </strong>
              </span>
            </button>

            {/* Voice Assistant Pill */}
            <button
              type="button"
              onClick={handleVoiceAssistant}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                isVoiceActive
                  ? "bg-[#192841] text-white animate-pulse"
                  : "bg-[#192841]/10 hover:bg-[#192841]/15 text-[#192841]"
              }`}
            >
              <Mic size={14} />
              <span>{isVoiceActive ? "Listening..." : "Tell Univa (Voice)"}</span>
            </button>

            {/* Plan Personalized Journey Link */}
            <Link
              href="/preferences"
              className="px-3.5 py-2 rounded-xl bg-[#192841] hover:bg-[#111C2E] u-btn text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              title="Plan personalized journey"
            >
              <span>Plan Journey</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Voice Assistant Transcript Notification */}
        {voiceTranscript && (
          <div className="p-3 bg-[#192841]/5 border border-[#192841]/20 rounded-2xl text-xs font-semibold text-[#0F172A] flex items-center gap-2.5">
            <Volume2 size={16} className="text-[#192841] shrink-0" />
            <span>{voiceTranscript}</span>
          </div>
        )}

        {/* Route Details Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
            <div className="text-[10px] font-bold text-[#64748B] uppercase">Terminus Points</div>
            <div className="text-xs font-extrabold text-[#0F172A] truncate mt-0.5">
              {currentRoute.origin.split(" ")[0]} ⇄ {currentRoute.destination.split(" ")[0]}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
            <div className="text-[10px] font-bold text-[#64748B] uppercase">Corridor Length</div>
            <div className="text-xs font-extrabold text-[#0F172A] mt-0.5">
              {currentRoute.distance} (~{currentRoute.avgDuration})
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
            <div className="text-[10px] font-bold text-[#64748B] uppercase">Scheduled Headway</div>
            <div className="text-xs font-extrabold text-[#22C55E] mt-0.5">
              {currentRoute.frequency} High Frequency
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
            <div className="text-[10px] font-bold text-[#64748B] uppercase">Active Fleet</div>
            <div className="text-xs font-extrabold text-[#192841] mt-0.5">
              {currentBuses.length} Vehicles In Corridor
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DUAL PANEL LAYOUT: INTERACTIVE MAP + RIDER CONTROL TELEMETRY PANEL     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT COLUMN: RIDER CONTROL & FLEET TELEMETRY (5 Columns)                */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-5 flex flex-col space-y-5 order-2 lg:order-1">
          
          {/* Panel Tabs: Active Fleet vs Stop Sequence */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-[0_4px_20px_rgba(25,40,65,0.04)] space-y-4 u-surface u-hud">
            
            {/* Search Filter Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3.5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Filter stops by name or landmark (e.g. Nugegoda, Borella)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] text-xs font-semibold text-[#0F172A] placeholder:text-[#64748B]/70 focus:outline-none focus:border-[#192841] focus:bg-white transition-all"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter("")}
                  className="absolute right-3.5 top-2.5 text-xs text-[#64748B] hover:text-[#192841]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Tab Buttons */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-extrabold">
              <button
                type="button"
                onClick={() => setActiveTab("fleet")}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "fleet"
                    ? "bg-[#192841] text-white shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <Bus size={14} />
                <span>Active Fleet ({currentBuses.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("stops")}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "stops"
                    ? "bg-[#192841] text-white shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <MapPin size={14} />
                <span>Station Stops ({activeStops.length})</span>
              </button>
            </div>

            {/* TAB CONTENT 1: ACTIVE FLEET CARDS */}
            {activeTab === "fleet" && (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {currentBuses.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#64748B]">
                    No active buses currently in this direction.
                  </div>
                ) : (
                  currentBuses.map((bus) => {
                    const isSelected = selectedBusId === bus.id;
                    return (
                      <div
                        key={bus.id}
                        onClick={() => {
                          setSelectedBusId(bus.id);
                          setSelectedStopId(null);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col space-y-3 ${
                          isSelected
                            ? "bg-white border-[#192841] shadow-md ring-2 ring-[#192841]/20 text-[#0F172A]"
                            : "bg-[#F7F9FC] hover:bg-white border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                                isSelected
                                  ? "bg-[#192841] text-white shadow-sm"
                                  : "bg-white border border-[#E2E8F0] text-[#192841]"
                              }`}
                            >
                              <Bus size={16} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-sm tracking-tight text-[#0F172A]">
                                  Bus {bus.plate}
                                </h4>
                                <span
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E]"
                                >
                                  {bus.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#64748B]">
                                {bus.driver}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-black text-[#22C55E]">
                              {bus.speed} km/h
                            </div>
                            <div className="text-[10px] text-[#64748B]">
                              Live Speed
                            </div>
                          </div>
                        </div>

                        {/* Next Stop Bar */}
                        <div
                          className="p-2.5 rounded-xl flex items-center justify-between text-xs bg-white border border-[#E2E8F0] text-[#0F172A]"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Clock size={13} className="text-[#192841] shrink-0" />
                            <span className="truncate">
                              Next: <strong className="text-[#0F172A]">{bus.nextStopName}</strong>
                            </span>
                          </div>
                          <span
                            className="font-black text-xs shrink-0 ml-2 text-[#192841]"
                          >
                            ~{bus.etaMinutes} min
                          </span>
                        </div>

                        {/* Occupancy & Seats */}
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                bus.occupancyPercent > 70
                                  ? "bg-[#EF4444]"
                                  : bus.occupancyPercent > 40
                                  ? "bg-[#F59E0B]"
                                  : "bg-[#22C55E]"
                              }`}
                            />
                            <span className={isSelected ? "text-[#0F172A]" : "text-[#64748B]"}>
                              Occupancy: <strong>{bus.occupancyPercent}%</strong> ({bus.seatsAvailable} seats free)
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[#22C55E] font-semibold">
                            <ShieldCheck size={12} />
                            <span> Ramp Ready</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB CONTENT 2: STATIONS & LIVE ETAS */}
            {activeTab === "stops" && (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredStops.map((stop) => {
                  const isSelected = selectedStopId === stop.id;
                  const approachingBus = currentBuses.find(
                    (b) => b.nextStopName === stop.name
                  );

                  return (
                    <div
                      key={stop.id}
                      onClick={() => {
                        setSelectedStopId(stop.id);
                        setSelectedBusId(null);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-white border-[#192841] shadow-sm ring-1 ring-[#192841]/30 text-[#0F172A]"
                          : "bg-white hover:bg-[#F7F9FC] border-[#E2E8F0] text-[#0F172A]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                            isSelected
                              ? "bg-[#192841] text-white"
                              : "bg-[#F7F9FC] border border-[#E2E8F0] text-[#64748B]"
                          }`}
                        >
                          {stop.seq}
                        </span>
                        <div>
                          <div className="text-xs font-bold leading-tight">
                            {stop.name}
                          </div>
                          {stop.landmark && (
                            <div
                              className={`text-[10px] mt-0.5 truncate max-w-[200px] ${
                                isSelected ? "text-[#192841] font-semibold" : "text-[#64748B]"
                              }`}
                            >
                              {stop.landmark}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Approaching Bus Badge */}
                      <div className="text-right">
                        {approachingBus ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                            <span className="text-xs font-extrabold text-[#22C55E]">
                              {approachingBus.etaMinutes} min
                            </span>
                          </div>
                        ) : (
                          <span
                            className={`text-[11px] font-semibold ${
                              isSelected ? "text-[#192841]" : "text-[#64748B]"
                            }`}
                          >
                            Every {currentRoute.frequency.replace("Every ", "")}
                          </span>
                        )}
                        {stop.isTransferHub && (
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded block mt-0.5 ${
                            isSelected ? "bg-[#192841] text-white" : "bg-slate-200 text-[#0F172A]"
                          }`}>
                            Hub Link
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* TapPass QR Fare Calculator Card */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-[0_4px_20px_rgba(25,40,65,0.04)] space-y-4 u-surface u-hud">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-[#192841]" />
                <h3 className="font-extrabold text-sm text-[#0F172A]">
                  TapPass™ Fare & Trip Estimator
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E]">
                NFC / QR Sync
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">
                  Boarding Station
                </label>
                <select
                  value={fareStopFrom}
                  onChange={(e) => setFareStopFrom(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] font-semibold text-[#0F172A] text-xs focus:outline-none focus:border-[#192841]"
                >
                  {activeStops.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.seq}. {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">
                  Disembarking Station
                </label>
                <select
                  value={fareStopTo}
                  onChange={(e) => setFareStopTo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] font-semibold text-[#0F172A] text-xs focus:outline-none focus:border-[#192841]"
                >
                  {activeStops.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.seq}. {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0F172A] text-white flex items-center justify-between shadow-xs">
              <div>
                <div className="text-[11px] text-slate-300">Digital TapPass Fare</div>
                <div className="text-xl font-black text-white">LKR {calculatedFare}.00</div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#22C55E] font-bold">✓ 100% Step-Free</span>
                <button
                  type="button"
                  onClick={() => alert("TapPass NFC active! Hold device near boarding terminal validator.")}
                  className="py-2 px-3 rounded-xl bg-[#192841] hover:bg-[#111C2E] u-btn text-white font-extrabold text-xs transition-colors cursor-pointer shadow-xs border border-white/10"
                >
                  Tap to Board
                </button>
              </div>
            </div>
          </div>

          {/* Official Dispatch Announcements */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] flex items-start gap-3 text-xs text-[#64748B] u-surface">
            <Info size={16} className="text-[#192841] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#0F172A] block">Transit Dispatch Notice:</strong>
              SmartMetro autonomous vehicle fleets are synchronized with Colombo traffic authority signals. High-capacity Euro-6 and electric pod lanes in effect.
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT COLUMN: INTERACTIVE LIVE ROUTE VECTOR MAP (7 Columns)             */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
          
          {/* Map Component */}
          <LiveRouteMap
            stops={activeStops}
            buses={currentBuses}
            routeName={currentRoute.title}
            routeId={currentRoute.id}
            selectedBusId={selectedBusId}
            onSelectBus={(busId) => setSelectedBusId(busId)}
            selectedStopId={selectedStopId}
            onSelectStop={(stopId) => setSelectedStopId(stopId)}
            showTraffic={showTraffic}
            onToggleTraffic={() => setShowTraffic((v) => !v)}
            isSimulating={true}
          />

          {/* Under-Map Mobile App Banner */}
          <div className="bg-[#0C1017] border border-[#192841]/40 rounded-3xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#22C55E] u-mono">
                <QrCode size={13} />
                <span>Univa Rider Mobile App</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Track live on the go with real-time push alerts
              </h3>
              <p className="text-xs text-slate-300">
                Get platform vibration alerts, seat reservation, and offline QR ticketing.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
              >
                <span>Google Play</span>
              </a>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
              >
                <span>App Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
