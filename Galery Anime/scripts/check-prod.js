// Inspect production HTML content
;(async () => {
  const r = await fetch("https://vanx-stream.vercel.app/")
  const html = await r.text()
  console.log("Status:", r.status, "Size:", html.length)

  // Count various patterns
  const patterns = [
    /href="\/anime\/(\d+)"/g,
    /\/anime\/(\d+)/g,
    /href=\\"\/anime\\/(\d+)\\"/g,
    /vx-poster/g,
    /vx-section-title/g,
    /vx-row/g,
    /image\.tmdb\.org/g,
    /anilistcdn/g,
    /Trending/g,
    /class="vx-section/g,
  ]
  for (const p of patterns) {
    const ms = html.match(p)
    console.log(p.source, "->", ms ? ms.length : 0)
  }

  // Find first vx-poster or similar marker
  const markers = ['<h2 class="vx-section-title">', "vx-hero-title", "Trending", "Popular"]
  for (const m of markers) {
    const idx = html.indexOf(m)
    if (idx >= 0) {
      console.log(`\n>>> Found "${m}" at ${idx}:`)
      console.log(html.slice(idx, idx + 300).replace(/\s+/g, " "))
    }
  }
})()
