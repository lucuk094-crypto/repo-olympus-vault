"use client"

import { Star } from "lucide-react"
import Link from "next/link"

interface Props {
  href: string
  title: string
  poster: string
  score?: number | null
  badge?: string | null
  rank?: number | null
  sub?: string | null
}

export default function Poster({ href, title, poster, score, badge, rank, sub }: Props) {
  return (
    <Link href={href} className="vx-poster">
      <div className="vx-poster-thumb">
        <img src={poster || "/placeholder.svg"} alt={title} loading="lazy" decoding="async" />
        {rank != null && <span className="vx-poster-rank">{rank}</span>}
        {badge && <span className="vx-poster-badge">{badge}</span>}
        {score != null && score > 0 && (
          <span className="vx-poster-score">
            <Star size={10} fill="currentColor" /> {score.toFixed(1)}
          </span>
        )}
      </div>
      <div className="vx-poster-title">{title}</div>
      {sub && <div className="vx-poster-sub">{sub}</div>}
    </Link>
  )
}
