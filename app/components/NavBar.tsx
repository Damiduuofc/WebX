"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import AuthModal from "./AuthModal";

const navItems = ["Home", "Live Route"];

const getHref = (item: string) => {
  switch (item) {
    case "Home":
      return "/";
    case "Live Route":
      return "/smartmetro";
    default:
      return "/";
  }
};

export default function Navbar() {
  const pathname = usePathname();
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const checkUser = () => {
      try {
        const stored = localStorage.getItem("univa_user");
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener("univa_auth_change", checkUser);
    window.addEventListener("storage", checkUser);
    return () => {
      window.removeEventListener("univa_auth_change", checkUser);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("univa_user");
      window.dispatchEvent(new Event("univa_auth_change"));
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const activeTab =
   
       pathname === "/smartmetro" || pathname.startsWith("/smartmetro") || pathname === "/liveroute" || pathname.startsWith("/liveroute")
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

  return (
    <>
      <style>{`
        .nv-tab:focus-visible,
        .nv-auth-btn:focus-visible,
        .nv-burger:focus-visible {
          outline: 2px solid rgba(85, 0, 0, 0.3);
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
            boxShadow: "0 4px 20px rgba(85, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
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
              background: "rgba(85, 0, 0, 0.04)",
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
                background: "#72222B",
                boxShadow: "0 2px 8px rgba(114, 34, 43, 0.25)",
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
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "#72222B";
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
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#72222B",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    boxShadow: "0 2px 8px rgba(114, 34, 43, 0.2)",
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
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
                <button
                  type="button"
                  onClick={() => setAuthModal("login")}
                  className="nv-auth-btn"
                  style={{
                    padding: "7px 16px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0F172A",
                    cursor: "pointer",
                    border: "1px solid #D6DAE3",
                    background: "#FFFFFF",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#72222B";
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
                    background: "#72222B",
                    boxShadow: "0 2px 8px rgba(114, 34, 43, 0.2)",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#5B1B22";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#72222B";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Sign Up
                </button>
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
                border: "1px solid #D6DAE3",
                boxShadow: "0 12px 32px rgba(85, 0, 0, 0.12)",
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
                    background: activeTab === item ? "#72222B" : "transparent",
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

              {user ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "6px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#72222B",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {(user.name || user.email || "U").slice(0, 1).toUpperCase()}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                        {user.name || "Explorer"}
                      </span>
                      <span style={{ fontSize: 11, color: "#5A6B85" }}>
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
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
                      color: "#0F172A",
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
                      background: "#72222B",
                      cursor: "pointer",
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
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
        background: "rgba(114, 34, 43, 0.04)",
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
              background: "#72222B",
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