"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Search, Bell, X,
  Home, Film, Theater, BookOpen, Newspaper, Sparkles, Radio, Heart, Compass, Info, Sun, Moon,
  MoreHorizontal, Calendar, LogIn,
} from "lucide-react"
import { useTheme } from "next-themes"
import BrandLogo from "@/components/brand-logo"
import SearchModal from "@/components/search-modal"

// Bottom nav primary tabs (always visible)
const NAV_PRIMARY = [
  { key: "home",    label: "Home",    href: "/",        icon: Home },
  { key: "anime",   label: "Anime",   href: "/anime",   icon: Sparkles },
  { key: "drama",   label: "Drama",   href: "/drama",   icon: Theater },
  { key: "film",    label: "Film",    href: "/film",    icon: Film },
  { key: "library", label: "Pustaka", href: "/library", icon: Heart },
]

// More menu (drawer on click)
const NAV_MORE = [
  { key: "trending",      label: "Trending",       href: "/trending",       icon: Compass },
  { key: "anime-cat",     label: "Katalog Anime",  href: "/anime/catalog",  icon: Sparkles },
  { key: "anime-jadwal",  label: "Jadwal Tayang",  href: "/anime/jadwal",   icon: Calendar },
  { key: "drama-cat",     label: "Katalog Drama",  href: "/drama/catalog",  icon: Theater },
  { key: "film-cat",      label: "Katalog Film",   href: "/film/catalog",   icon: Film },
  { key: "komik",         label: "Komik",          href: "/komik",          icon: BookOpen },
  { key: "novel",         label: "Novel",          href: "/novel",          icon: Newspaper },
  { key: "live",          label: "Live TV",        href: "/live",           icon: Radio },
  { key: "about",          label: "Tentang",       href: "/about",          icon: Info },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname() || "/"
  const [moreOpen, setMoreOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Lock body scroll when drawer open (preserve scroll position)
  useEffect(() => {
    if (moreOpen) {
      const y = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${y}px`
      document.body.style.left = "0"
      document.body.style.right = "0"
      document.body.style.width = "100%"
      return () => {
        const restoredY = document.body.style.top
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.left = ""
        document.body.style.right = ""
        document.body.style.width = ""
        if (restoredY) window.scrollTo(0, parseInt(restoredY || "0", 10) * -1)
      }
    }
  }, [moreOpen])

  // Hotkeys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as any)?.tagName)) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape") {
        setSearchOpen(false)
        setMoreOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href)
  const isMoreActive = NAV_MORE.some((it) => isActive(it.href))

  const navigate = (href: string) => {
    setMoreOpen(false)
    router.push(href)
  }

  const isDark = mounted ? resolvedTheme !== "light" : true

  return (
    <div className="vx-shell">
      {/* Top bar */}
      <header className="vx-topbar">
        <button className="vx-brand" onClick={() => navigate("/")}>
          <span className="vx-brand-mark">
            <BrandLogo size={28} />
          </span>
          <span className="vx-brand-text">
            <span className="vx-brand-title">VanX Stream</span>
            <span className="vx-brand-tag">καλώς ήρθατε</span>
          </span>
        </button>

        <button className="vx-search" onClick={() => setSearchOpen(true)}>
          <Search size={16} />
          <span className="vx-search-text">Cari anime, drama, film, komik...</span>
          <kbd>Ctrl K</kbd>
        </button>

        <div className="vx-actions">
          <button
            className="vx-iconbtn"
            onClick={() => setSearchOpen(true)}
            aria-label="Cari"
            title="Cari (Ctrl K)"
          >
            <Search size={16} />
          </button>
          <button
            className="vx-iconbtn"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Tema"
            title={isDark ? "Mode terang" : "Mode gelap"}
          >
            {mounted && isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="vx-iconbtn"
            onClick={() => router.push("/login")}
            aria-label="Masuk / Daftar"
            title="Masuk atau daftar"
          >
            <LogIn size={16} />
          </button>
          <button className="vx-iconbtn" aria-label="Notifikasi" title="Notifikasi">
            <Bell size={16} />
            <span className="vx-iconbtn-dot" />
          </button>
        </div>
      </header>

      {/* Main full-width */}
      <main className="vx-main">{children}</main>

      {/* Bottom nav — floating glass pill (visible on ALL screens) */}
      <nav className="vx-bottomnav" aria-label="Navigasi utama">
        {NAV_PRIMARY.map((it) => {
          const Icon = it.icon
          const active = isActive(it.href)
          return (
            <button
              key={it.key}
              className={`vx-bottomnav-item ${active ? "active" : ""}`}
              onClick={() => router.push(it.href)}
              title={it.label}
              aria-label={it.label}
              aria-current={active ? "page" : undefined}
            >
              <Icon strokeWidth={active ? 2.3 : 1.8} />
              <span>{it.label}</span>
            </button>
          )
        })}

        <button
          className={`vx-bottomnav-item ${isMoreActive ? "active" : ""}`}
          onClick={() => setMoreOpen(true)}
          title="Lainnya"
          aria-label="Buka menu lainnya"
          aria-expanded={moreOpen}
        >
          <MoreHorizontal strokeWidth={isMoreActive ? 2.3 : 1.8} />
          <span>Lainnya</span>
        </button>
      </nav>

      {/* More-drawer overlay */}
      <div
        className={`vx-more-overlay ${moreOpen ? "open" : ""}`}
        onClick={() => setMoreOpen(false)}
        aria-hidden={!moreOpen}
      />

      {/* More-drawer (bottom sheet) */}
      <aside className={`vx-more-drawer ${moreOpen ? "open" : ""}`} aria-hidden={!moreOpen}>
        <div className="vx-more-handle" />
        <div className="vx-more-head">
          <div>
            <div className="greek-caps" style={{ fontSize: "0.7rem", color: "var(--gold)", letterSpacing: "0.16em" }}>Menu</div>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.15rem", margin: "0.15rem 0 0", letterSpacing: "0.04em" }}>Jelajahi VanX Stream</h3>
          </div>
          <button className="vx-iconbtn" onClick={() => setMoreOpen(false)} aria-label="Tutup">
            <X size={16} />
          </button>
        </div>
        <div className="vx-more-grid">
          {NAV_MORE.map((it) => {
            const Icon = it.icon
            const active = isActive(it.href)
            return (
              <button
                key={it.key}
                className={`vx-more-item ${active ? "active" : ""}`}
                onClick={() => navigate(it.href)}
              >
                <span className="vx-more-item-icon"><Icon size={18} /></span>
                <span>{it.label}</span>
              </button>
            )
          })}
        </div>
      </aside>

      {/* Search */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
