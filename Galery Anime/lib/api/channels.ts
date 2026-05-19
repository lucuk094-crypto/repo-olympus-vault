// Channel data — runtime fetch + matcher to AniList/TMDB titles
// Source: public/data/channels.json (built via scripts/fetch-channels.js)
// + Live RSS feeds (top 15 latest per channel) auto-merged for fresh updates.

import { fetchAllChannelFeeds, type RssVideo } from "./youtube-rss"

export interface ChannelEpisode {
  id: string
  title: string
  thumbnail: string
  published: string | null
  length: string | null
  views: string | null
  channelId: string
  channelName: string
  channelType: string
  type: string
  kind: "episode" | "trailer" | "music" | "clip"
  series: string
  ep: number | null
  url: string
}

export interface ChannelSeries {
  seriesKey: string
  seriesName: string
  type: string
  thumbnail: string
  channelName: string
  channelId: string
  episodes: ChannelEpisode[]
}

export interface ChannelsData {
  fetchedAt: string
  totalVideos: number
  totalSeries: number
  channels: { id: string; name: string; type: string; handle: string; count: number }[]
  series: ChannelSeries[]
}

let cache: ChannelsData | null = null
let cacheAt = 0
let inflight: Promise<ChannelsData | null> | null = null
const CACHE_TTL = 30 * 60_000 // 30 min — auto-refresh from disk

async function load(): Promise<ChannelsData | null> {
  const now = Date.now()
  if (cache && now - cacheAt < CACHE_TTL) return cache
  if (inflight) return inflight
  inflight = (async () => {
    try {
      // Server-side: read from public dir directly
      if (typeof window === "undefined") {
        const fs = await import("fs/promises")
        const path = await import("path")
        const file = path.join(process.cwd(), "public", "data", "channels.json")
        const raw = await fs.readFile(file, "utf8")
        cache = JSON.parse(raw)
        cacheAt = now
        return cache
      } else {
        const r = await fetch(`/data/channels.json?t=${Math.floor(now / CACHE_TTL)}`, { cache: "force-cache" })
        if (!r.ok) return null
        cache = await r.json()
        cacheAt = now
        return cache
      }
    } catch (e) {
      console.error("Channels load failed:", e)
      return null
    } finally {
      inflight = null
    }
  })()
  return inflight
}

// Extract series name and episode number from a YouTube title
// Examples:
//  "Battle Through the Heavens 5 | Episode 06 - The Awakening" → series="Battle Through the Heavens 5", ep=6
//  "Throne of Seal Episode 121 [Sub Indo]" → series="Throne of Seal", ep=121
//  "[Multi Sub] To Be A Power Episode 78" → series="To Be A Power", ep=78
function parseSeriesAndEp(rawTitle: string): { series: string; ep: number | null; kind: ChannelEpisode["kind"] } {
  const title = rawTitle
    .replace(/\[(?:multi sub|sub indo|sub eng|english sub|indo sub|hd|fhd|4k|original|raw)[^\]]*\]/gi, "")
    .replace(/【[^】]*】/g, "")
    .trim()

  // Detect kind
  let kind: ChannelEpisode["kind"] = "episode"
  if (/\b(trailer|teaser|preview|pv)\b/i.test(title)) kind = "trailer"
  else if (/\b(opening|ending|op|ed|ost|theme|mv|music\s+video)\b/i.test(title)) kind = "music"
  else if (/\b(behind|making|interview|press|red carpet|highlight|recap)\b/i.test(title)) kind = "clip"

  // Extract episode number from various formats
  let ep: number | null = null
  const epPatterns = [
    /\bepisode\s+(\d{1,4})\b/i,
    /\beps?\.?\s*(\d{1,4})\b/i,
    /\bep\s*(\d{1,4})\b/i,
    /\b第\s*(\d{1,4})\s*集\b/, // Chinese
    /\bE(\d{1,4})\b/,
    /\|\s*(\d{1,4})\s*$/,
  ]
  for (const re of epPatterns) {
    const m = title.match(re)
    if (m) { ep = parseInt(m[1], 10); break }
  }

  // Extract series: take part before first separator
  const seriesRaw = title
    .split(/\s*(?:\||\—|–|-|\:|·|•)\s+/i)[0]
    .replace(/\bepisode\s+\d+.*$/i, "")
    .replace(/\beps?\.?\s*\d+.*$/i, "")
    .replace(/\bep\s*\d+.*$/i, "")
    .replace(/\bE\d+.*$/i, "")
    .replace(/\b(trailer|teaser|preview|pv|opening|ending|recap)\b.*$/i, "")
    .trim()

  return { series: seriesRaw || title, ep, kind }
}

function rssToEpisode(v: RssVideo, type: string): ChannelEpisode {
  const { series, ep, kind } = parseSeriesAndEp(v.title)
  return {
    id: v.id,
    title: v.title,
    thumbnail: v.thumbnail,
    published: v.published,
    length: null,
    views: null,
    channelId: v.channelId,
    channelName: v.channelName,
    channelType: type,
    type,
    kind,
    series,
    ep,
    url: v.url,
  }
}

const CHANNEL_TYPE: Record<string, string> = {
  "UCrcQMdsFqYpZOHDbm-fnNlw": "donghua",
  "UCsKp6Y5J17eOZCSCD-TgzqQ": "anime",
  "UCxB_Xn1GFVatKNX9gjb1WSw": "mixed",
  "UCvtfzGRjCwvMzd3NL8w8wLQ": "dracin",
  "UC8w78bCZNZkkfaOBXJ_FcEQ": "drakor",
}

// Merge RSS feed (latest videos) into the loaded series data
async function mergeRssWithSeries(base: ChannelSeries[]): Promise<ChannelSeries[]> {
  let rss: RssVideo[] = []
  try {
    rss = await fetchAllChannelFeeds()
  } catch {
    return base
  }
  if (!rss.length) return base

  // Build set of existing video IDs across all series for dedup
  const seenIds = new Set<string>()
  for (const s of base) {
    for (const ep of s.episodes) seenIds.add(ep.id)
  }

  // For each RSS video, attach to a series (existing or new)
  // Use mutable copy
  const out: ChannelSeries[] = base.map((s) => ({ ...s, episodes: [...s.episodes] }))
  const seriesByKey = new Map<string, ChannelSeries>()
  for (const s of out) seriesByKey.set(s.seriesKey, s)

  for (const v of rss) {
    if (seenIds.has(v.id)) continue
    seenIds.add(v.id)

    const type = CHANNEL_TYPE[v.channelId] || "mixed"
    const ep = rssToEpisode(v, type)

    // Find best series match by normalized name
    const seriesKey = `${v.channelId}::${normalize(ep.series).replace(/\s+/g, "-")}`
    let s = seriesByKey.get(seriesKey)
    if (!s) {
      // Also try matching with existing series of same channel
      const norm = normalize(ep.series)
      s = out.find((x) => x.channelId === v.channelId && normalize(x.seriesName) === norm)
    }
    if (s) {
      // Prepend (most recent first)
      s.episodes.unshift(ep)
    } else {
      const newSeries: ChannelSeries = {
        seriesKey,
        seriesName: ep.series,
        type,
        thumbnail: v.thumbnail,
        channelName: v.channelName,
        channelId: v.channelId,
        episodes: [ep],
      }
      out.unshift(newSeries) // newest series first
      seriesByKey.set(seriesKey, newSeries)
    }
  }

  return out
}

export async function getAllSeries(): Promise<ChannelSeries[]> {
  const d = await load()
  const base = d?.series || []
  // Server-side: enrich with live RSS feeds
  if (typeof window === "undefined") {
    return await mergeRssWithSeries(base)
  }
  return base
}

export async function getSeriesByType(type: string): Promise<ChannelSeries[]> {
  const all = await getAllSeries()
  return all.filter((s) => s.type === type)
}

// Normalize title for matching
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\[\]\(\)]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

// Find channel series matching given titles (english + romaji + original + character names)
export async function findChannelSeries(titles: (string | null | undefined)[]): Promise<ChannelSeries | null> {
  const all = await getAllSeries()
  const queries = titles.filter(Boolean).map((t) => normalize(String(t)))

  for (const q of queries) {
    if (!q || q.length < 3) continue

    // exact match first
    let hit = all.find((s) => normalize(s.seriesName) === q)
    if (hit) return hit

    // includes match
    hit = all.find((s) => {
      const n = normalize(s.seriesName)
      return n.includes(q) || q.includes(n)
    })
    if (hit) return hit

    // fuzzy match with similarity score
    let bestMatch: ChannelSeries | null = null
    let bestScore = 0

    for (const series of all) {
      const n = normalize(series.seriesName)
      const score = calculateSimilarity(q, n)
      if (score > bestScore && score > 0.6) {
        bestScore = score
        bestMatch = series
      }
    }

    if (bestMatch) return bestMatch
  }

  return null
}

// Calculate similarity score between two strings (Levenshtein distance)
function calculateSimilarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2
  const shorter = s1.length > s2.length ? s2 : s1

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = []
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j
      } else if (j > 0) {
        let newValue = costs[j - 1]
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
        }
        costs[j - 1] = lastValue
        lastValue = newValue
      }
    }
    if (i > 0) costs[s2.length] = lastValue
  }
  return costs[s2.length]
}

export async function searchChannelSeries(query: string, limit = 20): Promise<ChannelSeries[]> {
  const all = await getAllSeries()
  const q = normalize(query)
  if (!q) return []
  return all.filter((s) => normalize(s.seriesName).includes(q)).slice(0, limit)
}

export function ytEmbed(videoId: string, opts: { autoplay?: boolean } = {}): string {
  const params = new URLSearchParams({
    rel: "0", modestbranding: "1", hl: "id",
    cc_lang_pref: "id", cc_load_policy: "1",
    iv_load_policy: "3", playsinline: "1", fs: "1",
    ...(opts.autoplay && { autoplay: "1" }),
  })
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`
}
