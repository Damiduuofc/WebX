"use client";

import React from "react";
import { Bus, Train, Zap } from "lucide-react";
import { TRANSIT_ROUTES, UN01_LEGS } from "../data/smartMetroData";

// Compact, non-interactive preview of the journey's route. It is drawn from the
// same UN01 stops and legs as the Live Route map and the trip screen, so the
// preview, the live map and the itinerary can never disagree.
const ROUTE = TRANSIT_ROUTES.UN01;
const STOPS = ROUTE.stops;

const LEG_STYLE = [
  { color: "#38BDF8", core: "#E6F6FF", Icon: Bus },
  { color: "#22C55E", core: "#E9FFF1", Icon: Train },
  { color: "#F59E0B", core: "#FFF6E0", Icon: Zap },
] as const;

// Same smoothing as LiveRouteMap so the route has the identical shape.
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    const cy = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x} ${cy} ${cx} ${cy} T ${curr.x} ${curr.y}`;
  }
  return d;
}

const FULL_PATH = smoothPath(STOPS);
const TRANSFER_COUNT = UN01_LEGS.length - 1;

export default function RoutePreviewMap() {
  const transferIdx = new Set<number>(UN01_LEGS.slice(0, -1).map((leg) => leg.toIdx));
  const lastIdx = STOPS.length - 1;

  return (
    <div className="relative w-full rounded-2xl bg-[#0F172A] border border-[#E2E8F0] overflow-hidden p-4 space-y-3 u-glow-strong">
      {/* Subtle Grid Map Canvas Pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#94A3B8 1px, transparent 1px), radial-gradient(#94A3B8 1px, #0F172A 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      />

      {/* Floating Map Badges */}
      <div className="relative z-10 flex items-center justify-between text-white text-xs">
        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 font-bold flex items-center gap-1.5">
          <span className="u-pulse-dot" style={{ "--pulse-color": "#34D399" } as React.CSSProperties} />
          Live GPS Corridor • {ROUTE.code}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-[#192841]/90 backdrop-blur-md border border-white/20 text-[11px] font-semibold">
          {TRANSFER_COUNT} Transfers
        </span>
      </div>

      <div className="relative z-10 grid grid-cols-[38%_1fr] gap-3 items-stretch">
        {/* Route map */}
        <div className="h-[320px] sm:h-[340px]">
          <svg viewBox="185 -15 260 770" className="w-full h-full" aria-hidden="true">
            {/* Faint full corridor */}
            <path d={FULL_PATH} fill="none" stroke="#192841" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />

            {/* One laser beam per leg: glow halo, travelling pulse, bright core */}
            {UN01_LEGS.map((leg, i) => {
              const d = smoothPath(STOPS.slice(leg.fromIdx, leg.toIdx + 1));
              const { color, core } = LEG_STYLE[i];
              return (
                <g key={leg.short}>
                  <path d={d} fill="none" stroke={color} strokeWidth="24" opacity={0.3} strokeLinecap="round" style={{ filter: "blur(9px)" }} />
                  <path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth="9"
                    strokeDasharray="24 24"
                    strokeLinecap="round"
                    className="u-laser-flow"
                    style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                  />
                  <path d={d} fill="none" stroke={core} strokeWidth="3" opacity={0.9} strokeLinecap="round" />
                </g>
              );
            })}

            {/* Stops: terminals and transfer hubs are larger */}
            {STOPS.map((stop, idx) => {
              const isTerminus = idx === 0 || idx === lastIdx;
              const isTransfer = transferIdx.has(idx);
              const legIdx = UN01_LEGS.findIndex((leg) => idx >= leg.fromIdx && idx <= leg.toIdx);
              const ring = isTransfer ? "#F59E0B" : LEG_STYLE[Math.max(0, legIdx)].color;
              return (
                <circle
                  key={stop.id}
                  cx={stop.x}
                  cy={stop.y}
                  r={isTerminus ? 15 : isTransfer ? 14 : 8}
                  fill="#FFFFFF"
                  stroke={isTerminus ? "#22C55E" : ring}
                  strokeWidth={isTerminus || isTransfer ? 6 : 4}
                />
              );
            })}

            {/* A vehicle travelling the corridor */}
            <g>
              <circle r="22" fill="#38BDF8" opacity="0.25" />
              <circle r="11" fill="#192841" stroke="#FFFFFF" strokeWidth="4" />
              <circle r="4.5" fill="#22C55E" />
              <animateMotion dur="26s" repeatCount="indefinite" path={FULL_PATH} />
            </g>
          </svg>
        </div>

        {/* Legs of the journey */}
        <div className="flex flex-col justify-between gap-2.5 min-w-0">
          {UN01_LEGS.map((leg, i) => {
            const { color, Icon } = LEG_STYLE[i];
            return (
              <div key={leg.short} className="bg-black/60 backdrop-blur-md rounded-xl p-2.5 border border-white/10 text-white text-xs space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2 font-bold">
                  <span className="flex items-center gap-1.5 min-w-0" style={{ color }}>
                    <Icon size={13} className="shrink-0" />
                    <span className="truncate">{leg.short}</span>
                  </span>
                  <span className="text-slate-300 font-semibold shrink-0 u-digital-num">{leg.mins} min</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {STOPS[leg.fromIdx].name} <span className="text-slate-500">→</span> {STOPS[leg.toIdx].name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="relative z-10 text-[11px] text-slate-300 bg-black/60 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
        Step-free transfers at <strong className="text-white">{STOPS[UN01_LEGS[0].toIdx].name}</strong> and{" "}
        <strong className="text-white">{STOPS[UN01_LEGS[1].toIdx].name}</strong>
      </p>
    </div>
  );
}
