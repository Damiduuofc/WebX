"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Bus,
  MapPin,
  Clock,
  Navigation,
  Search,
  Zap,
  ShieldCheck,
  Radio,
  ArrowRight,
  ArrowLeftRight,
  RefreshCw,
  SlidersHorizontal,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Footprints,
  Mic,
  Volume2,
  QrCode,
  CreditCard,
  Info,
} from "lucide-react";
import LiveRouteMap, { StopPoint, LiveBus } from "../components/LiveRouteMap";

// =========================================================================
// REAL ROUTE & STOP DATA (MATCHING LANKAMETRO.LK/EN/SMARTMETRO + UNIVA )
// =========================================================================

interface TransitRoute {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  origin: string;
  destination: string;
  distance: string;
  avgDuration: string;
  fareBase: number; // LKR
  farePerStop: number;
  activeCount: number;
  frequency: string;
  hours: string;
  tag: string;
  color: string;
  stops: StopPoint[];
}

const CM01_STOPS: StopPoint[] = [
  { id: "cm01-1", name: "Makumbura (MMC) Terminal", landmark: "Multimodal Center Platform 1", x: 780, y: 670, seq: 1, isTransferHub: true, connections: ["Southern Expressway Shuttles", "Feeder Pods"], stepFreeAccessible: true },
  { id: "cm01-2", name: "Kottawa Interchange", landmark: "High Level Road Gate", x: 740, y: 640, seq: 2, stepFreeAccessible: true },
  { id: "cm01-3", name: "Pannipitiya Flyover", landmark: "Old Road Concourse", x: 690, y: 610, seq: 3, stepFreeAccessible: true },
  { id: "cm01-4", name: "Maharagama Central", landmark: "Clock Tower Transit Bay", x: 640, y: 580, seq: 4, isTransferHub: true, connections: ["Route 138 Feeder"], stepFreeAccessible: true },
  { id: "cm01-5", name: "Maharagama Apeksha Hospital", landmark: "Medical Center South Gate", x: 605, y: 560, seq: 5, stepFreeAccessible: true },
  { id: "cm01-6", name: "Navinna Junction", landmark: "Ayurveda Research Roundabout", x: 570, y: 540, seq: 6, stepFreeAccessible: true },
  { id: "cm01-7", name: "Wijerama University Junction", landmark: "USJ University Link", x: 540, y: 520, seq: 7, connections: ["Campus Shuttles"], stepFreeAccessible: true },
  { id: "cm01-8", name: "Delkanda Supermarket Junction", landmark: "High Level Commercial Concourse", x: 505, y: 495, seq: 8, stepFreeAccessible: true },
  { id: "cm01-9", name: "Nugegoda Supermarket Concourse", landmark: "Supermarket Concourse & Rail Station", x: 470, y: 460, seq: 9, isTransferHub: true, connections: ["Kelani Valley Rail", "Nugegoda Bus Depot"], stepFreeAccessible: true },
  { id: "cm01-10", name: "Kirulapone Market", landmark: "Kirulapone Canal Bridge", x: 430, y: 435, seq: 10, stepFreeAccessible: true },
  { id: "cm01-11", name: "Narahenpita Junction", landmark: "Elvitigala Mawatha Crossing", x: 410, y: 400, seq: 11, connections: ["Narahenpita Hospital Line"], stepFreeAccessible: true },
  { id: "cm01-12", name: "RMV / Military Hospital", landmark: "Denzil Kobbekaduwa Mawatha", x: 420, y: 365, seq: 12, stepFreeAccessible: true },
  { id: "cm01-13", name: "Borella YMBA Concourse", landmark: "Borella Crossroads Central Hub", x: 400, y: 330, seq: 13, isTransferHub: true, connections: ["SkyRail Line 02", "Central Hospital Shuttles"], stepFreeAccessible: true },
  { id: "cm01-14", name: "Campbell Park Station", landmark: "Baseline Road Pedestrian Overpass", x: 410, y: 295, seq: 14, stepFreeAccessible: true },
  { id: "cm01-15", name: "Dematagoda Railway Crossing", landmark: "Main Line Rail Overpass", x: 430, y: 260, seq: 15, connections: ["Coastal Commuter Line"], stepFreeAccessible: true },
  { id: "cm01-16", name: "Orion City Technology Park", landmark: "Orugodawatta Tech Concourse", x: 460, y: 230, seq: 16, stepFreeAccessible: true },
  { id: "cm01-17", name: "Thorana Junction", landmark: "Kelani River North Bridge Link", x: 500, y: 200, seq: 17, stepFreeAccessible: true },
  { id: "cm01-18", name: "Kelaniya University Hub", landmark: "Kandy Road University Concourse", x: 540, y: 170, seq: 18, connections: ["University Feeder Route"], stepFreeAccessible: true },
  { id: "cm01-19", name: "Kiribathgoda Town Center", landmark: "Kiribathgoda Commercial Roundabout", x: 580, y: 140, seq: 19, isTransferHub: true, stepFreeAccessible: true },
  { id: "cm01-20", name: "Mahara Flyover Junction", landmark: "Kandy Road Expressway Portal", x: 620, y: 110, seq: 20, stepFreeAccessible: true },
  { id: "cm01-21", name: "Kadawatha Multimodal Hub", landmark: "Expressway Terminal 01", x: 660, y: 80, seq: 21, isTransferHub: true, connections: ["Central Expressway E04", "Intercity Express Buses"], stepFreeAccessible: true },
];

const CM02_STOPS: StopPoint[] = [
  { id: "cm02-1", name: "Makumbura (MMC) Terminal", landmark: "Multimodal Center Platform 2", x: 780, y: 670, seq: 1, isTransferHub: true, connections: ["Southern Expressway Shuttles"], stepFreeAccessible: true },
  { id: "cm02-2", name: "Kottawa Expressway Gate", landmark: "E01 Southern Gateway", x: 740, y: 640, seq: 2, stepFreeAccessible: true },
  { id: "cm02-3", name: "High Level Expressway Link", landmark: "Maharagama Direct Flyover", x: 640, y: 580, seq: 3, stepFreeAccessible: true },
  { id: "cm02-4", name: "Nugegoda Station Concourse", landmark: "Supermarket Plaza Overpass", x: 470, y: 460, seq: 4, isTransferHub: true, stepFreeAccessible: true },
  { id: "cm02-5", name: "Havelock City Commercial Mall", landmark: "Havelock Concourse", x: 380, y: 460, seq: 5, connections: ["Commercial Shuttles"], stepFreeAccessible: true },
  { id: "cm02-6", name: "Bambalapitiya Marine Drive", landmark: "Galle Road & Coastal Strip", x: 260, y: 470, seq: 6, connections: ["Coastal Rail Line"], stepFreeAccessible: true },
  { id: "cm02-7", name: "Kollupitiya Coastal Concourse", landmark: "Kollupitiya Station Road", x: 240, y: 410, seq: 7, stepFreeAccessible: true },
  { id: "cm02-8", name: "Galle Face Green Promenade", landmark: "Oceanfront Promenade", x: 220, y: 350, seq: 8, stepFreeAccessible: true },
  { id: "cm02-9", name: "WTC Financial Center", landmark: "Echelon Square West", x: 200, y: 300, seq: 9, isTransferHub: true, stepFreeAccessible: true },
  { id: "cm02-10", name: "Colombo Fort Central Terminal", landmark: "Main Rail & SkyRail Station", x: 220, y: 260, seq: 10, isTransferHub: true, connections: ["SkyRail Line 01", "Intercity Main Line Rail"], stepFreeAccessible: true },
  { id: "cm02-11", name: "Pettah Central Bus Stand", landmark: "Bastian Mawatha Long-Distance Depot", x: 250, y: 240, seq: 11, isTransferHub: true, stepFreeAccessible: true },
  { id: "cm02-12", name: "Pettah Floating Market Hub", landmark: "Gold Center Concourse", x: 270, y: 220, seq: 12, isTransferHub: true, stepFreeAccessible: true },
];

const UN01_STOPS: StopPoint[] = [
  { id: "un01-1", name: "KDU Ratmalana Main Campus", landmark: "Defence University Gate 1", x: 240, y: 720, seq: 1, isTransferHub: true, connections: ["Campus Feeder Route 255"], stepFreeAccessible: true },
  { id: "un01-2", name: "Ratmalana Airport SkyGuideway", landmark: "Aviation Terminal Overpass", x: 250, y: 660, seq: 2, stepFreeAccessible: true },
  { id: "un01-3", name: "Dehiwala Coastal Hub", landmark: "Zoo Road Crossing", x: 255, y: 590, seq: 3, stepFreeAccessible: true },
  { id: "un01-4", name: "Wellawatte Concourse", landmark: "Marine Drive Flyover", x: 250, y: 520, seq: 4, stepFreeAccessible: true },
  { id: "un01-5", name: "Colombo Fort Multimodal Hub", landmark: "Platform 3 SkyGuideway Link", x: 220, y: 260, seq: 5, isTransferHub: true, connections: ["SkyRail Line 02", "Intercity Main Line"], stepFreeAccessible: true },
  { id: "un01-6", name: "Peliyagoda Smart Interchange", landmark: "New Kelani Bridge Flyway", x: 340, y: 210, seq: 6, isTransferHub: true, stepFreeAccessible: true },
  { id: "un01-7", name: "Kelaniya SkyRail Station", landmark: "Elevated Magnetic Track 2", x: 420, y: 160, seq: 7, connections: ["SkyRail Line 01"], stepFreeAccessible: true },
  { id: "un01-8", name: "Ja-Ela Smart Expressway Port", landmark: "Colombo-Katunayake E03 Port", x: 380, y: 110, seq: 8, isTransferHub: true, stepFreeAccessible: true },
  { id: "un01-9", name: "Katunayake Cargo Gateway", landmark: "Airport Logistics Concourse", x: 350, y: 60, seq: 9, stepFreeAccessible: true },
  { id: "un01-10", name: "Bandaranaike International Airport", landmark: "Terminal 1 & 2 SkyRail Gate", x: 320, y: 25, seq: 10, isTransferHub: true, connections: ["International Flight Shuttles", "Aeropod Terminal"], stepFreeAccessible: true },
];

const TRANSIT_ROUTES: Record<string, TransitRoute> = {
  CM01: {
    id: "CM01",
    code: "CM01",
    title: "Route CM01 • Makumbura ⇄ Kadawatha",
    subtitle: "High-Capacity Urban Expressway & Arterial Corridor",
    origin: "Makumbura Multimodal Center (MMC)",
    destination: "Kadawatha Multimodal Transport Hub",
    distance: "24.8 km",
    avgDuration: "42 min",
    fareBase: 80,
    farePerStop: 10,
    activeCount: 6,
    frequency: "Every 4 mins",
    hours: "05:00 AM – 11:30 PM",
    tag: "High Frequency",
    color: "#72222B",
    stops: CM01_STOPS,
  },
  CM02: {
    id: "CM02",
    code: "CM02",
    title: "Route CM02 • Makumbura ⇄ Colombo Fort",
    subtitle: "Southern Expressway & Coastal Financial Corridor",
    origin: "Makumbura Multimodal Center (MMC)",
    destination: "Colombo Fort / Pettah Central",
    distance: "21.4 km",
    avgDuration: "34 min",
    fareBase: 80,
    farePerStop: 12,
    activeCount: 5,
    frequency: "Every 5 mins",
    hours: "05:15 AM – 11:45 PM",
    tag: "Express Link",
    color: "#22C55E",
    stops: CM02_STOPS,
  },
  UN01: {
    id: "UN01",
    code: "UN01",
    title: "Route UN01 • KDU Ratmalana ⇄ BIA Airport",
    subtitle: " SkyRail Autonomous Express Inter-City Arterial",
    origin: "KDU, Ratmalana",
    destination: "Bandaranaike International Airport",
    distance: "46.2 km",
    avgDuration: "38 min",
    fareBase: 120,
    farePerStop: 15,
    activeCount: 4,
    frequency: "Every 6 mins",
    hours: "24 Hours Service",
    tag: "SkyRail Arterial",
    color: "#72222B",
    stops: UN01_STOPS,
  },
};

// Initial simulated bus fleets
const INITIAL_BUSES: Record<string, LiveBus[]> = {
  CM01: [
    { id: "b1", plate: "ND-8921", routeId: "CM01", direction: "outbound", currentStopIndex: 8, progress: 0.35, speed: 44, nextStopName: "Nugegoda Supermarket Concourse", etaMinutes: 2, occupancyPercent: 42, seatsAvailable: 18, wheelchairBay: true, driver: "Capt. Silva", status: "In Transit", heading: 45 },
    { id: "b2", plate: "NB-4412", routeId: "CM01", direction: "outbound", currentStopIndex: 3, progress: 0.8, speed: 38, nextStopName: "Maharagama Central", etaMinutes: 1, occupancyPercent: 68, seatsAvailable: 8, wheelchairBay: true, driver: "Capt. Perera", status: "Approaching Stop", heading: 50 },
    { id: "b3", plate: "NC-6284", routeId: "CM01", direction: "outbound", currentStopIndex: 14, progress: 0.2, speed: 52, nextStopName: "Dematagoda Railway Crossing", etaMinutes: 3, occupancyPercent: 30, seatsAvailable: 22, wheelchairBay: true, driver: "Capt. Fernando", status: "In Transit", heading: 40 },
    { id: "b4", plate: "ND-1055", routeId: "CM01", direction: "inbound", currentStopIndex: 18, progress: 0.6, speed: 46, nextStopName: "Kelaniya University Hub", etaMinutes: 2, occupancyPercent: 55, seatsAvailable: 12, wheelchairBay: true, driver: "Capt. Wickramasinghe", status: "In Transit", heading: 225 },
    { id: "b5", plate: "NA-9801", routeId: "CM01", direction: "inbound", currentStopIndex: 11, progress: 0.1, speed: 0, nextStopName: "Narahenpita Junction", etaMinutes: 1, occupancyPercent: 75, seatsAvailable: 5, wheelchairBay: true, driver: "Capt. Jayawardena", status: "At Station", heading: 220 },
    { id: "b6", plate: "NB-7320", routeId: "CM01", direction: "inbound", currentStopIndex: 5, progress: 0.7, speed: 48, nextStopName: "Maharagama Apeksha Hospital", etaMinutes: 4, occupancyPercent: 25, seatsAvailable: 24, wheelchairBay: true, driver: "Capt. Bandara", status: "In Transit", heading: 215 },
  ],
  CM02: [
    { id: "b7", plate: "ND-3341", routeId: "CM02", direction: "outbound", currentStopIndex: 3, progress: 0.45, speed: 58, nextStopName: "Nugegoda Station Concourse", etaMinutes: 3, occupancyPercent: 50, seatsAvailable: 16, wheelchairBay: true, driver: "Capt. Dissanayake", status: "In Transit", heading: 60 },
    { id: "b8", plate: "NB-1192", routeId: "CM02", direction: "outbound", currentStopIndex: 7, progress: 0.85, speed: 32, nextStopName: "Galle Face Green Promenade", etaMinutes: 1, occupancyPercent: 62, seatsAvailable: 10, wheelchairBay: true, driver: "Capt. Weerasinghe", status: "Approaching Stop", heading: 45 },
    { id: "b9", plate: "NC-7704", routeId: "CM02", direction: "outbound", currentStopIndex: 9, progress: 0.15, speed: 0, nextStopName: "Colombo Fort Central Terminal", etaMinutes: 1, occupancyPercent: 80, seatsAvailable: 4, wheelchairBay: true, driver: "Capt. Fonseka", status: "At Station", heading: 30 },
    { id: "b10", plate: "ND-5520", routeId: "CM02", direction: "inbound", currentStopIndex: 6, progress: 0.5, speed: 45, nextStopName: "Bambalapitiya Marine Drive", etaMinutes: 2, occupancyPercent: 35, seatsAvailable: 20, wheelchairBay: true, driver: "Capt. Karunaratne", status: "In Transit", heading: 210 },
    { id: "b11", plate: "NA-2299", routeId: "CM02", direction: "inbound", currentStopIndex: 2, progress: 0.75, speed: 60, nextStopName: "Makumbura (MMC) Terminal", etaMinutes: 2, occupancyPercent: 20, seatsAvailable: 25, wheelchairBay: true, driver: "Capt. Gunasekara", status: "In Transit", heading: 200 },
  ],
  UN01: [
    { id: "b12", plate: "UN-245", routeId: "UN01", direction: "outbound", currentStopIndex: 4, progress: 0.3, speed: 82, nextStopName: "Peliyagoda Smart Interchange", etaMinutes: 2, occupancyPercent: 38, seatsAvailable: 32, wheelchairBay: true, driver: "Univa AI Autonomous Co-Pilot", status: "In Transit", heading: 30 },
    { id: "b13", plate: "UN-108", routeId: "UN01", direction: "outbound", currentStopIndex: 7, progress: 0.7, speed: 95, nextStopName: "Ja-Ela Smart Expressway Port", etaMinutes: 1, occupancyPercent: 44, seatsAvailable: 28, wheelchairBay: true, driver: "Univa AI Autonomous Co-Pilot", status: "In Transit", heading: 25 },
    { id: "b14", plate: "UN-330", routeId: "UN01", direction: "outbound", currentStopIndex: 1, progress: 0.6, speed: 48, nextStopName: "Ratmalana Airport SkyGuideway", etaMinutes: 1, occupancyPercent: 22, seatsAvailable: 40, wheelchairBay: true, driver: "Univa AI Autonomous Co-Pilot", status: "In Transit", heading: 40 },
    { id: "b15", plate: "UN-512", routeId: "UN01", direction: "inbound", currentStopIndex: 8, progress: 0.4, speed: 90, nextStopName: "Kelaniya SkyRail Station", etaMinutes: 2, occupancyPercent: 52, seatsAvailable: 24, wheelchairBay: true, driver: "Univa AI Autonomous Co-Pilot", status: "In Transit", heading: 205 },
    { id: "b16", plate: "UN-601", routeId: "UN01", direction: "inbound", currentStopIndex: 3, progress: 0.2, speed: 40, nextStopName: "Dehiwala Coastal Hub", etaMinutes: 2, occupancyPercent: 60, seatsAvailable: 18, wheelchairBay: true, driver: "Univa AI Autonomous Co-Pilot", status: "In Transit", heading: 215 },
    { id: "b17", plate: "UN-720", routeId: "UN01", direction: "inbound", currentStopIndex: 0, progress: 0.9, speed: 0, nextStopName: "KDU Ratmalana Main Campus", etaMinutes: 1, occupancyPercent: 18, seatsAvailable: 42, wheelchairBay: true, driver: "Univa AI Autonomous Co-Pilot", status: "At Station", heading: 220 },
  ],
};

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
    <div className="w-full bg-[#F7F8FA] min-h-screen text-[#0F172A] pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1520px] mx-auto space-y-6 sm:space-y-8">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & TELEMETRY CONTROL BAR                                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#D6DAE3] p-5 sm:p-7 shadow-[0_4px_24px_rgba(114,34,43,0.04)] space-y-5">
        
        {/* Row 1: Brand Identifier & Real-Time Sync Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D6DAE3]/70">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#72222B] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
                <Radio size={12} className="text-[#22C55E] animate-pulse" />
                <span>SmartMetro™ Live Tracker</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold">
                <CheckCircle2 size={13} />
                <span>GPS Telemetry Calibrated</span>
              </span>

              <span className="text-xs text-[#5A6B85] font-semibold hidden sm:inline">
                Year  Multimodal Transit Grid
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Live Bus & Route Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6B85]">
              Real-time vehicle GPS positions, active passenger occupancy, step-free access, and stop-by-stop arrival countdowns.
            </p>
          </div>

          {/* Refresh Timer & Manual Sync */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex flex-col text-right text-xs">
              <span className="font-bold text-[#0F172A] flex items-center justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                <span>Live Feed Active</span>
              </span>
              <span className="text-[11px] text-[#5A6B85]">
                Refreshed {lastRefreshSeconds}s ago • Auto-refresh in {refreshCountdown}s
              </span>
            </div>

            <button
              type="button"
              onClick={handleManualRefresh}
              title="Refresh Fleet Data"
              className="w-10 h-10 rounded-2xl border border-[#D6DAE3] bg-[#F7F8FA] hover:bg-white hover:border-[#72222B] text-[#0F172A] flex items-center justify-center transition-all shadow-xs cursor-pointer active:rotate-180 duration-300"
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
                      ? "bg-[#72222B] text-white shadow-sm scale-[1.01]"
                      : "bg-[#F7F8FA] border border-[#D6DAE3] text-[#5A6B85] hover:text-[#0F172A] hover:bg-white"
                  }`}
                >
                  <Bus size={16} className={isSelected ? "text-white" : "text-[#5A6B85]"} />
                  <span>{r.code}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#72222B]/10 text-[#72222B]"
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
              className="px-4 py-2 rounded-xl bg-white border border-[#D6DAE3] hover:border-[#72222B] text-xs font-bold text-[#0F172A] flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeftRight size={14} className="text-[#72222B]" />
              <span>
                Direction:{" "}
                <strong className="text-[#72222B] uppercase">
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
                  ? "bg-[#72222B] text-white animate-pulse"
                  : "bg-[#72222B]/5 hover:bg-[#72222B]/10 text-[#72222B]"
              }`}
            >
              <Mic size={14} />
              <span>{isVoiceActive ? "Listening..." : "Tell Univa (Voice)"}</span>
            </button>

            {/* Plan Personalized Journey Link */}
            <Link
              href="/preferences"
              className="px-3.5 py-2 rounded-xl bg-[#192841] hover:bg-[#111C2E] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              title="Plan personalized journey"
            >
              <span>Plan Journey</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Voice Assistant Transcript Notification */}
        {voiceTranscript && (
          <div className="p-3 bg-[#72222B]/5 border border-[#72222B]/20 rounded-2xl text-xs font-semibold text-[#0F172A] flex items-center gap-2.5">
            <Volume2 size={16} className="text-[#72222B] shrink-0" />
            <span>{voiceTranscript}</span>
          </div>
        )}

        {/* Route Details Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-2xl bg-[#F7F8FA] border border-[#D6DAE3]/60">
            <div className="text-[10px] font-bold text-[#5A6B85] uppercase">Terminus Points</div>
            <div className="text-xs font-extrabold text-[#0F172A] truncate mt-0.5">
              {currentRoute.origin.split(" ")[0]} ⇄ {currentRoute.destination.split(" ")[0]}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F7F8FA] border border-[#D6DAE3]/60">
            <div className="text-[10px] font-bold text-[#5A6B85] uppercase">Corridor Length</div>
            <div className="text-xs font-extrabold text-[#0F172A] mt-0.5">
              {currentRoute.distance} (~{currentRoute.avgDuration})
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F7F8FA] border border-[#D6DAE3]/60">
            <div className="text-[10px] font-bold text-[#5A6B85] uppercase">Scheduled Headway</div>
            <div className="text-xs font-extrabold text-[#22C55E] mt-0.5">
              {currentRoute.frequency} High Frequency
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F7F8FA] border border-[#D6DAE3]/60">
            <div className="text-[10px] font-bold text-[#5A6B85] uppercase">Active Fleet</div>
            <div className="text-xs font-extrabold text-[#72222B] mt-0.5">
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
          <div className="bg-white rounded-3xl border border-[#D6DAE3] p-5 shadow-[0_4px_20px_rgba(85,0,0,0.06)] space-y-4">
            
            {/* Search Filter Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3.5 text-[#5A6B85]" />
              <input
                type="text"
                placeholder="Filter stops by name or landmark (e.g. Nugegoda, Borella)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#D6DAE3] bg-[#F7F8FA] text-xs font-semibold text-[#0F172A] placeholder:text-[#5A6B85]/70 focus:outline-none focus:border-[#72222B] focus:bg-white transition-all"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter("")}
                  className="absolute right-3.5 top-2.5 text-xs text-[#5A6B85] hover:text-[#72222B]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Tab Buttons */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#F7F8FA] border border-[#D6DAE3]/70 text-xs font-extrabold">
              <button
                type="button"
                onClick={() => setActiveTab("fleet")}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "fleet"
                    ? "bg-[#72222B] text-white shadow-sm"
                    : "text-[#5A6B85] hover:text-[#0F172A]"
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
                    ? "bg-[#72222B] text-white shadow-sm"
                    : "text-[#5A6B85] hover:text-[#0F172A]"
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
                  <div className="p-8 text-center text-xs text-[#5A6B85]">
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
                            ? "bg-white border-[#72222B] shadow-md ring-2 ring-[#72222B]/20 text-[#0F172A]"
                            : "bg-[#F7F8FA] hover:bg-white border-[#D6DAE3] text-[#0F172A]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                                isSelected
                                  ? "bg-[#72222B] text-white shadow-sm"
                                  : "bg-[#72222B]/10 text-[#72222B]"
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
                              <p className="text-[11px] text-[#5A6B85]">
                                {bus.driver}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-black text-[#22C55E]">
                              {bus.speed} km/h
                            </div>
                            <div className="text-[10px] text-[#5A6B85]">
                              Live Speed
                            </div>
                          </div>
                        </div>

                        {/* Next Stop Bar */}
                        <div
                          className="p-2.5 rounded-xl flex items-center justify-between text-xs bg-white border border-[#D6DAE3]/80 text-[#0F172A]"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Clock size={13} className="text-[#72222B] shrink-0" />
                            <span className="truncate">
                              Next: <strong className="text-[#0F172A]">{bus.nextStopName}</strong>
                            </span>
                          </div>
                          <span
                            className="font-black text-xs shrink-0 ml-2 text-[#72222B]"
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
                            <span className={isSelected ? "text-white/80" : "text-[#5A6B85]"}>
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
                          ? "bg-white border-[#72222B] shadow-sm ring-1 ring-[#72222B]/30 text-[#0F172A]"
                          : "bg-white hover:bg-[#F7F8FA] border-[#D6DAE3] text-[#0F172A]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                            isSelected
                              ? "bg-[#72222B] text-white"
                              : "bg-[#F7F8FA] border border-[#D6DAE3] text-[#5A6B85]"
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
                                isSelected ? "text-white/70" : "text-[#5A6B85]"
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
                              isSelected ? "text-white/60" : "text-[#5A6B85]"
                            }`}
                          >
                            Every {currentRoute.frequency.replace("Every ", "")}
                          </span>
                        )}
                        {stop.isTransferHub && (
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded block mt-0.5 ${
                            isSelected ? "bg-[#72222B] text-white" : "bg-[#72222B]/10 text-[#72222B]"
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
          <div className="bg-white rounded-3xl border border-[#D6DAE3] p-5 shadow-[0_4px_20px_rgba(114,34,43,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-[#72222B]" />
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
                <label className="block text-[10px] font-bold text-[#5A6B85] uppercase mb-1">
                  Boarding Station
                </label>
                <select
                  value={fareStopFrom}
                  onChange={(e) => setFareStopFrom(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D6DAE3] bg-[#F7F8FA] font-semibold text-[#0F172A] text-xs focus:outline-none focus:border-[#72222B]"
                >
                  {activeStops.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.seq}. {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#5A6B85] uppercase mb-1">
                  Disembarking Station
                </label>
                <select
                  value={fareStopTo}
                  onChange={(e) => setFareStopTo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D6DAE3] bg-[#F7F8FA] font-semibold text-[#0F172A] text-xs focus:outline-none focus:border-[#72222B]"
                >
                  {activeStops.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.seq}. {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0F172A] text-white flex items-center justify-between">
              <div>
                <div className="text-[11px] text-[#D6DAE3]">Digital TapPass Fare</div>
                <div className="text-xl font-black text-white">LKR {calculatedFare}.00</div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#22C55E] font-bold">✓ 100% Step-Free</span>
                <button
                  type="button"
                  onClick={() => alert("TapPass NFC active! Hold device near boarding terminal validator.")}
                  className="py-2 px-3 rounded-xl bg-[#72222B] hover:bg-[#5B1B22] text-white font-extrabold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Tap to Board
                </button>
              </div>
            </div>
          </div>

          {/* Official Dispatch Announcements */}
          <div className="p-4 rounded-2xl bg-white border border-[#D6DAE3] flex items-start gap-3 text-xs text-[#5A6B85]">
            <Info size={16} className="text-[#72222B] shrink-0 mt-0.5" />
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

          {/* Under-Map Mobile App Banner) */}
          <div className="bg-[#0C1017] border border-[#72222B]/30 rounded-3xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#22C55E]">
                <QrCode size={13} />
                <span>Univa Rider Mobile App</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Track live on the go with real-time push alerts
              </h3>
              <p className="text-xs text-[#D6DAE3]/80">
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
