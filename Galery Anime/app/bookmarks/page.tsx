"use client"

import { useEffect, useState } from "react"
import { getBookmarks, clearBookmarks, removeBookmark, type BookmarkItem } from "@/lib/watch-history"
import Poster from "@/components/poster"

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'film' | 'anime'>('all')

  useEffect(() => {
    loadBookmarks()

    const handleUpdate = () => loadBookmarks()
    window.addEventListener("bookmarksUpdated", handleUpdate)
    return () => window.removeEventListener("bookmarksUpdated", handleUpdate)
  }, [])

  const loadBookmarks = () => {
    setBookmarks(getBookmarks())
    setLoading(false)
  }

  const handleClearAll = () => {
    if (confirm("Hapus semua bookmark?")) {
      clearBookmarks()
      loadBookmarks()
    }
  }

  const handleRemove = (videoId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeBookmark(videoId)
    loadBookmarks()
  }

  const filteredBookmarks = filter === 'all'
    ? bookmarks
    : bookmarks.filter(b => b.type === filter)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="vx-section" style={{ paddingTop: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-2)" }}>Memuat bookmark...</p>
      </div>
    )
  }

  return (
    <div className="vx-section" style={{ paddingTop: "2rem" }}>
      <div className="vx-section-head">
        <div className="vx-section-title-group">
          <div className="vx-section-eyebrow">Koleksi</div>
          <h1 className="vx-section-title">Bookmark Saya</h1>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={handleClearAll}
            className="vx-btn-ghost"
            style={{ fontSize: "0.875rem" }}
          >
            Hapus Semua
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      {bookmarks.length > 0 && (
        <div style={{
          display: "flex",
          gap: "0.5rem",
          marginTop: "1.5rem",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "0.5rem"
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: "0.5rem 1rem",
              background: filter === 'all' ? "var(--gold-soft)" : "transparent",
              color: filter === 'all' ? "var(--gold)" : "var(--text-2)",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Semua ({bookmarks.length})
          </button>

          <button
            onClick={() => setFilter('film')}
            style={{
              padding: "0.5rem 1rem",
              background: filter === 'film' ? "var(--gold-soft)" : "transparent",
              color: filter === 'film' ? "var(--gold)" : "var(--text-2)",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Film ({bookmarks.filter(b => b.type === 'film').length})
          </button>

          <button
            onClick={() => setFilter('anime')}
            style={{
              padding: "0.5rem 1rem",
              background: filter === 'anime' ? "var(--gold-soft)" : "transparent",
              color: filter === 'anime' ? "var(--gold)" : "var(--text-2)",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Anime ({bookmarks.filter(b => b.type === 'anime').length})
          </button>
        </div>
      )}

      {/* Bookmarks Grid */}
      {filteredBookmarks.length > 0 ? (
        <div className="vx-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem"
        }}>
          {filteredBookmarks.map((item) => (
            <div key={item.videoId} style={{ position: "relative" }}>
              <Poster
                href={`/watch/${item.videoId}`}
                title={item.title}
                poster={item.thumbnail}
                sub={item.channelName}
              />

              {/* Remove Button */}
              <button
                onClick={(e) => handleRemove(item.videoId, e)}
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  width: "32px",
                  height: "32px",
                  background: "rgba(0,0,0,0.8)",
                  border: "none",
                  borderRadius: "50%",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  zIndex: 10
                }}
                className="remove-btn"
                title="Hapus dari bookmark"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Episode Badge */}
              {item.episodeNumber && (
                <div style={{
                  position: "absolute",
                  top: "0.5rem",
                  left: "0.5rem",
                  background: "rgba(0,0,0,0.8)",
                  color: "var(--gold)",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 600
                }}>
                  EP {item.episodeNumber}
                </div>
              )}

              {/* Bookmark Date */}
              <div style={{
                marginTop: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--text-3)",
                textAlign: "center"
              }}>
                {formatDate(item.bookmarkedAt)}
              </div>
            </div>
          ))}
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
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <p style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>
            {filter === 'all' ? 'Belum ada bookmark' : `Belum ada bookmark ${filter}`}
          </p>
          <p style={{ fontSize: "0.875rem" }}>
            Simpan video favorit Anda untuk ditonton nanti
          </p>
        </div>
      )}

      <style jsx>{`
        .remove-btn:hover {
          background: var(--gold);
          color: #000;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}
