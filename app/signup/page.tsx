"use client";

import React, { Suspense } from "react";
import AuthCard from "../components/AuthCard";

export default function SignUpPage() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-sm font-semibold text-[#64748B]">
            Loading sign up...
          </div>
        }
      >
        <AuthCard initialMode="signup" isFullScreen={true} />
      </Suspense>
    </main>
  );
}
