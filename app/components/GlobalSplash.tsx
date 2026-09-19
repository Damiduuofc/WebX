"use client";

import React, { useState, useEffect, useCallback } from "react";
import LoadingAnimation from "./loadingAnimation";

export default function GlobalSplash() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setIsFadingOut(true);
    const fadeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 500);
    return () => clearTimeout(fadeTimer);
  }, []);

  // Safety fallback: ensure splash always dismisses even if tab is throttled in background
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      handleSplashComplete();
    }, 3200);

    return () => clearTimeout(safetyTimer);
  }, [handleSplashComplete]);

  if (!showSplash) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#FFFFFF] transition-opacity duration-500 ease-out select-none ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden={isFadingOut}
    >
      <LoadingAnimation
        loop={false}
        loopDuration={2.4}
        onComplete={handleSplashComplete}
      />
    </div>
  );
}
