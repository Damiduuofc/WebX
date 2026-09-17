"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, Lock, Mail, X, Check } from "lucide-react";

const navItems = ["Home", "About Us", "Contact Us"];

const getHref = (item: string) => {
  switch (item) {
    case "Home":
      return "/";
    case "About Us":
      return "/about";
    case "Contact Us":
      return "/contact";
    default:
      return "/";
  }
};

export default function Navbar() {
  const pathname = usePathname();
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);

  const activeTab =
    pathname === "/about" || pathname.startsWith("/Aboutus")
      ? "About Us"
      : pathname === "/contact" || pathname.startsWith("/Contact")
      ? "Contact Us"
      : "Home";

  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSlider = useCallback(() => {
    const el = tabRefs.current[activeTab];
    const container = containerRef.current;
    if (!el || !container) {
      setSliderStyle({
        opacity: 0,
        width: 0,
      });
      return;
    }
    const cRect = container.getBoundingClientRect();
    const tRect = el.getBoundingClientRect();
    setSliderStyle({
      left: tRect.left - cRect.left,
      width: tRect.width,
      opacity: 1,
    });
  }, [activeTab]);

  useEffect(() => {
    updateSlider();
    const timer1 = setTimeout(updateSlider, 50);
    const timer2 = setTimeout(updateSlider, 200);

    window.addEventListener("resize", updateSlider);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("resize", updateSlider);
    };
  }, [updateSlider]);

  const handleKeyDown = (e: React.KeyboardEvent, item: string) => {
    const idx = navItems.indexOf(item);
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % navItems.length;
    else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + navItems.length) % navItems.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = navItems.length - 1;
    if (nextIdx !== null) {
      e.preventDefault();
      const nextItem = navItems[nextIdx];
      tabRefs.current[nextItem]?.focus();
    }
  };

  return (
    <>
      <style>{`
        .nv-tab:focus-visible,
        .nv-auth-btn:focus-visible,
        .nv-burger:focus-visible {
          outline: 2px solid rgba(25, 40, 65, 0.3);
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .nv-slider, .nv-tab, .nv-auth-btn, .nv-menu-panel { transition: none !important; }
        }
        @media (max-width: 768px) {
          .nv-tabstrip { display: none !important; }
          .nv-desktop-actions { display: none !important; }
          .nv-burger { display: inline-flex !important; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: "16px",
          left: "0",
          right: "0",
          zIndex: 50,
          padding: "0 16px",
          width: "100%",
          pointerEvents: "none",
        }}
      >
        <nav
          aria-label="Primary"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "960px",
            margin: "0 auto",
            padding: "10px 18px",
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.88)",
            border: "1px solid rgba(214, 218, 227, 0.8)",
            boxShadow: "0 4px 20px rgba(25, 40, 65, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            position: "relative",
            pointerEvents: "auto",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Home"
            onClick={() => setMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}
          >
            <Image
              src="/logo.png"
              alt="UNIVA"
              width={120}
              height={40}
              priority
              style={{
                height: "38px",
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>

          {/* Tab strip (desktop) */}
          <div
            ref={containerRef}
            className="nv-tabstrip"
            role="tablist"
            aria-label="Sections"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              padding: 3,
              borderRadius: 999,
              background: "rgba(25, 40, 65, 0.04)",
              border: "1px solid rgba(214, 218, 227, 0.6)",
              position: "relative",
            }}
          >
            {/* Animated solid navy slider */}
            <div
              aria-hidden="true"
              className="nv-slider"
              style={{
                position: "absolute",
                top: 3,
                bottom: 3,
                borderRadius: 999,
                background: "#192841",
                boxShadow: "0 2px 8px rgba(25, 40, 65, 0.25)",
                transition: "left 0.28s cubic-bezier(0.34,1.56,0.64,1), width 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
                pointerEvents: "none",
                zIndex: 0,
                ...sliderStyle,
              }}
            />

            {navItems.map((item) => {
              const isActive = activeTab === item;
              return (
                <Link
                  key={item}
                  ref={(el) => {
                    tabRefs.current[item] = el;
                  }}
                  href={getHref(item)}
                  role="tab"
                  aria-selected={isActive}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={isActive ? 0 : -1}
                  className="nv-tab"
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, item)}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    padding: "7px 18px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 550,
                    color: isActive ? "#FFFFFF" : "#5A6B85",
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "inline-block",
                    border: "none",
                    background: "none",
                    whiteSpace: "nowrap",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "#192841";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "#5A6B85";
                  }}
                >
                  {item}
                </Link>
              );
            })}
          </div>

          {/* Right side: Login & Sign Up buttons (desktop) */}
          <div
            className="nv-desktop-actions"
            style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}
          >
            <button
              type="button"
              onClick={() => setAuthModal("login")}
              className="nv-auth-btn"
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                color: "#192841",
                cursor: "pointer",
                border: "1px solid #D6DAE3",
                background: "#FFFFFF",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#192841";
                e.currentTarget.style.background = "#F7F8FA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#D6DAE3";
                e.currentTarget.style.background = "#FFFFFF";
              }}
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() => setAuthModal("signup")}
              className="nv-auth-btn"
              style={{
                padding: "7px 18px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                color: "#FFFFFF",
                cursor: "pointer",
                border: "none",
                background: "#192841",
                boxShadow: "0 2px 8px rgba(25, 40, 65, 0.2)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1E2E4D";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#192841";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Mobile hamburger button */}
          <BurgerButton open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />

          {/* Mobile dropdown menu */}
          {menuOpen && (
            <div
              className="nv-menu-panel"
              role="menu"
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                left: 0,
                borderRadius: 20,
                background: "rgba(255, 255, 255, 0.98)",
                border: "1px solid #D6DAE3",
                boxShadow: "0 12px 32px rgba(25, 40, 65, 0.12)",
                backdropFilter: "blur(20px)",
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                zIndex: 60,
              }}
            >
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={getHref(item)}
                  role="menuitem"
                  aria-current={activeTab === item ? "page" : undefined}
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "block",
                    background: activeTab === item ? "#192841" : "transparent",
                    color: activeTab === item ? "#FFFFFF" : "#5A6B85",
                    transition: "background 0.2s ease",
                  }}
                >
                  {item}
                </Link>
              ))}

              <div
                style={{
                  height: "1px",
                  background: "#D6DAE3",
                  margin: "8px 0",
                }}
              />

              <div style={{ display: "flex", gap: "8px", padding: "4px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModal("login");
                    setMenuOpen(false);
                  }}
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#192841",
                    border: "1px solid #D6DAE3",
                    background: "#FFFFFF",
                    cursor: "pointer",
                  }}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModal("signup");
                    setMenuOpen(false);
                  }}
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    border: "none",
                    background: "#192841",
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Auth Modal (Login / Sign Up) adhering strictly to Design.md Section 5.1 & 5.2 */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitchMode={(mode) => setAuthModal(mode)}
        />
      )}
    </>
  );
}

function BurgerButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="nv-burger"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      style={{
        display: "none",
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "1px solid #D6DAE3",
        background: "rgba(25, 40, 65, 0.04)",
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ position: "relative", width: 16, height: 12, display: "inline-block" }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: i * 5,
              width: 16,
              height: 2,
              borderRadius: 2,
              background: "#192841",
              transformOrigin: "center",
              transition: "transform 0.2s ease, opacity 0.2s ease, top 0.2s ease",
              transform: open
                ? i === 0
                  ? "translateY(5px) rotate(45deg)"
                  : i === 2
                  ? "translateY(-5px) rotate(-45deg)"
                  : "none"
                : "none",
              opacity: open && i === 1 ? 0 : 1,
            }}
          />
        ))}
      </span>
    </button>
  );
}

function AuthModal({
  mode,
  onClose,
  onSwitchMode,
}: {
  mode: "login" | "signup";
  onClose: () => void;
  onSwitchMode: (mode: "login" | "signup") => void;
}) {
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
            {mode === "login" ? "Welcome back to NEXA" : "Create your Rider Account"}
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
              Welcome aboard the NEXA transit network.
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
                <span>I agree to NEXA transit terms & privacy policy</span>
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