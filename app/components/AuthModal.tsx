"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Lock, Mail, X, Check } from "lucide-react";

interface AuthModalProps {
  mode: "login" | "signup";
  onClose: () => void;
  onSwitchMode: (mode: "login" | "signup") => void;
}

export default function AuthModal({
  mode,
  onClose,
  onSwitchMode,
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#F7F8FA",
          borderRadius: "16px",
          padding: "32px 28px",
          boxShadow: "0 12px 40px rgba(25, 40, 65, 0.16)",
          border: "1px solid #D6DAE3",
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#5A6B85",
            padding: "4px",
            borderRadius: "8px",
          }}
        >
          <X size={20} />
        </button>

        {/* Logo and header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Image
            src="/logo.png"
            alt="UNIVA"
            width={140}
            height={48}
            style={{
              height: "48px",
              width: "auto",
              objectFit: "contain",
              margin: "0 auto 12px auto",
              display: "block",
            }}
          />
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#192841",
              margin: 0,
            }}
          >
            {mode === "login" ? "Welcome back to Univa" : "Create your Rider Account"}
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#5A6B85",
              marginTop: "4px",
              marginBottom: 0,
            }}
          >
            {mode === "login"
              ? "Access live journeys, saved passes, and routes"
              : "Smart transit planning tailored to your daily commute"}
          </p>
        </div>

        {submitted ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              color: "#2E7D5B",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(46, 125, 91, 0.12)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <Check size={24} color="#2E7D5B" />
            </div>
            <p style={{ fontWeight: 600, fontSize: "16px", margin: 0, color: "#192841" }}>
              {mode === "login" ? "Logged in successfully!" : "Account created successfully!"}
            </p>
            <p style={{ fontSize: "13px", color: "#5A6B85", marginTop: "4px" }}>
              Welcome aboard the Univa 2100 transit network.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {mode === "signup" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#192841",
                    marginBottom: "4px",
                  }}
                >
                  Full Name
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    required
                    placeholder="Alex Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 36px",
                      borderRadius: "12px",
                      border: "1px solid #D6DAE3",
                      background: "#FFFFFF",
                      fontSize: "14px",
                      color: "#000000",
                      outline: "none",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#192841")}
                    onBlur={(e) => (e.target.style.borderColor = "#D6DAE3")}
                  />
                  <User
                    size={16}
                    color="#5A6B85"
                    style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                  />
                </div>
              </div>
            )}

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#192841",
                  marginBottom: "4px",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  required
                  placeholder="alex.rider@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 36px",
                    borderRadius: "12px",
                    border: "1px solid #D6DAE3",
                    background: "#FFFFFF",
                    fontSize: "14px",
                    color: "#000000",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#192841")}
                  onBlur={(e) => (e.target.style.borderColor = "#D6DAE3")}
                />
                <Mail
                  size={16}
                  color="#5A6B85"
                  style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#192841",
                  }}
                >
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "12px",
                      color: "#192841",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 36px",
                    borderRadius: "12px",
                    border: "1px solid #D6DAE3",
                    background: "#FFFFFF",
                    fontSize: "14px",
                    color: "#000000",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#192841")}
                  onBlur={(e) => (e.target.style.borderColor = "#D6DAE3")}
                />
                <Lock
                  size={16}
                  color="#5A6B85"
                  style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                />
              </div>
            </div>

            {mode === "signup" && (
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: "#5A6B85",
                  cursor: "pointer",
                  marginTop: "2px",
                }}
              >
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ accentColor: "#192841", width: 14, height: 14 }}
                />
                <span>I agree to Univa transit terms & privacy policy</span>
              </label>
            )}

            <button
              type="submit"
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#FFFFFF",
                background: "#192841",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(25, 40, 65, 0.2)",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1E2E4D")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#192841")}
            >
              {mode === "login" ? "Login" : "Register Account"}
            </button>

            <div style={{ textAlign: "center", marginTop: "10px" }}>
              {mode === "login" ? (
                <p style={{ fontSize: "12px", color: "#5A6B85", margin: 0 }}>
                  New commuter?{" "}
                  <button
                    type="button"
                    onClick={() => onSwitchMode("signup")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#192841",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p style={{ fontSize: "12px", color: "#5A6B85", margin: 0 }}>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => onSwitchMode("login")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#192841",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    Log in here
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
