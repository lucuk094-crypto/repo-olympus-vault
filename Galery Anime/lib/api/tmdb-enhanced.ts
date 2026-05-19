// Enhanced TMDB API with full IMDB-style data
// Includes: videos (trailers, clips, teasers), images (backdrops, posters), reviews, keywords

const READ_TOKEN = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN || process.env.TMDB_READ_TOKEN ||
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjc2YThhZTFjYzE3MTBiNjI5NzNjOGU0YWQ5MTU0NyIsIm5iZiI6MTc3OTA0MTI0Ni44MTEsInN1YiI6IjZhMGEwM2RlMDUzNzk4MWFmYTFlNzBhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UdSVv7GE3Nle4Qc88D6UPa9wFlkCida-XMe3DDEpQMw"

const BASE = "https://api.themoviedb.org/3"

export interface TmdbVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  published_at: string
  size: number
}

export interface TmdbImage {
  file_path: string
  width: number
  height: number
  aspect_ratio: number
  vote_average: number
  vote_count: number
}

export interface TmdbReview {
  id: string
  author: string
  author_details: {
    name: string
    username: string
    avatar_path: string | null
    rating: number | null
  }
  content: string
  created_at: string
  updated_at: string
  url: string
}

export interface EnhancedMovieData {
  videos: TmdbVideo[]
  images: {
    backdrops: TmdbImage[]
    posters: TmdbImage[]
    logos: TmdbImage[]
  }
  reviews: TmdbReview[]
  keywords: { id: number; name: string }[]
  external_ids: {
    imdb_id: string | null
    facebook_id: string | null
    instagram_id: string | null
    twitter_id: string | null
  }
}

// Fetch enhanced movie data (videos, images, reviews)
export async function getEnhancedMovieData(movieId: string): Promise<EnhancedMovieData | null> {
  try {
    const headers = {
      Authorization: `Bearer ${READ_TOKEN}`,
      "Content-Type": "application/json",
    }

    const [videosRes, imagesRes, reviewsRes, keywordsRes, externalRes] = await Promise.all([
      fetch(`${BASE}/movie/${movieId}/videos?language=en-US`, { headers, next: { revalidate: 3600 } }),
      fetch(`${BASE}/movie/${movieId}/images?include_image_language=en,null`, { headers, next: { revalidate: 3600 } }),
      fetch(`${BASE}/movie/${movieId}/reviews?language=en-US&page=1`, { headers, next: { revalidate: 3600 } }),
      fetch(`${BASE}/movie/${movieId}/keywords`, { headers, next: { revalidate: 3600 } }),
      fetch(`${BASE}/movie/${movieId}/external_ids`, { headers, next: { revalidate: 3600 } }),
    ])

    if (!videosRes.ok) {
      console.error("TMDB videos fetch failed:", videosRes.status, await videosRes.text())
      return null
    }

    const [videos, images, reviews, keywords, external] = await Promise.all([
      videosRes.json(),
      imagesRes.json(),
      reviewsRes.json(),
      keywordsRes.json(),
      externalRes.json(),
    ])

    return {
      videos: videos.results || [],
      images: {
        backdrops: images.backdrops || [],
        posters: images.posters || [],
        logos: images.logos || [],
      },
      reviews: reviews.results || [],
      keywords: keywords.keywords || [],
      external_ids: external,
    }
  } catch (e) {
    console.error("Enhanced movie data fetch failed:", e)
    return null
  }
}

// Group videos by type
export function groupVideosByType(videos: TmdbVideo[]) {
  const groups: Record<string, TmdbVideo[]> = {
    Trailer: [],
    Teaser: [],
    Clip: [],
    "Behind the Scenes": [],
    Featurette: [],
    Other: [],
  }

  for (const v of videos) {
    if (v.site !== "YouTube") continue
    const type = v.type || "Other"
    if (groups[type]) {
      groups[type].push(v)
    } else {
      groups.Other.push(v)
    }
  }

  // Sort by official first, then by published date
  for (const key in groups) {
    groups[key].sort((a, b) => {
      if (a.official !== b.official) return a.official ? -1 : 1
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    })
  }

  return groups
}

// Get best quality images
export function getBestImages(images: TmdbImage[], limit = 20): TmdbImage[] {
  return images
    .sort((a, b) => {
      // Sort by vote average, then vote count
      if (b.vote_average !== a.vote_average) {
        return b.vote_average - a.vote_average
      }
      return b.vote_count - a.vote_count
    })
    .slice(0, limit)
}

export function tmdbImageUrl(path: string | null, size: string = "original"): string {
  if (!path) return "/placeholder.jpg"
  return `https://image.tmdb.org/t/p/${size}${path}`
}
