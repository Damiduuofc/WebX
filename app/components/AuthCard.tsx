"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, X, Check, ShieldCheck, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingAnimation from "./loadingAnimation";

interface AuthCardProps {
  initialMode?: "login" | "signup";
  onClose?: () => void;
  onSuccess?: (user: { name: string; email: string }) => void;
  isModal?: boolean;
  isFullScreen?: boolean;
}

const testimonials = [
  {
    quote:
      "Univa cut my daily commute across Colombo and KDU by 35%. The synchronized SkyRail and autonomous bus links feel seamless.",
    author: "Sara Bright",
    role: "Daily Commuter • KDU Scholar",
    tag1: "Autonomous Grid 2100",
    tag2: "Synchronized Rail",
    image: "/images/skyrail.jpg",
    vehicle: "SkyRail Line 02",
    badge: "180 km/h Maglev",
    highlight: "Colombo Metro Corridor",
  },
  {
    quote:
      "With step-free precision docking and instant TapPass, our faculty members travel between research hubs effortlessly.",
    author: "Dr. Priyantha K.",
    role: "Senior Researcher • Computing Faculty",
    tag1: "Step-Free Transit",
    tag2: "Digital TapPass",
    image: "/images/bus.jpg",
    vehicle: "Autonomous Bus 245",
    badge: "Precision Docking",
    highlight: "Direct University Link",
  },
  {
    quote:
      "Hands-free voice routing with Tell Univa gives me real-time platform updates right before every interchange.",
    author: "Malik Perera",
    role: "Undergraduate Commuter",
    tag1: "AI Voice Co-Pilot",
    tag2: "Zero Emissions",
    image: "/images/pod.jpg",
    vehicle: "Smart Road Pod EV",
    badge: "Micro-Mobility",
    highlight: "Autonomous Arterial Link",
  },
];

export default function AuthCard({
  initialMode = "signup",
  onClose,
  onSuccess,
  isModal = false,
  isFullScreen = false,
}: AuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/preferences";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successUser, setSuccessUser] = useState<{ name: string; email: string } | null>(null);

  const handleNextTestimonial = () => {
    setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Synchronized auto-rotation for transit vehicle showcase (both desktop and mobile)
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleAuthSuccess = (userName?: string, userEmail?: string) => {
    const resolvedName =
      userName ||
      name.trim() ||
      (email.includes("@") ? email.split("@")[0] : email.trim()) ||
      "Transit Rider";
    const resolvedEmail = userEmail || email.trim() || "rider@univa2100.org";

    const userData = { name: resolvedName, email: resolvedEmail, loggedIn: true };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("univa_user", JSON.stringify(userData));
        window.dispatchEvent(new Event("univa_auth_change"));
      } catch (err) {
        console.error(err);
      }
    }

    setSuccessUser(userData);
    setIsSuccess(true);

    if (onSuccess) {
      onSuccess(userData);
    }

    // Safety fallback timer if tab is backgrounded
    setTimeout(() => {
      if (onClose) {
        onClose();
      } else {
        router.push(redirect);
      }
    }, 3600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthSuccess();
  };

  const currentTestimonial = testimonials[testimonialIdx];

  // =========================================================================
  // 1. FULL-SCREEN DEDICATED AUTH PAGE LAYOUT (/login & /signup)
  // =========================================================================
  if (isFullScreen) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col overflow-x-hidden">
        {/* Full-Screen Branded Univa Loading Animation on Auth Completion */}
        {isSuccess && (
          <LoadingAnimation
            loop={false}
            loopDuration={2.6}
            zIndex="z-[9999]"
            message={`Welcome, ${successUser?.name || "Rider"}!`}
            subMessage={
              mode === "signup"
                ? "Your Rider Account has been created • Initializing Univa Pass..."
                : "You have logged in successfully • Initializing live transit telemetry..."
            }
            onComplete={() => {
              if (onClose) {
                onClose();
              } else {
                router.push(redirect);
              }
            }}
          />
        )}
        {/* ========================================================================= */}
        {/* MOBILE VIEW LAYOUT (Exact match to reference image media_1789824213599)    */}
        {/* ========================================================================= */}
        <div className="lg:hidden w-full min-h-screen bg-[#0F172A] flex flex-col justify-between">
          {/* Top Hero Image Header: Same transit vehicle imagery & behavior as desktop */}
          <div className="relative w-full h-[260px] sm:h-[300px] overflow-hidden shrink-0 select-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.image}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 z-0"
              >
                <Image
                  src={currentTestimonial.image}
                  alt={currentTestimonial.vehicle}
                  fill
                  priority
                  className="object-cover object-center"
                />
                {/* Visual Depth Gradient Scrims matching desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-black/40 to-black/60 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,197,94,0.18)_0%,_transparent_65%)]" />
              </motion.div>
            </AnimatePresence>

            {/* Top floating nav items */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <Link
                href="/"
                className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 transition-colors cursor-pointer"
                aria-label="Back to home"
              >
                <ArrowLeft size={16} />
              </Link>
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="Univa Logo"
                  width={100}
                  height={32}
                  className="h-7 w-auto object-contain brightness-0 invert"
                />
              </Link>
            </div>

            {/* Bottom Overlay inside Top Header: Active Telemetry Badge & Carousel Controls */}
            <div className="absolute bottom-12 left-4 right-4 flex items-center justify-between z-20 gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white shadow-md truncate">
                <Zap size={12} className="text-[#38BDF8] shrink-0" />
                <span className="truncate">{currentTestimonial.vehicle}</span>
                <span className="text-white/40">•</span>
                <span className="text-[#22C55E] shrink-0">{currentTestimonial.badge}</span>
              </div>

              {/* Slide Dots and Prev/Next Navigation */}
              <div className="flex items-center gap-1.5 shrink-0">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTestimonialIdx(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === testimonialIdx ? "w-4 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={handlePrevTestimonial}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 transition-colors cursor-pointer ml-1"
                  aria-label="Previous transit vehicle"
                >
                  <ArrowLeft size={11} />
                </button>
                <button
                  type="button"
                  onClick={handleNextTestimonial}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 transition-colors cursor-pointer"
                  aria-label="Next transit vehicle"
                >
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          </div>

          {/* Overlapping White Bottom Sheet Card */}
          <div className="relative -mt-8 w-full bg-white rounded-t-[32px] px-6 sm:px-8 pt-7 pb-8 shadow-2xl flex-1 flex flex-col justify-between z-10">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4 my-auto"
              >
                <div className="w-16 h-16 rounded-full bg-[#22C55E]/15 text-[#22C55E] mx-auto flex items-center justify-center shadow-xs">
                  <Check size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-[#0F172A]">
                    Welcome, {successUser?.name}!
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    {mode === "signup"
                      ? "Your Rider Account has been created."
                      : "You have logged in successfully."}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#192841]/10 text-[#192841] text-xs font-semibold">
                  <span>Redirecting to journey control...</span>
                </div>
              </motion.div>
            ) : (
              <div>
                {/* Centered Heading */}
                <h2 className="text-2xl sm:text-3xl font-bold text-[#192841] text-center mb-6 tracking-tight">
                  {mode === "signup" ? "Get Started" : "Welcome Back"}
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm font-semibold text-[#0F172A]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Full Name"
                        required={mode === "signup"}
                        className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#192841] focus:ring-1 focus:ring-[#192841] transition-all"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-[#0F172A]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Mail"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#192841] focus:ring-1 focus:ring-[#192841] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-[#0F172A]">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        required
                        className="w-full px-4 py-3 pr-11 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#192841] focus:ring-1 focus:ring-[#192841] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#192841] p-1 transition-colors cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Checkbox row */}
                  {mode === "signup" ? (
                    <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="w-4 h-4 rounded border-[#CBD5E1] text-[#192841] focus:ring-[#192841] accent-[#192841] cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm text-[#0F172A]">
                        I accept the terms of{" "}
                        <span className="font-semibold text-[#192841]">Personal data</span>
                      </span>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-[#CBD5E1] text-[#192841] focus:ring-[#192841] accent-[#192841] cursor-pointer"
                        />
                        <span className="text-xs text-[#0F172A]">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAuthSuccess("Recovered Rider")}
                        className="text-xs text-[#192841] font-semibold hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Primary Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#0B132B] hover:bg-[#192841] text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
                    >
                      {mode === "signup" ? "Sign up" : "Sign in"}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-6">
                  <div className="w-full border-t border-[#E2E8F0]" />
                  <span className="absolute bg-white px-3 text-xs text-[#94A3B8]">
                    {mode === "signup" ? "Sign up with" : "Sign in with"}
                  </span>
                </div>

                {/* Social Icons Row */}
                <div className="flex items-center justify-center gap-5 sm:gap-6 mb-6">
                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => handleAuthSuccess("Facebook Rider", "fb.rider@univa.com")}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all active:scale-95 cursor-pointer shadow-2xs"
                    aria-label="Sign in with Facebook"
                  >
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>

                  {/* Twitter */}
                  <button
                    type="button"
                    onClick={() => handleAuthSuccess("Twitter Rider", "twitter.rider@univa.com")}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all active:scale-95 cursor-pointer shadow-2xs"
                    aria-label="Sign in with Twitter"
                  >
                    <svg className="w-4.5 h-4.5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                    </svg>
                  </button>

                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleAuthSuccess("Google Rider", "google.rider@univa.com")}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all active:scale-95 cursor-pointer shadow-2xs"
                    aria-label="Sign in with Google"
                  >
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={() => handleAuthSuccess("Apple Rider", "apple.rider@univa.com")}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all active:scale-95 cursor-pointer shadow-2xs"
                    aria-label="Sign in with Apple"
                  >
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.4c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.83-1 2.94 1.07.08 2.15-.55 2.81-1.34z" />
                    </svg>
                  </button>
                </div>

                {/* Bottom Switch Link */}
                <div className="text-center text-xs text-[#64748B]">
                  {mode === "signup" ? (
                    <p>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="font-bold text-[#192841] hover:underline cursor-pointer"
                      >
                        Sign in
                      </button>
                    </p>
                  ) : (
                    <p>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="font-bold text-[#192841] hover:underline cursor-pointer"
                      >
                        Sign up
                      </button>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Quick 1-Click Demo Commuter Login Button */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleAuthSuccess("KDU Commuter", "rider@univa2100.org")}
                className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0F172A] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200"
              >
                <ShieldCheck size={13} className="text-[#22C55E]" />
                <span>1-Click Demo Passenger Access</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW: 2-COLUMN LAYOUT (hidden lg:grid)                            */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 w-full min-h-screen bg-white">
          {/* LEFT COLUMN: AUTHENTICATION FORM (Desktop) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between min-h-screen p-6 sm:p-10 lg:p-12 xl:p-14 bg-white z-10">
          
          {/* Top Navigation Row: Official Brand Logo & Return Home */}
          <div className="flex items-center justify-between gap-4 pb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 group transition-opacity hover:opacity-90 cursor-pointer"
              title="Return to Univa Home"
            >
              <Image
                src="/logo.png"
                alt="Univa Logo"
                width={130}
                height={42}
                priority
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#192841] transition-colors py-1.5 px-3 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Form Center Container */}
          <div className="w-full max-w-md mx-auto my-auto py-6 sm:py-8 space-y-6">
            
            {/* Quick Segment Switcher (Sign Up vs Sign In) */}
            <div className="flex p-1 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0] text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                  mode === "signup"
                    ? "bg-white text-[#192841] shadow-xs font-extrabold"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-white text-[#192841] shadow-xs font-extrabold"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Form Content with Seamless Transitions */}
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success-fullscreen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-[#22C55E]/15 text-[#22C55E] mx-auto flex items-center justify-center shadow-xs">
                    <Check size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-[#0F172A]">
                      Welcome, {successUser?.name}!
                    </h3>
                    <p className="text-sm text-[#64748B]">
                      {mode === "signup"
                        ? "Your Rider Account has been created."
                        : "You have logged in successfully."}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#192841]/10 text-[#192841] text-xs font-semibold">
                    <span>Redirecting to journey control...</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === "signup" ? -14 : 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "signup" ? 14 : -14 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                      {mode === "signup" ? "Create an account" : "Welcome back"}
                    </h2>
                    <div className="u-accent-line w-14" />
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      {mode === "signup"
                        ? "Start exploring and utilizing all the resources that will help you elevate every journey you make."
                        : "Log in to your Univa rider account to access live transit routes, passes, and telemetry."}
                    </p>
                  </div>

                  {/* The Form */}
                  <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                    {/* Name field (Sign Up only) */}
                    {mode === "signup" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1"
                      >
                        <label className="block text-xs font-bold text-[#0F172A]">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Kasun Fernando"
                          className="w-full px-4 py-3.5 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] focus:bg-white text-base sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#192841] focus:ring-2 focus:ring-[#192841]/15 transition-all"
                        />
                      </motion.div>
                    )}

                    {/* Email / Username field */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#0F172A]">
                        {mode === "signup" ? "Email Address" : "Email or Username"}
                      </label>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          mode === "signup"
                            ? "rider@univa2100.org"
                            : "Enter username or email"
                        }
                        className="w-full px-4 py-3.5 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] focus:bg-white text-base sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#192841] focus:ring-2 focus:ring-[#192841]/15 transition-all"
                      />
                    </div>

                    {/* Password field */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#0F172A]">
                          Password
                        </label>
                        {mode === "login" && (
                          <button
                            type="button"
                            onClick={() => handleAuthSuccess("Recovered Rider")}
                            className="text-[11px] text-[#64748B] hover:text-[#192841] hover:underline cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={
                            mode === "signup"
                              ? "Create a secure password"
                              : "Enter your password"
                          }
                          className="w-full px-4 py-3.5 pr-11 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] focus:bg-white text-base sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#192841] focus:ring-2 focus:ring-[#192841]/15 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#192841] p-1.5 transition-colors cursor-pointer"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Primary CTA Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-4 px-6 rounded-xl sm:rounded-2xl bg-[#192841] hover:bg-[#111C2E] u-btn text-white font-bold text-base transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>
                          {mode === "signup"
                            ? "Create Account"
                            : "Sign In to Univa"}
                        </span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </form>

                  {/* OR Divider Line */}
                  <div className="relative flex items-center justify-center pt-2">
                    <div className="w-full border-t border-[#E2E8F0]" />
                    <span className="absolute bg-white px-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider u-mono">
                      OR
                    </span>
                  </div>

                  {/* Social Login 3-Button Row (Google, Apple, Facebook) */}
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleAuthSuccess("Google Rider", "google.rider@univa.com")
                      }
                      className="py-3 px-3 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white hover:bg-slate-50 transition-all flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer group"
                      aria-label="Sign in with Google"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleAuthSuccess("Apple Rider", "apple.rider@univa.com")
                      }
                      className="py-3 px-3 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white hover:bg-slate-50 transition-all flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer group"
                      aria-label="Sign in with Apple"
                    >
                      <svg
                        className="w-5 h-5 text-black"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.4c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.83-1 2.94 1.07.08 2.15-.55 2.81-1.34z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleAuthSuccess("Facebook Rider", "fb.rider@univa.com")
                      }
                      className="py-3 px-3 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white hover:bg-slate-50 transition-all flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer group"
                      aria-label="Sign in with Facebook"
                    >
                      <svg
                        className="w-5 h-5 text-[#1877F2]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                  </div>

                  {/* Bottom Toggle Link */}
                  <div className="pt-2 text-center text-xs text-[#64748B]">
                    {mode === "signup" ? (
                      <p>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("login")}
                          className="font-bold text-[#192841] hover:underline cursor-pointer"
                        >
                          Sign in
                        </button>
                      </p>
                    ) : (
                      <p>
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("signup")}
                          className="font-bold text-[#192841] hover:underline cursor-pointer"
                        >
                          Create one free
                        </button>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Transit Visual Card (Shown only on small screens) */}
            <div className="lg:hidden pt-4 border-t border-[#E2E8F0]">
              <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs bg-[#F7F9FC] p-3 flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                  <Image
                    src={currentTestimonial.image}
                    alt={currentTestimonial.vehicle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0F172A] truncate">
                      {currentTestimonial.vehicle}
                    </span>
                    <span className="text-[9px] font-extrabold text-[#22C55E] bg-[#22C55E]/15 px-1.5 py-0.5 rounded">
                      2100 Active
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    {currentTestimonial.badge} • {currentTestimonial.highlight}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Security Note & 1-Click Passenger Demo Access */}
          <div className="pt-6 border-t border-[#E2E8F0] space-y-2">
            <button
              type="button"
              onClick={() =>
                handleAuthSuccess("KDU Commuter", "rider@univa2100.org")
              }
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0F172A] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-200 shadow-2xs"
            >
              <ShieldCheck size={15} className="text-[#22C55E]" />
              <span>1-Click Instant Passenger Demo Access</span>
            </button>
            <p className="text-[11px] text-[#94A3B8] text-center">
              Protected by Univa Biometric TapPass Protocol • 2100 Unified Transit Standard
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: HIGH-RES TRANSIT VEHICLE SHOWCASE (Desktop View) */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative min-h-screen overflow-hidden flex-col justify-between p-10 xl:p-14 text-white select-none">
          {/* Dynamic Background Image with Smooth Crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.image}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 z-0"
            >
              <Image
                src={currentTestimonial.image}
                alt={currentTestimonial.vehicle}
                fill
                priority
                className="object-cover object-center"
              />
              {/* Multi-layered dark gradient overlay for optimal legibility and futuristic ambience */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-[#192841]/55" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,197,94,0.18)_0%,_transparent_65%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(56,189,248,0.15)_0%,_transparent_60%)]" />
            </motion.div>
          </AnimatePresence>

          {/* Top Bar: Transit Pill Badges & Live Status */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-white tracking-wide shadow-sm">
                {currentTestimonial.tag1}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-white tracking-wide shadow-sm">
                {currentTestimonial.tag2}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span>Colombo Multi-Modal Grid Active</span>
            </div>
          </div>

          {/* Middle: Active Vehicle Telemetry Ribbon */}
          <div className="relative z-10 self-start">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg">
              <Zap size={14} className="text-[#38BDF8]" />
              <span>{currentTestimonial.vehicle}</span>
              <span className="text-white/40">•</span>
              <span className="text-[#22C55E]">{currentTestimonial.badge}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/80 font-mono text-[11px]">
                {currentTestimonial.highlight}
              </span>
            </div>
          </div>

          {/* Bottom Testimonial Floating Glassmorphism Card */}
          <div className="relative z-10">
            <div className="bg-black/45 backdrop-blur-xl border border-white/20 rounded-3xl p-6 xl:p-8 text-white shadow-[0_16px_40px_rgba(0,0,0,0.3)] space-y-4">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-[#F59E0B]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-sm">
                    ★
                  </span>
                ))}
              </div>

              {/* Animated Quote */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <p className="text-base xl:text-lg font-medium leading-relaxed text-white/95">
                    &ldquo;{currentTestimonial.quote}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h4 className="font-extrabold text-sm xl:text-base text-white">
                        {currentTestimonial.author}
                      </h4>
                      <p className="text-xs text-white/80 font-medium">
                        {currentTestimonial.role}
                      </p>
                    </div>

                    {/* Navigation Carousel Arrows */}
                    <div className="flex items-center gap-2">
                      {/* Slide Indicator Dots */}
                      <div className="flex items-center gap-1.5 mr-2">
                        {testimonials.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setTestimonialIdx(i)}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              i === testimonialIdx
                                ? "w-5 bg-white"
                                : "w-1.5 bg-white/40 hover:bg-white/70"
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handlePrevTestimonial}
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-colors cursor-pointer"
                        aria-label="Previous transit story"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextTestimonial}
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-colors cursor-pointer"
                        aria-label="Next transit story"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

  // =========================================================================
  // 2. MODAL CARD LAYOUT (Used when opened inside AuthModal dialog)
  // =========================================================================
  return (
    <div className="relative w-full max-w-[980px] bg-white rounded-[32px] sm:rounded-[36px] shadow-[0_24px_70px_rgba(25,40,65,0.22)] border border-[#E2E8F0] overflow-hidden p-6 sm:p-8 md:p-10 transition-all">
      {/* Full-Screen Branded Univa Loading Animation on Auth Completion */}
      {isSuccess && (
        <LoadingAnimation
          loop={false}
          loopDuration={2.6}
          zIndex="z-[9999]"
          message={`Welcome, ${successUser?.name || "Rider"}!`}
          subMessage={
            mode === "signup"
              ? "Your Rider Account has been created • Initializing Univa Pass..."
              : "You have logged in successfully • Initializing live transit telemetry..."
          }
          onComplete={() => {
            if (onClose) {
              onClose();
            } else {
              router.push(redirect);
            }
          }}
        />
      )}
      {/* Optional Close Button for Modals */}
      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 z-30 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        
        {/* LEFT COLUMN: THE FORM SIDE */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-6">
          
          {/* Official Univa Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Univa Logo"
              width={120}
              height={38}
              priority
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success-modal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#22C55E]/15 text-[#22C55E] mx-auto flex items-center justify-center shadow-xs">
                  <Check size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-[#0F172A]">
                    Welcome, {successUser?.name}!
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    {mode === "signup"
                      ? "Your Rider Account has been created."
                      : "You have logged in successfully."}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#192841]/10 text-[#192841] text-xs font-semibold">
                  <span>Redirecting to journey control...</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === "signup" ? -14 : 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "signup" ? 14 : -14 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                {/* Header Titles */}
                <div className="space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                    {mode === "signup" ? "Create an account" : "Welcome back"}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {mode === "signup"
                      ? "Start exploring and utilizing all the resources that will help you elevate every journey you make."
                      : "Log in to your Univa rider account to access live transit routes, passes, and telemetry."}
                  </p>
                </div>

                {/* Form Input Fields */}
                <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                  {mode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1"
                    >
                      <label className="block text-xs font-bold text-[#0F172A]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] focus:bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#192841] focus:ring-2 focus:ring-[#192841]/15 transition-all"
                      />
                    </motion.div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#0F172A]">
                      {mode === "signup" ? "Email Address" : "Email or Username"}
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        mode === "signup" ? "Your email" : "Enter username or email"
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] focus:bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#192841] focus:ring-2 focus:ring-[#192841]/15 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#0F172A]">
                        Password
                      </label>
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={() => handleAuthSuccess("Recovered Rider")}
                          className="text-[11px] text-[#64748B] hover:text-[#192841] hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                          mode === "signup"
                            ? "Create a password"
                            : "Enter your password"
                        }
                        className="w-full px-4 py-3 pr-11 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] focus:bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#192841] focus:ring-2 focus:ring-[#192841]/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#192841] p-1 transition-colors cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl sm:rounded-2xl bg-[#192841] hover:bg-[#111C2E] u-btn text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>
                        {mode === "signup" ? "Create Account" : "Sign In to Univa"}
                      </span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>

                <div className="relative flex items-center justify-center pt-1">
                  <div className="w-full border-t border-[#E2E8F0]" />
                  <span className="absolute bg-white px-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider u-mono">
                    OR
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleAuthSuccess("Google Rider", "google.rider@univa.com")
                    }
                    className="py-2.5 px-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 transition-all flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer group"
                    aria-label="Sign in with Google"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleAuthSuccess("Apple Rider", "apple.rider@univa.com")
                    }
                    className="py-2.5 px-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 transition-all flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer group"
                    aria-label="Sign in with Apple"
                  >
                    <svg
                      className="w-5 h-5 text-black"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.4c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.83-1 2.94 1.07.08 2.15-.55 2.81-1.34z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleAuthSuccess("Facebook Rider", "fb.rider@univa.com")
                    }
                    className="py-2.5 px-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 transition-all flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer group"
                    aria-label="Sign in with Facebook"
                  >
                    <svg
                      className="w-5 h-5 text-[#1877F2]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                </div>

                <div className="pt-2 text-center text-xs text-[#64748B]">
                  {mode === "signup" ? (
                    <p>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="font-bold text-[#192841] hover:underline cursor-pointer"
                      >
                        Sign in
                      </button>
                    </p>
                  ) : (
                    <p>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="font-bold text-[#192841] hover:underline cursor-pointer"
                      >
                        Sign up
                      </button>
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-[11px] text-[#94A3B8] text-center pt-2">
            Prototype mode active • Any credentials will authenticate instantly
          </div>
        </div>

        {/* RIGHT COLUMN: THE SHOWCASE CARD WITH TRANSIT IMAGE */}
        <div className="md:col-span-6 relative rounded-[28px] sm:rounded-[32px] overflow-hidden p-6 sm:p-7 flex flex-col justify-between min-h-[460px] sm:min-h-[520px] shadow-inner">
          {/* Dynamic Background Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.image}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-0"
            >
              <Image
                src={currentTestimonial.image}
                alt={currentTestimonial.vehicle}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-[#192841]/55" />
            </motion.div>
          </AnimatePresence>

          {/* Top Pill Tags */}
          <div className="relative z-10 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white tracking-wide shadow-xs">
              {currentTestimonial.tag1}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white tracking-wide shadow-xs">
              {currentTestimonial.tag2}
            </span>
          </div>

          {/* Floating Testimonial Quote Box */}
          <div className="relative z-10 pt-16">
            <div className="relative bg-black/45 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6 text-white shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <p className="text-base sm:text-lg font-medium leading-relaxed text-white/95">
                    &ldquo;{currentTestimonial.quote}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white">
                        {currentTestimonial.author}
                      </h4>
                      <p className="text-xs text-white/80 font-medium">
                        {currentTestimonial.role}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 shadow-md">
                      <button
                        type="button"
                        onClick={handlePrevTestimonial}
                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/20 text-white transition-colors cursor-pointer"
                        aria-label="Previous story"
                      >
                        <ArrowLeft size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextTestimonial}
                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/20 text-white transition-colors cursor-pointer"
                        aria-label="Next story"
                      >
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
