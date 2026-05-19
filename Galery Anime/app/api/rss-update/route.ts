import { NextResponse } from 'next/server'

/**
 * RSS Feed Parser for YouTube Channels
 * Auto-updates video data from YouTube RSS feeds
 */

interface RSSVideo {
  videoId: string
  title: string
  publishedAt: string
  thumbnail: string
  channelId: string
  channelName: string
}

/**
 * Parse YouTube RSS feed
 */
async function parseRSSFeed(rssUrl: string): Promise<RSSVideo[]> {
  try {
    const response = await fetch(rssUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.status}`)
    }

    const xml = await response.text()

    // Parse XML manually (simple parser for YouTube RSS)
    const videos: RSSVideo[] = []
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
    const entries = xml.match(entryRegex) || []

    for (const entry of entries) {
      const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1]
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1]
      const published = entry.match(/<published>(.*?)<\/published>/)?.[1]
      const channelId = entry.match(/<yt:channelId>(.*?)<\/yt:channelId>/)?.[1]
      const channelName = entry.match(/<name>(.*?)<\/name>/)?.[1]
      const thumbnail = entry.match(/<media:thumbnail url="(.*?)"/)?.[1]

      if (videoId && title && published) {
        videos.push({
          videoId,
          title: decodeHTMLEntities(title),
          publishedAt: published,
          thumbnail: thumbnail || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
          channelId: channelId || '',
          channelName: decodeHTMLEntities(channelName || '')
        })
      }
    }

    return videos
  } catch (error) {
    console.error('RSS parse error:', error)
    return []
  }
}

/**
 * Decode HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'"
  }

  return text.replace(/&[^;]+;/g, match => entities[match] || match)
}

/**
 * Get video duration from YouTube API
 */
async function getVideoDuration(videoId: string): Promise<number> {
  const API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyDRhyQx8VqJ9X5fZ3kN2pL7mW4tC8vE9fA'

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`
    const response = await fetch(url, {
      next: { revalidate: 86400 } // Cache for 24 hours
    })

    if (!response.ok) return 0

    const data = await response.json()
    if (!data.items || data.items.length === 0) return 0

    const duration = data.items[0].contentDetails.duration
    return parseDuration(duration)
  } catch {
    return 0
  }
}

/**
 * Parse ISO 8601 duration to seconds
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')

  return hours * 3600 + minutes * 60 + seconds
}

/**
 * API Route: Update channels from RSS feeds
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const channelId = searchParams.get('channelId')

  // Channel configurations - now fetch ALL videos (full + trailers)
  const channels = [
    { id: 'UCApexAction1', name: 'Apex Action', genre: 'action', type: 'film', minDuration: 60 },
    { id: 'UCJagoanDonghua', name: 'Jagoan Donghua', genre: 'action', type: 'anime', minDuration: 60 },
    { id: 'UCHitFlix-RC', name: 'HitFlix', genre: 'action', type: 'film', minDuration: 60 },
    { id: 'UCMovieSphereHorror-SciFi', name: 'MovieSphere Horror', genre: 'horror', type: 'film', minDuration: 60 },
    { id: 'UCAmazingAnimeMan', name: 'Amazing Anime Man', genre: 'action', type: 'anime', minDuration: 60 },
    { id: 'UCSuperheroFXLGames', name: 'Superhero FXL', genre: 'action', type: 'film', minDuration: 60 },
    { id: 'UChotanime-ri9zc', name: 'Hot Anime', genre: 'action', type: 'anime', minDuration: 60 },
    { id: 'UCFILVOXFOX', name: 'FILVOX FOX', genre: 'action', type: 'film', minDuration: 60 }
  ]

  try {
    const updates = []

    // If specific channel requested, update only that one
    const channelsToUpdate = channelId
      ? channels.filter(c => c.id === channelId)
      : channels

    for (const channel of channelsToUpdate) {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`
      const videos = await parseRSSFeed(rssUrl)

      // Filter for full-length videos based on channel type
      const fullLengthVideos = []
      for (const video of videos.slice(0, 15)) { // Check latest 15 videos
        const duration = await getVideoDuration(video.videoId)
        if (duration >= channel.minDuration) { // Use channel-specific minimum duration
          fullLengthVideos.push({
            ...video,
            duration,
            genre: channel.genre,
            type: channel.type
          })
        }
      }

      updates.push({
        channelId: channel.id,
        channelName: channel.name,
        newVideos: fullLengthVideos.length,
        videos: fullLengthVideos
      })

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return NextResponse.json({
      success: true,
      updatedAt: new Date().toISOString(),
      channels: updates,
      totalNewVideos: updates.reduce((sum, u) => sum + u.newVideos, 0)
    })

  } catch (error) {
    console.error('RSS update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update from RSS feeds' },
      { status: 500 }
    )
  }
}

/**
 * POST: Manual trigger for RSS update
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { channelId } = body

    // Trigger update
    const baseUrl = request.headers.get('host') || 'localhost:3000'
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const updateUrl = `${protocol}://${baseUrl}/api/rss-update${channelId ? `?channelId=${channelId}` : ''}`

    const response = await fetch(updateUrl)
    const data = await response.json()

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to trigger RSS update' },
      { status: 500 }
    )
  }
}
