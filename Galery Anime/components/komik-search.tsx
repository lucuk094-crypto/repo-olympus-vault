"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import Link from "next/link"
import { slugFromLink, type KomikItem } from "@/lib/api/komiku"

export default function KomikSearch() {
  const [q, setQ] = useState("")
  const [results, setResults] = useState<KomikItem[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<any>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q.trim() || q.trim().length < 2) {
      setResults([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const r = await fetch(`/api/komik-search?q=${encodeURIComponent(q.trim())}`, { cache: "force-cache" })
        const d = await r.json()
        setResults(d.comics || [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [q])

  return (
    <div style={{ position: "relative", maxWidth: 560, marginBottom: "1.5rem" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "0.6rem",
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 8, padding: "0.6rem 0.85rem",
        transition: "border-color 0.15s ease",
      }}>
        <Search size={16} style={{ color: "var(--text-3)" }} />
        <input
          type="search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Cari judul komik..."
          style={{
            flex: 1, background: "transparent", border: 0, outline: "none",
            color: "var(--text)", fontFamily: "var(--sans)",
            fontSize: "0.95rem",
          }}
        />
        {q && (
          <button onClick={() => { setQ(""); setResults([]) }} style={{
            background: "transparent", border: 0, cursor: "pointer",
            color: "var(--text-3)", display: "flex", padding: 0,
          }} aria-label="Bersihkan">
            <X size={16} />
          </button>
        )}
      </div>

      {open && q.length >= 2 && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "var(--bg-2)", border: "1px solid var(--border)",
          borderRadius: 8, maxHeight: 420, overflowY: "auto", zIndex: 20,
          boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
        }}>
          {loading && (
            <div style={{ padding: "1rem", color: "var(--text-3)", fontFamily: "var(--serif-italic)", textAlign: "center" }}>
              Mencari "{q}"...
            </div>
          )}
          {!loading && results.length === 0 && (
            <div style={{ padding: "1rem", color: "var(--text-3)", fontFamily: "var(--serif-italic)", textAlign: "center" }}>
              Tidak ada hasil.
            </div>
          )}
          {!loading && results.map((c) => {
            const slug = c.slug || slugFromLink(c.link)
            return (
              <Link
                key={slug}
                href={`/komik/${slug}`}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex", gap: "0.6rem", padding: "0.55rem 0.85rem",
                  textDecoration: "none", color: "var(--text)",
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.15s ease",
                }}
              >
                <img src={c.image} alt={c.title} style={{
                  width: 40, height: 56, objectFit: "cover",
                  borderRadius: 3, flexShrink: 0,
                }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontFamily: "var(--serif)", fontWeight: 600,
                    fontSize: "0.85rem", marginBottom: 2,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{c.title}</div>
                  <div style={{
                    fontSize: "0.72rem", color: "var(--text-3)",
                    fontFamily: "var(--serif-italic)",
                  }}>
                    {c.genre || c.type || ""} {c.status && `· ${c.status}`}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
