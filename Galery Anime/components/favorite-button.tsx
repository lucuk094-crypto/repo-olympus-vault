"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { isFavorited, toggleFavorite, type Favorite } from "@/lib/favorites"

interface Props {
  item: Favorite
  variant?: "primary" | "ghost"
}

export default function FavoriteButton({ item, variant = "ghost" }: Props) {
  const [fav, setFav] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    isFavorited(item.type, item.id).then(setFav)
  }, [item.type, item.id])

  const click = async () => {
    if (busy) return
    setBusy(true)
    const next = await toggleFavorite(item)
    setFav(next)
    setBusy(false)
  }

  return (
    <button
      onClick={click}
      disabled={busy}
      className={variant === "primary" ? "vx-btn-primary" : "vx-btn-ghost"}
      style={{ opacity: busy ? 0.6 : 1 }}
    >
      <Heart size={14} fill={fav ? "currentColor" : "none"} />
      {fav ? "Tersimpan" : "Simpan"}
    </button>
  )
}
