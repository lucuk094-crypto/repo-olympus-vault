"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Star, Play, Info as InfoIcon } from "lucide-react"

export interface HeroSlide {
  href: string
  title: string
  titleItalic?: string | null
  backdrop: string
  overview: string
  meta: string[]
  score?: number | null
}

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const router = useRouter()
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 7000)
    return () => clearInterval(t)
  }, [slides.length])

  if (slides.length === 0) return null
  const s = slides[idx]

  return (
    <div className="vx-hero" key={s.href}>
      <div
        className="vx-hero-bg"
        style={{ backgroundImage: `url(${s.backdrop})` }}
      />
      <div className="vx-hero-overlay" />
      <div className="vx-hero-content">
        <div className="vx-hero-eyebrow">Pilihan Editor</div>
        <h1 className="vx-hero-title">
          {s.title}
          {s.titleItalic && <> · <em>{s.titleItalic}</em></>}
        </h1>
        <div className="vx-hero-meta">
          {s.score != null && s.score > 0 && (
            <span style={{ color: "var(--gold)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Star size={12} fill="currentColor" /> {s.score.toFixed(1)}
            </span>
          )}
          {s.meta.map((m, i) => (
            <span key={i} className={i > 0 || s.score ? "vx-hero-meta-divider" : ""}>{m}</span>
          ))}
        </div>
        <p className="vx-hero-sub">{s.overview}</p>
        <div className="vx-hero-actions">
          <button className="vx-btn-primary" onClick={() => router.push(s.href)}>
            <Play size={14} fill="currentColor" /> Tonton
          </button>
          <button className="vx-btn-ghost" onClick={() => router.push(s.href)}>
            <InfoIcon size={14} /> Detail
          </button>
        </div>
      </div>
      {slides.length > 1 && (
        <div className="vx-hero-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`vx-hero-dot ${i === idx ? "active" : ""}`}
              onClick={() => setIdx(i)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
