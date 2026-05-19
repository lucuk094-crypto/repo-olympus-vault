"use client"

interface Props { size?: number }

export default function BrandLogo({ size = 38 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="vxGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5d77a" />
          <stop offset="60%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#b8941f" />
        </linearGradient>
        <linearGradient id="vxMarble" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5f1e8" />
          <stop offset="100%" stopColor="#cdc5b1" />
        </linearGradient>
      </defs>
      {/* Outer circle (laurel border) */}
      <circle cx="32" cy="32" r="29" fill="#0a0e1a" stroke="url(#vxGold)" strokeWidth="2" />
      {/* Greek key meander pattern */}
      <g stroke="url(#vxGold)" strokeWidth="1.4" fill="none" opacity="0.55">
        <path d="M 8 32 H 12 V 28 H 16 V 36 H 12 V 32" />
        <path d="M 56 32 H 52 V 28 H 48 V 36 H 52 V 32" />
      </g>
      {/* Doric column shape forming a stylized "V" */}
      <g fill="url(#vxMarble)">
        {/* Capital top */}
        <rect x="20" y="14" width="24" height="3" rx="1" />
        {/* Column shaft (V converging) */}
        <path d="M 24 18 L 32 46 L 40 18 Z" opacity="0.95" />
        {/* Base */}
        <rect x="20" y="48" width="24" height="3" rx="1" />
      </g>
      {/* Center gold dot (Olympic flame) */}
      <circle cx="32" cy="32" r="3" fill="url(#vxGold)" />
    </svg>
  )
}
