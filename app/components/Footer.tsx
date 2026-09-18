"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Full-screen auth pages have their own dedicated footer/layout
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/register"
  ) {
    return null;
  }

  const wordmarkParts = [
    "UNIVA RIDER",
    "URBAN TRANSIT",
    "JOURNEY PLANNER",
    " MOBILITY",
  ];

  return (
    <footer className="relative w-full bg-[#192841] text-white pt-14 md:pt-20 pb-0 overflow-hidden font-sans border-t border-white/10 mt-20">
      {/* Top Section: Logo/Description + Links Grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16">
        
        {/* Left Column (Brand Logo & Mission) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="flex items-center gap-3 select-none shrink-0">
            <div className="p-2 rounded-xl bg-white flex items-center justify-center shadow-md">
              <Image
                src="/logo.png"
                alt="UNIVA"
                width={100}
                height={36}
                className="h-9 w-auto object-contain"
              />
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
            Streamlining urban commuting through radical clarity and precision.
          </h3>
          <p className="text-[#D6DAE3]/80 text-sm leading-relaxed max-w-sm font-normal">
            UNIVA empowers transit riders with real-time route telemetry, multimodal schedules, live delay alerts, and distraction-free journey guidance.
          </p>


        </div>

        {/* Right Columns Grid: Spans 8 Columns */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1: Quick Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-white/60 font-semibold uppercase text-[11px] tracking-wider">
              Quick Links
            </h4>
            <ul className="flex flex-col space-y-2.5">
              {[
                { name: "Home", href: "/" },
                { name: "Live Route (SmartMetro)", href: "/smartmetro" },
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
                { name: "Commuter Pass", href: "/#pass" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[#D6DAE3] hover:text-white transition-colors text-sm font-normal flex items-center gap-1 group"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Transit Network */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-white/60 font-semibold uppercase text-[11px] tracking-wider">
              Transit Modes
            </h4>
            <ul className="flex flex-col space-y-2.5 text-sm text-[#D6DAE3]">
              <li className="hover:text-white transition-colors cursor-pointer">Metro Rail (Blue Line)</li>
              <li className="hover:text-white transition-colors cursor-pointer">City Bus Express (138 / 120)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Commuter Feeder Shuttles</li>
              <li className="hover:text-white transition-colors cursor-pointer">Airport SkyRail Link</li>
              <li className="hover:text-white transition-colors cursor-pointer">Pedestrian Protected Ways</li>
            </ul>
          </div>

          {/* Column 3: Rider Support & Dispatch */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-white/60 font-semibold uppercase text-[11px] tracking-wider">
              Rider Dispatch
            </h4>
            <ul className="flex flex-col space-y-2.5 text-sm text-[#D6DAE3]">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#D6DAE3] shrink-0" />
                <a
                  href="mailto:rider-support@univa.com"
                  className="hover:text-white transition-colors break-all"
                >
                  rider-support@univa.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#D6DAE3] shrink-0" />
                <a href="tel:+94112003344" className="hover:text-white transition-colors">
                  +94 11 200 3344
                </a>
              </li>
              <li className="flex items-start gap-2 text-xs leading-relaxed text-[#D6DAE3]/80 pt-1">
                <MapPin size={14} className="text-[#D6DAE3] shrink-0 mt-0.5" />
                <span>Central Transit Hub, Station Concourse L2, Colombo.</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Commuter Community & Social */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-white/60 font-semibold uppercase text-[11px] tracking-wider">
              Network Social
            </h4>
            <ul className="flex flex-col space-y-2.5">
              {["X", "LinkedIn", "Community Forum", "App Store", "Google Play"].map((social) => (
                <li key={social}>
                  <a
                    href="#"
                    className="text-[#D6DAE3] hover:text-white transition-colors text-sm font-normal"
                  >
                    {social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Horizontal Divider Line */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 w-full h-[1px] bg-white/10" />

      {/* Middle Row: Copyright & Design Credit */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#D6DAE3]/70 font-normal">
        <p>© 2026 UNIVA Transit Systems Inc. All commuter rights reserved.</p>
        <p className="flex items-center gap-3">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer transition-colors">Commuter Charter</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer transition-colors">Accessibility</span>
        </p>
      </div>

      {/* Massive Faded Background Wordmark at bottom with smooth pure CSS animation */}
      <div
        aria-hidden="true"
        className="relative w-full overflow-hidden h-[75px] sm:h-[100px] md:h-[130px] lg:h-[160px] xl:h-[190px] select-none pointer-events-none flex items-end pb-2"
      >
        <div className="animate-marquee">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-12 sm:gap-16 md:gap-24 pr-12 sm:pr-16 md:pr-24">
              {wordmarkParts.map((word, idx) => (
                <h2
                  key={idx}
                  className="text-[14vw] sm:text-[15vw] font-black tracking-tighter uppercase leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white/12 to-white/0 whitespace-nowrap"
                >
                  {word}
                </h2>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
