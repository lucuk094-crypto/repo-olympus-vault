// API: GET /api/youtube-search?q=...&type=...
// Returns YouTube search results via Piped public instances (no API key)
// Used as fallback for Watch tab when no channel match exists

import { NextResponse } from "next/server"

export const revalidate = 1800

interface PipedResult {
  url: string
  title: string
  thumbnail: string
  uploaderName: string
  uploaderUrl: string
  uploadedDate: string
  duration: number
  views: number
}

const INSTANCES = [
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.adminforge.de",
  "https://api.piped.private.coffee",
  "https://pipedapi.r4fo.com",
]

async function tryFetch(url: string, signal?: AbortSignal): Promise<any | null> {
  for (const inst of INSTANCES) {
    try {
      const r = await fetch(inst + url, {
        signal,
        headers: { Accept: "application/json", "User-Agent": "VanX-Stream/1.0" },
        next: { revalidate: 1800 },
      })
      if (r.ok) return await r.json()
    } catch {
      // try next instance
    }
  }
  return null
}

function parseVideoId(url: string): string | null {
  // Piped returns "/watch?v=VIDEO_ID"
  const m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get("q")?.trim()
  if (!q) return NextResponse.json({ items: [] })

  const limit = Math.min(parseInt(url.searchParams.get("limit") || "12", 10), 30)
  const filter = url.searchParams.get("filter") || "videos" // videos | channels | playlists

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 8000)

  try {
    const data = await tryFetch(`/search?q=${encodeURIComponent(q)}&filter=${filter}`, ctrl.signal)
    if (!data?.items) return NextResponse.json({ items: [] })

    const items = (data.items as PipedResult[])
      .filter((it: any) => it.type === "stream" || it.url?.includes("/watch"))
      .map((it) => ({
        id: parseVideoId(it.url) || "",
        title: it.title,
        thumbnail: it.thumbnail,
        channelName: it.uploaderName,
        published: it.uploadedDate,
        duration: it.duration,
        views: it.views,
        url: `https://www.youtube.com${it.url}`,
      }))
      .filter((it) => it.id)
      .slice(0, limit)

    return NextResponse.json({ items, source: "piped" })
  } catch (e) {
    return NextResponse.json({ items: [], error: "failed" })
  } finally {
    clearTimeout(timer)
  }
}
