"use client"

import { useEffect, useState } from "react"
import { getWatchHistory, getContinueWatching, clearHistory, type WatchHistoryItem } from "@/lib/watch-history"
import Poster from "@/components/poster"

export default function HistoryPage() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([])
  const [continueWatching, setContinueWatching] = useState<WatchHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()

    const handleUpdate = () => loadHistory()
    window.addEventListener("watchHistoryUpdated", handleUpdate)
    return () => window.removeEventListener("watchHistoryUpdated", handleUpdate)
  }, [])

  const loadHistory = () => {
    setHistory(getWatchHistory())
    setContinueWatching(getContinueWatching())
    setLoading(false)
  }

  const handleClearHistory = () => {
    if (confirm("Hapus semua riwayat tontonan?")) {
      clearHistory()
      loadHistory()
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Baru saja"
    if (diffMins < 60) return `${diffMins} menit lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    if (diffDays < 7) return `${diffDays} hari lalu`

    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatProgress = (item: WatchHistoryItem) => {
    const percent = (item.progress / item.duration) * 100
    return Math.min(Math.round(percent), 100)
  }

  if (loading) {
    return (
      <div className="vx-section" style={{ paddingTop: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-2)" }}>Memuat riwayat...</p>
      </div>
    )
  }

  return (
    <div className="vx-section" style={{ paddingTop: "2rem" }}>
      <div className="vx-section-head">
        <div className="vx-section-title-group">
          <div className="vx-section-eyebrow">Riwayat</div>
          <h1 className="vx-section-title">Tontonan Saya</h1>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="vx-btn-ghost"
            style={{ fontSize: "0.875rem" }}
          >
            Hapus Semua
          </button>
        )}
      </div>

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "1rem",
            color: "var(--gold)"
          }}>
            Lanjutkan Menonton
          </h2>

          <div className="vx-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1.5rem"
          }}>
            {continueWatching.map((item) => (
              <div key={item.videoId} style={{ position: "relative" }}>
                <Poster
                  href={`/watch/${item.videoId}`}
                  title={item.title}
                  poster={item.thumbnail}
                  sub={item.channelName}
                />

                {/* Progress Bar */}
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "rgba(0,0,0,0.5)",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${formatProgress(item)}%`,
                    height: "100%",
                    background: "var(--gold)"
                  }} />
                </div>

                {/* Progress Label */}
                <div style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  background: "rgba(0,0,0,0.8)",
                  color: "var(--gold)",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 600
                }}>
                  {formatProgress(item)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full History */}
      {history.length > 0 ? (
        <div style={{ marginTop: "3rem" }}>
          <h2 style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "1rem"
          }}>
            Semua Riwayat
          </h2>

          <div style={{
            display: "grid",
            gap: "1rem"
          }}>
            {history.map((item) => (
              <a
                key={`${item.videoId}-${item.watchedAt}`}
                href={`/watch/${item.videoId}`}
                style={{
                  display: "flex",
                  gap: "1rem",
                  background: "var(--card)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  transition: "all 0.2s ease"
                }}
                className="history-item"
              >
                {/* Thumbnail */}
                <div style={{
                  position: "relative",
                  width: "200px",
                  flexShrink: 0,
                  background: "#000"
                }}>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />

                  {/* Progress Overlay */}
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "rgba(0,0,0,0.5)"
                  }}>
                    <div style={{
                      width: `${formatProgress(item)}%`,
                      height: "100%",
                      background: "var(--gold)"
                    }} />
                  </div>
                </div>

                {/* Info */}
                <div style={{
                  flex: 1,
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <div>
                    <h3 style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      marginBottom: "0.5rem"
                    }}>
                      {item.title}
                    </h3>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      fontSize: "0.875rem",
                      color: "var(--text-2)",
                      flexWrap: "wrap"
                    }}>
                      <span>{item.channelName}</span>

                      {item.episodeNumber && (
                        <>
                          <span>•</span>
                          <span>Episode {item.episodeNumber}</span>
                        </>
                      )}

                      <span>•</span>
                      <span style={{
                        padding: "0.125rem 0.375rem",
                        background: "var(--gold-soft)",
                        color: "var(--gold)",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase"
                      }}>
                        {item.genre}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.875rem",
                    color: "var(--text-2)"
                  }}>
                    <span>{formatDate(item.watchedAt)}</span>
                    <span style={{ color: "var(--gold)", fontWeight: 600 }}>
                      {formatProgress(item)}% selesai
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "4rem 2rem",
          color: "var(--text-2)"
        }}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ margin: "0 auto 1rem", opacity: 0.5 }}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>
            Belum ada riwayat tontonan
          </p>
          <p style={{ fontSize: "0.875rem" }}>
            Video yang Anda tonton akan muncul di sini
          </p>
        </div>
      )}

      <style jsx>{`
        .history-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          border-color: var(--gold);
        }
      `}</style>
    </div>
  )
}
