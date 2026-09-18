"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import Step1Search from "./Step1Search";
import Step2RouteDetails from "./Step2RouteDetails";
import Step3Payment from "./Step3Payment";
import Step4LiveTrip from "./Step4LiveTrip";
import Step5ArrivalFeedback from "./Step5ArrivalFeedback";
import {
  JourneyOption,
  DEFAULT_JOURNEY_KDU_TO_AIRPORT,
  JourneyPreference,
  PresetDestination,
  UserTransitWallet,
  INITIAL_WALLET,
} from "./journeyData";

interface JourneyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: 1 | 2 | 3 | 4 | 5;
  initialDestination?: string;
}

export default function JourneyPlanModal({
  isOpen,
  onClose,
  initialStep = 1,
  initialDestination = "Bandaranaike International Airport (BIA)",
}: JourneyPlanModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(initialStep);
  const [fromLocation, setFromLocation] = useState("KDU, Ratmalana");
  const [toLocation, setToLocation] = useState(initialDestination);
  const [selectedPreference, setSelectedPreference] = useState<JourneyPreference>("fastest");
  const [activePlan, setActivePlan] = useState<JourneyOption>(DEFAULT_JOURNEY_KDU_TO_AIRPORT);
  const [wallet, setWallet] = useState<UserTransitWallet>(INITIAL_WALLET);

  if (!isOpen) return null;

  const handleSelectRecentDestination = (dest: PresetDestination) => {
    setToLocation(dest.address);
    setActivePlan(dest.defaultPlan);
    setCurrentStep(2);
  };

  const handleProceedToDetails = (selectedPlan?: JourneyOption) => {
    if (selectedPlan) {
      setActivePlan({
        ...selectedPlan,
        from: fromLocation,
        to: toLocation,
      });
    } else {
      setActivePlan((prev) => ({
        ...prev,
        from: fromLocation,
        to: toLocation,
      }));
    }
    setCurrentStep(2);
  };

  const handleStartJourneyPayment = (selectedPlan: JourneyOption) => {
    setActivePlan(selectedPlan);
    setCurrentStep(3);
  };

  const handlePaymentCompleted = (
    finalPlan: JourneyOption,
    updatedWallet: UserTransitWallet
  ) => {
    setActivePlan(finalPlan);
    setWallet(updatedWallet);
    setCurrentStep(4);
  };

  const handleTripAutoCompleted = () => {
    setCurrentStep(5);
  };

  const handleDone = () => {
    setCurrentStep(1);
    onClose();
  };

  const handlePlanAnother = () => {
    setCurrentStep(1);
  };

  const stepLabels = [
    "Search & Available Vehicles",
    "Route Details & Timeline",
    "Payment & Pass",
    "Live Trip Tracking",
    "Arrival & Feedback",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      
      {/* ========================================================================= */}
      {/* CONTENT-FIRST CENTERED MODAL CONTAINER (SPACIOUS, CALM, AND CLEAR)        */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 12 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative w-full max-w-[860px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#72222B] text-white flex items-center justify-center font-black text-sm shadow-sm">
              U
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#0F172A] tracking-tight block">
                Univa Journey Planner
              </span>
              <div className="flex items-center gap-2 text-xs text-[#5A6B85]">
                <span className="font-bold text-[#72222B]">Step {currentStep} of 5: {stepLabels[currentStep - 1]}</span>
                <span>•</span>
                <span className="text-[#2E7D5B] font-semibold">💎 {wallet.pointsBalance} pts</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Step Breadcrumb Indicators */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#D6DAE3] shadow-xs">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    s === currentStep
                      ? "bg-[#72222B] scale-125 shadow-xs"
                      : s < currentStep
                      ? "bg-[#2E7D5B]"
                      : "bg-[#D6DAE3]"
                  }`}
                />
              ))}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <Step1Search
                  fromLocation={fromLocation}
                  setFromLocation={setFromLocation}
                  toLocation={toLocation}
                  setToLocation={setToLocation}
                  selectedPreference={selectedPreference}
                  setSelectedPreference={setSelectedPreference}
                  onSelectRecentDestination={handleSelectRecentDestination}
                  onProceedToDetails={handleProceedToDetails}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <Step2RouteDetails
                  journeyPlan={activePlan}
                  onBack={() => setCurrentStep(1)}
                  onStartJourney={handleStartJourneyPayment}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <Step3Payment
                  journeyPlan={activePlan}
                  onBack={() => setCurrentStep(2)}
                  onPaymentComplete={handlePaymentCompleted}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <Step4LiveTrip
                  journeyPlan={activePlan}
                  onTripAutoCompleted={handleTripAutoCompleted}
                  onReroute={() => setCurrentStep(1)}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18 }}
              >
                <Step5ArrivalFeedback
                  journeyPlan={activePlan}
                  onDone={handleDone}
                  onPlanAnother={handlePlanAnother}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
