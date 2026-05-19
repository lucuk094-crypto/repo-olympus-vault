"use client"

import { useState } from "react"
import { Play, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  published_at: string
}

interface VideoClipsPlayerProps {
  videos: Video[]
  title: string
}

export function VideoClipsPlayer({ videos, title }: VideoClipsPlayerProps) {
  const [currentVideo, setCurrentVideo] = useState(videos[0])

  // Group videos by type
  const grouped: Record<string, Video[]> = {}
  for (const v of videos) {
    if (v.site !== "YouTube") continue
    const type = v.type || "Other"
    if (!grouped[type]) grouped[type] = []
    grouped[type].push(v)
  }

  const types = Object.keys(grouped).sort((a, b) => {
    const order = ["Trailer", "Teaser", "Clip", "Behind the Scenes", "Featurette"]
    const aIdx = order.indexOf(a)
    const bIdx = order.indexOf(b)
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
    if (aIdx !== -1) return -1
    if (bIdx !== -1) return 1
    return a.localeCompare(b)
  })

  if (!videos.length) return null

  return (
    <section className="vx-section">
      <div className="vx-section-head">
        <div className="vx-section-title-group">
          <div className="vx-section-eyebrow">Video</div>
          <h2 className="vx-section-title">Trailer & Klip</h2>
        </div>
        <Badge variant="secondary">{videos.length} Video</Badge>
      </div>

      {/* Main Player */}
      <div className="space-y-4 mb-6">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-gold shadow-2xl">
          <iframe
            key={currentVideo.key}
            src={`https://www.youtube.com/embed/${currentVideo.key}?autoplay=0&rel=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Current Video Info */}
        <div className="flex items-start justify-between gap-4 p-4 bg-card border border-border rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={currentVideo.official ? "default" : "outline"}>
                {currentVideo.type}
              </Badge>
              {currentVideo.official && (
                <Badge variant="secondary" className="text-gold">Official</Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg">{currentVideo.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(currentVideo.published_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${currentVideo.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="vx-btn-ghost"
          >
            <ExternalLink size={14} /> YouTube
          </a>
        </div>
      </div>

      {/* Video Grid by Type */}
      <Tabs defaultValue={types[0]} className="w-full">
        <TabsList className="mb-4">
          {types.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type} ({grouped[type].length})
            </TabsTrigger>
          ))}
        </TabsList>

        {types.map((type) => (
          <TabsContent key={type} value={type}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {grouped[type].map((video) => (
                <button
                  key={video.id}
                  onClick={() => setCurrentVideo(video)}
                  className={`group relative aspect-video rounded-lg overflow-hidden transition-all ${
                    currentVideo.key === video.key
                      ? "ring-2 ring-gold scale-105"
                      : "hover:scale-105 hover:ring-1 hover:ring-border"
                  }`}
                >
                  {/* Thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                    alt={video.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" fill="white" />
                  </div>

                  {/* Official Badge */}
                  {video.official && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="default" className="text-xs bg-gold text-black">
                        Official
                      </Badge>
                    </div>
                  )}

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-xs text-white font-medium line-clamp-2">
                      {video.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
