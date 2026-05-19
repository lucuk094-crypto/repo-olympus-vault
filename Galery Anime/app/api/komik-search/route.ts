import { NextResponse } from "next/server"
import { searchKomik } from "@/lib/api/komiku"

export const revalidate = 300

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get("q")?.trim()
  if (!q || q.length < 2) return NextResponse.json({ comics: [] })
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "12", 10), 30)
  const comics = await searchKomik(q, 1, limit).catch(() => [])
  return NextResponse.json({ comics, total: comics.length })
}
