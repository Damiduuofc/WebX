"use client";

import React from "react";
import AuthCard from "../components/AuthCard";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] w-full flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#F7F8FA]">
      <AuthCard initialMode="login" />
    </div>
  );
}
