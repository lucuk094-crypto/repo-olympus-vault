// Search AniList for any media (anime + donghua + manga) by title
// to enrich our YouTube-derived series with rich synopsis & metadata.

const API_URL = "https://graphql.anilist.co"

export interface AniListResult {
  id: number
  idMal: number | null
  title: { romaji: string; english: string | null; native: string | null }
  description: string | null
  coverImage: { extraLarge: string; large: string; color: string | null }
  bannerImage: string | null
  genres: string[]
  format: string | null
  status: string | null
  episodes: number | null
  duration: number | null
  season: string | null
  seasonYear: number | null
  averageScore: number | null
  popularity: number | null
  favourites: number | null
  startDate: { year: number | null; month: number | null; day: number | null }
  endDate: { year: number | null; month: number | null; day: number | null }
  countryOfOrigin: string | null
  source: string | null
  studios: { nodes: { name: string; isAnimationStudio: boolean }[] }
  trailer: { id: string; site: string } | null
  siteUrl: string
}

const QUERY = `
  query ($search: String, $type: MediaType) {
    Media(search: $search, type: $type, sort: [SEARCH_MATCH, POPULARITY_DESC]) {
      id
      idMal
      title { romaji english native }
      description(asHtml: false)
      coverImage { extraLarge large color }
      bannerImage
      genres
      format
      status
      episodes
      duration
      season
      seasonYear
      averageScore
      popularity
      favourites
      startDate { year month day }
      endDate { year month day }
      countryOfOrigin
      source
      studios(isMain: true) {
        nodes { name isAnimationStudio }
      }
      trailer { id site }
      siteUrl
    }
  }
`

const cache = new Map<string, AniListResult | null>()
const inflight = new Map<string, Promise<AniListResult | null>>()

export async function searchAniListMedia(title: string): Promise<AniListResult | null> {
  const key = title.toLowerCase().trim()
  if (cache.has(key)) return cache.get(key) || null
  if (inflight.has(key)) return inflight.get(key)!

  const promise = (async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query: QUERY, variables: { search: title, type: "ANIME" } }),
      })
      if (!res.ok) return null
      const json = await res.json()
      if (json.errors) return null
      const m = json.data?.Media as AniListResult | null
      cache.set(key, m)
      return m
    } catch {
      cache.set(key, null)
      return null
    }
  })()
  inflight.set(key, promise)
  try {
    return await promise
  } finally {
    inflight.delete(key)
  }
}
