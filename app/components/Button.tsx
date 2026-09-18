"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  className?: string;
  children: React.ReactNode;
  variant?: "primary" | "highlight" | "secondary" | "glass" | "outline";
}

export default function Button({
  href,
  className = "",
  children,
  variant = "primary",
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isDisabled = props.disabled;

  let bg = "#192841";
  let color = "#FFFFFF";
  let border = "none";
  let shadow = "0 2px 8px rgba(25, 40, 65, 0.18)";

  if (isDisabled) {
    bg = "#9CA3AF";
    shadow = "none";
  } else if (variant === "highlight") {
    bg = hovered ? "linear-gradient(135deg, #223454 0%, #192841 100%)" : "linear-gradient(135deg, #192841 0%, #111C2E 100%)";
    shadow = hovered
      ? "0 10px 24px rgba(25, 40, 65, 0.35)"
      : "0 6px 18px rgba(25, 40, 65, 0.25)";
    border = "1px solid rgba(255, 255, 255, 0.2)";
  } else if (variant === "secondary" || variant === "glass") {
    bg = hovered ? "#FFFFFF" : "rgba(255, 255, 255, 0.95)";
    color = "#192841";
    border = hovered ? "1.5px solid #192841" : "1.5px solid rgba(25, 40, 65, 0.2)";
    shadow = hovered ? "0 6px 16px rgba(25, 40, 65, 0.1)" : "0 2px 8px rgba(25, 40, 65, 0.05)";
  } else if (variant === "outline") {
    bg = hovered ? "rgba(25, 40, 65, 0.05)" : "transparent";
    color = "#192841";
    border = "1.5px solid #192841";
    shadow = "none";
  } else {
    // primary
    bg = hovered ? "#111C2E" : "#192841";
  }

  const buttonStyle: React.CSSProperties = {
    flexShrink: 0,
    padding: variant === "highlight" ? "12px 28px" : "10px 24px",
    borderRadius: 999,
    fontSize: variant === "highlight" ? 15 : 14,
    fontWeight: 600,
    color: color,
    cursor: isDisabled ? "not-allowed" : "pointer",
    border: border,
    background: bg,
    boxShadow: shadow,
    transform: isDisabled
      ? "none"
      : pressed
      ? "translateY(0) scale(0.98)"
      : hovered
      ? "translateY(-1.5px) scale(1.01)"
      : "none",
    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    ...props.style,
  };

  const buttonElement = (
    <button
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => !isDisabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={buttonStyle}
      className={`nv-join focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A1F44]/30 focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  if (href) {
    const isAnchor = href.startsWith("#");
    const isExternal =
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    if (isAnchor || isExternal) {
      return (
        <a
          href={href}
          style={{ textDecoration: "none", display: "inline-flex" }}
          className={className}
        >
          {buttonElement}
        </a>
      );
    }

    return (
      <Link
        href={href}
        style={{ textDecoration: "none", display: "inline-flex" }}
        className={className}
      >
        {buttonElement}
      </Link>
    );
  }

  return buttonElement;
}
