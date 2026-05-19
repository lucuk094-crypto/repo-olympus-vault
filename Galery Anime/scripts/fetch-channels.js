// Scrape latest videos from 5 official YouTube channels
// Output: public/data/channels.json — used at runtime to match anime/drama detail pages

const fs = require("fs")
const path = require("path")

const CHANNELS = [
  { id: "UCrcQMdsFqYpZOHDbm-fnNlw", name: "Yuewen Animation Indonesia", type: "donghua",  handle: "YuewenAnimationIndonesia-YAI" },
  { id: "UCsKp6Y5J17eOZCSCD-TgzqQ", name: "Joyland Animation",          type: "anime",    handle: "Joyland-Animation" },
  { id: "UCxB_Xn1GFVatKNX9gjb1WSw", name: "Youku Indonesia",            type: "mixed",    handle: "youkuindonesia" },
  { id: "UCvtfzGRjCwvMzd3NL8w8wLQ", name: "iQIYI Indonesia",            type: "dracin",   handle: "iQIYIIndonesia" },
  { id: "UC8w78bCZNZkkfaOBXJ_FcEQ", name: "WeTV Dunia Drama",           type: "drakor",   handle: "WeTVDuniaDrama" },
]

const MAX_PER_CHANNEL = 1500
const INNERTUBE_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
const CLIENT = {
  context: { client: { clientName: "WEB", clientVersion: "2.20240101.00.00", hl: "id", gl: "ID" } },
}

function findInitialData(html) {
  const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s)
  if (!m) return null
  try { return JSON.parse(m[1]) } catch { return null }
}

function extractFromTab(items) {
  const out = []
  for (const it of items || []) {
    const v = it.richItemRenderer?.content?.videoRenderer
    if (!v?.videoId) continue
    out.push({
      id: v.videoId,
      title: v.title?.runs?.[0]?.text || v.title?.simpleText || "",
      thumbnail: v.thumbnail?.thumbnails?.slice(-1)[0]?.url || "",
      published: v.publishedTimeText?.simpleText || null,
      length: v.lengthText?.simpleText || null,
      views: v.viewCountText?.simpleText || null,
    })
  }
  return out
}

function findContinuation(items) {
  for (const it of items || []) {
    const c = it.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token
    if (c) return c
  }
  return null
}

async function fetchInitial(channelId) {
  const url = `https://www.youtube.com/channel/${channelId}/videos`
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
      "Accept-Language": "id,en;q=0.8",
    },
  })
  const html = await res.text()
  const data = findInitialData(html)
  if (!data) throw new Error("No ytInitialData")
  const tabs = data.contents?.twoColumnBrowseResultsRenderer?.tabs || []
  const videosTab = tabs.find((t) => t.tabRenderer?.title === "Videos") || tabs[1]
  const items = videosTab?.tabRenderer?.content?.richGridRenderer?.contents || []
  return { videos: extractFromTab(items), continuation: findContinuation(items) }
}

async function fetchContinuation(token) {
  const res = await fetch(`https://www.youtube.com/youtubei/v1/browse?key=${INNERTUBE_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
    body: JSON.stringify({ ...CLIENT, continuation: token }),
  })
  const data = await res.json()
  const items = data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems || []
  return { videos: extractFromTab(items), continuation: findContinuation(items) }
}

function classifyKind(title) {
  const t = title.toLowerCase()
  if (/episode\s*\d+|\beps?\.?\s*\d+/.test(t)) return "episode"
  if (/\[bahasa indonesia\]|sub\s*indo|eng\s*sub|\[eng sub\]/.test(t)) return "episode"
  if (/trailer|teaser|coming soon|preview/.test(t)) return "trailer"
  if (/opening|ending|theme song|\bop\b|\bed\b/.test(t)) return "music"
  return "clip"
}

function classifyType(title, channelType) {
  if (channelType !== "mixed") return channelType
  const t = title.toLowerCase()
  if (/donghua|斗罗|cultivation|sword|qing|huang|china animation|chinese anim/.test(t)) return "donghua"
  if (/drakor|korean drama|korea/.test(t)) return "drakor"
  if (/dracin|chinese drama|cdrama|c-drama/.test(t)) return "dracin"
  return "donghua"
}

function seriesKey(title) {
  let t = title.toLowerCase()
  t = t.replace(/\[[^\]]*\]/g, "").replace(/\([^)]*\)/g, "")
  t = t.replace(/\bepisode\s*\d+(\s*[-:]\s*[^|]*)?/g, "")
  t = t.replace(/\bep\.?\s*\d+(\s*[-:]\s*[^|]*)?/g, "")
  t = t.replace(/\beps?\s*\d+/g, "")
  t = t.replace(/\b(official\s*)?(trailer|teaser|preview|coming soon|highlight|cuplikan|opening|ending|sub\s*indo)\b.*$/g, "")
  t = t.replace(/\b(op|ed)\s*\d*\s*$/g, "")
  t = t.replace(/[\|\-—–·•:!?,.]/g, " ").replace(/\s+/g, " ").trim()
  return t
}

function parseEp(title) {
  const m = title.match(/episode\s*(\d+)/i) || title.match(/\bep\.?\s*(\d+)/i) || title.match(/\beps?\s*(\d+)/i)
  return m ? Number(m[1]) : null
}

async function fetchChannel(ch) {
  console.log(`\n[fetch] ${ch.name} (${ch.id}) [${ch.type}]`)
  const collected = []
  try {
    let { videos, continuation } = await fetchInitial(ch.id)
    collected.push(...videos)
    let safety = 60
    while (continuation && collected.length < MAX_PER_CHANNEL && safety-- > 0) {
      const next = await fetchContinuation(continuation)
      if (!next.videos.length) break
      collected.push(...next.videos)
      continuation = next.continuation
      await new Promise((r) => setTimeout(r, 150))
      if (collected.length % 300 === 0) console.log(`  ${collected.length} videos`)
    }
    console.log(`  -> total ${collected.length}`)
  } catch (e) {
    console.error(`  ERR: ${e.message}`)
  }
  return collected.map((v) => ({
    ...v,
    channelId: ch.id, channelName: ch.name, channelHandle: ch.handle,
    channelType: ch.type,
    type: classifyType(v.title, ch.type),
    kind: classifyKind(v.title),
    series: seriesKey(v.title),
    ep: parseEp(v.title),
    url: `https://www.youtube.com/watch?v=${v.id}`,
  }))
}

;(async () => {
  const all = []
  for (const ch of CHANNELS) {
    all.push(...(await fetchChannel(ch)))
  }
  // dedupe
  const seen = new Set()
  const dedup = all.filter((v) => seen.has(v.id) ? false : (seen.add(v.id), true))

  // Group into series
  const groups = {}
  for (const v of dedup) {
    if (!v.series || v.series.length < 2) continue
    const key = `${v.type}::${v.series}`
    if (!groups[key]) {
      groups[key] = {
        seriesKey: key,
        seriesName: v.series.split(" ").map(w => w[0]?.toUpperCase() + w.slice(1)).join(" "),
        type: v.type,
        thumbnail: v.thumbnail,
        channelName: v.channelName,
        channelId: v.channelId,
        episodes: [],
      }
    }
    groups[key].episodes.push(v)
  }
  // sort by ep number
  for (const g of Object.values(groups)) {
    g.episodes.sort((a, b) => (a.ep || 9999) - (b.ep || 9999))
    const ep1 = g.episodes.find(e => e.ep === 1)
    if (ep1) g.thumbnail = ep1.thumbnail
  }

  const groupsArr = Object.values(groups).sort((a, b) => b.episodes.length - a.episodes.length)

  const output = {
    fetchedAt: new Date().toISOString(),
    totalVideos: dedup.length,
    totalSeries: groupsArr.length,
    channels: CHANNELS.map((c) => ({ ...c, count: dedup.filter((v) => v.channelId === c.id).length })),
    series: groupsArr,
  }

  const out = path.join(__dirname, "..", "public", "data", "channels.json")
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, JSON.stringify(output))
  const sizeMB = (fs.statSync(out).size / 1024 / 1024).toFixed(2)
  console.log(`\n[done] ${dedup.length} videos in ${groupsArr.length} series → ${out} (${sizeMB} MB)`)
})().catch((e) => { console.error("FATAL:", e); process.exit(1) })
