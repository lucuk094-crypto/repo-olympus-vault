import { notFound } from "next/navigation"
import YouTubePlayer from "@/components/youtube-player"
import Poster from "@/components/poster"

interface Props {
  params: Promise<{ videoId: string }>
  searchParams: Promise<{ series?: string }>
}

export const revalidate = 3600

// Load channel data
async function getChannelData() {
  try {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'public', 'data', 'new-channels.json')

    if (!fs.existsSync(filePath)) {
      return null
    }

    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

// Find video by ID
function findVideo(data: any, videoId: string) {
  if (!data || !data.channels) return null

  for (const channel of data.channels) {
    for (const series of channel.series || []) {
      for (const episode of series.episodes || []) {
        if (episode.videoId === videoId) {
          return {
            video: episode,
            series: series,
            channel: channel,
            allEpisodes: series.episodes
          }
        }
      }
    }
  }

  return null
}

export async function generateMetadata({ params }: Props) {
  const { videoId } = await params
  const data = await getChannelData()
  const result = findVideo(data, videoId)

  if (!result) {
    return { title: "Video Not Found — VanX Stream" }
  }

  const { video, series } = result
  return {
    title: `${video.title} — VanX Stream`,
    description: video.description || `Watch ${series.name} on VanX Stream`,
    openGraph: {
      images: [video.thumbnail]
    }
  }
}

export default async function VideoWatchPage({ params, searchParams }: Props) {
  const { videoId } = await params
  const { series: seriesFilter } = await searchParams

  const data = await getChannelData()
  const result = findVideo(data, videoId)

  if (!result) notFound()

  const { video, series, channel, allEpisodes } = result

  // Get related videos from same channel
  const relatedVideos = channel.series
    .filter((s: any) => s.name !== series.name)
    .flatMap((s: any) => s.episodes)
    .slice(0, 12)

  return (
    <div className="vx-section" style={{ paddingTop: "2rem" }}>
      {/* Breadcrumb */}
      <div style={{
        fontSize: "0.875rem",
        color: "var(--text-2)",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        <a href={`/${channel.type}`} style={{ color: "var(--gold)" }}>
          {channel.type === "film" ? "Film" : "Anime"}
        </a>
        <span>›</span>
        <a href={`/${channel.type}/channel/${channel.channelId}`} style={{ color: "var(--gold)" }}>
          {channel.name}
        </a>
        <span>›</span>
        <span>{series.name}</span>
      </div>

      {/* Video Player */}
      <YouTubePlayer
        videoId={video.videoId}
        title={video.title}
        thumbnail={video.thumbnail}
        channelName={channel.name}
        channelId={channel.channelId}
        genre={channel.genre}
        type={channel.type}
        duration={video.duration}
        episodeNumber={video.episodeNumber}
        seriesName={series.name}
        autoplay={true}
      />

      {/* Episodes List */}
      {allEpisodes.length > 1 && (
        <div style={{ marginTop: "3rem" }}>
          <div className="vx-section-head">
            <h2 className="vx-section-title">
              Episode Lainnya ({allEpisodes.length})
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
            marginTop: "1.5rem"
          }}>
            {allEpisodes.map((ep: any) => (
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
                className="episode-card"
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

                  {/* Episode Number Badge */}
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
                    EP {ep.episodeNumber}
                  </div>

                  {/* Duration */}
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

                  {/* Playing Indicator */}
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
                      fontSize: "0.875rem",
                      fontWeight: 600
                    }}>
                      ▶ Sedang Diputar
                    </div>
                  )}
                </div>

                <div style={{ padding: "1rem" }}>
                  <h3 style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical"
                  }}>
                    {ep.title}
                  </h3>

                  <div style={{
                    fontSize: "0.75rem",
                    color: "var(--text-2)"
                  }}>
                    {new Date(ep.publishedAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Related Videos */}
      {relatedVideos.length > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <div className="vx-section-head">
            <h2 className="vx-section-title">
              Video Lainnya dari {channel.name}
            </h2>
          </div>

          <div className="vx-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "1.5rem",
            marginTop: "1.5rem"
          }}>
            {relatedVideos.map((v: any) => (
              <Poster
                key={v.videoId}
                href={`/watch/${v.videoId}`}
                title={v.title}
                poster={v.thumbnail}
                sub={`${Math.floor(v.duration / 60)} menit`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
