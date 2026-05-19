"use client"

import { useEffect, useState, useRef } from "react"
import { X, Maximize, Minimize, Subtitles } from "lucide-react"

interface Props {
  open: boolean
  youtubeId: string
  title: string
  onClose: () => void
}

export default function TrailerOverlay({ open, youtubeId, title, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [captions, setCaptions] = useState(true)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key.toLowerCase() === "f") toggleFs()
    }
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const toggleFs = async () => {
    const el = containerRef.current
    if (!el) return
    try {
      if (!document.fullscreenElement) await el.requestFullscreen({ navigationUI: "hide" } as FullscreenOptions)
      else await document.exitFullscreen()
    } catch {}
  }

  if (!open) return null

  const params = new URLSearchParams({
    autoplay: "1", rel: "0", modestbranding: "1",
    hl: "id", cc_lang_pref: "id",
    cc_load_policy: captions ? "1" : "0",
    iv_load_policy: "3", playsinline: "1", fs: "1",
    vq: "hd1080",
  })
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?${params}`

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(10, 14, 26, 0.96)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        zIndex: 1400,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "min(1200px, 100%)",
          maxHeight: "92vh",
          aspectRatio: "16/9",
          background: "#000",
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid var(--gold)",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px var(--gold-glow)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          key={src}
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: 0 }}
        />

        {/* Top-left title badge */}
        <div style={{
          position: "absolute", top: 12, left: 14,
          background: "rgba(10, 14, 26, 0.85)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--gold)",
          color: "var(--gold)",
          padding: "0.35rem 0.85rem",
          borderRadius: 4,
          fontFamily: "var(--serif)",
          fontSize: "0.78rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          maxWidth: "60%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          pointerEvents: "none",
        }}>
          ✦ {title}
        </div>

        {/* Top-right controls */}
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 5,
          display: "flex", gap: 6,
        }}>
          <button
            onClick={() => setCaptions((v) => !v)}
            title="Subtitle Indonesia"
            style={{
              width: 34, height: 34, borderRadius: 4,
              background: captions ? "var(--gold)" : "rgba(0,0,0,0.6)",
              color: captions ? "var(--bg)" : "var(--marble)",
              border: "1px solid var(--gold)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", backdropFilter: "blur(8px)",
            }}
          >
            <Subtitles size={14} />
          </button>
          <button
            onClick={toggleFs}
            title={fullscreen ? "Keluar layar penuh" : "Layar penuh"}
            style={{
              width: 34, height: 34, borderRadius: 4,
              background: "rgba(0,0,0,0.6)",
              color: "var(--marble)",
              border: "1px solid var(--border-2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", backdropFilter: "blur(8px)",
            }}
          >
            {fullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
          <button
            onClick={onClose}
            aria-label="Tutup"
            style={{
              width: 34, height: 34, borderRadius: 4,
              background: "rgba(155, 28, 28, 0.85)",
              color: "#fff",
              border: "1px solid #c75d3c",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", backdropFilter: "blur(8px)",
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
