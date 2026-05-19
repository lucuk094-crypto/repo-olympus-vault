// Jikan API — MyAnimeList wrapper (no key)
// Useful for: airing schedule, top movies, manga
// Docs: https://docs.api.jikan.moe/

const BASE = "https://api.jikan.moe/v4"

export interface JikanAnime {
  mal_id: number
  url: string
  title: string
  title_english: string | null
  title_japanese: string | null
  type: string
  episodes: number | null
  status: string
  aired: { from: string | null; to: string | null }
  duration: string
  score: number | null
  scored_by: number | null
  rank: number | null
  popularity: number | null
  members: number | null
  favorites: number | null
  synopsis: string | null
  genres: { mal_id: number; name: string }[]
  images: {
    jpg: { image_url: string; large_image_url: string }
    webp: { image_url: string; large_image_url: string }
  }
  trailer?: {
    youtube_id: string | null
    url: string | null
    images: { maximum_image_url?: string }
  }
  studios: { name: string }[]
  source: string
  season: string | null
  year: number | null
}

async function jikan<T>(path: string): Promise<T | null> {
  try {
    const r = await fetch(`${BASE}${path}`, { next: { revalidate: 1800 } })
    if (!r.ok) return null
    return await r.json() as T
  } catch { return null }
}

export async function getJikanSchedule(day?: "monday"|"tuesday"|"wednesday"|"thursday"|"friday"|"saturday"|"sunday") {
  const data = await jikan<{ data: JikanAnime[] }>(`/schedules${day ? `?filter=${day}` : ""}`)
  return data?.data || []
}

export async function getJikanTopMovies(page = 1) {
  const data = await jikan<{ data: JikanAnime[] }>(`/top/anime?type=movie&page=${page}`)
  return data?.data || []
}

export async function getJikanSeasonNow(page = 1) {
  const data = await jikan<{ data: JikanAnime[] }>(`/seasons/now?page=${page}`)
  return data?.data || []
}

export async function getJikanSeasonUpcoming(page = 1) {
  const data = await jikan<{ data: JikanAnime[] }>(`/seasons/upcoming?page=${page}`)
  return data?.data || []
}

export async function getJikanRecentEpisodes() {
  const data = await jikan<{ data: { entry: JikanAnime; episodes: any[]; region_locked: boolean }[] }>(`/watch/episodes`)
  return data?.data || []
}
