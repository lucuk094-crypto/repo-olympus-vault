// API: POST /api/refresh-channels
// Triggers re-scrape of YouTube channels in background.
// Optional query param `?key=<REFRESH_KEY>` for auth.
// Set REFRESH_KEY in env to enable. Without it, anyone can trigger.

import { NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export const dynamic = "force-dynamic"

let lastRunAt = 0
let running = false

export async function POST(req: Request) {
  const url = new URL(req.url)
  const key = url.searchParams.get("key") || ""
  const expected = process.env.REFRESH_KEY
  if (expected && key !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  // Throttle: max 1 run per 30 minutes
  const now = Date.now()
  if (running) {
    return NextResponse.json({ ok: false, message: "Sedang berjalan" })
  }
  if (now - lastRunAt < 30 * 60_000) {
    return NextResponse.json({
      ok: false,
      message: "Throttled — coba lagi nanti",
      nextAvailable: new Date(lastRunAt + 30 * 60_000).toISOString(),
    })
  }

  lastRunAt = now
  running = true

  // Fire and forget
  const script = path.join(process.cwd(), "scripts", "fetch-channels.js")
  const proc = spawn("node", [script], {
    cwd: process.cwd(),
    detached: true,
    stdio: "ignore",
  })
  proc.unref()
  proc.on("exit", () => { running = false })
  proc.on("error", () => { running = false })

  return NextResponse.json({
    ok: true,
    message: "Scraper dijalankan di background. Cek lagi 5-10 menit lagi.",
    startedAt: new Date().toISOString(),
  })
}

export async function GET() {
  return NextResponse.json({
    running,
    lastRunAt: lastRunAt ? new Date(lastRunAt).toISOString() : null,
    method: "POST untuk memicu refresh",
  })
}
