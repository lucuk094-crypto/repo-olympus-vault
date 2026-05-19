// Auto-update cron job for YouTube channels data
// Run this script periodically to keep channels.json fresh

const { spawn } = require("child_process")
const path = require("path")

const REFRESH_INTERVAL = 6 * 60 * 60 * 1000 // 6 hours

function runScraper() {
  console.log(`[${new Date().toISOString()}] Starting YouTube scraper...`)

  const scriptPath = path.join(__dirname, "fetch-channels.js")
  const proc = spawn("node", [scriptPath], {
    cwd: __dirname,
    stdio: "inherit"
  })

  proc.on("exit", (code) => {
    if (code === 0) {
      console.log(`[${new Date().toISOString()}] Scraper completed successfully`)
    } else {
      console.error(`[${new Date().toISOString()}] Scraper failed with code ${code}`)
    }
  })

  proc.on("error", (err) => {
    console.error(`[${new Date().toISOString()}] Scraper error:`, err)
  })
}

// Run immediately on start
runScraper()

// Then run every 6 hours
setInterval(runScraper, REFRESH_INTERVAL)

console.log(`Auto-update scheduler started. Will refresh every ${REFRESH_INTERVAL / 1000 / 60 / 60} hours.`)
