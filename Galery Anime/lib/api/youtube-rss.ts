// YouTube RSS feed parser — auto-fetch latest 15 videos per channel
// No API key required. Updates within minutes of upload.
// Used to merge live data with scraped channels.json

export interface RssVideo {
  id: string
  title: string
  thumbnail: string
  published: string | null  // human-readable "2 jam lalu"
  publishedAt: number       // unix timestamp ms
  channelId: string
  channelName: string
  url: string
}

const CHANNELS = [
  { id: "UCrcQMdsFqYpZOHDbm-fnNlw", name: "Yuewen Animation Indonesia", type: "donghua" },
  { id: "UCsKp6Y5J17eOZCSCD-TgzqQ", name: "Joyland Animation",          type: "anime" },
  { id: "UCxB_Xn1GFVatKNX9gjb1WSw", name: "Youku Indonesia",            type: "mixed" },
  { id: "UCvtfzGRjCwvMzd3NL8w8wLQ", name: "iQIYI Indonesia",            type: "dracin" },
  { id: "UC8w78bCZNZkkfaOBXJ_FcEQ", name: "WeTV Dunia Drama",           type: "drakor" },
] as const

export const RSS_CHANNELS = CHANNELS

function rel(date: number): string {
  const diff = Date.now() - date
  const m = Math.floor(diff / 60000)
  if (m < 1) return "Baru saja"
  if (m < 60) return `${m} menit lalu`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} jam lalu`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d} hari lalu`
  const w = Math.floor(d / 7)
  if (w < 4) return `${w} minggu lalu`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `${mo} bulan lalu`
  return `${Math.floor(d / 365)} tahun lalu`
}

function parseRss(xml: string, channelId: string, channelName: string): RssVideo[] {
  const out: RssVideo[] = []
  // Each <entry>...</entry> = one video
  const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || []
  for (const entry of entries) {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
    if (!id) continue
    const title = entry.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() || ""
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1]?.trim()
    const ts = published ? Date.parse(published) : Date.now()
    const thumb = entry.match(/url="([^"]+hqdefault[^"]+)"/)?.[1]
      || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    out.push({
      id,
      title,
      thumbnail: thumb,
      published: rel(ts),
      publishedAt: ts,
      channelId,
      channelName,
      url: `https://www.youtube.com/watch?v=${id}`,
    })
  }
  return out
}

async function fetchOneFeed(channelId: string, channelName: string): Promise<RssVideo[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 VanX-Stream",
        Accept: "application/atom+xml,application/xml,text/xml",
      },
      next: { revalidate: 300 }, // 5-min cache (Next/Vercel layer)
    })
    if (!r.ok) {
      console.warn(`RSS ${channelName}: HTTP ${r.status}`)
      return []
    }
    const xml = await r.text()
    return parseRss(xml, channelId, channelName)
  } catch (e: any) {
    console.warn(`RSS ${channelName}: ${e.message || e}`)
    return []
  }
}

// In-memory cache to dedupe parallel calls
let cache: { at: number; data: RssVideo[] } | null = null
const TTL = 5 * 60_000 // 5 min

export async function fetchAllChannelFeeds(): Promise<RssVideo[]> {
  const now = Date.now()
  if (cache && now - cache.at < TTL) return cache.data

  const results = await Promise.all(
    CHANNELS.map((c) => fetchOneFeed(c.id, c.name))
  )
  const all = results.flat().sort((a, b) => b.publishedAt - a.publishedAt)
  cache = { at: now, data: all }
  return all
}

export function clearRssCache() {
  cache = null
}
