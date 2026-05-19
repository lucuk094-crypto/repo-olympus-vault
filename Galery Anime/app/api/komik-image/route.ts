// Image proxy for komiku.org chapter images (bypass hotlink protection)
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const target = url.searchParams.get("u")
  if (!target) return new NextResponse("missing url", { status: 400 })

  try {
    const u = new URL(target)
    // Allow only komiku CDN/host
    if (!/komiku\.org$|komiku\.id$|komiku\.cz$/.test(u.hostname) && !u.hostname.includes("komiku")) {
      return new NextResponse("forbidden host", { status: 403 })
    }

    const r = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 VanX/1.0",
        Referer: "https://komiku.org/",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      next: { revalidate: 3600 },
    })
    if (!r.ok) return new NextResponse(`upstream ${r.status}`, { status: r.status })
    const buf = await r.arrayBuffer()
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": r.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
      },
    })
  } catch (e: any) {
    return new NextResponse(`error: ${e.message}`, { status: 500 })
  }
}
