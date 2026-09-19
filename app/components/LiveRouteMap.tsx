"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Navigation,
  CheckCircle2,
  Clock,
  Gauge,
  Users,
  ShieldCheck,
  Zap,
  MapPin,
  RefreshCw,
  Compass,
  AlertCircle,
  Eye,
  Sliders,
} from "lucide-react";

export interface StopPoint {
  id: string;
  name: string;
  landmark?: string;
  x: number; // 0 to 1000 coordinate space
  y: number; // 0 to 800 coordinate space
  seq: number;
  connections?: string[];
  isTransferHub?: boolean;
  stepFreeAccessible?: boolean;
}

export interface LiveBus {
  id: string;
  plate: string;
  routeId: string;
  direction: "outbound" | "inbound";
  currentStopIndex: number;
  progress: number; // 0 to 1 between stops
  speed: number;
  nextStopName: string;
  etaMinutes: number;
  occupancyPercent: number;
  seatsAvailable: number;
  wheelchairBay: boolean;
  driver: string;
  status: "In Transit" | "Approaching Stop" | "At Station" | "Slight Delay";
  heading: number; // degrees
  /** Shown in the HUD title instead of "Bus" (e.g. "SkyRail", "Pod"). */
  vehicleType?: string;
}

interface LiveRouteMapProps {
  stops: StopPoint[];
  buses: LiveBus[];
  routeName: string;
  routeId: string;
  selectedBusId?: string | null;
  onSelectBus?: (busId: string | null) => void;
  selectedStopId?: string | null;
  onSelectStop?: (stopId: string | null) => void;
  showTraffic?: boolean;
  onToggleTraffic?: () => void;
  isSimulating?: boolean;
  heightClass?: string;
  className?: string;
  hideTopOverlay?: boolean;
  hideControls?: boolean;
}

export default function LiveRouteMap({
  stops,
  buses,
  routeName,
  routeId,
  selectedBusId,
  onSelectBus,
  selectedStopId,
  onSelectStop,
  showTraffic = true,
  onToggleTraffic,
  isSimulating = true,
  heightClass,
  className,
  hideTopOverlay = false,
  hideControls = false,
}: LiveRouteMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Selected bus object
  const selectedBus = useMemo(
    () => buses.find((b) => b.id === selectedBusId) || null,
    [buses, selectedBusId]
  );

  // Selected stop object
  const selectedStop = useMemo(
    () => stops.find((s) => s.id === selectedStopId) || null,
    [stops, selectedStopId]
  );

  // Calculate coordinates for a bus based on its stops and progress
  const getBusCoordinates = (bus: LiveBus) => {
    if (stops.length === 0) return { x: 500, y: 400 };

    const fromIdx = Math.min(Math.max(0, bus.currentStopIndex), stops.length - 1);
    const toIdx =
      bus.direction === "outbound"
        ? Math.min(fromIdx + 1, stops.length - 1)
        : Math.max(fromIdx - 1, 0);

    const fromStop = stops[fromIdx];
    const toStop = stops[toIdx];

    if (!fromStop || !toStop || fromIdx === toIdx) {
      return { x: fromStop?.x ?? 500, y: fromStop?.y ?? 400 };
    }

    const t = Math.max(0, Math.min(1, bus.progress));
    const x = fromStop.x + (toStop.x - fromStop.x) * t;
    const y = fromStop.y + (toStop.y - fromStop.y) * t;
    return { x, y };
  };

  // Build SVG path string from stops
  const routePathD = useMemo(() => {
    if (stops.length < 2) return "";
    let d = `M ${stops[0].x} ${stops[0].y}`;
    for (let i = 1; i < stops.length; i++) {
      // Create smooth curve between nodes
      const prev = stops[i - 1];
      const curr = stops[i];
      const cx = (prev.x + curr.x) / 2;
      const cy = (prev.y + curr.y) / 2;
      d += ` Q ${prev.x} ${cy} ${cx} ${cy} T ${curr.x} ${curr.y}`;
    }
    return d;
  }, [stops]);

  // Center on a selected bus or reset
  const centerOnBus = (bus: LiveBus) => {
    const coords = getBusCoordinates(bus);
    // Center at 500, 400
    setPanOffset({
      x: (500 - coords.x) * zoomLevel,
      y: (400 - coords.y) * zoomLevel,
    });
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    onSelectBus?.(null);
    onSelectStop?.(null);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.4, Math.max(0.7, prev + delta)));
  };

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Toggle fullscreen for map
  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!isFullscreen) {
      if (mapContainerRef.current.requestFullscreen) {
        mapContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={mapContainerRef}
      className={`relative w-full overflow-hidden rounded-3xl border border-[#D6DAE3] bg-[#0B0F17] shadow-[0_12px_40px_rgba(15,23,42,0.18)] u-glow-strong select-none ${
        isFullscreen
          ? "h-screen w-screen rounded-none"
          : heightClass || "h-[540px] sm:h-[620px] lg:h-[700px]"
      } ${className || ""}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Top Map Status Overlay */}
      {!hideTopOverlay && (
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Route Badge & Live Pulse */}
          <div className="flex items-center gap-2 bg-[#0F141C]/90 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full shadow-lg pointer-events-auto">
            <span className="u-pulse-dot" style={{ "--pulse-color": "#22C55E" } as React.CSSProperties} />
            <span className="text-xs font-extrabold text-white tracking-wide">
              {routeName}
            </span>
            <span className="text-[10px] font-bold text-[#D6DAE3] border-l border-white/20 pl-2">
              {buses.length} Active Fleet Vehicles
            </span>
          </div>

          {/* Live GPS Telemetry Status */}
          <div className="hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[11px] text-white/80 pointer-events-auto">
            <span className="u-pulse-dot" style={{ "--pulse-color": "#22C55E" } as React.CSSProperties} />
            <span>GPS Calibration: Active (±1.5m Precision)</span>
          </div>
        </div>
      )}

      {/* Floating Map Controls (Right Side) */}
      {!hideControls && (
        <div className="absolute top-16 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => handleZoom(0.25)}
            title="Zoom In"
            className="w-9 h-9 rounded-xl bg-[#0F141C]/90 hover:bg-[#192841] border border-white/15 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            <ZoomIn size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(-0.25)}
            title="Zoom Out"
            className="w-9 h-9 rounded-xl bg-[#0F141C]/90 hover:bg-[#192841] border border-white/15 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            <ZoomOut size={16} />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            title="Reset View"
            className="w-9 h-9 rounded-xl bg-[#0F141C]/90 hover:bg-[#192841] border border-white/15 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            <Compass size={16} />
          </button>
          {onToggleTraffic && (
            <button
              type="button"
              onClick={onToggleTraffic}
              title={showTraffic ? "Hide Traffic" : "Show Traffic"}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-md transition-all cursor-pointer ${
                showTraffic
                  ? "bg-[#22C55E]/20 border-[#22C55E]/60 text-[#22C55E]"
                  : "bg-[#0F141C]/90 border-white/15 text-white/60 hover:text-white"
              }`}
            >
              <Sliders size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
            className="w-9 h-9 rounded-xl bg-[#0F141C]/90 hover:bg-[#192841] border border-white/15 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      )}

      {/* Main SVG Vector Transit Canvas */}
      <svg
        viewBox="0 0 1000 800"
        className="w-full h-full"
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${
            panOffset.y / zoomLevel
          }px)`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.25s ease-out",
        }}
      >
        <defs>
          {/* Background Grid Pattern */}
          <pattern
            id="smartmetro-grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="1"
            />
          </pattern>

          {/* Route Polyline Multi-Stop Neon Gradient */}
          <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#192841" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>

          {/* Bus Icon Marker Filter */}
          <filter id="busGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#192841" floodOpacity="0.6" />
          </filter>

          <filter id="stopGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#22C55E" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* 1. Map Grid Surface */}
        <rect width="1000" height="800" fill="#0B0F17" />
        <rect width="1000" height="800" fill="url(#smartmetro-grid)" />

        {/* 2. Topographical Context: Stylized Colombo Coastline & Waterways */}
        <path
          d="M 80,0 C 95,150 70,300 85,450 C 100,580 65,700 80,800 L 0,800 L 0,0 Z"
          fill="rgba(2, 132, 199, 0.08)"
          stroke="rgba(56, 189, 248, 0.2)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <text
          x="35"
          y="420"
          fill="rgba(56, 189, 248, 0.3)"
          fontSize="11"
          fontWeight="700"
          letterSpacing="0.25em"
          transform="rotate(-90 35 420)"
        >
          INDIAN OCEAN COASTAL BELT
        </text>

        {/* Kelani River Corridor */}
        <path
          d="M 85,280 Q 250,260 420,290 T 750,270 T 950,290"
          fill="none"
          stroke="rgba(2, 132, 199, 0.15)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <text
          x="460"
          y="280"
          fill="rgba(56, 189, 248, 0.25)"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.15em"
        >
          KELANI RIVER BASIN
        </text>

        {/* Southern Expressway & Outer Circular Arterial lines */}
        <path
          d="M 780,800 Q 820,600 780,480 Q 750,380 820,180 T 800,0"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="4"
          strokeDasharray="6 6"
        />
        <text
          x="840"
          y="560"
          fill="rgba(255, 255, 255, 0.25)"
          fontSize="9"
          fontWeight="700"
          transform="rotate(85 840 560)"
        >
          OUTER CIRCULAR EXPRESSWAY (E02)
        </text>

        {/* 3. Traffic Density Heatmap (If enabled) */}
        {showTraffic && (
          <g opacity="0.45">
            <path
              d={routePathD}
              fill="none"
              stroke="#22C55E"
              strokeWidth="16"
              strokeLinecap="round"
              strokeOpacity="0.3"
            />
            {/* Moderate traffic hotspot simulation near Nugegoda / Borella */}
            {stops.length > 8 && (
              <circle
                cx={stops[8]?.x ?? 480}
                cy={stops[8]?.y ?? 430}
                r="38"
                fill="rgba(245, 158, 11, 0.25)"
              />
            )}
          </g>
        )}

        {/* 4. Active Transit Corridor Base Polyline */}
        <path
          d={routePathD}
          fill="none"
          stroke="#192841"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={routePathD}
          fill="none"
          stroke="url(#routeGlow)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Animated Directional Flow Dashes along Corridor */}
        <path
          d={routePathD}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="8 20"
          strokeLinecap="round"
          opacity="0.6"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* 5. Transit Stops (Station Nodes) */}
        {stops.map((stop, idx) => {
          const isSelected = selectedStopId === stop.id;
          const isTerminus = idx === 0 || idx === stops.length - 1;

          return (
            <g
              key={stop.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStop?.(stop.id);
                onSelectBus?.(null);
              }}
              className="cursor-pointer group"
            >
              {/* Pulsing ring for selected stop */}
              {isSelected && (
                <circle
                  cx={stop.x}
                  cy={stop.y}
                  r="20"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="2"
                  opacity="0.8"
                >
                  <animate
                    attributeName="r"
                    values="14;24;14"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.9;0.1;0.9"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Station Outer Ring */}
              <circle
                cx={stop.x}
                cy={stop.y}
                r={isTerminus ? 9 : 6.5}
                fill={isTerminus ? "#192841" : isSelected ? "#FFFFFF" : "#192841"}
                stroke={isTerminus ? "#FFFFFF" : isSelected ? "#192841" : "#22C55E"}
                strokeWidth={isTerminus ? 3 : 2}
                filter="url(#stopGlow)"
                className="transition-transform group-hover:scale-125"
              />

              {/* Inner dot */}
              <circle
                cx={stop.x}
                cy={stop.y}
                r={isTerminus ? 3.5 : 2.5}
                fill={isTerminus ? "#FFFFFF" : isSelected ? "#192841" : "#FFFFFF"}
              />

              {/* Station Label Badge */}
              <g transform={`translate(${stop.x + 12}, ${stop.y + 4})`}>
                <rect
                  x="-2"
                  y="-12"
                  width={stop.name.length * 6.6 + 10}
                  height="16"
                  rx="4"
                  fill={isTerminus ? "rgba(25, 40, 65, 0.95)" : isSelected ? "#192841" : "rgba(15, 20, 28, 0.85)"}
                  stroke={isSelected ? "#192841" : "rgba(255,255,255,0.15)"}
                  strokeWidth="1"
                />
                <text
                  x="3"
                  y="0"
                  fill={isTerminus ? "#FFFFFF" : isSelected ? "#FFFFFF" : "#E2E8F0"}
                  fontSize={isTerminus ? "10" : "8.5"}
                  fontWeight={isTerminus || isSelected ? "800" : "600"}
                >
                  {stop.seq}. {stop.name}
                </text>
              </g>
            </g>
          );
        })}

        {/* 6. Active Live Bus Markers */}
        {buses.map((bus) => {
          const coords = getBusCoordinates(bus);
          const isSelected = selectedBusId === bus.id;

          return (
            <g
              key={bus.id}
              transform={`translate(${coords.x}, ${coords.y})`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectBus?.(bus.id);
                onSelectStop?.(null);
              }}
              className="cursor-pointer"
            >
              {/* Ripple animation around active bus */}
              <circle
                r={isSelected ? "26" : "18"}
                fill="none"
                stroke={isSelected ? "#FFFFFF" : "#22C55E"}
                strokeWidth="2"
                opacity="0.75"
              >
                <animate
                  attributeName="r"
                  values={isSelected ? "18;32;18" : "12;24;12"}
                  dur="1.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.8;0.1;0.8"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Bus Outer Shield */}
              <circle
                r={isSelected ? "16" : "13"}
                fill={isSelected ? "#223454" : "#192841"}
                stroke={isSelected ? "#FFFFFF" : "#223454"}
                strokeWidth="2.5"
                filter="url(#busGlow)"
              />

              {/* Vehicle Icon representation */}
              <g transform="translate(-7, -7) scale(0.7)">
                <path
                  d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 10.8 2 11v5c0 .6.4 1 1 1h2m0 0v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2m8 0v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2m-9-6h5"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* Vehicle Plate Badge */}
              <g transform="translate(18, -14)">
                <rect
                  x="0"
                  y="0"
                  width="68"
                  height="22"
                  rx="6"
                  fill={isSelected ? "#192841" : "rgba(15, 20, 28, 0.92)"}
                  stroke={isSelected ? "#223454" : "rgba(255,255,255,0.2)"}
                  strokeWidth="1.5"
                />
                <text
                  x="6"
                  y="11"
                  fill="#FFFFFF"
                  fontSize="8.5"
                  fontWeight="800"
                  letterSpacing="0.05em"
                >
                  {bus.plate}
                </text>
                <text
                  x="6"
                  y="18"
                  fill="#22C55E"
                  fontSize="6.5"
                  fontWeight="700"
                >
                  {bus.speed} km/h • {bus.etaMinutes}m
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Selected Bus Floating Telemetry HUD Card */}
      <AnimatePresence>
        {selectedBus && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-30 bg-[#0F141C]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl text-white pointer-events-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#192841] flex items-center justify-center text-white shadow-md border border-white/10">
                  <Bus size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold tracking-tight">
                      {selectedBus.vehicleType ?? "Bus"} {selectedBus.plate}
                    </h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                      {selectedBus.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    {selectedBus.driver} • SmartFleet Grid
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectBus?.(null)}
                className="text-xs text-white/50 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Live Stats */}
            <div className="grid grid-cols-3 gap-2 py-3 text-center border-b border-white/10">
              <div className="bg-white/5 rounded-xl p-2">
                <div className="text-[10px] text-white/60">Speed</div>
                <div className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5 u-digital-num">
                  <Gauge size={12} className="text-[#22C55E]" />
                  <span>{selectedBus.speed} km/h</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-2">
                <div className="text-[10px] text-white/60">Next Stop ETA</div>
                <div className="text-xs font-bold text-[#22C55E] flex items-center justify-center gap-1 mt-0.5 u-digital-num">
                  <Clock size={12} />
                  <span>{selectedBus.etaMinutes} min</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-2">
                <div className="text-[10px] text-white/60">Occupancy</div>
                <div className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                  <Users size={12} className="text-[#FBBF24]" />
                  <span>{selectedBus.occupancyPercent}%</span>
                </div>
              </div>
            </div>

            {/* Next Stop & Accessibility */}
            <div className="pt-2.5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-white/80">
                <span>Next Scheduled Stop:</span>
                <strong className="text-white truncate max-w-[180px]">
                  {selectedBus.nextStopName}
                </strong>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#22C55E]" />
                  <span>Step-Free Ramp Active</span>
                </span>
                <span className="text-[#22C55E] font-bold">
                  {selectedBus.seatsAvailable} Seats Free
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => centerOnBus(selectedBus)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#192841] hover:bg-[#111C2E] u-btn text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              >
                <Navigation size={13} />
                <span>Center on Bus</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Stop Modal / Overlay */}
      <AnimatePresence>
        {selectedStop && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-30 bg-[#0F141C]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl text-white pointer-events-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#22C55E] text-[#0F141C] font-black text-xs flex items-center justify-center">
                  {selectedStop.seq}
                </span>
                <h4 className="text-sm font-bold text-white truncate max-w-[200px]">
                  {selectedStop.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => onSelectStop?.(null)}
                className="text-xs text-white/50 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-2.5 space-y-1.5 text-xs text-white/80">
              {selectedStop.landmark && (
                <p className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                  <MapPin size={11} className="text-sky-400 shrink-0" />
                  <span>{selectedStop.landmark}</span>
                </p>
              )}
              <div className="flex items-center justify-between pt-1">
                <span>Accessibility:</span>
                <span className="text-[#22C55E] font-semibold">
                  100% Step-Free Concourse
                </span>
              </div>
              {selectedStop.connections && selectedStop.connections.length > 0 && (
                <div className="pt-1">
                  <span className="text-[10px] text-white/50 block mb-1">
                    Intermodal Connections:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedStop.connections.map((c, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => onSelectStop?.(null)}
                className="py-1.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Map Legend */}
      <div className="absolute bottom-4 right-4 z-10 hidden md:flex items-center gap-3 bg-[#0F141C]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[10px] text-white/70">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#192841] border border-white/50" />
          <span>Active Bus</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span>Transit Stop</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 rounded-full bg-gradient-to-r from-[#192841] to-[#22C55E]" />
          <span>Corridor Line</span>
        </div>
      </div>
    </div>
  );
}
