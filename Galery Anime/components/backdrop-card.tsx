"use client"

import Link from "next/link"

interface Props {
  href: string
  title: string
  backdrop: string
  sub?: string | null
}

export default function BackdropCard({ href, title, backdrop, sub }: Props) {
  return (
    <Link href={href} className="vx-backdrop-card">
      <div className="vx-backdrop-card-thumb">
        <img src={backdrop || "/placeholder.svg"} alt={title} loading="lazy" decoding="async" />
      </div>
      <div className="vx-backdrop-card-info">
        <div className="vx-backdrop-card-title">{title}</div>
        {sub && <div className="vx-backdrop-card-sub">{sub}</div>}
      </div>
    </Link>
  )
}
