"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Loader2, Film, Tv, Sparkles, BookOpen } from "lucide-react"
import { searchAnime, aniTitle } from "@/lib/api/anilist"
import { searchMulti, tmdbImg } from "@/lib/api/tmdb"
import { searchManga, mdCover, mdTitle } from "@/lib/api/mangadex"

interface Props { open: boolean; onClose: () => void }

interface Result {
  type: "anime" | "movie" | "tv" | "manga"
  id: number | string
  title: string
  thumb: string
  sub?: string
  href: string
}

export default function SearchModal({ open, onClose }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState("")
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setTimeout(() => inputRef.current?.focus(), 50)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [open])

  useEffect(() => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    const t = window.setTimeout(async () => {
      const [anime, multi, manga] = await Promise.all([
        searchAnime(q, 8),
        searchMulti(q, 1),
        searchManga(q, 6),
      ])
      const out: Result[] = []
      // Anime
      for (const a of anime.slice(0, 6)) {
        out.push({
          type: "anime", id: a.id,
          title: aniTitle(a),
          thumb: a.coverImage?.large || a.coverImage?.extraLarge || "",
          sub: `${a.format || "Anime"} · ${a.seasonYear || ""}`.trim(),
          href: `/anime/${a.id}`,
        })
      }
      // Multi (movies + tv from TMDB)
      const tmdbResults = multi?.results || []
      for (const r of tmdbResults.slice(0, 8)) {
        if (r.media_type === "movie") {
          out.push({
            type: "movie", id: r.id,
            title: r.title || r.original_title,
            thumb: tmdbImg(r.poster_path, "w342"),
            sub: `Film · ${r.release_date?.slice(0, 4) || ""}`,
            href: `/film/${r.id}`,
          })
        } else if (r.media_type === "tv") {
          out.push({
            type: "tv", id: r.id,
            title: r.name || r.original_name,
            thumb: tmdbImg(r.poster_path, "w342"),
            sub: `Drama · ${r.first_air_date?.slice(0, 4) || ""}`,
            href: `/drama/${r.id}`,
          })
        }
      }
      // Manga
      for (const m of manga.slice(0, 4)) {
        out.push({
          type: "manga", id: m.id,
          title: mdTitle(m),
          thumb: mdCover(m),
          sub: `Komik · ${m.attributes.year || ""}`,
          href: `/komik/${m.id}`,
        })
      }
      setResults(out)
      setLoading(false)
    }, 300)
    return () => window.clearTimeout(t)
  }, [q])

  if (!open) return null

  const pick = (r: Result) => {
    onClose()
    router.push(r.href)
  }

  const ICON: Record<string, any> = {
    anime: Sparkles, movie: Film, tv: Tv, manga: BookOpen,
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(10, 14, 26, 0.94)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        zIndex: 1300,
        display: "flex", flexDirection: "column",
      }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} style={{
        maxWidth: 720, width: "100%", margin: "0 auto",
        display: "flex", flexDirection: "column", height: "100%",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "1rem", borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
        }}>
          <Search size={18} style={{ color: "var(--gold)" }} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari anime, film, drama, komik..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && results.length) pick(results[0])
              if (e.key === "Escape") onClose()
            }}
            style={{
              flex: 1, background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: "0.95rem", padding: "0.6rem 0.95rem",
              borderRadius: 999, outline: "none",
              fontFamily: "var(--serif-italic)",
            }}
          />
          <button onClick={onClose} style={{
            background: "transparent", border: 0, color: "var(--gold)",
            fontFamily: "var(--serif)", fontSize: "0.78rem",
            fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            cursor: "pointer", padding: "0.5rem 0.8rem",
          }}>Tutup</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {loading && (
            <div className="vx-loading">
              <Loader2 className="animate-spin" size={16} /> mencari...
            </div>
          )}
          {!loading && q && results.length === 0 && (
            <div className="vx-empty">Tidak ada hasil untuk "{q}"</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {results.map((r) => {
              const Icon = ICON[r.type] || Search
              return (
                <button key={`${r.type}-${r.id}`} onClick={() => pick(r)} style={{
                  display: "grid", gridTemplateColumns: "60px 1fr auto",
                  gap: "0.7rem", alignItems: "center",
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 8, padding: "0.4rem", cursor: "pointer",
                  textAlign: "left", color: "var(--text)",
                  font: "inherit",
                }}>
                  <img src={r.thumb || "/placeholder.svg"} alt="" loading="lazy"
                    style={{ width: 60, aspectRatio: "2/3", objectFit: "cover", borderRadius: 4, background: "var(--bg-3)" }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: "var(--marble)", fontWeight: 600, fontSize: "0.92rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "var(--serif)" }}>
                      {r.title}
                    </div>
                    <div style={{ color: "var(--text-3)", fontSize: "0.75rem", fontFamily: "var(--serif-italic)" }}>{r.sub}</div>
                  </div>
                  <Icon size={16} style={{ color: "var(--gold)" }} />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
