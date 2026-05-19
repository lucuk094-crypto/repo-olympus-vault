// On-demand fetch of full anime detail from AniList GraphQL
// Used by the Netflix-style detail modal

const API_URL = "https://graphql.anilist.co"

export interface StreamingEpisode {
  title: string | null
  thumbnail: string | null
  url: string | null
  site: string | null
}

export interface ExternalLink {
  id: number
  url: string
  site: string
  type: string | null
  language: string | null
  color: string | null
  icon: string | null
}

export interface RankingEntry {
  id: number
  rank: number
  type: string
  format: string
  year: number | null
  season: string | null
  allTime: boolean
  context: string
}

export interface RelationEdge {
  relationType: string
  node: {
    id: number
    title: { romaji: string; english: string | null; native: string | null }
    coverImage: { large: string; color: string | null }
    type: string
    format: string | null
    status: string | null
    episodes: number | null
  }
}

export interface RecommendationEdge {
  node: {
    id: number
    rating: number
    mediaRecommendation: {
      id: number
      title: { romaji: string; english: string | null }
      coverImage: { large: string; color: string | null }
      averageScore: number | null
      seasonYear: number | null
      format: string | null
    } | null
  }
}

export interface StaffEdge {
  role: string
  node: {
    id: number
    name: { full: string }
    image: { medium: string }
  }
}

export interface CharacterEdge {
  role: string
  node: {
    id: number
    name: { full: string; native: string | null }
    image: { medium: string; large: string }
  }
  voiceActors: { id: number; name: { full: string }; image: { medium: string }; languageV2: string }[]
}

export interface MediaTag {
  id: number
  name: string
  description: string | null
  category: string | null
  rank: number | null
  isGeneralSpoiler: boolean
  isMediaSpoiler: boolean
  isAdult: boolean
}

export interface NextAiringEpisode {
  airingAt: number
  timeUntilAiring: number
  episode: number
}

export interface AnimeDetail {
  id: number
  idMal: number | null
  title: { romaji: string; english: string | null; native: string | null; userPreferred?: string }
  synonyms: string[]
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
  meanScore: number | null
  popularity: number | null
  favourites: number | null
  trending: number | null
  source: string | null
  hashtag: string | null
  countryOfOrigin: string | null
  startDate: { year: number | null; month: number | null; day: number | null }
  endDate: { year: number | null; month: number | null; day: number | null }
  studios: { edges: { isMain: boolean; node: { id: number; name: string; isAnimationStudio: boolean } }[] }
  trailer: { id: string; site: string; thumbnail: string } | null
  characters: { edges: CharacterEdge[] }
  staff: { edges: StaffEdge[] }
  externalLinks: ExternalLink[]
  streamingEpisodes: StreamingEpisode[]
  rankings: RankingEntry[]
  relations: { edges: RelationEdge[] }
  recommendations: { edges: RecommendationEdge[] }
  tags: MediaTag[]
  nextAiringEpisode: NextAiringEpisode | null
  siteUrl: string
  isAdult: boolean
}

const QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      idMal
      title { romaji english native userPreferred }
      synonyms
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
      meanScore
      popularity
      favourites
      trending
      source
      hashtag
      countryOfOrigin
      isAdult
      startDate { year month day }
      endDate { year month day }
      studios {
        edges { isMain node { id name isAnimationStudio } }
      }
      trailer { id site thumbnail }
      characters(perPage: 12, sort: [ROLE, RELEVANCE, ID]) {
        edges {
          role
          node { id name { full native } image { medium large } }
          voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
            id name { full } image { medium } languageV2
          }
        }
      }
      staff(perPage: 8, sort: [RELEVANCE, ID]) {
        edges {
          role
          node { id name { full } image { medium } }
        }
      }
      externalLinks { id url site type language color icon }
      streamingEpisodes { title thumbnail url site }
      rankings { id rank type format year season allTime context }
      relations {
        edges {
          relationType(version: 2)
          node {
            id
            title { romaji english native }
            coverImage { large color }
            type format status episodes
          }
        }
      }
      recommendations(perPage: 8, sort: [RATING_DESC]) {
        edges {
          node {
            id
            rating
            mediaRecommendation {
              id
              title { romaji english }
              coverImage { large color }
              averageScore
              seasonYear
              format
            }
          }
        }
      }
      tags { id name description category rank isGeneralSpoiler isMediaSpoiler isAdult }
      nextAiringEpisode { airingAt timeUntilAiring episode }
      siteUrl
    }
  }
`

const cache = new Map<number, AnimeDetail>()
const inflight = new Map<number, Promise<AnimeDetail>>()

export async function fetchAnimeDetail(id: number): Promise<AnimeDetail> {
  if (cache.has(id)) return cache.get(id)!
  if (inflight.has(id)) return inflight.get(id)!

  const promise = (async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { id } }),
    })

    if (!res.ok) throw new Error(`AniList HTTP ${res.status}`)
    const json = await res.json()
    if (json.errors) throw new Error(json.errors[0]?.message || "AniList query error")

    const detail: AnimeDetail = json.data.Media
    cache.set(id, detail)
    return detail
  })()

  inflight.set(id, promise)
  try {
    return await promise
  } finally {
    inflight.delete(id)
  }
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return ""
  return html
    .replace(/<br\s*\/?>(\s*)/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}
