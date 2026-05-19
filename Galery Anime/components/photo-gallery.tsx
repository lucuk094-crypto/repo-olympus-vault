"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Image {
  file_path: string
  width: number
  height: number
  aspect_ratio: number
  vote_average: number
  vote_count: number
}

interface PhotoGalleryProps {
  backdrops: Image[]
  posters: Image[]
  title: string
}

export function PhotoGallery({ backdrops, posters, title }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentTab, setCurrentTab] = useState<"backdrops" | "posters">("backdrops")

  const currentImages = currentTab === "backdrops" ? backdrops : posters
  const totalImages = backdrops.length + posters.length

  if (!totalImages) return null

  const openLightbox = (index: number, tab: "backdrops" | "posters") => {
    setCurrentIndex(index)
    setCurrentTab(tab)
    setLightboxOpen(true)
  }

  const goNext = () => {
    if (currentIndex < currentImages.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const getImageUrl = (path: string, size: string = "original") => {
    return `https://image.tmdb.org/t/p/${size}${path}`
  }

  const currentImage = currentImages[currentIndex]

  return (
    <section className="vx-section">
      <div className="vx-section-head">
        <div className="vx-section-title-group">
          <div className="vx-section-eyebrow">Galeri</div>
          <h2 className="vx-section-title">Foto & Gambar</h2>
        </div>
        <Badge variant="secondary">{totalImages} Foto</Badge>
      </div>

      <Tabs defaultValue="backdrops" className="w-full">
        <TabsList className="mb-4">
          {backdrops.length > 0 && (
            <TabsTrigger value="backdrops">
              Backdrops ({backdrops.length})
            </TabsTrigger>
          )}
          {posters.length > 0 && (
            <TabsTrigger value="posters">
              Posters ({posters.length})
            </TabsTrigger>
          )}
        </TabsList>

        {backdrops.length > 0 && (
          <TabsContent value="backdrops">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {backdrops.slice(0, 20).map((img, idx) => (
                <button
                  key={img.file_path}
                  onClick={() => openLightbox(idx, "backdrops")}
                  className="group relative aspect-video rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                >
                  <img
                    src={getImageUrl(img.file_path, "w500")}
                    alt={`${title} backdrop ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {img.vote_average > 0 && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs bg-black/80 text-gold">
                        ★ {img.vote_average.toFixed(1)}
                      </Badge>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </TabsContent>
        )}

        {posters.length > 0 && (
          <TabsContent value="posters">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {posters.slice(0, 24).map((img, idx) => (
                <button
                  key={img.file_path}
                  onClick={() => openLightbox(idx, "posters")}
                  className="group relative aspect-[2/3] rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                >
                  <img
                    src={getImageUrl(img.file_path, "w342")}
                    alt={`${title} poster ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {img.vote_average > 0 && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs bg-black/80 text-gold">
                        ★ {img.vote_average.toFixed(1)}
                      </Badge>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-gold">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            {currentIndex > 0 && (
              <button
                onClick={goPrev}
                className="absolute left-4 z-50 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {currentIndex < currentImages.length - 1 && (
              <button
                onClick={goNext}
                className="absolute right-4 z-50 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}

            {/* Image */}
            {currentImage && (
              <div className="relative max-w-full max-h-full p-8">
                <img
                  src={getImageUrl(currentImage.file_path, "original")}
                  alt={`${title} ${currentTab} ${currentIndex + 1}`}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />

                {/* Image Info */}
                <div className="absolute bottom-12 left-8 right-8 p-4 bg-black/80 rounded-lg text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">
                        {currentTab === "backdrops" ? "Backdrop" : "Poster"} {currentIndex + 1} / {currentImages.length}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {currentImage.width} × {currentImage.height} • Aspect Ratio: {currentImage.aspect_ratio.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentImage.vote_average > 0 && (
                        <Badge variant="secondary" className="bg-gold text-black">
                          ★ {currentImage.vote_average.toFixed(1)} ({currentImage.vote_count} votes)
                        </Badge>
                      )}
                      <a
                        href={getImageUrl(currentImage.file_path, "original")}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gold hover:bg-gold/80 text-black transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
