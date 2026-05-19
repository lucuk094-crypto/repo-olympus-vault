import { NextResponse } from 'next/server'

/**
 * Fetch related videos and clips from the same channel
 * This includes trailers, clips, and episodes from the same series
 */

const API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyDRhyQx8VqJ9X5fZ3kN2pL7mW4tC8vE9fA'

interface VideoClip {
  videoId: string
  title: string
  thumbnail: string
  duration: number
  type: 'trailer' | 'clip' | 'episode' | 'full'
  publishedAt: string
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
 * Determine video type based on duration and title
 */
function determineVideoType(duration: number, title: string): 'trailer' | 'clip' | 'episode' | 'full' {
  const lowerTitle = title.toLowerCase()

  // Check title keywords first
  if (lowerTitle.includes('trailer') || lowerTitle.includes('teaser')) {
    return 'trailer'
  }
  if (lowerTitle.includes('clip') || lowerTitle.includes('scene') || lowerTitle.includes('behind')) {
    return 'clip'
  }

  // Determine by duration
  if (duration < 300) { // < 5 minutes
    return 'clip'
  } else if (duration < 600) { // 5-10 minutes
    return 'trailer'
  } else if (duration < 3600) { // 10-60 minutes
    return 'episode'
  } else { // > 1 hour
    return 'full'
  }
}

/**
 * Extract series name from video title
 */
function extractSeriesName(title: string): string {
  // Remove common patterns
  const patterns = [
    /\s*[Ee][Pp]?\.?\s*\d+.*/,
    /\s*-\s*[Ee]pisode\s*\d+.*/,
    /\s*\|\s*[Ee][Pp]?\.?\s*\d+.*/,
    /\s*#\d+.*/,
    /\s*\[\d+\].*/,
    /\s*Part\s*\d+.*/i,
    /\s*-\s*Trailer.*/i,
    /\s*-\s*Teaser.*/i,
    /\s*\|\s*Official.*/i,
  ]

  let seriesName = title
  for (const pattern of patterns) {
    seriesName = seriesName.replace(pattern, '')
  }

  return seriesName.trim()
}

/**
 * GET /api/video-clips?videoId=xxx&channelId=xxx
 * Fetch clips, trailers, and episodes related to a specific video
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get('videoId')
  const channelId = searchParams.get('channelId')

  if (!videoId || !channelId) {
    return NextResponse.json(
      { error: 'videoId and channelId are required' },
      { status: 400 }
    )
  }

  try {
    // 1. Get current video details
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`
    const videoRes = await fetch(videoUrl, {
      next: { revalidate: 3600 }
    })

    if (!videoRes.ok) {
      throw new Error('Failed to fetch video details')
    }

    const videoData = await videoRes.json()
    if (!videoData.items || videoData.items.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const currentVideo = videoData.items[0]
    const currentTitle = currentVideo.snippet.title
    const seriesName = extractSeriesName(currentTitle)

    // 2. Search for related videos from the same channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=50&key=${API_KEY}`
    const searchRes = await fetch(searchUrl, {
      next: { revalidate: 3600 }
    })

    if (!searchRes.ok) {
      throw new Error('Failed to search channel videos')
    }

    const searchData = await searchRes.json()
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

    // 3. Get video details including duration
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
    const detailsRes = await fetch(detailsUrl, {
      next: { revalidate: 3600 }
    })

    if (!detailsRes.ok) {
      throw new Error('Failed to fetch video details')
    }

    const detailsData = await detailsRes.json()

    // 4. Categorize videos
    const clips: VideoClip[] = []
    const trailers: VideoClip[] = []
    const episodes: VideoClip[] = []
    const fullMovies: VideoClip[] = []

    for (const video of detailsData.items || []) {
      const duration = parseDuration(video.contentDetails.duration)
      const title = video.snippet.title
      const videoSeriesName = extractSeriesName(title)

      // Only include videos from the same series or with similar titles
      const similarity = videoSeriesName.toLowerCase().includes(seriesName.toLowerCase()) ||
                        seriesName.toLowerCase().includes(videoSeriesName.toLowerCase())

      if (!similarity && video.id !== videoId) continue

      const videoClip: VideoClip = {
        videoId: video.id,
        title: title,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
        duration: duration,
        type: determineVideoType(duration, title),
        publishedAt: video.snippet.publishedAt
      }

      // Categorize
      switch (videoClip.type) {
        case 'clip':
          clips.push(videoClip)
          break
        case 'trailer':
          trailers.push(videoClip)
          break
        case 'episode':
          episodes.push(videoClip)
          break
        case 'full':
          fullMovies.push(videoClip)
          break
      }
    }

    return NextResponse.json({
      success: true,
      currentVideo: {
        videoId: currentVideo.id,
        title: currentTitle,
        seriesName: seriesName
      },
      clips: clips.slice(0, 10),
      trailers: trailers.slice(0, 10),
      episodes: episodes.slice(0, 20),
      fullMovies: fullMovies.slice(0, 10)
    })

  } catch (error) {
    console.error('Video clips fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video clips' },
      { status: 500 }
    )
  }
}
