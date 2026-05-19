"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, Trash2, Loader2 } from "lucide-react"
import { loadFavorites, toggleFavorite, type Favorite, favHref } from "@/lib/favorites"

export default function LibraryPage() {
  const [list, setList] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "anime" | "movie" | "tv" | "manga">("all")

  useEffect(() => {
    loadFavorites().then((l) => { setList(l); setLoading(false) })
  }, [])

  const filtered = filter === "all" ? list : list.filter((x) => x.type === filter)

  const remove = async (item: Favorite) => {
    await toggleFavorite(item)
    setList((l) => l.filter((x) => !(x.type === item.type && x.id === item.id)))
  }

  return (
    <section className="vx-section" style={{ paddingTop: "2rem" }}>
      <div className="vx-section-head">
        <div className="vx-section-title-group">
          <div className="vx-section-eyebrow">Pribadi</div>
          <h1 className="vx-section-title">Pustaka Saya</h1>
        </div>
      </div>

      <div className="vx-tabstrip">
        {[
          { k: "all", l: "Semua" },
          { k: "anime", l: "Anime" },
          { k: "movie", l: "Film" },
          { k: "tv", l: "Drama" },
          { k: "manga", l: "Komik" },
        ].map((t) => (
          <button
            key={t.k}
            className={`vx-tab ${filter === t.k ? "active" : ""}`}
            onClick={() => setFilter(t.k as any)}
          >
            {t.l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="vx-loading">
          <Loader2 className="animate-spin" size={16} /> memuat pustaka...
        </div>
      ) : filtered.length === 0 ? (
        <div className="vx-empty" style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "3rem 1.5rem",
        }}>
          <Heart size={42} style={{ color: "var(--gold)", margin: "0 auto 1rem" }} />
          <h3 style={{ fontFamily: "var(--serif)", color: "var(--marble)", fontSize: "1.3rem", margin: "0 0 0.5rem" }}>
            Pustaka {filter === "all" ? "" : filter} kosong
          </h3>
          <p style={{ fontFamily: "var(--serif-italic)", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            Klik tombol "Simpan" pada halaman detail untuk menambahkan ke pustaka.
          </p>
        </div>
      ) : (
        <div className="vx-grid">
          {filtered.map((it) => (
            <div key={`${it.type}-${it.id}`} style={{ position: "relative" }}>
              <Link href={favHref(it)} className="vx-poster">
                <div className="vx-poster-thumb">
                  <img src={it.poster || "/placeholder.svg"} alt={it.title} loading="lazy" />
                </div>
                <div className="vx-poster-title">{it.title}</div>
                {it.sub && <div className="vx-poster-sub">{it.sub}</div>}
              </Link>
              <button
                onClick={() => remove(it)}
                aria-label="Hapus dari pustaka"
                style={{
                  position: "absolute", top: 6, right: 6, zIndex: 3,
                  width: 30, height: 30, borderRadius: "50%",
                  border: "1px solid var(--border)", background: "rgba(0,0,0,0.7)",
                  color: "#ff6b6b", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
