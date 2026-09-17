"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, X, Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthCardProps {
  initialMode?: "login" | "signup";
  onClose?: () => void;
  onSuccess?: (user: { name: string; email: string }) => void;
  isModal?: boolean;
}

const testimonials = [
  {
    quote: "Univa cut my daily commute across Colombo and KDU by 35%. The synchronized SkyRail and autonomous bus links feel seamless.",
    author: "Sara Bright",
    role: "Daily Commuter • KDU Scholar",
    tag1: "Autonomous Grid 2100",
    tag2: "Synchronized Rail",
  },
  {
    quote: "With step-free precision docking and instant TapPass, our faculty members travel between research hubs effortlessly.",
    author: "Dr. Priyantha K.",
    role: "Senior Researcher • Computing Faculty",
    tag1: "Step-Free Transit",
    tag2: "Digital TapPass",
  },
  {
    quote: "Hands-free voice routing with Tell Univa gives me real-time platform updates right before every interchange.",
    author: "Malik Perera",
    role: "Undergraduate Commuter",
    tag1: "AI Voice Co-Pilot",
    tag2: "Zero Emissions",
  },
];

export default function AuthCard({
  initialMode = "signup",
  onClose,
  onSuccess,
  isModal = false,
}: AuthCardProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successUser, setSuccessUser] = useState<{ name: string; email: string } | null>(null);

  const handleNextTestimonial = () => {
    setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

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

    setTimeout(() => {
      if (onClose) {
        onClose();
      } else {
        router.push("/");
      }
    }, 1100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthSuccess();
  };

  const currentTestimonial = testimonials[testimonialIdx];

  return (
    <div className="relative w-full max-w-[980px] bg-white rounded-[32px] sm:rounded-[36px] shadow-[0_24px_70px_rgba(25,40,65,0.18)] border border-[#E2E8F0] overflow-hidden p-6 sm:p-8 md:p-10 transition-all">
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
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: THE FORM SIDE (Matches uploaded photo layout)                 */}
        {/* ========================================================================= */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-6">
          
          {/* Top Brand Spark Icon */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#72222B] text-white flex items-center justify-center shadow-sm">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#72222B]">
              Univa 2100
            </span>
          </div>

          {/* Form Content with Seamless Framer Motion Animation */}
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#2E7D5B]/15 text-[#2E7D5B] mx-auto flex items-center justify-center shadow-xs">
                  <Check size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-[#0F172A]">
                    Welcome, {successUser?.name}!
                  </h3>
                  <p className="text-sm text-[#5A6B85]">
                    {mode === "signup" ? "Your Rider Account has been created." : "You have logged in successfully."}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#72222B]/10 text-[#72222B] text-xs font-semibold">
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
                  <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                    {mode === "signup" ? "Create an account" : "Welcome back"}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {mode === "signup"
                      ? "Start exploring and utilizing all the resources that will help you elevate every journey you make."
                      : "Log in to your Univa rider account to access live transit routes, passes, and telemetry."}
                  </p>
                </div>

                {/* Form Input Fields */}
                <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                  {/* Name field (Only for Sign Up, seamlessly animated) */}
                  {mode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1"
                    >
                      <label className="block text-xs font-bold text-[#0F172A]">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#72222B] focus:ring-2 focus:ring-[#72222B]/15 transition-all"
                      />
                    </motion.div>
                  )}

                  {/* Email / Username field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#0F172A]">
                      {mode === "signup" ? "Email" : "Email or Username"}
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={mode === "signup" ? "Your email" : "Enter username or email"}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#72222B] focus:ring-2 focus:ring-[#72222B]/15 transition-all"
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
                          className="text-[11px] text-[#5A6B85] hover:text-[#72222B] hover:underline cursor-pointer"
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
                        placeholder={mode === "signup" ? "Create a password" : "Enter your password"}
                        className="w-full px-4 py-3 sm:py-3.5 pr-11 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#72222B] focus:ring-2 focus:ring-[#72222B]/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#72222B] transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Primary CTA Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl bg-[#72222B] hover:bg-[#5B1B22] text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{mode === "signup" ? "Create account" : "Sign in to Univa"}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>

                {/* OR Divider Line */}
                <div className="relative flex items-center justify-center pt-2">
                  <div className="w-full border-t border-[#E2E8F0]" />
                  <span className="absolute bg-white px-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    OR
                  </span>
                </div>

                {/* Social Login 3-Button Row (Google, Facebook, Apple) */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-1">
                  {/* Google Button */}
                  <button
                    type="button"
                    onClick={() => handleAuthSuccess("Google Rider", "google.rider@univa.com")}
                    className="py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white hover:bg-slate-50 transition-all flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer group"
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

                  {/* Facebook Button */}
                  <button
                    type="button"
                    onClick={() => handleAuthSuccess("Facebook Rider", "fb.rider@univa.com")}
                    className="py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white hover:bg-slate-50 transition-all flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer group"
                    aria-label="Sign in with Facebook"
                  >
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>

                  {/* Apple Button */}
                  <button
                    type="button"
                    onClick={() => handleAuthSuccess("Apple Rider", "apple.rider@univa.com")}
                    className="py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white hover:bg-slate-50 transition-all flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer group"
                    aria-label="Sign in with Apple"
                  >
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.4c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.83-1 2.94 1.07.08 2.15-.55 2.81-1.34z" />
                    </svg>
                  </button>
                </div>

                {/* Bottom Toggle Switcher */}
                <div className="pt-2 text-center text-xs text-[#64748B]">
                  {mode === "signup" ? (
                    <p>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="font-bold text-[#72222B] hover:underline cursor-pointer"
                      >
                        Log in
                      </button>
                    </p>
                  ) : (
                    <p>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="font-bold text-[#72222B] hover:underline cursor-pointer"
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

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: THE SHOWCASE CARD (Matches uploaded photo aesthetics)       */}
        {/* ========================================================================= */}
        <div className="md:col-span-6 relative rounded-[28px] sm:rounded-[32px] overflow-hidden p-6 sm:p-7 flex flex-col justify-between min-h-[460px] sm:min-h-[520px] shadow-inner">
          {/* Rich warm liquid gradient backdrop matching photo */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#E27D60] via-[#C3523B] to-[#7E2919] z-0 pointer-events-none" />
          
          {/* Fluid Ambient Light Contours */}
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#FFBE98]/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#F4A261]/30 blur-3xl pointer-events-none" />
          
          {/* Subtle diagonal highlight wave */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.25)_0%,_transparent_70%)] pointer-events-none" />

          {/* Top Pill Tags / Filter Chips */}
          <div className="relative z-10 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/30 text-[11px] font-semibold text-white tracking-wide transition-colors shadow-xs">
              {currentTestimonial.tag1}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/30 text-[11px] font-semibold text-white tracking-wide transition-colors shadow-xs">
              {currentTestimonial.tag2}
            </span>
          </div>

          {/* Floating Testimonial Quote Box with Cutout Navigation Controls */}
          <div className="relative z-10 pt-16">
            <div className="relative bg-white/20 backdrop-blur-xl border border-white/35 rounded-3xl p-5 sm:p-6 text-white shadow-[0_12px_32px_rgba(0,0,0,0.16)]">
              {/* Quote text with animated transitions */}
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

                    {/* Integrated Carousel Arrow Controls */}
                    <div className="flex items-center gap-1.5 bg-white rounded-2xl p-1.5 shadow-md">
                      <button
                        type="button"
                        onClick={handlePrevTestimonial}
                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 text-[#0F172A] transition-colors cursor-pointer"
                        aria-label="Previous story"
                      >
                        <ArrowLeft size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextTestimonial}
                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 text-[#0F172A] transition-colors cursor-pointer"
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
