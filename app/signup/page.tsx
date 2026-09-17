"use client";

import React from "react";
import AuthCard from "../components/AuthCard";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center pt-24 sm:pt-28 pb-12 p-4 sm:p-6 md:p-10 bg-[#F7F8FA]">
      <AuthCard initialMode="signup" />
    </div>
  );
}
