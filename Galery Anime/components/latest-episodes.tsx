"use client"

import { useEffect, useState } from "react"
import { Calendar, Play } from "lucide-react"
import { ytEmbed } from "@/lib/api/channels"

interface Ep {
  id: string
  title: string
  thumbnail: string
  published: string | null
  length: string | null
  views: string | null
  channelName: string
  channelType: string
  seriesKey: string
  seriesName: string
  seriesType: string
  ep: number | null
  url: string
}

const TYPES: { key: string; label: string }[] = [
  { key: "all",     label: "Semua" },
  { key: "anime",   label: "Anime" },
  { key: "donghua", label: "Donghua" },
  { key: "cdrama",  label: "C-Drama" },
  { key: "kdrama",  label: "K-Drama" },
  { key: "drama",   label: "Drama" },
]

export default function LatestEpisodes() {
  const [eps, setEps] = useState<Ep[]>([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState("all")
  const [active, setActive] = useState<Ep | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/latest-episodes?limit=24&type=${type}`, { cache: "force-cache" })
      .then((r) => r.json())
      .then((d) => setEps(d.episodes || []))
      .catch(() => setEps([]))
      .finally(() => setLoading(false))
  }, [type])

  return (
    <section className="vx-section">
      <div className="vx-section-head">
        <div className="vx-section-title-group">
          <div className="vx-section-eyebrow">
            <span style={{ color: "var(--gold)" }}>● </span>Update Terbaru
          </div>
          <h2 className="vx-section-title">Episode Terbaru</h2>
        </div>
      </div>

      {/* Type filter pills */}
      <div style={{
        display: "flex", gap: 6, flexWrap: "wrap",
        marginBottom: "1rem", paddingBottom: "0.5rem",
      }}>
        {TYPES.map((t) => {
          const isActive = type === t.key
          return (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              style={{
                padding: "0.4rem 0.85rem",
                background: isActive ? "var(--gold)" : "transparent",
                color: isActive ? "var(--bg)" : "var(--gold)",
                border: "1px solid var(--gold)",
                borderRadius: 4,
                fontFamily: "var(--serif)",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {loading && (
        <div style={{ color: "var(--text-3)", fontFamily: "var(--serif-italic)", textAlign: "center", padding: "2rem" }}>
          Memuat episode terbaru...
        </div>
      )}

      {!loading && eps.length === 0 && (
        <div style={{ color: "var(--text-3)", fontFamily: "var(--serif-italic)", textAlign: "center", padding: "2rem" }}>
          Tidak ada episode terbaru.
        </div>
      )}

      {/* Active player */}
      {active && (
        <div style={{
          marginBottom: "1.25rem",
          background: "#000",
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid var(--gold)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px var(--gold-glow)",
        }}>
          <div style={{ position: "relative", aspectRatio: "16/9" }}>
            <iframe
              key={active.id}
              src={ytEmbed(active.id, { autoplay: true })}
              title={active.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          </div>
          <div style={{ padding: "0.85rem 1rem", background: "var(--card)" }}>
            <div style={{
              fontFamily: "var(--serif)", fontSize: "0.95rem",
              fontWeight: 600, color: "var(--marble)", marginBottom: 4,
            }}>{active.title}</div>
            <div style={{ display: "flex", gap: 12, color: "var(--text-3)", fontSize: "0.75rem", fontFamily: "var(--serif-italic)" }}>
              <span>{active.seriesName}</span>
              {active.published && <span>· {active.published}</span>}
              {active.length && <span>· {active.length}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {!loading && eps.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "0.75rem",
        }}>
          {eps.map((ep) => (
            <button
              key={ep.id}
              onClick={() => {
                setActive(ep)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              style={{
                background: "transparent", border: 0, padding: 0,
                cursor: "pointer", textAlign: "left", color: "inherit",
                display: "flex", flexDirection: "column", gap: "0.4rem",
              }}
            >
              <div style={{
                position: "relative", aspectRatio: "16/9",
                borderRadius: 6, overflow: "hidden",
                border: "1px solid var(--border)",
                background: "var(--card)",
                transition: "border-color 0.15s ease",
              }} className="latest-ep-thumb">
                <img
                  src={ep.thumbnail}
                  alt={ep.title}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
                  padding: "1rem 0.5rem 0.4rem",
                  display: "flex", alignItems: "center", gap: 6,
                  color: "#fff", fontSize: "0.7rem",
                }}>
                  <Play size={10} fill="#fff" />
                  {ep.ep != null ? `Eps ${ep.ep}` : "Tonton"}
                  {ep.length && <span style={{ marginLeft: "auto", fontSize: "0.65rem" }}>{ep.length}</span>}
                </span>
                {ep.published && (
                  <span style={{
                    position: "absolute", top: 4, right: 4,
                    background: "var(--gold)", color: "var(--bg)",
                    padding: "1px 6px", borderRadius: 3,
                    fontFamily: "var(--serif)", fontSize: "0.6rem",
                    fontWeight: 700,
                    display: "inline-flex", alignItems: "center", gap: 3,
                  }}>
                    <Calendar size={9} /> {ep.published.replace(/lalu|ago/i, "").trim()}
                  </span>
                )}
              </div>
              <div style={{
                fontSize: "0.78rem", fontWeight: 600,
                color: "var(--marble)",
                fontFamily: "var(--serif)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.3,
              }}>{ep.seriesName}</div>
              <div style={{
                fontSize: "0.68rem", color: "var(--text-3)",
                fontFamily: "var(--serif-italic)",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>{ep.title}</div>
            </button>
          ))}
        </div>
      )}

      <style>{`.latest-ep-thumb:hover { border-color: var(--gold) !important; }`}</style>
    </section>
  )
}
