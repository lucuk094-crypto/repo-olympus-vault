"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

export default function Live2dWrapper() {
  const [enabled, setEnabled] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window === "undefined") return
    const v = localStorage.getItem("vx_live2d_enabled")
    setEnabled(v !== "0")
  }, [])

  if (!mounted || !enabled) return null

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js"
        strategy="afterInteractive"
      />
      <div className="live2d-container" />
    </>
  )
}
