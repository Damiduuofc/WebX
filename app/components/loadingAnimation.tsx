"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

interface LoadingAnimationProps {
  loop?: boolean;
  loopDuration?: number; // in seconds
  onComplete?: () => void;
}

export default function LoadingAnimation({
  loop = true,
  loopDuration = 4.0,
  onComplete,
}: LoadingAnimationProps) {
  const [progress, setProgress] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [targetMouse, setTargetMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const completedRef = useRef<boolean>(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Smooth mouse parallax lerp
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setTargetMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Master timeline loop
  useEffect(() => {
    let currentX = 0;
    let currentY = 0;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      // Parallax smooth interpolation
      currentX += (targetMouse.x - currentX) * 0.05;
      currentY += (targetMouse.y - currentY) * 0.05;
      setMousePos({ x: currentX, y: currentY });

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      let p = (elapsed % loopDuration) / loopDuration;

      if (!loop && elapsed >= loopDuration) {
        p = 1;
        setProgress(1);
        if (!completedRef.current) {
          completedRef.current = true;
          onCompleteRef.current?.();
        }
        return;
      }

      setProgress(p);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [loop, loopDuration, targetMouse]);

  // Easing helpers
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOutExpo = (t: number) =>
    t === 1 ? 1 : 1 - Math.pow(2, -10 * Math.min(1, Math.max(0, t)));

  // 1. Staggered Stroke Drawing Calculations (Wave effect across U N I V Λ)
  // U: 0.00 -> 0.28
  const uDraw = easeOutCubic(Math.min(1, progress / 0.28));
  const uOffset = 260 * (1 - uDraw);

  // N: 0.05 -> 0.33
  const nDraw = easeOutCubic(Math.min(1, Math.max(0, (progress - 0.05) / 0.28)));
  const nOffset = 300 * (1 - nDraw);

  // I: 0.10 -> 0.36
  const iDraw = easeOutCubic(Math.min(1, Math.max(0, (progress - 0.10) / 0.26)));
  const iOffset = 120 * (1 - iDraw);

  // V: 0.15 -> 0.41
  const vDraw = easeOutCubic(Math.min(1, Math.max(0, (progress - 0.15) / 0.26)));
  const vOffset = 220 * (1 - vDraw);

  // Λ (Modern Geometric A): 0.20 -> 0.46
  const aDraw = easeOutCubic(Math.min(1, Math.max(0, (progress - 0.20) / 0.26)));
  const aOffset = 220 * (1 - aDraw);

  // 2. Lock-in Shockwave / Energy Ripple (0.44 -> 0.72)
  const rippleActive = progress >= 0.44 && progress <= 0.75;
  const rippleProgress = rippleActive
    ? easeOutExpo((progress - 0.44) / 0.28)
    : 0;
  const rippleScale = rippleProgress * 2.8;
  const rippleOpacity = rippleActive ? (1 - rippleProgress) * 0.35 : 0;

  // 3. Solid Fill & Glow Illumination (0.35 -> 0.65)
  const fillProgress = easeInOutCubic(
    Math.min(1, Math.max(0, (progress - 0.35) / 0.30))
  );

  // 4. Prismatic Shimmer Light Sweep across Obsidian Letters (0.45 -> 0.85)
  const shimmerProgress = Math.min(1, Math.max(0, (progress - 0.45) / 0.38));
  const shimmerOffset = -240 + shimmerProgress * 560;

  // 5. Seamless Cycle Fade & Gentle Zoom (0.88 -> 1.00)
  const cycleFade =
    progress > 0.88
      ? 1 - easeInOutCubic((progress - 0.88) / 0.12)
      : 1;

  const cycleScale = 1 + (progress > 0.88 ? (progress - 0.88) * 0.12 : 0);

  // Background Ambient Dust Particles
  const particles = useMemo(
    () => [
      { id: 1, x: 20, y: 30, size: 3 },
      { id: 2, x: 75, y: 25, size: 4 },
      { id: 3, x: 35, y: 70, size: 2.5 },
      { id: 4, x: 82, y: 65, size: 3.5 },
      { id: 5, x: 50, y: 20, size: 2 },
      { id: 6, x: 15, y: 78, size: 3 },
    ],
    []
  );

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-[#FFFFFF] overflow-hidden select-none">
      {/* 1. Dynamic Atmosphere & Interactive Radial Glow */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,216,0.06)_0%,transparent_60%)] pointer-events-none transition-transform duration-300"
        style={{
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      {/* Floating Ambient Micro Bokeh Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-tr from-[#192841]/15 to-[#223454]/15 blur-[1px] animate-pulse"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${3 + p.id}s`,
              transform: `translate(${mousePos.x * (p.id * 5)}px, ${
                mousePos.y * (p.id * 5)
              }px)`,
              transition: "transform 0.2s ease-out",
            }}
          />
        ))}
      </div>

      {/* 2. Expanding Geometric Shockwave Pulse */}
      {rippleActive && (
        <div
          className="absolute w-72 h-72 rounded-full border border-[#192841]/30 pointer-events-none will-change-transform"
          style={{
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
            boxShadow: "0 0 25px rgba(25, 40, 65, 0.15)",
          }}
        />
      )}

      {/* 3. Main UNIVA Brand Wordmark Stage with 3D Parallax Tilt */}
      <div
        className="relative flex flex-col items-center justify-center will-change-transform"
        style={{
          opacity: cycleFade,
          transform: `perspective(1000px) rotateX(${-mousePos.y * 6}deg) rotateY(${
            mousePos.x * 6
          }deg) scale(${cycleScale})`,
          transition: "transform 0.15s ease-out",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 520 120"
          className="w-[320px] sm:w-[480px] md:w-[600px] h-auto overflow-visible"
        >
          <defs>
            {/* Prismatic Shimmer Sweep for Obsidian Typography */}
            <linearGradient
              id="univaPrismaticShimmer"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
              gradientTransform={`translate(${shimmerOffset}, 0)`}
            >
              <stop offset="0%" stopColor="#07090E" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#07090E" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#192841" stopOpacity="1" />
              <stop offset="50%" stopColor="#223454" stopOpacity="1" />
              <stop offset="55%" stopColor="#111C2E" stopOpacity="1" />
              <stop offset="65%" stopColor="#07090E" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#07090E" stopOpacity="0.95" />
            </linearGradient>

            {/* Precision Stroke Gradient */}
            <linearGradient id="univaStrokeCore" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#07090E" />
              <stop offset="50%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Shadow Depth Filter */}
            <filter id="premiumLetterShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.14" />
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* 1. Blueprint Guide Track (Subtle 6% Opacity) - Exactly matching modern Λ design */}
          <g className="opacity-6">
            {/* U */}
            <path
              d="M 45 25 L 45 75 C 45 95, 95 95, 95 75 L 95 25"
              fill="none"
              stroke="#000000"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* N */}
            <path
              d="M 137 95 L 137 25 L 195 95 L 195 25"
              fill="none"
              stroke="#000000"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* I */}
            <path
              d="M 247 25 L 247 95"
              fill="none"
              stroke="#000000"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* V */}
            <path
              d="M 299 25 L 333 95 L 367 25"
              fill="none"
              stroke="#000000"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Modern Geometric Λ (Exact same shape as animated A) */}
            <path
              d="M 417 95 L 451 25 L 485 95"
              fill="none"
              stroke="#000000"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* 2. Staggered Animated Stroke Lines */}
          <g filter="url(#premiumLetterShadow)">
            {/* U Path */}
            <path
              d="M 45 25 L 45 75 C 45 95, 95 95, 95 75 L 95 25"
              fill="none"
              stroke="url(#univaStrokeCore)"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeDasharray="260"
              strokeDashoffset={uOffset}
            />
            {/* N Path */}
            <path
              d="M 137 95 L 137 25 L 195 95 L 195 25"
              fill="none"
              stroke="url(#univaStrokeCore)"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="300"
              strokeDashoffset={nOffset}
            />
            {/* I Path */}
            <path
              d="M 247 25 L 247 95"
              fill="none"
              stroke="url(#univaStrokeCore)"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeDasharray="120"
              strokeDashoffset={iOffset}
            />
            {/* V Path */}
            <path
              d="M 299 25 L 333 95 L 367 25"
              fill="none"
              stroke="url(#univaStrokeCore)"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="220"
              strokeDashoffset={vOffset}
            />
            {/* Modern Geometric Λ Path */}
            <path
              d="M 417 95 L 451 25 L 485 95"
              fill="none"
              stroke="url(#univaStrokeCore)"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="220"
              strokeDashoffset={aOffset}
            />
          </g>

          {/* 3. Luminous Solid Fill with Prismatic Shimmer Sweep */}
          <g
            style={{ opacity: fillProgress }}
            filter="url(#premiumLetterShadow)"
            className="transition-opacity duration-300"
          >
            {/* U Solid */}
            <path
              d="M 45 25 L 45 75 C 45 95, 95 95, 95 75 L 95 25"
              fill="none"
              stroke="url(#univaPrismaticShimmer)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* N Solid */}
            <path
              d="M 137 95 L 137 25 L 195 95 L 195 25"
              fill="none"
              stroke="url(#univaPrismaticShimmer)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* I Solid */}
            <path
              d="M 247 25 L 247 95"
              fill="none"
              stroke="url(#univaPrismaticShimmer)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* V Solid */}
            <path
              d="M 299 25 L 333 95 L 367 25"
              fill="none"
              stroke="url(#univaPrismaticShimmer)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Modern Geometric Λ Solid */}
            <path
              d="M 417 95 L 451 25 L 485 95"
              fill="none"
              stroke="url(#univaPrismaticShimmer)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        {/* 4. Luxury Kinetic Progress Bar with Glowing Laser Tip */}
        <div className="mt-12 relative w-32 sm:w-44 h-[2.5px] bg-black/[0.06] rounded-full overflow-hidden shadow-inner">
          {/* Main Progress Line */}
          <div
            className="h-full bg-gradient-to-r from-black/20 via-[#192841] to-[#22C55E] transition-all duration-75 ease-out rounded-full relative"
            style={{ width: `${Math.round(progress * 100)}%` }}
          >
            {/* Glowing Leading Particle Head */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
