"use client";

import React from "react";
import LoadingAnimation from "./components/loadingAnimation";

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden bg-[#FFFFFF]">
      <LoadingAnimation loop={true} />
    </main>
  );
}
