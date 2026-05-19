// AniList GraphQL API (no key required)
// Used for anime metadata: rich, accurate, anime-focused

const ENDPOINT = "https://graphql.anilist.co"

export interface AniListMedia {
  id: number
  idMal: number | null
  title: { romaji: string; english: string | null; native: string | null }
  description: string | null
  coverImage: { extraLarge: string; large: string; color: string | null }
  bannerImage: string | null
  format: string | null
  status: string | null
  episodes: number | null
  duration: number | null
  season: string | null
  seasonYear: number | null
  averageScore: number | null
  popularity: number | null
  favourites: number | null
  trending: number | null
  countryOfOrigin: string | null
  genres: string[]
  source: string | null
  studios: { nodes: { name: string; isAnimationStudio: boolean }[] }
  trailer: { id: string; site: string; thumbnail: string | null } | null
  startDate: { year: number | null; month: number | null; day: number | null }
  endDate: { year: number | null; month: number | null; day: number | null }
  nextAiringEpisode: { airingAt: number; timeUntilAiring: number; episode: number } | null
  siteUrl: string
}

const FIELDS = `
  id
  idMal
  title { romaji english native }
  description(asHtml: false)
  coverImage { extraLarge large color }
  bannerImage
  format status episodes duration season seasonYear
  averageScore popularity favourites trending
  countryOfOrigin genres source
  studios(isMain: true) { nodes { name isAnimationStudio } }
  trailer { id site thumbnail }
  startDate { year month day }
  endDate { year month day }
  nextAiringEpisode { airingAt timeUntilAiring episode }
  siteUrl
`

async function gql<T>(query: string, variables: any = {}): Promise<T | null> {
  const tries = 2
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "VanX-Stream/1.0 (Vercel)",
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: 1800 },
      })
      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 1500))
        continue
      }
      if (!res.ok) {
        console.error(`AniList HTTP ${res.status}`)
        return null
      }
      const json = await res.json()
      if (json.errors) {
        console.error("AniList errors:", json.errors[0]?.message)
        return null
      }
      return json.data as T
    } catch (e: any) {
      console.error("AniList fetch failed:", e.message || e)
      if (i === tries - 1) return null
    }
  }
  return null
}

export async function getAnimeTrending(perPage = 20, page = 1) {
  const data = await gql<{ Page: { media: AniListMedia[] } }>(
    `query ($p: Int, $pp: Int) {
       Page(page: $p, perPage: $pp) {
         media(type: ANIME, sort: TRENDING_DESC) { ${FIELDS} }
       }
     }`,
    { p: page, pp: perPage },
  )
  return data?.Page.media || []
}

export async function getAnimePopularThisSeason(perPage = 20) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const season =
    month <= 3 ? "WINTER" :
    month <= 6 ? "SPRING" :
    month <= 9 ? "SUMMER" : "FALL"
  const data = await gql<{ Page: { media: AniListMedia[] } }>(
    `query ($s: MediaSeason, $y: Int, $pp: Int) {
       Page(page: 1, perPage: $pp) {
         media(type: ANIME, season: $s, seasonYear: $y, sort: POPULARITY_DESC) { ${FIELDS} }
       }
     }`,
    { s: season, y: year, pp: perPage },
  )
  return data?.Page.media || []
}

export async function getAnimePopularAllTime(perPage = 20, page = 1) {
  const data = await gql<{ Page: { media: AniListMedia[] } }>(
    `query ($p: Int, $pp: Int) {
       Page(page: $p, perPage: $pp) {
         media(type: ANIME, sort: POPULARITY_DESC) { ${FIELDS} }
       }
     }`,
    { p: page, pp: perPage },
  )
  return data?.Page.media || []
}

export async function getAnimeTopRated(perPage = 20, page = 1) {
  const data = await gql<{ Page: { media: AniListMedia[] } }>(
    `query ($p: Int, $pp: Int) {
       Page(page: $p, perPage: $pp) {
         media(type: ANIME, sort: SCORE_DESC) { ${FIELDS} }
       }
     }`,
    { p: page, pp: perPage },
  )
  return data?.Page.media || []
}

export async function getAnimeByGenre(genre: string, perPage = 20, page = 1) {
  const data = await gql<{ Page: { media: AniListMedia[] } }>(
    `query ($g: String, $p: Int, $pp: Int) {
       Page(page: $p, perPage: $pp) {
         media(type: ANIME, genre: $g, sort: POPULARITY_DESC) { ${FIELDS} }
       }
     }`,
    { g: genre, p: page, pp: perPage },
  )
  return data?.Page.media || []
}

export async function getAnimeDetail(id: number | string) {
  const data = await gql<{ Media: AniListMedia & {
    streamingEpisodes: { title: string; thumbnail: string; url: string; site: string }[]
    characters: { edges: { role: string; node: { id: number; name: { full: string }; image: { medium: string } }; voiceActors: { id: number; name: { full: string }; image: { medium: string }; languageV2: string }[] }[] }
    staff: { edges: { role: string; node: { id: number; name: { full: string }; image: { medium: string } } }[] }
    relations: { edges: { relationType: string; node: AniListMedia }[] }
    recommendations: { edges: { node: { rating: number; mediaRecommendation: AniListMedia | null } }[] }
    rankings: { id: number; rank: number; type: string; allTime: boolean; context: string; year: number | null; season: string | null; format: string | null }[]
    tags: { id: number; name: string; description: string | null; rank: number; isMediaSpoiler: boolean; isAdult: boolean; category: string | null }[]
    externalLinks: { id: number; url: string; site: string; type: string | null; language: string | null; color: string | null; icon: string | null }[]
    stats: {
      scoreDistribution: { score: number; amount: number }[]
      statusDistribution: { status: string; amount: number }[]
    }
    synonyms: string[]
    hashtag: string | null
    meanScore: number | null
    isAdult: boolean
  } }>(
    `query ($id: Int) {
       Media(id: $id, type: ANIME) {
         ${FIELDS}
         meanScore
         synonyms
         hashtag
         isAdult
         streamingEpisodes { title thumbnail url site }
         characters(perPage: 18, sort: [ROLE, RELEVANCE, ID]) {
           edges {
             role
             node { id name { full } image { medium } }
             voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) { id name { full } image { medium } languageV2 }
           }
         }
         staff(perPage: 12, sort: [RELEVANCE, ID]) {
           edges { role node { id name { full } image { medium } } }
         }
         relations { edges { relationType(version: 2) node { ${FIELDS} } } }
         recommendations(perPage: 8, sort: [RATING_DESC]) {
           edges { node { rating mediaRecommendation { ${FIELDS} } } }
         }
         rankings { id rank type allTime context year season format }
         tags { id name description rank isMediaSpoiler isAdult category }
         externalLinks { id url site type language color icon }
         stats {
           scoreDistribution { score amount }
           statusDistribution { status amount }
         }
       }
     }`,
    { id: Number(id) },
  )
  return data?.Media || null
}

export async function searchAnime(query: string, perPage = 20) {
  const data = await gql<{ Page: { media: AniListMedia[] } }>(
    `query ($s: String, $pp: Int) {
       Page(page: 1, perPage: $pp) {
         media(type: ANIME, search: $s, sort: SEARCH_MATCH) { ${FIELDS} }
       }
     }`,
    { s: query, pp: perPage },
  )
  return data?.Page.media || []
}

// Helpers
export function aniTitle(m: { title: AniListMedia["title"] }): string {
  return m.title.english || m.title.romaji || m.title.native || ""
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
