// Komiku via Sanka Vollerei public API
// Docs: https://www.sankavollerei.com/comic
// Endpoints: terbaru, populer, search, comic/:slug, chapter/:segment, genre/:genre, recommendations

const API = "https://www.sankavollerei.com/comic"

export interface KomikItem {
  title: string
  slug: string             // derived from link
  link: string             // path or full URL on komiku.org
  image: string
  chapter: string | null
  rating: number | null
  genre?: string | null
  status?: string | null
  type?: string | null
  description?: string | null
}

export interface KomikDetail {
  slug: string
  title: string
  title_indonesian: string | null
  image: string
  synopsis: string
  synopsis_full?: string
  summary?: string
  background_story?: string
  metadata: {
    type: string
    author: string
    status: string
    concept: string
    age_rating: string
    reading_direction: string
  }
  genres: { name: string; slug: string; link: string }[]
  chapters: KomikChapter[]
  similar_manga?: KomikItem[]
}

export interface KomikChapter {
  chapter: string
  slug: string
  link: string
  date: string
}

export interface ChapterPage {
  url: string
  index: number
}

export interface ChapterDetail {
  title: string
  chapter: string
  prev: string | null
  next: string | null
  pages: ChapterPage[]
}

// Extract slug from path like "/manga/<slug>/" or "/detail-komik/<slug>/"
export function slugFromLink(link: string): string {
  if (!link) return ""
  const m = link.match(/\/(?:manga|detail-komik)\/([^\/]+)\/?/)
  return m ? m[1] : link.replace(/^\/+|\/+$/g, "").split("/").pop() || ""
}

async function gx<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T | null> {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&")
  const url = `${API}${path}${qs ? "?" + qs : ""}`
  try {
    const r = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "VanX-Stream/1.0" },
      next: { revalidate: 300 }, // 5 min default
    })
    if (!r.ok) {
      console.warn(`Komiku API ${path}: HTTP ${r.status}`)
      return null
    }
    return (await r.json()) as T
  } catch (e: any) {
    console.warn(`Komiku API ${path}:`, e.message || e)
    return null
  }
}

function normalize(c: any): KomikItem {
  const link: string = c.link || c.href || ""
  return {
    title: c.title || "",
    slug: c.slug || slugFromLink(link),
    link,
    image: c.image || c.thumbnail || "",
    chapter: c.chapter || null,
    rating: c.rating ?? null,
    genre: c.genre || (Array.isArray(c.genres) ? c.genres.map((g: any) => g.name).join(", ") : null),
    status: c.status || null,
    type: c.type || null,
    description: c.description || null,
  }
}

// === LISTING ===

export async function getKomikTerbaru(page = 1, limit = 24): Promise<KomikItem[]> {
  const d = await gx<{ comics: any[] }>("/terbaru", { page, limit })
  return (d?.comics || []).map(normalize)
}

export async function getKomikPopuler(page = 1, limit = 24): Promise<KomikItem[]> {
  const d = await gx<{ comics: any[] }>("/populer", { page, limit })
  return (d?.comics || []).map(normalize)
}

export async function getKomikRealtime(count = 24, randomize = false): Promise<KomikItem[]> {
  const d = await gx<{ comics: any[] }>("/realtime", { count, randomize: randomize ? "true" : "false" })
  return (d?.comics || []).map(normalize)
}

export async function getKomikByGenre(genre: string, page = 1, limit = 24): Promise<KomikItem[]> {
  const d = await gx<{ comics: any[] }>(`/genre/${encodeURIComponent(genre)}`, { page, limit })
  return (d?.comics || []).map(normalize)
}

export async function searchKomik(query: string, page = 1, limit = 20): Promise<KomikItem[]> {
  if (!query.trim()) return []
  const d = await gx<{ data?: any[]; comics?: any[] }>("/search", { q: query, page, limit })
  return ((d?.data || d?.comics) || []).map(normalize)
}

export async function getKomikRecommendations(based_on?: string, limit = 12): Promise<KomikItem[]> {
  const d = await gx<{ comics: any[] }>("/recommendations", { based_on, limit })
  return (d?.comics || []).map(normalize)
}

export async function getKomikBerwarna(page = 1): Promise<KomikItem[]> {
  const d = await gx<{ comics: any[] }>(`/berwarna${page > 1 ? "/" + page : ""}`)
  return (d?.comics || []).map(normalize)
}

export async function getKomikPustaka(page = 1): Promise<KomikItem[]> {
  const d = await gx<{ comics: any[]; data?: any[] }>(`/pustaka${page > 1 ? "/" + page : ""}`)
  return ((d?.comics || d?.data) || []).map(normalize)
}

// === DETAIL ===

export async function getKomikDetail(slug: string): Promise<KomikDetail | null> {
  const d = await gx<KomikDetail>(`/comic/${encodeURIComponent(slug)}`)
  return d || null
}

// === CHAPTER READER ===

export async function getChapter(segment: string): Promise<ChapterDetail | null> {
  // segment is the chapter slug like "it-all-starts...-chapter-236"
  const seg = segment.replace(/^\/+|\/+$/g, "")
  const d = await gx<any>(`/chapter/${encodeURIComponent(seg)}`)
  if (!d) return null
  // Normalize variations of chapter response
  const pagesRaw: any[] = d.pages || d.images || d.data || []
  const pages: ChapterPage[] = pagesRaw.map((p: any, i: number) => ({
    url: typeof p === "string" ? p : (p.url || p.image || p.src || ""),
    index: i,
  })).filter((p) => p.url)

  return {
    title: d.title || d.chapter_title || segment,
    chapter: d.chapter || segment,
    prev: d.prev || d.prev_chapter || null,
    next: d.next || d.next_chapter || null,
    pages,
  }
}

// === Genre list (curated since Komiku doesn't expose API for it) ===
export const KOMIKU_GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Isekai", "Martial Arts", "Mystery", "Romance",
  "Sci-Fi", "School Life", "Shounen", "Slice of Life", "Supernatural",
] as const
