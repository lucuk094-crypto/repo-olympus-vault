"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft, ChevronRight, ArrowUp, List, Book,
  Maximize2, Minimize2, Settings,
} from "lucide-react"
import type { ChapterPage, KomikChapter } from "@/lib/api/komiku"

interface Props {
  title: string
  chapterTitle: string
  slug: string
  pages: ChapterPage[]
  prevSlug: string | null
  nextSlug: string | null
  allChapters: KomikChapter[]
  currentSeg: string
}

export default function ChapterReader({
  title, chapterTitle, slug, pages, prevSlug, nextSlug, allChapters, currentSeg,
}: Props) {
  const router = useRouter()
  const [showChapters, setShowChapters] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [width, setWidth] = useState<"fit" | "full" | "narrow">("fit")
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as any)?.tagName)) return
      if (e.key === "ArrowLeft" && prevSlug) {
        router.push(`/komik/${slug}/chapter/${prevSlug}`)
      } else if (e.key === "ArrowRight" && nextSlug) {
        router.push(`/komik/${slug}/chapter/${nextSlug}`)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prevSlug, nextSlug, slug, router])

  const proxy = (u: string) => `/api/komik-image?u=${encodeURIComponent(u)}`

  const widthStyle: React.CSSProperties = {
    fit: { maxWidth: 720 },
    full: { maxWidth: "100%" },
    narrow: { maxWidth: 540 },
  }[width]

  return (
    <>
      {/* Sticky toolbar */}
      <div style={{
        position: "sticky", top: "var(--topbar-h)", zIndex: 20,
        background: "rgba(10, 14, 26, 0.92)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--gold)",
        padding: "0.6rem 1rem",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.85rem",
      }}>
        <Link href={`/komik/${slug}`} style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          color: "var(--gold)", textDecoration: "none",
          fontFamily: "var(--serif)", fontSize: "0.78rem", fontWeight: 600,
          letterSpacing: "0.06em",
        }}>
          <Book size={14} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "min(180px, 32vw)" }}>{title}</span>
        </Link>

        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setShowChapters(true)} className="vx-iconbtn" title="Daftar Chapter">
            <List size={16} />
          </button>
          <button onClick={() => setShowSettings(true)} className="vx-iconbtn" title="Pengaturan">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "1.25rem 1rem 0.85rem", maxWidth: 900, margin: "0 auto" }}>
        <div className="greek-caps" style={{ color: "var(--gold)", fontSize: "0.7rem", marginBottom: 4 }}>
          Sedang Membaca
        </div>
        <h1 style={{
          fontFamily: "var(--serif)", fontSize: "clamp(1.1rem, 2.4vw, 1.4rem)",
          margin: 0, fontWeight: 700, letterSpacing: "0.04em",
          color: "var(--marble)",
        }}>{chapterTitle}</h1>
      </div>

      {/* Chapter navigation buttons (top) */}
      <div style={{
        display: "flex", gap: 8, justifyContent: "center",
        padding: "0.5rem 1rem 0.85rem", flexWrap: "wrap",
      }}>
        {prevSlug ? (
          <Link href={`/komik/${slug}/chapter/${prevSlug}`} className="vx-btn-ghost" style={{ minWidth: 130 }}>
            <ChevronLeft size={14} /> Chapter Sebelumnya
          </Link>
        ) : (
          <button className="vx-btn-ghost" disabled style={{ minWidth: 130, opacity: 0.4 }}>
            <ChevronLeft size={14} /> Sudah Awal
          </button>
        )}
        {nextSlug ? (
          <Link href={`/komik/${slug}/chapter/${nextSlug}`} className="vx-btn-primary" style={{ minWidth: 130 }}>
            Chapter Berikutnya <ChevronRight size={14} />
          </Link>
        ) : (
          <button className="vx-btn-ghost" disabled style={{ minWidth: 130, opacity: 0.4 }}>
            Sudah Akhir <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Page images */}
      <div style={{
        ...widthStyle,
        margin: "0 auto",
        padding: "0 0 2rem",
        background: "#000",
      }}>
        {pages.map((p, i) => (
          <img
            key={`${p.url}-${i}`}
            src={proxy(p.url)}
            alt={`Halaman ${i + 1}`}
            loading={i < 2 ? "eager" : "lazy"}
            style={{
              display: "block", width: "100%", height: "auto",
              margin: 0,
              background: "#000",
            }}
            onError={(e) => {
              // Try direct URL as fallback
              const t = e.target as HTMLImageElement
              if (!t.dataset.fallback) {
                t.dataset.fallback = "1"
                t.src = p.url
              }
            }}
          />
        ))}
      </div>

      {/* Bottom navigation */}
      <div style={{
        display: "flex", gap: 8, justifyContent: "center",
        padding: "1.5rem 1rem", flexWrap: "wrap",
      }}>
        {prevSlug && (
          <Link href={`/komik/${slug}/chapter/${prevSlug}`} className="vx-btn-ghost" style={{ minWidth: 130 }}>
            <ChevronLeft size={14} /> Sebelumnya
          </Link>
        )}
        <Link href={`/komik/${slug}`} className="vx-btn-ghost" style={{ minWidth: 130 }}>
          <Book size={14} /> Detail Komik
        </Link>
        {nextSlug && (
          <Link href={`/komik/${slug}/chapter/${nextSlug}`} className="vx-btn-primary" style={{ minWidth: 130 }}>
            Berikutnya <ChevronRight size={14} />
          </Link>
        )}
      </div>

      {/* Chapter list drawer */}
      {showChapters && (
        <>
          <div onClick={() => setShowChapters(false)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            zIndex: 100, backdropFilter: "blur(4px)",
          }} />
          <aside style={{
            position: "fixed", top: 0, right: 0, bottom: 0,
            width: "min(360px, 92vw)", zIndex: 101,
            background: "var(--bg-2)",
            borderLeft: "1px solid var(--gold)",
            padding: "1rem",
            overflowY: "auto",
            animation: "vx-slide-left 0.25s ease",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "1rem", paddingBottom: "0.85rem",
              borderBottom: "1px solid var(--border)",
            }}>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "1rem", margin: 0, color: "var(--gold)" }}>
                Daftar Chapter
              </h3>
              <button onClick={() => setShowChapters(false)} className="vx-iconbtn">✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {allChapters.map((c) => {
                const active = c.slug === currentSeg
                return (
                  <Link
                    key={c.slug}
                    href={`/komik/${slug}/chapter/${c.slug}`}
                    onClick={() => setShowChapters(false)}
                    style={{
                      padding: "0.6rem 0.85rem",
                      background: active ? "var(--gold-soft)" : "var(--card)",
                      border: `1px solid ${active ? "var(--gold)" : "var(--border)"}`,
                      borderRadius: 5,
                      color: active ? "var(--gold)" : "var(--text-2)",
                      textDecoration: "none",
                      display: "flex", justifyContent: "space-between",
                      fontFamily: "var(--serif)", fontSize: "0.82rem",
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    <span>{c.chapter}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-3)", fontFamily: "var(--serif-italic)" }}>{c.date}</span>
                  </Link>
                )
              })}
            </div>
          </aside>
        </>
      )}

      {/* Settings drawer */}
      {showSettings && (
        <>
          <div onClick={() => setShowSettings(false)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            zIndex: 100, backdropFilter: "blur(4px)",
          }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)", zIndex: 101,
            background: "var(--bg-2)", border: "1px solid var(--gold)",
            borderRadius: 12, padding: "1.5rem",
            width: "min(360px, 92vw)",
          }}>
            <h3 style={{ fontFamily: "var(--serif)", color: "var(--gold)", margin: "0 0 1rem", fontSize: "1.05rem" }}>
              Pengaturan Pembaca
            </h3>
            <div style={{ marginBottom: "1.25rem" }}>
              <div className="greek-caps" style={{ fontSize: "0.65rem", color: "var(--gold)", marginBottom: "0.5rem" }}>
                Lebar Halaman
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {(["narrow", "fit", "full"] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWidth(w)}
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      background: width === w ? "var(--gold)" : "transparent",
                      color: width === w ? "var(--bg)" : "var(--gold)",
                      border: "1px solid var(--gold)",
                      borderRadius: 5,
                      cursor: "pointer",
                      fontFamily: "var(--serif)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {w === "narrow" ? "Sempit" : w === "fit" ? "Sedang" : "Penuh"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-3)", fontFamily: "var(--serif-italic)", textAlign: "center" }}>
              Tip: gunakan ← / → untuk navigasi chapter
            </div>
            <button onClick={() => setShowSettings(false)} className="vx-btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
              Selesai
            </button>
          </div>
        </>
      )}

      {/* Scroll to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            right: "1rem",
            bottom: "calc(var(--bottomnav-h) + 1.5rem)",
            zIndex: 50,
            width: 44, height: 44,
            borderRadius: "50%",
            background: "var(--gold)",
            color: "var(--bg)",
            border: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 22px var(--gold-glow)",
          }}
          aria-label="Naik ke atas"
        >
          <ArrowUp size={18} />
        </button>
      )}

      <style>{`
        @keyframes vx-slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}
