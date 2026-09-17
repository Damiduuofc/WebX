"use client";

import React, { useState, useEffect, useRef } from "react";

interface LoadingAnimationProps {
  loop?: boolean;
  loopDuration?: number; // in seconds
}

export default function LoadingAnimation({
  loop = true,
  loopDuration = 3.6,
}: LoadingAnimationProps) {
  const [progress, setProgress] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      let currentProgress = (elapsed % loopDuration) / loopDuration;

      if (!loop && elapsed >= loopDuration) {
        currentProgress = 1;
        setProgress(1);
        return;
      }

      setProgress(currentProgress);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [loop, loopDuration]);

  // Easing helpers
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Phase 1: Stroke Drawing (0.00 -> 0.40)
  const strokeProgress = easeOutCubic(Math.min(1, progress / 0.40));
  const strokeOffset = 360 * (1 - strokeProgress);

  // A Crossbar delayed stroke (0.20 -> 0.42)
  const crossbarProgress = easeOutCubic(
    Math.min(1, Math.max(0, (progress - 0.20) / 0.22))
  );
  const crossbarOffset = 50 * (1 - crossbarProgress);

  // Phase 2: Solid Fill & Illumination (0.32 -> 0.65)
  const fillProgress = easeInOutCubic(
    Math.min(1, Math.max(0, (progress - 0.32) / 0.33))
  );

  // Phase 3: Light Shimmer Sweep Across Brand (0.45 -> 0.82)
  const shimmerProgress = Math.min(1, Math.max(0, (progress - 0.45) / 0.37));
  const shimmerOffset = -220 + shimmerProgress * 500;

  // Phase 4: Gentle Breath & Seamless Loop Transition (0.88 -> 1.00)
  const cycleFade =
    progress > 0.88
      ? 1 - easeInOutCubic((progress - 0.88) / 0.12)
      : 1;

  const scaleEffect = 1 + (progress > 0.88 ? (progress - 0.88) * 0.15 : 0);

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-[#FFFFFF] overflow-hidden select-none">
      {/* Subtle Atmospheric Radial Texture & Light Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,216,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

      {/* Main Centered Loading Wordmark */}
      <div
        className="relative flex flex-col items-center justify-center will-change-transform"
        style={{
          opacity: cycleFade,
          transform: `scale(${scaleEffect})`,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 520 120"
          className="w-[300px] sm:w-[460px] md:w-[560px] h-auto overflow-visible"
        >
          <defs>
            {/* Dynamic Light Sweep Shimmer for Black Typography */}
            <linearGradient
              id="univaShimmerDark"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
              gradientTransform={`translate(${shimmerOffset}, 0)`}
            >
              <stop offset="0%" stopColor="#0A0D14" stopOpacity="0.9" />
              <stop offset="38%" stopColor="#0A0D14" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#00B4D8" stopOpacity="1" />
              <stop offset="62%" stopColor="#0A0D14" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0A0D14" stopOpacity="0.9" />
            </linearGradient>

            {/* Stroke Gradient */}
            <linearGradient id="univaStrokeDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A0D14" />
              <stop offset="60%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>

          {/* 1. Subtle Blueprint Silhouette Lines (6% Opacity in Black) */}
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
            {/* A */}
            <path
              d="M 419 95 L 451 25 L 483 95"
              fill="none"
              stroke="#000000"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 430 70 L 472 70"
              fill="none"
              stroke="#000000"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>

          {/* 2. Precision Animated Stroke Lines */}
          <g className="filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
            {/* U */}
            <path
              d="M 45 25 L 45 75 C 45 95, 95 95, 95 75 L 95 25"
              fill="none"
              stroke="url(#univaStrokeDark)"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeDasharray="360"
              strokeDashoffset={strokeOffset}
            />
            {/* N */}
            <path
              d="M 137 95 L 137 25 L 195 95 L 195 25"
              fill="none"
              stroke="url(#univaStrokeDark)"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="360"
              strokeDashoffset={strokeOffset}
            />
            {/* I */}
            <path
              d="M 247 25 L 247 95"
              fill="none"
              stroke="url(#univaStrokeDark)"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeDasharray="360"
              strokeDashoffset={strokeOffset}
            />
            {/* V */}
            <path
              d="M 299 25 L 333 95 L 367 25"
              fill="none"
              stroke="url(#univaStrokeDark)"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="360"
              strokeDashoffset={strokeOffset}
            />
            {/* A Legs */}
            <path
              d="M 419 95 L 451 25 L 483 95"
              fill="none"
              stroke="url(#univaStrokeDark)"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="360"
              strokeDashoffset={strokeOffset}
            />
            {/* A Crossbar */}
            <path
              d="M 430 70 L 472 70"
              fill="none"
              stroke="url(#univaStrokeDark)"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeDasharray="50"
              strokeDashoffset={crossbarOffset}
            />
          </g>

          {/* 3. Luminous Shimmer Fill in Black & Cyan Gloss */}
          <g
            style={{ opacity: fillProgress }}
            className="filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.18)]"
          >
            {/* U Solid */}
            <path
              d="M 45 25 L 45 75 C 45 95, 95 95, 95 75 L 95 25"
              fill="none"
              stroke="url(#univaShimmerDark)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* N Solid */}
            <path
              d="M 137 95 L 137 25 L 195 95 L 195 25"
              fill="none"
              stroke="url(#univaShimmerDark)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* I Solid */}
            <path
              d="M 247 25 L 247 95"
              fill="none"
              stroke="url(#univaShimmerDark)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* V Solid */}
            <path
              d="M 299 25 L 333 95 L 367 25"
              fill="none"
              stroke="url(#univaShimmerDark)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* A Solid */}
            <path
              d="M 419 95 L 451 25 L 483 95"
              fill="none"
              stroke="url(#univaShimmerDark)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 430 70 L 472 70"
              fill="none"
              stroke="url(#univaShimmerDark)"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Minimal High-End Accent Progress Bar (White Background Theme) */}
        <div className="mt-10 w-28 sm:w-36 h-[2px] bg-black/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-black/30 via-black to-[#00B4D8] transition-all duration-75 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
