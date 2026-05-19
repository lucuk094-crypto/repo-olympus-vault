// TMDB API wrapper — uses v4 read token (Bearer)
// Docs: https://developer.themoviedb.org/reference/intro/getting-started

const READ_TOKEN = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN || process.env.TMDB_READ_TOKEN ||
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjc2YThhZTFjYzE3MTBiNjI5NzNjOGU0YWQ5MTU0NyIsIm5iZiI6MTc3OTA0MTI0Ni44MTEsInN1YiI6IjZhMGEwM2RlMDUzNzk4MWFmYTFlNzBhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UdSVv7GE3Nle4Qc88D6UPa9wFlkCida-XMe3DDEpQMw"

const BASE = "https://api.themoviedb.org/3"
const IMG = "https://image.tmdb.org/t/p"

export type ImgSize =
  | "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original"
  | "w300" | "w1280"

export const tmdbImg = (path: string | null | undefined, size: ImgSize = "w500"): string => {
  if (!path) return "https://via.placeholder.com/500x750/1a1a1a/gold?text=No+Image"
  return `${IMG}/${size}${path}`
}

interface FetchOpts {
  language?: string
  region?: string
  page?: number
  query?: string
  withGenres?: string
  sortBy?: string
  year?: number
  cache?: RequestCache
}

async function tmdbFetch<T = any>(path: string, opts: FetchOpts = {}): Promise<T | null> {
  const params = new URLSearchParams({
    language: opts.language || "id-ID",
    ...(opts.region && { region: opts.region }),
    ...(opts.page && { page: String(opts.page) }),
    ...(opts.query && { query: opts.query }),
    ...(opts.withGenres && { with_genres: opts.withGenres }),
    ...(opts.sortBy && { sort_by: opts.sortBy }),
    ...(opts.year && { year: String(opts.year) }),
  })
  try {
    const res = await fetch(`${BASE}${path}?${params}`, {
      headers: {
        Authorization: `Bearer ${READ_TOKEN}`,
        Accept: "application/json",
      },
      cache: opts.cache ?? "force-cache",
      next: { revalidate: 3600 }, // 1h
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// === Movies ===
export interface TmdbMovie {
  id: number
  title: string
  original_title: string
  overview: string | null
  poster_path: string | null
  backdrop_path: string | null
  release_date: string | null
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  original_language: string
}

export interface TmdbMovieDetail extends TmdbMovie {
  genres: { id: number; name: string }[]
  runtime: number | null
  status: string
  tagline: string | null
  homepage: string | null
  budget: number
  revenue: number
  production_companies: { id: number; name: string; logo_path: string | null }[]
  videos?: { results: TmdbVideo[] }
  credits?: { cast: TmdbCast[]; crew: TmdbCrew[] }
  recommendations?: { results: TmdbMovie[] }
  similar?: { results: TmdbMovie[] }
  external_ids?: { imdb_id: string | null }
}

export interface TmdbTv extends Omit<TmdbMovie, "title" | "original_title" | "release_date"> {
  name: string
  original_name: string
  first_air_date: string | null
  origin_country: string[]
}

export interface TmdbTvDetail extends TmdbTv {
  genres: { id: number; name: string }[]
  number_of_episodes: number
  number_of_seasons: number
  episode_run_time: number[]
  status: string
  in_production: boolean
  last_episode_to_air: TmdbEpisode | null
  next_episode_to_air: TmdbEpisode | null
  seasons: TmdbSeason[]
  videos?: { results: TmdbVideo[] }
  credits?: { cast: TmdbCast[]; crew: TmdbCrew[] }
  recommendations?: { results: TmdbTv[] }
  similar?: { results: TmdbTv[] }
}

export interface TmdbSeason {
  id: number
  season_number: number
  episode_count: number
  air_date: string | null
  name: string
  overview: string
  poster_path: string | null
}

export interface TmdbEpisode {
  id: number
  name: string
  overview: string
  episode_number: number
  season_number: number
  air_date: string | null
  still_path: string | null
  vote_average: number
  runtime: number | null
}

export interface TmdbVideo {
  id: string
  key: string
  site: string  // YouTube, Vimeo
  type: string  // Trailer, Teaser, Clip, ...
  official: boolean
  iso_639_1: string
  name: string
  published_at: string
}

export interface TmdbCast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface TmdbCrew {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

// === Movies fns ===
export async function getMoviesPopular(page = 1) {
  return tmdbFetch<{ results: TmdbMovie[]; total_pages: number }>(`/movie/popular`, { page })
}

export async function getMoviesTrending(window: "day" | "week" = "day") {
  return tmdbFetch<{ results: TmdbMovie[] }>(`/trending/movie/${window}`)
}

export async function getMoviesNowPlaying(page = 1) {
  return tmdbFetch<{ results: TmdbMovie[] }>(`/movie/now_playing`, { page, region: "ID" })
}

export async function getMoviesTopRated(page = 1) {
  return tmdbFetch<{ results: TmdbMovie[] }>(`/movie/top_rated`, { page })
}

export async function getMoviesUpcoming(page = 1) {
  return tmdbFetch<{ results: TmdbMovie[] }>(`/movie/upcoming`, { page })
}

export async function getMovieDetail(id: number | string) {
  return tmdbFetch<TmdbMovieDetail>(`/movie/${id}`, {
    language: "id-ID",
  }).then(async (data) => {
    if (!data) return null
    // Append details
    const append = await tmdbFetch<any>(`/movie/${id}`, { language: "id-ID" })
      .then(() => fetch(`${BASE}/movie/${id}?language=id-ID&append_to_response=videos,credits,recommendations,similar,external_ids`, {
        headers: { Authorization: `Bearer ${READ_TOKEN}` },
        next: { revalidate: 3600 },
      }))
      .then((r) => r.ok ? r.json() : null)
    return append || data
  })
}

export async function searchMovies(query: string, page = 1) {
  return tmdbFetch<{ results: TmdbMovie[] }>(`/search/movie`, { query, page })
}

// === TV fns ===
export async function getTvPopular(page = 1) {
  return tmdbFetch<{ results: TmdbTv[] }>(`/tv/popular`, { page })
}

export async function getTvTrending(window: "day" | "week" = "day") {
  return tmdbFetch<{ results: TmdbTv[] }>(`/trending/tv/${window}`)
}

export async function getTvAiringToday(page = 1) {
  return tmdbFetch<{ results: TmdbTv[] }>(`/tv/airing_today`, { page })
}

export async function getTvOnAir(page = 1) {
  return tmdbFetch<{ results: TmdbTv[] }>(`/tv/on_the_air`, { page })
}

export async function getTvTopRated(page = 1) {
  return tmdbFetch<{ results: TmdbTv[] }>(`/tv/top_rated`, { page })
}

export async function getTvDetail(id: number | string) {
  const r = await fetch(
    `${BASE}/tv/${id}?language=id-ID&append_to_response=videos,credits,recommendations,similar,external_ids`,
    { headers: { Authorization: `Bearer ${READ_TOKEN}` }, next: { revalidate: 3600 } },
  )
  if (!r.ok) return null
  return (await r.json()) as TmdbTvDetail
}

export async function getTvSeason(id: number | string, season: number) {
  const r = await fetch(`${BASE}/tv/${id}/season/${season}?language=id-ID`, {
    headers: { Authorization: `Bearer ${READ_TOKEN}` },
    next: { revalidate: 3600 },
  })
  if (!r.ok) return null
  return (await r.json()) as TmdbSeason & { episodes: TmdbEpisode[] }
}

export async function searchTv(query: string, page = 1) {
  return tmdbFetch<{ results: TmdbTv[] }>(`/search/tv`, { query, page })
}

// === Discover (filter by region/language for Asian dramas) ===
export async function discoverDrama(opts: { country?: string; page?: number; sortBy?: string } = {}) {
  // origin_country=KR for K-drama, JP for J-drama, CN for C-drama
  const params = new URLSearchParams({
    language: "id-ID",
    page: String(opts.page || 1),
    sort_by: opts.sortBy || "popularity.desc",
    ...(opts.country && { with_origin_country: opts.country }),
  })
  const r = await fetch(`${BASE}/discover/tv?${params}`, {
    headers: { Authorization: `Bearer ${READ_TOKEN}` },
    next: { revalidate: 3600 },
  })
  if (!r.ok) return null
  return (await r.json()) as { results: TmdbTv[]; total_pages: number }
}

export async function discoverMovieByLang(opts: { language?: string; page?: number; year?: number } = {}) {
  const params = new URLSearchParams({
    language: "id-ID",
    page: String(opts.page || 1),
    sort_by: "popularity.desc",
    ...(opts.language && { with_original_language: opts.language }),
    ...(opts.year && { primary_release_year: String(opts.year) }),
  })
  const r = await fetch(`${BASE}/discover/movie?${params}`, {
    headers: { Authorization: `Bearer ${READ_TOKEN}` },
    next: { revalidate: 3600 },
  })
  if (!r.ok) return null
  return (await r.json()) as { results: TmdbMovie[]; total_pages: number }
}

// === Multi search (movies + tv + people) ===
export async function searchMulti(query: string, page = 1) {
  const r = await fetch(`${BASE}/search/multi?language=id-ID&query=${encodeURIComponent(query)}&page=${page}`, {
    headers: { Authorization: `Bearer ${READ_TOKEN}` },
    next: { revalidate: 600 },
  })
  if (!r.ok) return null
  return (await r.json()) as { results: any[] }
}

// Helpers
export function pickTrailer(videos?: TmdbVideo[]): TmdbVideo | null {
  if (!videos || videos.length === 0) return null
  // Priority: official YouTube trailer > YouTube trailer > YouTube teaser > first video
  const yt = videos.filter((v) => v.site === "YouTube")
  return (
    yt.find((v) => v.type === "Trailer" && v.official) ||
    yt.find((v) => v.type === "Trailer") ||
    yt.find((v) => v.type === "Teaser") ||
    yt[0] ||
    null
  )
}
