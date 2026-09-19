"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Camera,
  Check,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/auth";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/preferences";
  const { register, demoLogin } = useAuth();

  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photoAdded, setPhotoAdded] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password validation rules
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasNumber && hasSpecialChar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!identifier.trim()) {
      setError("Please enter your email or phone number");
      return;
    }

    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements below");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 400));
      await register(name.trim(), identifier.trim(), password, photoAdded ? "KP" : undefined);
      setSuccess(true);
      setTimeout(() => {
        router.push(redirect);
      }, 500);
    } catch {
      setError("Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    demoLogin();
    setSuccess(true);
    setTimeout(() => {
      router.push(redirect);
    }, 400);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-[0_12px_40px_rgba(25,40,65,0.06)] space-y-6 my-4 u-glow">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#192841] text-white font-black text-xl shadow-md u-glow">
          U
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
          Create Passenger Account
        </h1>
        <div className="u-accent-line w-12 mx-auto" />
        <p className="text-xs sm:text-sm text-[#64748B] font-medium">
          Join Univa for synchronized multi-modal travel
        </p>
      </div>

      {redirect && redirect !== "/preferences" && redirect !== "/" && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#192841] flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#192841] shrink-0" />
          <span>Create an account to start your journey workflow.</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#EF4444] flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#22C55E] flex items-center gap-2 font-semibold">
          <CheckCircle2 size={15} className="shrink-0" />
          <span>Account created! Redirecting to your journey plan...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Photo (Optional) */}
        <div className="flex items-center gap-4 p-3 bg-[#F7F9FC] rounded-2xl border border-[#E2E8F0]">
          <div className="w-14 h-14 rounded-full bg-white border-2 border-dashed border-[#192841]/30 flex items-center justify-center text-[#192841] overflow-hidden shrink-0">
            {photoAdded ? (
              <span className="font-black text-sm">KP</span>
            ) : (
              <Camera size={20} className="text-[#64748B]" />
            )}
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold text-[#0F172A] block">
              Profile Photo (Optional)
            </span>
            <button
              type="button"
              onClick={() => setPhotoAdded(!photoAdded)}
              className="text-xs font-bold text-[#192841] hover:underline mt-0.5 cursor-pointer"
            >
              {photoAdded ? "Remove photo" : "+ Add photo"}
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] focus:border-[#192841] focus:bg-white text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#64748B]/60"
            disabled={isLoading || success}
          />
        </div>

        {/* Email or Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider">
            Email or Phone
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter email or phone number"
            className="w-full px-4 py-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] focus:border-[#192841] focus:bg-white text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#64748B]/60"
            disabled={isLoading || success}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full px-4 py-3 pr-11 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] focus:border-[#192841] focus:bg-white text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#64748B]/60"
              disabled={isLoading || success}
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

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full px-4 py-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] focus:border-[#192841] focus:bg-white text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#64748B]/60"
            disabled={isLoading || success}
          />
        </div>

        {/* Password Requirements List */}
        <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0] space-y-1.5">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
            Password Requirements
          </span>
          <div className="grid grid-cols-1 gap-1 text-xs">
            <div
              className={`flex items-center gap-1.5 ${
                hasMinLength ? "text-emerald-700 font-semibold" : "text-[#64748B]"
              }`}
            >
              <Check size={13} className={hasMinLength ? "text-emerald-600" : "opacity-30"} />
              <span>At least 8 characters</span>
            </div>
            <div
              className={`flex items-center gap-1.5 ${
                hasNumber ? "text-emerald-700 font-semibold" : "text-[#64748B]"
              }`}
            >
              <Check size={13} className={hasNumber ? "text-emerald-600" : "opacity-30"} />
              <span>One number</span>
            </div>
            <div
              className={`flex items-center gap-1.5 ${
                hasSpecialChar ? "text-emerald-700 font-semibold" : "text-[#64748B]"
              }`}
            >
              <Check size={13} className={hasSpecialChar ? "text-emerald-600" : "opacity-30"} />
              <span>One special character (!@#$...)</span>
            </div>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="terms-check"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-[#192841] focus:ring-[#192841] cursor-pointer"
          />
          <label htmlFor="terms-check" className="text-xs text-[#64748B] cursor-pointer select-none">
            I agree to the{" "}
            <span className="text-[#192841] font-semibold underline">Terms of Service</span> and{" "}
            <span className="text-[#192841] font-semibold underline">Privacy Policy</span>.
          </label>
        </div>

        {/* Primary CTA */}
        <button
          type="submit"
          disabled={isLoading || success}
          className="w-full py-3.5 px-6 rounded-xl bg-[#4F6EF7] hover:bg-[#3B4FE0] text-white font-bold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <span>Creating account...</span>
          ) : (
            <>
              <span>Create Account</span>
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
          <span>Quick Demo Account (1-Click)</span>
        </button>
      </div>

      {/* Login Link */}
      <div className="text-center text-xs text-[#64748B] pt-1">
        Already have an account?{" "}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirect)}`}
          className="font-bold text-[#192841] hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center pt-24 sm:pt-28 pb-12 p-4 sm:p-6 md:p-10 bg-[#F7F9FC] u-grid-bg">
      <Suspense fallback={<div className="text-sm font-semibold text-[#64748B]">Loading registration...</div>}>
        <SignUpContent />
      </Suspense>
    </div>
  );
}
