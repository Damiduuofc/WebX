"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/preferences";
  const { login, demoLogin } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setError("Please enter your email or phone number");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate quick secure authentication
      await new Promise((res) => setTimeout(res, 400));
      await login(trimmedId, password);
      setLoginSuccess(true);
      setTimeout(() => {
        router.push(redirect);
      }, 500);
    } catch {
      setError("Invalid credentials. Please try again or use the demo login.");
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    demoLogin();
    setLoginSuccess(true);
    setTimeout(() => {
      router.push(redirect);
    }, 400);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-[0_12px_40px_rgba(25,40,65,0.06)] space-y-6">
      {/* Top Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#192841] text-white font-black text-xl shadow-md">
          U
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
          Welcome back to Univa
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] font-medium">
          Move smarter. Arrive better.
        </p>
      </div>

      {redirect && redirect !== "/preferences" && redirect !== "/" && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#192841] flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#192841] shrink-0" />
          <span>Sign in to continue to your selected journey screen.</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#EF4444] flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loginSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#22C55E] flex items-center gap-2 font-semibold">
          <CheckCircle2 size={15} className="shrink-0" />
          <span>Authenticated! Navigating to your journey...</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider">
            Email or Phone Number
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter email or phone number"
            className="w-full px-4 py-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] focus:border-[#192841] focus:bg-white text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#64748B]/60"
            disabled={isLoading || loginSuccess}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              onClick={() => alert("Password reset link sent to registered contact in demo mode.")}
              className="text-xs text-[#192841] hover:underline font-semibold cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-11 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] focus:border-[#192841] focus:bg-white text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#64748B]/60"
              disabled={isLoading || loginSuccess}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || loginSuccess}
          className="w-full py-3.5 px-6 rounded-xl bg-[#192841] hover:bg-[#111C2E] text-white font-bold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Login</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Demo Passenger 1-Click Button */}
      <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
        <button
          type="button"
          onClick={handleDemoAccess}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles size={14} className="text-emerald-600" />
          <span>Quick Login as Demo Commuter</span>
        </button>
        <p className="text-[11px] text-center text-[#64748B]">
          Instant one-click access for evaluation without entering credentials
        </p>
      </div>

      {/* Register Link */}
      <div className="text-center text-xs text-[#64748B] pt-1">
        Don&apos;t have an account?{" "}
        <Link
          href={`/signup?redirect=${encodeURIComponent(redirect)}`}
          className="font-bold text-[#192841] hover:underline"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center pt-24 sm:pt-28 pb-12 p-4 sm:p-6 md:p-10 bg-[#F7F9FC]">
      <Suspense fallback={<div className="text-sm font-semibold text-[#64748B]">Loading login...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
