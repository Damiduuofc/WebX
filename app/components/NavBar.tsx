"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/auth";

const navItems = ["Home", "Plan Journey", "Live Route"];

const getHref = (item: string) => {
  switch (item) {
    case "Home":
      return "/";
    case "Plan Journey":
      return "/preferences";
    case "Live Route":
      return "/smartmetro";
    default:
      return "/";
  }
};

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});
  const [menuOpen, setMenuOpen] = useState(false);

  const activeTab =
    pathname.startsWith("/preferences") || pathname.startsWith("/journey-plan")
      ? "Plan Journey"
      : pathname.startsWith("/live-journey") ||
        pathname.startsWith("/liveroute") ||
        pathname.startsWith("/smartmetro") ||
        pathname.startsWith("/complete") ||
        pathname.startsWith("/feedback")
      ? "Live Route"
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

  // Dedicated full-screen auth screens provide their own navigation and logo
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <>
      <style>{`
        .nv-tab:focus-visible,
        .nv-auth-btn:focus-visible,
        .nv-burger:focus-visible {
          outline: 2px solid rgba(25, 40, 65, 0.35);
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
          className="u-nav"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "960px",
            margin: "0 auto",
            padding: "10px 18px",
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.94)",
            border: "1px solid rgba(226, 232, 240, 0.9)",
            boxShadow: "0 0 0 1px rgba(25, 40, 65, 0.03), 0 8px 28px -8px rgba(25, 40, 65, 0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
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
              background: "rgba(25, 40, 65, 0.05)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              position: "relative",
            }}
          >
            {/* Animated solid Deep Navy slider */}
            <div
              aria-hidden="true"
              className="nv-slider"
              style={{
                position: "absolute",
                top: 3,
                bottom: 3,
                borderRadius: 999,
                background: "#192841",
                boxShadow: "0 2px 10px rgba(25, 40, 65, 0.35)",
                transition:
                  "left 0.28s cubic-bezier(0.34,1.56,0.64,1), width 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
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
                    fontWeight: 600,
                    color: isActive ? "#FFFFFF" : "#64748B",
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
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "#64748B";
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
            {isAuthenticated && user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#192841",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    boxShadow: "0 2px 8px rgba(25, 40, 65, 0.25)",
                  }}
                >
                  {(user.name || "P").charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    color: "#EF4444",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    marginLeft: "4px",
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="nv-auth-btn"
                  style={{
                    padding: "7px 16px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0F172A",
                    cursor: "pointer",
                    border: "1px solid #E2E8F0",
                    background: "#FFFFFF",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#192841";
                    e.currentTarget.style.background = "#F7F9FC";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E2E8F0";
                    e.currentTarget.style.background = "#FFFFFF";
                  }}
                >
                  Log In
                </Link>

                <Link
                  href="/signup"
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
                    boxShadow: "0 2px 10px rgba(25, 40, 65, 0.3)",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#111C2E";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#192841";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Create Account
                </Link>
              </>
            )}
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
                border: "1px solid #E2E8F0",
                boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)",
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
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "block",
                    background: activeTab === item ? "#192841" : "transparent",
                    color: activeTab === item ? "#FFFFFF" : "#64748B",
                    transition: "background 0.2s ease",
                  }}
                >
                  {item}
                </Link>
              ))}

              <div
                style={{
                  height: "1px",
                  background: "#E2E8F0",
                  margin: "8px 0",
                }}
              />

              {isAuthenticated && user ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "6px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#192841",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {(user.name || user.email || "P").slice(0, 1).toUpperCase()}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                        {user.name}
                      </span>
                      <span style={{ fontSize: 11, color: "#64748B" }}>
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#EF4444",
                      border: "1px solid #FCA5A5",
                      background: "#FEF2F2",
                      cursor: "pointer",
                      marginTop: 4,
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "8px", padding: "4px" }}>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      flex: 1,
                      padding: "9px 12px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0F172A",
                      border: "1px solid #E2E8F0",
                      background: "#FFFFFF",
                      cursor: "pointer",
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
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
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
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
        border: "1px solid #E2E8F0",
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