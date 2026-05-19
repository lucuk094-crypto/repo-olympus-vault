"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, Eye, Search } from "lucide-react"
import { ytEmbed } from "@/lib/api/channels"

interface YtItem {
  id: string
  title: string
  thumbnail: string
  channelName: string
  published: string
  duration: number
  views: number
  url: string
}

interface Props {
  query: string
  fallbackTitles?: string[]
  label?: string
}

function fmtDuration(secs: number): string {
  if (!secs) return ""
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

function fmtViews(n: number): string {
  if (!n) return ""
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`
  return String(n)
}

export default function YoutubeSearchPlayer({ query, fallbackTitles = [], label = "Pencarian Video" }: Props) {
  const [items, setItems] = useState<YtItem[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<YtItem | null>(null)
  const [searchTerm, setSearchTerm] = useState(query)

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  useEffect(() => {
    let alive = true
    async function fetchAttempt(q: string): Promise<YtItem[]> {
      try {
        const r = await fetch(`/api/youtube-search?q=${encodeURIComponent(q)}&limit=12`, { cache: "force-cache" })
        if (!r.ok) return []
        const d = await r.json()
        return d.items || []
      } catch {
        return []
      }
    }
    ;(async () => {
      setLoading(true)
      // Try primary query, then fallbacks
      const queries = [searchTerm, ...fallbackTitles].filter(Boolean)
      let results: YtItem[] = []
      for (const q of queries) {
        results = await fetchAttempt(q + " sub indo")
        if (results.length >= 3) break
        const r2 = await fetchAttempt(q)
        if (r2.length >= 3) { results = r2; break }
      }
      if (!alive) return
      setItems(results)
      setActive(results[0] || null)
      setLoading(false)
    })()
    return () => { alive = false }
  }, [searchTerm, fallbackTitles.join("|")])

  return (
    <section className="vx-section">
      <div className="vx-section-head">
        <div className="vx-section-title-group">
          <div className="vx-section-eyebrow">
            <Search size={11} style={{ display: "inline-block", verticalAlign: "-1px", color: "var(--gold)", marginRight: 4 }} />
            Pencarian Otomatis
          </div>
          <h2 className="vx-section-title">{label}</h2>
        </div>
      </div>

      {loading && (
        <div style={{ color: "var(--text-3)", fontFamily: "var(--serif-italic)", textAlign: "center", padding: "2rem" }}>
          Mencari video untuk "{searchTerm}"...
        </div>
      )}

      {!loading && items.length === 0 && (
        <div style={{
          color: "var(--text-3)", fontFamily: "var(--serif-italic)",
          textAlign: "center", padding: "1.5rem",
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: 6,
        }}>
          Tidak ditemukan video publik untuk judul ini.
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm + " sub indo")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--gold)", marginLeft: 6, textDecoration: "underline" }}
          >
            Cari di YouTube
          </a>
        </div>
      )}

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
              src={ytEmbed(active.id, { autoplay: false })}
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
            <div style={{ display: "flex", gap: 12, color: "var(--text-3)", fontSize: "0.75rem", fontFamily: "var(--serif-italic)", flexWrap: "wrap" }}>
              <span>{active.channelName}</span>
              {active.published && <span><Calendar size={10} style={{ display: "inline-block", verticalAlign: "-1px" }} /> {active.published}</span>}
              {active.duration > 0 && <span><Clock size={10} style={{ display: "inline-block", verticalAlign: "-1px" }} /> {fmtDuration(active.duration)}</span>}
              {active.views > 0 && <span><Eye size={10} style={{ display: "inline-block", verticalAlign: "-1px" }} /> {fmtViews(active.views)}</span>}
            </div>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "0.6rem",
        }}>
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => setActive(it)}
              style={{
                background: "transparent", border: 0, padding: 0,
                cursor: "pointer", textAlign: "left", color: "inherit",
                display: "flex", flexDirection: "column", gap: 4,
              }}
            >
              <div style={{
                position: "relative", aspectRatio: "16/9",
                borderRadius: 5, overflow: "hidden",
                border: it.id === active?.id ? "2px solid var(--gold)" : "1px solid var(--border)",
              }}>
                <img src={it.thumbnail} alt={it.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {it.duration > 0 && (
                  <span style={{
                    position: "absolute", bottom: 4, right: 4,
                    background: "rgba(0,0,0,0.85)", color: "#fff",
                    padding: "1px 5px", borderRadius: 2,
                    fontSize: "0.6rem", fontWeight: 600,
                  }}>{fmtDuration(it.duration)}</span>
                )}
              </div>
              <div style={{
                fontSize: "0.75rem", fontWeight: 500, color: "var(--marble)",
                fontFamily: "var(--serif)",
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                overflow: "hidden", lineHeight: 1.3,
              }}>{it.title}</div>
              <div style={{
                fontSize: "0.65rem", color: "var(--text-3)",
                fontFamily: "var(--serif-italic)",
                display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>{it.channelName}</div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
