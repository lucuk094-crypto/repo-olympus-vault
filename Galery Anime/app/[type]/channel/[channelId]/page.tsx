import { notFound } from "next/navigation"
import Poster from "@/components/poster"

interface Props {
  params: Promise<{ channelId: string }>
  searchParams: Promise<{ page?: string }>
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

// Find channel by ID
function findChannel(data: any, channelId: string) {
  if (!data || !data.channels) return null
  return data.channels.find((c: any) => c.channelId === channelId)
}

export async function generateMetadata({ params }: Props) {
  const { channelId } = await params
  const data = await getChannelData()
  const channel = findChannel(data, channelId)

  if (!channel) {
    return { title: "Channel Not Found — VanX Stream" }
  }

  return {
    title: `${channel.name} — VanX Stream`,
    description: channel.description || `Watch videos from ${channel.name}`
  }
}

export default async function ChannelPage({ params, searchParams }: Props) {
  const { channelId } = await params
  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr || "1", 10)

  const data = await getChannelData()
  const channel = findChannel(data, channelId)

  if (!channel) notFound()

  // Get all videos from all series
  const allVideos = channel.series?.flatMap((s: any) =>
    s.episodes.map((ep: any) => ({
      ...ep,
      seriesName: s.name
    }))
  ) || []

  // Pagination
  const perPage = 24
  const totalPages = Math.ceil(allVideos.length / perPage)
  const startIdx = (page - 1) * perPage
  const endIdx = startIdx + perPage
  const paginatedVideos = allVideos.slice(startIdx, endIdx)

  return (
    <div className="vx-section" style={{ paddingTop: "2rem" }}>
      {/* Channel Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)",
        borderRadius: "12px",
        padding: "2rem",
        marginBottom: "2rem",
        border: "1px solid rgba(212, 175, 55, 0.2)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.5rem"
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--gold)">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span style={{
            fontSize: "0.875rem",
            color: "var(--gold)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            YouTube Channel
          </span>
        </div>

        <h1 style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "0.5rem"
        }}>
          {channel.name}
        </h1>

        <p style={{
          fontSize: "1rem",
          color: "var(--text-2)",
          marginBottom: "1rem"
        }}>
          {channel.description}
        </p>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          fontSize: "0.875rem",
          color: "var(--text-2)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
              <polyline points="17 2 12 7 7 2" />
            </svg>
            <span>{channel.videoCount || 0} video</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>{channel.series?.length || 0} series</span>
          </div>

          <div style={{
            padding: "0.25rem 0.75rem",
            background: "var(--gold-soft)",
            color: "var(--gold)",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase"
          }}>
            {channel.genre}
          </div>

          <a
            href={`https://youtube.com/${channel.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="vx-btn-ghost"
            style={{
              marginLeft: "auto",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Kunjungi Channel
          </a>
        </div>
      </div>

      {/* Videos Grid */}
      {paginatedVideos.length > 0 ? (
        <>
          <div className="vx-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1.5rem"
          }}>
            {paginatedVideos.map((video: any) => (
              <Poster
                key={video.videoId}
                href={`/watch/${video.videoId}`}
                title={video.title}
                poster={video.thumbnail}
                sub={`${Math.floor(video.duration / 60)} menit`}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "3rem",
              paddingBottom: "2rem"
            }}>
              {page > 1 && (
                <a
                  href={`/${channel.type}/channel/${channelId}?page=${page - 1}`}
                  className="vx-btn-ghost"
                >
                  ← Sebelumnya
                </a>
              )}
              <span style={{
                padding: "0.5rem 1rem",
                color: "var(--gold)",
                fontFamily: "var(--serif)",
                fontWeight: 600
              }}>
                Halaman {page} dari {totalPages}
              </span>
              {page < totalPages && (
                <a
                  href={`/${channel.type}/channel/${channelId}?page=${page + 1}`}
                  className="vx-btn-ghost"
                >
                  Selanjutnya →
                </a>
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "4rem 2rem",
          color: "var(--text-2)"
        }}>
          <p style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>
            Belum ada video
          </p>
          <p style={{ fontSize: "0.875rem" }}>
            Video dari channel ini akan muncul setelah RSS update dijalankan
          </p>
        </div>
      )}
    </div>
  )
}
