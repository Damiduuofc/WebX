"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export default function Button({ href, className = "", children, ...props }: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isDisabled = props.disabled;

  const buttonStyle: React.CSSProperties = {
    flexShrink: 0,
    padding: '10px 24px',
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    border: 'none',
    background: isDisabled ? '#9CA3AF' : (hovered ? '#1E3A5F' : '#0A1F44'),
    boxShadow: isDisabled ? 'none' : '0 2px 8px rgba(10, 31, 68, 0.2)',
    transform: isDisabled ? 'none' : (pressed ? 'translateY(0) scale(0.98)' : hovered ? 'translateY(-1px)' : 'none'),
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    ...props.style,
  };

  const buttonElement = (
    <button
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
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
    const isAnchor = href.startsWith('#');
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

    if (isAnchor || isExternal) {
      return (
        <a href={href} style={{ textDecoration: 'none', display: 'inline-flex' }} className={className}>
          {buttonElement}
        </a>
      );
    }

    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'inline-flex' }} className={className}>
        {buttonElement}
      </Link>
    );
  }

  return buttonElement;
}
