"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthCard from "./AuthCard";

interface AuthModalProps {
  mode: "login" | "signup";
  onClose: () => void;
  onSwitchMode?: (mode: "login" | "signup") => void;
}

export default function AuthModal({
  mode,
  onClose,
}: AuthModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto"
      >
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0A1322]/60 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[980px] my-auto"
        >
          <AuthCard
            isModal={true}
            initialMode={mode}
            onClose={onClose}
            onSuccess={() => {
              // Handled internally in AuthCard
            }}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
