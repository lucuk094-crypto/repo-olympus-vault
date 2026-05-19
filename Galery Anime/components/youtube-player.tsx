"use client"

import { useEffect, useRef, useState } from "react"
import { addToHistory, updateWatchProgress, toggleBookmark, isBookmarked } from "@/lib/watch-history"

interface YouTubePlayerProps {
  videoId: string
  title: string
  thumbnail: string
  channelName: string
  genre: string
  type: "film" | "anime"
  duration: number
  episodeNumber?: number
  seriesName?: string
  autoplay?: boolean
  startTime?: number
}

export default function YouTubePlayer({
  videoId,
  title,
  thumbnail,
  channelName,
  genre,
  type,
  duration,
  episodeNumber,
  seriesName,
  autoplay = false,
  startTime = 0
}: YouTubePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [player, setPlayer] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)
  const progressInterval = useRef<NodeJS.Timeout>()

  // Check bookmark status
  useEffect(() => {
    setBookmarked(isBookmarked(videoId))

    const handleBookmarkUpdate = () => {
      setBookmarked(isBookmarked(videoId))
    }

    window.addEventListener("bookmarksUpdated", handleBookmarkUpdate)
    return () => window.removeEventListener("bookmarksUpdated", handleBookmarkUpdate)
  }, [videoId])

  // Initialize YouTube Player API
  useEffect(() => {
    // Load YouTube IFrame API
    if (!(window as any).YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // Wait for API to be ready
    const initPlayer = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        const ytPlayer = new (window as any).YT.Player(iframeRef.current, {
          videoId,
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            start: startTime,
            rel: 0,
            modestbranding: 1,
            fs: 1,
            playsinline: 1
          },
          events: {
            onReady: (event: any) => {
              setPlayer(event.target)

              // Add to history when player is ready
              addToHistory({
                videoId,
                title,
                thumbnail,
                channelName,
                genre,
                type,
                progress: startTime,
                duration,
                episodeNumber,
                seriesName
              })
            },
            onStateChange: (event: any) => {
              // 1 = playing, 2 = paused
              if (event.data === 1) {
                setIsPlaying(true)
                startProgressTracking()
              } else {
                setIsPlaying(false)
                stopProgressTracking()
              }
            }
          }
        })
      } else {
        setTimeout(initPlayer, 100)
      }
    }

    if (typeof window !== "undefined") {
      if ((window as any).YT) {
        initPlayer()
      } else {
        (window as any).onYouTubeIframeAPIReady = initPlayer
      }
    }

    return () => {
      stopProgressTracking()
    }
  }, [videoId])

  // Track watch progress
  const startProgressTracking = () => {
    stopProgressTracking()

    progressInterval.current = setInterval(() => {
      if (player && typeof player.getCurrentTime === "function") {
        const time = Math.floor(player.getCurrentTime())
        setCurrentTime(time)

        // Update progress every 10 seconds
        if (time % 10 === 0) {
          updateWatchProgress(videoId, time)
        }
      }
    }, 1000)
  }

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)

      // Save final progress
      if (player && typeof player.getCurrentTime === "function") {
        const time = Math.floor(player.getCurrentTime())
        updateWatchProgress(videoId, time)
      }
    }
  }

  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    const newState = toggleBookmark({
      videoId,
      title,
      thumbnail,
      channelName,
      genre,
      type,
      episodeNumber,
      seriesName
    })
    setBookmarked(newState)
  }

  // Format time
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    }
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="youtube-player-wrapper">
      <div className="player-container" style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        overflow: "hidden",
        background: "#000",
        borderRadius: "12px"
      }}>
        <iframe
          ref={iframeRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none"
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Player Controls */}
      <div style={{
        marginTop: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem"
      }}>
        {/* Progress Info */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            color: "var(--text-2)",
            marginBottom: "0.5rem"
          }}>
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
            {progressPercent > 0 && (
              <span style={{ color: "var(--gold)" }}>
                ({progressPercent.toFixed(0)}%)
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{
            width: "100%",
            height: "4px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "2px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "var(--gold)",
              transition: "width 0.3s ease"
            }} />
          </div>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkToggle}
          className="vx-btn-ghost"
          style={{
            padding: "0.5rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
          title={bookmarked ? "Hapus dari bookmark" : "Tambah ke bookmark"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={bookmarked ? "var(--gold)" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          {bookmarked ? "Tersimpan" : "Simpan"}
        </button>
      </div>

      {/* Video Info */}
      <div style={{ marginTop: "1.5rem" }}>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          marginBottom: "0.5rem"
        }}>
          {title}
        </h2>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          fontSize: "0.875rem",
          color: "var(--text-2)"
        }}>
          <span>{channelName}</span>
          {episodeNumber && (
            <>
              <span>•</span>
              <span>Episode {episodeNumber}</span>
            </>
          )}
          <span>•</span>
          <span style={{
            padding: "0.25rem 0.5rem",
            background: "var(--gold-soft)",
            color: "var(--gold)",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase"
          }}>
            {genre}
          </span>
        </div>
      </div>
    </div>
  )
}
