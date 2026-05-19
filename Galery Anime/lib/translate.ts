// Free client-side translation using Google Translate's public endpoint.
// No API key, no auth. Cached in-memory + localStorage to keep it cheap.

const cache = new Map<string, string>()
const inflight = new Map<string, Promise<string>>()
const LS_KEY = "vx_tr_cache_v1"
const LS_MAX = 200

const ENDPOINT = "https://translate.googleapis.com/translate_a/single"

function loadLs(): Record<string, string> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}") } catch { return {} }
}
function saveLs(map: Record<string, string>) {
  if (typeof window === "undefined") return
  const keys = Object.keys(map)
  if (keys.length > LS_MAX) {
    const trim: Record<string, string> = {}
    keys.slice(-LS_MAX).forEach((k) => trim[k] = map[k])
    map = trim
  }
  try { localStorage.setItem(LS_KEY, JSON.stringify(map)) } catch {}
}

function chunkText(text: string, max = 1500): string[] {
  if (text.length <= max) return [text]
  const parts: string[] = []
  let buf = ""
  const sentences = text.split(/(?<=[.!?])\s+/)
  for (const s of sentences) {
    if ((buf + s).length > max) {
      if (buf) parts.push(buf)
      buf = s + " "
    } else {
      buf += s + " "
    }
  }
  if (buf.trim()) parts.push(buf.trim())
  return parts
}

async function translateChunk(text: string, target: string): Promise<string> {
  const url = `${ENDPOINT}?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Translate HTTP " + res.status)
  const data = await res.json()
  if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error("Bad response")
  return data[0].map((it: any[]) => (it && typeof it[0] === "string" ? it[0] : "")).join("")
}

export async function translateText(text: string, target = "id"): Promise<string> {
  if (!text || !text.trim()) return text
  const key = `${target}:${text.slice(0, 100)}:${text.length}`
  if (cache.has(key)) return cache.get(key)!
  if (inflight.has(key)) return inflight.get(key)!

  const ls = loadLs()
  if (ls[key]) {
    cache.set(key, ls[key])
    return ls[key]
  }

  const promise = (async () => {
    const chunks = chunkText(text)
    const out: string[] = []
    for (const c of chunks) {
      try {
        out.push(await translateChunk(c, target))
      } catch {
        out.push(c)
      }
    }
    const result = out.join(" ").trim()
    cache.set(key, result)
    const ls = loadLs()
    ls[key] = result
    saveLs(ls)
    return result
  })()

  inflight.set(key, promise)
  try {
    return await promise
  } finally {
    inflight.delete(key)
  }
}
