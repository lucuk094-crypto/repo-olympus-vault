"use client"
import { useEffect } from "react"

export default function ScrollState() {
  useEffect(() => {
    let raf = 0
    let timeout: number | null = null
    let scrolling = false

    const onScroll = () => {
      if (!scrolling) {
        scrolling = true
        raf = window.requestAnimationFrame(() => {
          if (!document.body.classList.contains("is-scrolling")) {
            document.body.classList.add("is-scrolling")
          }
        })
      }
      if (timeout) window.clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        document.body.classList.remove("is-scrolling")
        scrolling = false
      }, 130)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) window.cancelAnimationFrame(raf)
      if (timeout) window.clearTimeout(timeout)
      document.body.classList.remove("is-scrolling")
    }
  }, [])
  return null
}
