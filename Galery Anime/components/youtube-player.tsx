"use client"

import { useEffect, useRef, useState } from "react"
import { addToHistory, updateWatchProgress, toggleBookmark, isBookmarked } from "@/lib/watch-history"

interface YouTubePlayerProps {
  videoId: string
  title: string
  thumbnail: string
  channelName: string
  channelId: string
  genre: string
  type: "film" | "anime"
  duration: number
  episodeNumber?: number
  seriesName?: string
  autoplay?: boolean
  startTime?: number
}

interface VideoClip {
  videoId: string
  title: string
  thumbnail: string
  duration: number
  type: 'trailer' | 'clip' | 'episode' | 'full'
}

export default function YouTubePlayer({
  videoId,
  title,
  thumbnail,
  channelName,
  channelId,
  genre,
  type,
  duration,
  episodeNumber,
  seriesName,
  autoplay = false,
  startTime = 0
}: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [player, setPlayer] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState<'episodes' | 'clips' | 'trailers'>('episodes')
  const [clips, setClips] = useState<VideoClip[]>([])
  const [trailers, setTrailers] = useState<VideoClip[]>([])
  const [episodes, setEpisodes] = useState<VideoClip[]>([])
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const progressInterval = useRef<NodeJS.Timeout>()

  // Fetch clips, trailers, and episodes
  useEffect(() => {
    async function fetchClips() {
      try {
        const res = await fetch(`/api/video-clips?videoId=${videoId}&channelId=${channelId}`)
        if (res.ok) {
          const data = await res.json()
          setClips(data.clips || [])
          setTrailers(data.trailers || [])
          setEpisodes(data.episodes || [])
        }
      } catch (error) {
        console.error('Failed to fetch clips:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClips()
  }, [videoId, channelId])

  // Check bookmark status
  useEffect(() => {
    setBookmarked(isBookmarked(videoId))

    const handleBookmarkUpdate = () => {
      setBookmarked(isBookmarked(videoId))
    }

    window.addEventListener("bookmarksUpdated", handleBookmarkUpdate)
    return () => window.removeEventListener("bookmarksUpdated", handleBookmarkUpdate)
  }, [videoId])

  // Auto landscape fullscreen on orientation change
  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.screen.orientation) {
        const orientation = window.screen.orientation.type

        // If landscape and playing, enter fullscreen
        if ((orientation.includes('landscape')) && isPlaying && containerRef.current) {
          if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen?.()
              .catch(err => console.log('Fullscreen error:', err))
          }
        }
      }
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange)
    }

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange)
      }
    }
  }, [isPlaying])

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

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
        setPlayer(ytPlayer)
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
      <div
        ref={containerRef}
        className="player-container"
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          overflow: "hidden",
          background: "#000",
          borderRadius: "12px"
        }}
      >
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
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>

      {/* Player Controls */}
      <div style={{
        marginTop: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap"
      }}>
        {/* Progress Info */}
        <div style={{ flex: 1, minWidth: "200px" }}>
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
          color: "var(--text-2)",
          flexWrap: "wrap"
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

      {/* Tabs: Episodes, Clips, Trailers */}
      {!loading && (episodes.length > 0 || clips.length > 0 || trailers.length > 0) && (
        <div style={{ marginTop: "2rem" }}>
          {/* Tab Headers */}
          <div style={{
            display: "flex",
            gap: "0.5rem",
            borderBottom: "1px solid var(--border)",
            marginBottom: "1.5rem"
          }}>
            {episodes.length > 0 && (
              <button
                onClick={() => setActiveTab('episodes')}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: activeTab === 'episodes' ? "var(--gold-soft)" : "transparent",
                  color: activeTab === 'episodes' ? "var(--gold)" : "var(--text-2)",
                  border: "none",
                  borderBottom: activeTab === 'episodes' ? "2px solid var(--gold)" : "2px solid transparent",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                Episode ({episodes.length})
              </button>
            )}

            {clips.length > 0 && (
              <button
                onClick={() => setActiveTab('clips')}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: activeTab === 'clips' ? "var(--gold-soft)" : "transparent",
                  color: activeTab === 'clips' ? "var(--gold)" : "var(--text-2)",
                  border: "none",
                  borderBottom: activeTab === 'clips' ? "2px solid var(--gold)" : "2px solid transparent",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                Clip ({clips.length})
              </button>
            )}

            {trailers.length > 0 && (
              <button
                onClick={() => setActiveTab('trailers')}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: activeTab === 'trailers' ? "var(--gold-soft)" : "transparent",
                  color: activeTab === 'trailers' ? "var(--gold)" : "var(--text-2)",
                  border: "none",
                  borderBottom: activeTab === 'trailers' ? "2px solid var(--gold)" : "2px solid transparent",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                Trailer ({trailers.length})
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem"
          }}>
            {activeTab === 'episodes' && episodes.map((ep) => (
              <a
                key={ep.videoId}
                href={`/watch/${ep.videoId}`}
                style={{
                  display: "block",
                  background: ep.videoId === videoId ? "rgba(212, 175, 55, 0.1)" : "var(--card)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: ep.videoId === videoId ? "2px solid var(--gold)" : "1px solid var(--border)",
                  transition: "all 0.2s ease"
                }}
                className="video-clip-card"
              >
                <div style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  background: "#000"
                }}>
                  <img
                    src={ep.thumbnail}
                    alt={ep.title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: "0.5rem",
                    right: "0.5rem",
                    background: "rgba(0,0,0,0.8)",
                    color: "#fff",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem"
                  }}>
                    {Math.floor(ep.duration / 60)}m
                  </div>
                  {ep.videoId === videoId && (
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "var(--gold)",
                      color: "#000",
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: 600
                    }}>
                      ▶ Playing
                    </div>
                  )}
                </div>
                <div style={{ padding: "0.75rem" }}>
                  <h4 style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical"
                  }}>
                    {ep.title}
                  </h4>
                </div>
              </a>
            ))}

            {activeTab === 'clips' && clips.map((clip) => (
              <a
                key={clip.videoId}
                href={`/watch/${clip.videoId}`}
                style={{
                  display: "block",
                  background: "var(--card)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  transition: "all 0.2s ease"
                }}
                className="video-clip-card"
              >
                <div style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  background: "#000"
                }}>
                  <img
                    src={clip.thumbnail}
                    alt={clip.title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: "0.5rem",
                    right: "0.5rem",
                    background: "rgba(0,0,0,0.8)",
                    color: "#fff",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem"
                  }}>
                    {Math.floor(clip.duration / 60)}m
                  </div>
                </div>
                <div style={{ padding: "0.75rem" }}>
                  <h4 style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical"
                  }}>
                    {clip.title}
                  </h4>
                </div>
              </a>
            ))}

            {activeTab === 'trailers' && trailers.map((trailer) => (
              <a
                key={trailer.videoId}
                href={`/watch/${trailer.videoId}`}
                style={{
                  display: "block",
                  background: "var(--card)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  transition: "all 0.2s ease"
                }}
                className="video-clip-card"
              >
                <div style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  background: "#000"
                }}>
                  <img
                    src={trailer.thumbnail}
                    alt={trailer.title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: "0.5rem",
                    right: "0.5rem",
                    background: "rgba(0,0,0,0.8)",
                    color: "#fff",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem"
                  }}>
                    {Math.floor(trailer.duration / 60)}m
                  </div>
                  <div style={{
                    position: "absolute",
                    top: "0.5rem",
                    left: "0.5rem",
                    background: "rgba(212, 175, 55, 0.9)",
                    color: "#000",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 600
                  }}>
                    TRAILER
                  </div>
                </div>
                <div style={{ padding: "0.75rem" }}>
                  <h4 style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical"
                  }}>
                    {trailer.title}
                  </h4>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
