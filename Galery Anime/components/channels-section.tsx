import Link from "next/link"

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

export default async function ChannelsSection() {
  const data = await getChannelData()

  if (!data || !data.channels || data.channels.length === 0) {
    return null
  }

  const filmChannels = data.channels.filter((c: any) => c.type === 'film')
  const animeChannels = data.channels.filter((c: any) => c.type === 'anime')

  return (
    <>
      {/* Film Channels */}
      {filmChannels.length > 0 && (
        <section className="vx-section">
          <div className="vx-section-head">
            <div className="vx-section-title-group">
              <div className="vx-section-eyebrow">YouTube Channels</div>
              <h2 className="vx-section-title">Channel Film</h2>
            </div>
            <Link href="/film/channels" className="vx-section-more">
              Lihat Semua
            </Link>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginTop: "1.5rem"
          }}>
            {filmChannels.map((channel: any) => (
              <Link
                key={channel.channelId}
                href={`/film/channel/${channel.channelId}`}
                style={{
                  display: "block",
                  background: "var(--card)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid var(--border)",
                  transition: "all 0.2s ease"
                }}
                className="channel-card"
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg, var(--gold) 0%, rgba(212, 175, 55, 0.6) 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#000">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {channel.name}
                    </h3>
                    <p style={{
                      fontSize: "0.75rem",
                      color: "var(--text-3)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {channel.handle}
                    </p>
                  </div>
                </div>

                <p style={{
                  fontSize: "0.875rem",
                  color: "var(--text-2)",
                  marginBottom: "1rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical"
                }}>
                  {channel.description}
                </p>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  fontSize: "0.75rem",
                  color: "var(--text-3)"
                }}>
                  <span>{channel.videoCount || 0} video</span>
                  <span>•</span>
                  <span>{channel.series?.length || 0} series</span>
                  <span style={{
                    marginLeft: "auto",
                    padding: "0.25rem 0.5rem",
                    background: "var(--gold-soft)",
                    color: "var(--gold)",
                    borderRadius: "4px",
                    fontWeight: 600,
                    textTransform: "uppercase"
                  }}>
                    {channel.genre}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Anime Channels */}
      {animeChannels.length > 0 && (
        <section className="vx-section">
          <div className="vx-section-head">
            <div className="vx-section-title-group">
              <div className="vx-section-eyebrow">YouTube Channels</div>
              <h2 className="vx-section-title">Channel Anime</h2>
            </div>
            <Link href="/anime/channels" className="vx-section-more">
              Lihat Semua
            </Link>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginTop: "1.5rem"
          }}>
            {animeChannels.map((channel: any) => (
              <Link
                key={channel.channelId}
                href={`/anime/channel/${channel.channelId}`}
                style={{
                  display: "block",
                  background: "var(--card)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid var(--border)",
                  transition: "all 0.2s ease"
                }}
                className="channel-card"
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg, var(--gold) 0%, rgba(212, 175, 55, 0.6) 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#000">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {channel.name}
                    </h3>
                    <p style={{
                      fontSize: "0.75rem",
                      color: "var(--text-3)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {channel.handle}
                    </p>
                  </div>
                </div>

                <p style={{
                  fontSize: "0.875rem",
                  color: "var(--text-2)",
                  marginBottom: "1rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical"
                }}>
                  {channel.description}
                </p>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  fontSize: "0.75rem",
                  color: "var(--text-3)"
                }}>
                  <span>{channel.videoCount || 0} video</span>
                  <span>•</span>
                  <span>{channel.series?.length || 0} series</span>
                  <span style={{
                    marginLeft: "auto",
                    padding: "0.25rem 0.5rem",
                    background: "var(--gold-soft)",
                    color: "var(--gold)",
                    borderRadius: "4px",
                    fontWeight: 600,
                    textTransform: "uppercase"
                  }}>
                    {channel.genre}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
