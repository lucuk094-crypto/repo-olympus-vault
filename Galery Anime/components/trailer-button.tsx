"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import TrailerOverlay from "@/components/trailer-overlay"

interface Props {
  youtubeId: string
  title: string
}

export function TrailerButton({ youtubeId, title }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="vx-btn-primary" onClick={() => setOpen(true)}>
        <Play size={14} fill="currentColor" /> Putar Trailer
      </button>
      <TrailerOverlay open={open} youtubeId={youtubeId} title={title} onClose={() => setOpen(false)} />
    </>
  )
}
