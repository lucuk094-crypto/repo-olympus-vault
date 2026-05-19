// API: GET /api/latest-episodes
// Returns the latest episodes by combining:
// - Live YouTube RSS feeds (top 15 latest per channel) — auto-updates within minutes
// - Scraped channels.json (deeper history)
// Sorted by published date (most recent first).

import { NextResponse } from "next/server"
import { fetchAllChannelFeeds } from "@/lib/api/youtube-rss"
import { getAllSeries } from "@/lib/api/channels"

export const revalidate = 300 // 5 min — match RSS cache

const CHANNEL_TYPE: Record<string, string> = {
  "UCrcQMdsFqYpZOHDbm-fnNlw": "donghua",
  "UCsKp6Y5J17eOZCSCD-TgzqQ": "anime",
  "UCxB_Xn1GFVatKNX9gjb1WSw": "mixed",
  "UCvtfzGRjCwvMzd3NL8w8wLQ": "dracin",
  "UC8w78bCZNZkkfaOBXJ_FcEQ": "drakor",
}

// Crude relative-date parser for non-RSS scraped items (lower = newer)
function parseScrapedDate(published: string | null | undefined): number {
  if (!published) return 0
  const s = published.toLowerCase()
  const num = parseInt(s.match(/\d+/)?.[0] || "0", 10)
  let mult = 0
  if (/jam|hour/.test(s)) mult = 1
  else if (/hari|day/.test(s)) mult = 24
  else if (/minggu|week/.test(s)) mult = 24 * 7
  else if (/bulan|month/.test(s)) mult = 24 * 30
  else if (/tahun|year/.test(s)) mult = 24 * 365
  else if (/menit|minute/.test(s)) mult = 0.02
  return -(num * mult)
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "24", 10), 100)
  const type = url.searchParams.get("type") // anime|drama|donghua|cdrama|kdrama|all

  // === 1) Live RSS (newest, with proper timestamps) ===
  const rss = await fetchAllChannelFeeds().catch(() => [])
  const rssMapped = rss.map((v) => {
    // Clean title for series name
    const cleaned = v.title
      .replace(/【[^】]*】/g, "") // remove 【Trailer EP08】
      .replace(/\[(?:multi sub|sub indo|sub eng|english sub|indo sub|hd|fhd|4k|original|raw|trailer|teaser|preview)[^\]]*\]/gi, "")
      .replace(/\b(trailer|teaser|preview|pv|ep\.|episode|eps)\.?\s*\d+\b/gi, "")
      .trim()
    const seriesName = cleaned.split(/\s*[\|\-:·]\s+/)[0].trim() || v.title
    return {
      id: v.id,
      title: v.title,
      thumbnail: v.thumbnail,
      published: v.published,
      publishedAt: v.publishedAt,
      length: null as string | null,
      views: null as string | null,
      channelId: v.channelId,
      channelName: v.channelName,
      seriesType: CHANNEL_TYPE[v.channelId] || "mixed",
      seriesKey: `${v.channelId}::live::${v.id}`,
      seriesName,
      ep: null as number | null,
      url: v.url,
      source: "rss" as const,
    }
  })

  // === 2) Scraped channels.json deeper history ===
  const all = await getAllSeries().catch(() => [])
  const flatScraped = all.flatMap((s) =>
    s.episodes
      .filter((ep) => ep.kind === "episode")
      .map((ep) => ({
        id: ep.id,
        title: ep.title,
        thumbnail: ep.thumbnail,
        published: ep.published,
        publishedAt: 0, // unknown precise time
        length: ep.length,
        views: ep.views,
        channelId: ep.channelId,
        channelName: ep.channelName,
        seriesType: s.type,
        seriesKey: s.seriesKey,
        seriesName: s.seriesName,
        ep: ep.ep,
        url: ep.url,
        source: "scrape" as const,
      }))
  )

  // === 3) Merge — RSS wins on dup id ===
  const seenIds = new Set<string>(rssMapped.map((v) => v.id))
  const merged = [...rssMapped, ...flatScraped.filter((v) => !seenIds.has(v.id))]

  // === 4) Filter by type ===
  const filtered = type && type !== "all"
    ? merged.filter((ep) => ep.seriesType === type)
    : merged

  // === 5) Sort: RSS (with publishedAt) first by ts, then scraped by relative-date heuristic ===
  filtered.sort((a, b) => {
    if (a.publishedAt && b.publishedAt) return b.publishedAt - a.publishedAt
    if (a.publishedAt) return -1
    if (b.publishedAt) return 1
    return parseScrapedDate(a.published) - parseScrapedDate(b.published)
  })

  // === 6) De-dupe by series — only one (latest) per series ===
  const seenSeries = new Set<string>()
  const unique: typeof filtered = []
  for (const ep of filtered) {
    if (seenSeries.has(ep.seriesKey)) continue
    seenSeries.add(ep.seriesKey)
    unique.push(ep)
    if (unique.length >= limit) break
  }

  return NextResponse.json({
    episodes: unique,
    total: unique.length,
    rssCount: rssMapped.length,
    scrapeCount: flatScraped.length,
    fetchedAt: new Date().toISOString(),
  })
}
