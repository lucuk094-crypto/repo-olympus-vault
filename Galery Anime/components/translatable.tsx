"use client"

import { useEffect, useState } from "react"
import { Languages, Loader2 } from "lucide-react"
import { translateText } from "@/lib/translate"

interface Props {
  text: string
  /** Hide translate button, just auto-translate */
  auto?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function Translatable({ text, auto = true, className, style }: Props) {
  const [translated, setTranslated] = useState<string | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!auto || !text) return
    let cancelled = false
    setLoading(true)
    translateText(text, "id")
      .then((tr) => { if (!cancelled) setTranslated(tr) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [text, auto])

  const display = showOriginal || !translated ? text : translated

  return (
    <div className={className} style={style}>
      <p style={{ margin: 0 }}>{display}</p>
      {translated && translated !== text && (
        <button
          onClick={() => setShowOriginal((v) => !v)}
          style={{
            marginTop: 6,
            background: "transparent", border: 0,
            color: "var(--gold)", fontFamily: "var(--serif)",
            fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
            fontWeight: 600, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 4,
          }}
        >
          <Languages size={11} />
          {showOriginal ? "Bahasa Indonesia" : "Lihat Asli"}
        </button>
      )}
      {loading && !translated && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--text-3)", fontSize: "0.7rem", marginTop: 4, fontFamily: "var(--serif-italic)" }}>
          <Loader2 className="animate-spin" size={11} /> menerjemahkan...
        </span>
      )}
    </div>
  )
}
