"use client";

import React, { Suspense } from "react";
import AuthCard from "../components/AuthCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center pt-24 sm:pt-28 pb-12 p-4 sm:p-6 md:p-10 bg-[#F7F9FC]">
      <Suspense fallback={<div className="text-sm font-semibold text-[#64748B]">Loading login...</div>}>
        <AuthCard initialMode="login" />
      </Suspense>
    </div>
  );
}
