// MangaDex API — komik/manga (no key)
// Docs: https://api.mangadex.org/docs/

const BASE = "https://api.mangadex.org"
const COVER = "https://uploads.mangadex.org/covers"

export interface MdManga {
  id: string
  attributes: {
    title: Record<string, string>
    altTitles: Record<string, string>[]
    description: Record<string, string>
    status: string
    year: number | null
    contentRating: string
    tags: { id: string; attributes: { name: Record<string, string>; group: string } }[]
    originalLanguage: string
    lastVolume: string | null
    lastChapter: string | null
    publicationDemographic: string | null
  }
  relationships: { id: string; type: string; attributes?: { fileName?: string; name?: string } }[]
}

export function mdCover(m: MdManga): string {
  const cover = m.relationships.find((r) => r.type === "cover_art")
  if (!cover?.attributes?.fileName) return "https://via.placeholder.com/512x750/1a1a1a/gold?text=No+Cover"
  return `${COVER}/${m.id}/${cover.attributes.fileName}.512.jpg`
}

export function mdTitle(m: MdManga): string {
  const t = m.attributes.title
  return t.en || t["ja-ro"] || t.ja || Object.values(t)[0] || ""
}

export function mdDescription(m: MdManga): string {
  const d = m.attributes.description
  return d.id || d.en || d["ja-ro"] || Object.values(d)[0] || ""
}

interface FetchOpts { limit?: number; offset?: number; order?: string }

async function mdFetch<T>(path: string, params: Record<string, any> = {}): Promise<T | null> {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) v.forEach((x) => qs.append(k, x))
    else if (v !== undefined && v !== null) qs.append(k, String(v))
  }
  // include cover_art relationship
  qs.append("includes[]", "cover_art")
  qs.append("includes[]", "author")
  try {
    const r = await fetch(`${BASE}${path}?${qs}`, { next: { revalidate: 3600 } })
    if (!r.ok) return null
    return await r.json() as T
  } catch { return null }
}

export async function getMangaPopular(limit = 20, offset = 0) {
  const data = await mdFetch<{ data: MdManga[] }>(`/manga`, {
    limit, offset,
    "order[followedCount]": "desc",
    "contentRating[]": ["safe", "suggestive"],
    "availableTranslatedLanguage[]": ["en", "id"],
  })
  return data?.data || []
}

export async function getMangaLatest(limit = 20, offset = 0) {
  const data = await mdFetch<{ data: MdManga[] }>(`/manga`, {
    limit, offset,
    "order[latestUploadedChapter]": "desc",
    "contentRating[]": ["safe", "suggestive"],
    "availableTranslatedLanguage[]": ["en", "id"],
  })
  return data?.data || []
}

export async function getMangaTopRated(limit = 20, offset = 0) {
  const data = await mdFetch<{ data: MdManga[] }>(`/manga`, {
    limit, offset,
    "order[rating]": "desc",
    "contentRating[]": ["safe", "suggestive"],
  })
  return data?.data || []
}

export async function getMangaDetail(id: string) {
  const data = await mdFetch<{ data: MdManga }>(`/manga/${id}`, {})
  return data?.data || null
}

export async function searchManga(query: string, limit = 20) {
  const data = await mdFetch<{ data: MdManga[] }>(`/manga`, {
    title: query,
    limit,
    "contentRating[]": ["safe", "suggestive"],
  })
  return data?.data || []
}
