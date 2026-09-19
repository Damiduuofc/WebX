import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface FlowHeaderProps {
  backHref: string;
  backTitle: string;
  title: string;
  /** e.g. "Step 2 of 4" */
  step: string;
  subtitle: React.ReactNode;
  /** Live status shown as a pulsing pill on the right. */
  status: string;
}

/**
 * The header shared by every step of the journey flow (plan, itinerary, live
 * trip), so the steps look and behave identically.
 */
export default function FlowHeader({ backHref, backTitle, title, step, subtitle, status }: FlowHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#192841] text-[#0F172A] transition-all u-surface"
          title={backTitle}
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight u-title">{title}</h1>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#192841]/10 text-[#192841] text-xs font-bold">
              {step}
            </span>
          </div>
          <div className="u-accent-line w-14 my-1.5" />
          <p className="text-xs sm:text-sm text-[#64748B]">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
        <span className="u-pulse-dot" style={{ "--pulse-color": "#22C55E" } as React.CSSProperties} />
        <span>{status}</span>
      </div>
    </div>
  );
}
