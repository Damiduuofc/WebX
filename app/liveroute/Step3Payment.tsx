"use client";

import React, { useState } from "react";
import {
  Coins,
  CreditCard,
  QrCode,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { JourneyOption, INITIAL_WALLET, UserTransitWallet } from "./journeyData";

interface Step3PaymentProps {
  journeyPlan: JourneyOption;
  onBack: () => void;
  onPaymentComplete: (finalPlan: JourneyOption, updatedWallet: UserTransitWallet) => void;
}

export default function Step3Payment({
  journeyPlan,
  onBack,
  onPaymentComplete,
}: Step3PaymentProps) {
  const [wallet, setWallet] = useState<UserTransitWallet>(INITIAL_WALLET);
  const [selectedMethod, setSelectedMethod] = useState<"points" | "nfc" | "qr">("points");
  const [hasStudentConcession, setHasStudentConcession] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [topupFeedback, setTopupFeedback] = useState<string | null>(null);

  const discount = hasStudentConcession ? 0.8 : 1.0;
  const fareLkr = Math.round(journeyPlan.fareLkr * discount);
  const farePts = Math.round(journeyPlan.farePoints * discount);

  const remainingBalance = wallet.pointsBalance - farePts;
  const canAfford = remainingBalance >= 0;

  const handleTopup = (amt: number) => {
    const newBal = wallet.pointsBalance + amt;
    setWallet((prev) => ({
      ...prev,
      pointsBalance: newBal,
    }));
    setTopupFeedback(`+${amt} Points Added (Balance: ${newBal} pts)`);
    setTimeout(() => setTopupFeedback(null), 3000);
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const finalWallet = { ...wallet };
      if (selectedMethod === "points") {
        finalWallet.pointsBalance = remainingBalance;
      }
      setIsProcessing(false);
      onPaymentComplete({ ...journeyPlan, fareLkr, farePoints: farePts }, finalWallet);
    }, 800);
  };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Payment & Digital Pass
            </h2>
            <p className="text-xs text-slate-500">
              Select your payment method
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
          Encrypted
        </span>
      </div>

      {/* Topup Notification */}
      {topupFeedback && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-600" />
          <span>{topupFeedback}</span>
        </div>
      )}

      {/* Summary Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#D6DAE3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <strong className="text-sm font-bold text-[#0F172A] block">{journeyPlan.title}</strong>
            <span className="text-xs text-[#5A6B85]">{journeyPlan.from} → {journeyPlan.to}</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-extrabold text-[#192841] block">LKR {fareLkr}</span>
            <span className="text-xs text-[#5A6B85]">({farePts} pts)</span>
          </div>
        </div>

        <label className="flex items-center gap-2 pt-2 border-t border-[#D6DAE3]/60 text-xs text-[#5A6B85] cursor-pointer">
          <input
            type="checkbox"
            checked={hasStudentConcession}
            onChange={(e) => setHasStudentConcession(e.target.checked)}
            className="w-4 h-4 text-[#192841] rounded border-[#D6DAE3] focus:ring-[#192841]"
          />
          <span className="font-semibold text-[#0F172A]">Student / Senior Concession (20% Off)</span>
        </label>
      </div>

      {/* Payment Options */}
      <div className="space-y-2.5">
        
        {/* 1. POINTS WALLET */}
        <div
          onClick={() => setSelectedMethod("points")}
          className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
            selectedMethod === "points"
              ? "bg-white border-[#192841] ring-2 ring-[#192841]/15 shadow-md"
              : "bg-white hover:bg-[#F7F8FA] border-[#D6DAE3] hover:border-[#192841]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-sm font-bold text-[#0F172A] block">Univa Points Wallet</strong>
              <span className="text-xs text-[#5A6B85]">
                Balance: <strong className="text-[#0F172A]">{wallet.pointsBalance} pts</strong>
              </span>
            </div>

            <span className={`text-xs font-bold ${canAfford ? "text-[#2E7D5B]" : "text-red-500"}`}>
              {canAfford ? `After: ${remainingBalance} pts` : "Need Top-Up"}
            </span>
          </div>

          {/* Clean Top-up Chips */}
          <div className="mt-3 pt-3 border-t border-[#D6DAE3]/60 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[#5A6B85]">Quick Top-up:</span>
            <div className="flex items-center gap-2">
              {[100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTopup(amt);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#F7F8FA] hover:bg-[#192841] text-xs font-bold text-[#5A6B85] hover:text-white border border-[#D6DAE3] hover:border-[#192841] transition-all cursor-pointer shadow-2xs"
                >
                  +{amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. NFC PASS */}
        <div
          onClick={() => setSelectedMethod("nfc")}
          className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
            selectedMethod === "nfc"
              ? "bg-white border-[#192841] ring-2 ring-[#192841]/15 shadow-md"
              : "bg-white hover:bg-[#F7F8FA] border-[#D6DAE3] hover:border-[#192841]/40"
          }`}
        >
          <div>
            <strong className="text-xs font-bold text-[#0F172A] block">Digital Transit NFC Pass</strong>
            <span className="text-[11px] text-[#5A6B85] font-mono">{wallet.nfcCardNumber}</span>
          </div>
          <span className="text-xs font-bold text-[#192841] bg-[#192841]/10 px-2 py-0.5 rounded-full">Touch & Go</span>
        </div>

        {/* 3. LANKAPAY QR */}
        <div
          onClick={() => setSelectedMethod("qr")}
          className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
            selectedMethod === "qr"
              ? "bg-white border-[#192841] ring-2 ring-[#192841]/15 shadow-md"
              : "bg-white hover:bg-[#F7F8FA] border-[#D6DAE3] hover:border-[#192841]/40"
          }`}
        >
          <div>
            <strong className="text-xs font-bold text-[#0F172A] block">LankaPay Dynamic QR</strong>
            <span className="text-[11px] text-[#5A6B85]">Scan at station gate</span>
          </div>
          <span className="text-xs font-bold text-[#192841] bg-[#192841]/10 px-2 py-0.5 rounded-full">QR Scan</span>
        </div>
      </div>

      {/* Action CTA with website light sweep and shadow */}
      <div className="pt-2">
        <button
          type="button"
          disabled={(selectedMethod === "points" && !canAfford) || isProcessing}
          onClick={handlePay}
          className={`relative group w-full py-4 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 shadow-[0_8px_20px_-3px_rgba(25,40,65,0.35)] hover:shadow-[0_12px_26px_-3px_rgba(25,40,65,0.45)] hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer ring-2 ring-[#192841]/20 overflow-hidden ${
            selectedMethod === "points" && !canAfford
              ? "bg-[#D6DAE3] text-[#5A6B85] cursor-not-allowed shadow-none hover:translate-y-0"
              : "bg-[#192841] hover:bg-[#111C2E] text-white"
          }`}
        >
          {/* Dynamic Light Sweep Highlight on hover */}
          <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />
          
          {isProcessing ? (
            <span>Authorizing Pass & Payment...</span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Pay LKR {fareLkr} & Start Live Trip</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
