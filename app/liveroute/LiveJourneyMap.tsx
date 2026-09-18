"use client";

import React, { useState, useMemo } from "react";
import {
  Bus,
  Train,
  Plane,
  Navigation,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
} from "lucide-react";
import { TransportModeType } from "./journeyData";

export interface StopStation {
  id: string;
  name: string;
  sub: string;
  x: number;
  y: number;
  mode: TransportModeType | "transfer" | "start" | "end";
  platform?: string;
}

interface LiveJourneyMapProps {
  progress?: number; // 0.0 to 1.0
  activeMode?: TransportModeType;
  currentVehicleName?: string;
  speedKmH?: number;
  fromLocation?: string;
  toLocation?: string;
  interactive?: boolean;
  className?: string;
  onSelectStation?: (station: StopStation) => void;
}

export default function LiveJourneyMap({
  progress = 0,
  activeMode = "bus",
  currentVehicleName = "Bus U-204",
  speedKmH = 54,
  fromLocation = "KDU, Ratmalana",
  toLocation = "Bandaranaike International Airport",
  interactive = true,
  className = "",
  onSelectStation,
}: LiveJourneyMapProps) {
  const [zoom, setZoom] = useState(1);
  const [selectedStation, setSelectedStation] = useState<StopStation | null>(null);

  // 9 Transit Stations
  const stations: StopStation[] = useMemo(
    () => [
      { id: "st-1", name: "KDU Ratmalana", sub: "Origin Station • Bay 4", x: 100, y: 390, mode: "start", platform: "Bay 4" },
      { id: "st-2", name: "Dehiwala Coastal", sub: "Autonomous Bus Waypoint", x: 190, y: 345, mode: "bus", platform: "Bay 2" },
      { id: "st-3", name: "Kollupitiya Marine", sub: "Autonomous Bus Waypoint", x: 280, y: 300, mode: "bus", platform: "Bay 1" },
      { id: "st-4", name: "Central Station Hub", sub: "Transfer Hub 1 (Bus → SkyRail)", x: 370, y: 255, mode: "transfer", platform: "Platform 2" },
      { id: "st-5", name: "Peliyagoda Smart Port", sub: "SkyRail Maglev Stop", x: 470, y: 220, mode: "skyrail", platform: "Track 2" },
      { id: "st-6", name: "Kelaniya Elevated", sub: "SkyRail Maglev Stop", x: 560, y: 185, mode: "skyrail", platform: "Track 2" },
      { id: "st-7", name: "SkyPort Gateway", sub: "Transfer Hub 2 (SkyRail → Aeropod)", x: 650, y: 155, mode: "transfer", platform: "Gate A1" },
      { id: "st-8", name: "Katunayake Aeroway", sub: "Aeropod Guideway Stop", x: 750, y: 120, mode: "air", platform: "Gate A1" },
      { id: "st-9", name: "Bandaranaike Airport", sub: "Destination (Terminal 1)", x: 860, y: 85, mode: "end", platform: "T1 Gate" },
    ],
    []
  );

  // Trajectory calculation
  const vehicleState = useMemo(() => {
    const p = Math.max(0, Math.min(1, progress));
    if (p <= 0.38) {
      const segT = p / 0.38;
      const x = 100 + (370 - 100) * segT;
      const y = 390 + (255 - 390) * segT;
      return { x, y, mode: "bus" as TransportModeType, label: "Bus U-204", color: "#F97316" };
    } else if (p <= 0.72) {
      const segT = (p - 0.38) / 0.34;
      const x = 370 + (650 - 370) * segT;
      const y = 255 + (155 - 255) * segT;
      return { x, y, mode: "skyrail" as TransportModeType, label: "SkyRail 02", color: "#0284C7" };
    } else {
      const segT = (p - 0.72) / 0.28;
      const x = 650 + (860 - 650) * segT;
      const y = 155 + (85 - 155) * segT;
      return { x, y, mode: "air" as TransportModeType, label: "Aeropod AP-12", color: "#8B5CF6" };
    }
  }, [progress]);

  const handleStationClick = (st: StopStation) => {
    setSelectedStation(st);
    onSelectStation?.(st);
  };

  return (
    <div className={`relative w-full h-full min-h-[320px] bg-[#0F172A] overflow-hidden select-none flex flex-col justify-between ${className}`}>
      
      {/* Top Map HUD */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#192841]/90 backdrop-blur-md border border-white/10 text-xs text-white shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-xs">Live Route Map</span>
          <span className="text-white/30">•</span>
          <span className="text-cyan-400 font-mono text-xs">{speedKmH} km/h</span>
        </div>

        {interactive && (
          <div className="pointer-events-auto flex items-center gap-1 bg-[#192841]/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-sm">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.15))}
              className="w-7 h-7 rounded-lg hover:bg-white/15 flex items-center justify-center text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.85, z - 0.15))}
              className="w-7 h-7 rounded-lg hover:bg-white/15 flex items-center justify-center text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Map SVG Canvas */}
      <div className="w-full h-full flex-1 flex items-center justify-center relative overflow-hidden">
        <svg
          viewBox="0 0 960 460"
          className="w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Background Grid */}
          <g opacity="0.06" stroke="#38BDF8" strokeWidth="0.75" strokeDasharray="3 6">
            {[...Array(14)].map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 35} x2="960" y2={i * 35} />
            ))}
            {[...Array(28)].map((_, i) => (
              <line key={`v-${i}`} x1={i * 35} y1="0" x2={i * 35} y2="460" />
            ))}
          </g>

          {/* Segment 1: Bus */}
          <path d="M 100 390 L 190 345 L 280 300 L 370 255" fill="none" stroke="#F97316" strokeWidth="5" strokeLinecap="round" opacity="0.85" />

          {/* Segment 2: SkyRail */}
          <path d="M 370 255 L 470 220 L 560 185 L 650 155" fill="none" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 4" opacity="0.9" />

          {/* Segment 3: Air */}
          <path d="M 650 155 L 750 120 L 860 85" fill="none" stroke="#8B5CF6" strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />

          {/* Completed Green Line */}
          {progress > 0 && (
            <line
              x1="100"
              y1="390"
              x2={vehicleState.x}
              y2={vehicleState.y}
              stroke="#22C55E"
              strokeWidth="5"
              strokeLinecap="round"
            />
          )}

          {/* Station Points */}
          {stations.map((st) => {
            const isStart = st.mode === "start";
            const isEnd = st.mode === "end";
            const isTransfer = st.mode === "transfer";

            return (
              <g
                key={st.id}
                transform={`translate(${st.x}, ${st.y})`}
                onClick={() => handleStationClick(st)}
                className="cursor-pointer group"
              >
                <circle
                  r={isTransfer ? 7 : isStart || isEnd ? 7 : 5}
                  fill={isStart ? "#0284C7" : isEnd ? "#22C55E" : isTransfer ? "#192841" : "#334155"}
                  stroke={isTransfer ? "#38BDF8" : isStart || isEnd ? "#FFFFFF" : "#64748B"}
                  strokeWidth={isTransfer ? 2 : 1.5}
                />

                <text
                  x="0"
                  y={isTransfer ? -12 : 16}
                  textAnchor="middle"
                  fill={isTransfer ? "#38BDF8" : isEnd ? "#22C55E" : "#CBD5E1"}
                  fontSize={isTransfer || isStart || isEnd ? 9 : 8}
                  fontWeight={isTransfer || isStart || isEnd ? "bold" : "normal"}
                  className="pointer-events-none"
                >
                  {st.name}
                </text>
              </g>
            );
          })}

          {/* Moving Vehicle Beacon */}
          <g transform={`translate(${vehicleState.x}, ${vehicleState.y})`} className="transition-all duration-700 ease-out">
            <circle r="14" fill={vehicleState.color} opacity="0.25" className="animate-ping" />
            <circle r="9" fill={vehicleState.color} />
            <circle r="4" fill="#FFFFFF" />

            {/* Floating Tag */}
            <g transform="translate(0, -22)">
              <rect
                x="-40"
                y="-9"
                width="80"
                height="18"
                rx="9"
                fill="#192841"
                stroke={vehicleState.color}
                strokeWidth="1"
              />
              <text x="0" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
                {vehicleState.label}
              </text>
            </g>
          </g>
        </svg>

        {/* Selected Station Popover */}
        {selectedStation && (
          <div className="absolute bottom-10 left-4 right-4 sm:left-auto sm:right-4 sm:w-64 bg-[#192841]/95 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl text-xs space-y-1 z-30">
            <div className="flex items-center justify-between text-white font-bold">
              <span>{selectedStation.name}</span>
              <button
                type="button"
                onClick={() => setSelectedStation(null)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-300 text-[11px]">{selectedStation.sub}</p>
          </div>
        )}
      </div>

      {/* Bottom Map Legend */}
      <div className="px-4 py-2 bg-[#192841] border-t border-white/5 flex items-center justify-between text-[11px] text-slate-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#F97316]" /> Bus
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#0284C7]" /> SkyRail
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Aeropod
          </span>
        </div>
        <span className="text-emerald-400 font-medium">GPS Synchronized</span>
      </div>
    </div>
  );
}
