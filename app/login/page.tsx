"use client";

import React, { Suspense } from "react";
import AuthCard from "../components/AuthCard";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-sm font-semibold text-[#64748B]">
            Loading login...
          </div>
        }
      >
        <AuthCard initialMode="login" isFullScreen={true} />
      </Suspense>
    </main>
  );
}
