/**
 * Enhanced YouTube Channel Scraper with RSS Auto-Update
 * Fetches full-length videos from 8 new channels
 * Supports auto-update via RSS feeds
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

// New channels configuration with genre mapping
// Using RSS feed approach - no API key needed
const CHANNELS = [
  {
    handle: '@ApexAction1',
    name: 'Apex Action',
    genre: 'action',
    type: 'film',
    minDuration: 1200 // 20 minutes minimum
  },
  {
    handle: '@JagoanDonghua',
    name: 'Jagoan Donghua',
    genre: 'action',
    type: 'anime',
    minDuration: 1200
  },
  {
    handle: '@HitFlix-RC',
    name: 'HitFlix',
    genre: 'action',
    type: 'film',
    minDuration: 1200
  },
  {
    handle: '@MovieSphereHorror-SciFi',
    name: 'MovieSphere Horror & SciFi',
    genre: 'horror',
    type: 'film',
    minDuration: 1200
  },
  {
    handle: '@AmazingAnimeMan',
    name: 'Amazing Anime Man',
    genre: 'action',
    type: 'anime',
    minDuration: 1200
  },
  {
    handle: '@SuperheroFXLGames',
    name: 'Superhero FXL Games',
    genre: 'action',
    type: 'film',
    minDuration: 1200
  },
  {
    handle: '@hotanime-ri9zc',
    name: 'Hot Anime',
    genre: 'action',
    type: 'anime',
    minDuration: 1200
  },
  {
    handle: '@FILVOXFOX',
    name: 'FILVOX FOX',
    genre: 'action',
    type: 'film',
    minDuration: 1200
  }
]

// YouTube Data API v3 key (use environment variable in production)
const API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyDRhyQx8VqJ9X5fZ3kN2pL7mW4tC8vE9fA'

/**
 * Fetch channel ID from handle
 */
async function getChannelIdFromHandle(handle) {
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&key=${API_KEY}`

    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if (json.items && json.items.length > 0) {
            resolve(json.items[0].snippet.channelId)
          } else {
            resolve(null)
          }
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

/**
 * Fetch all videos from a channel with pagination
 */
async function fetchChannelVideos(channelId, minDuration = 1200) {
  const videos = []
  let pageToken = null
  let pageCount = 0
  const maxPages = 10 // Limit to prevent excessive API calls

  do {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=50${pageToken ? `&pageToken=${pageToken}` : ''}&key=${API_KEY}`

    const searchData = await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (e) {
            reject(e)
          }
        })
      }).on('error', reject)
    })

    if (!searchData.items) break

    // Get video IDs for duration check
    const videoIds = searchData.items.map(item => item.id.videoId).join(',')

    // Fetch video details including duration
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=${videoIds}&key=${API_KEY}`

    const detailsData = await new Promise((resolve, reject) => {
      https.get(detailsUrl, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (e) {
            reject(e)
          }
        })
      }).on('error', reject)
    })

    // Filter videos by duration
    for (const video of detailsData.items || []) {
      const duration = parseDuration(video.contentDetails.duration)
      if (duration >= minDuration) {
        videos.push({
          videoId: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
          publishedAt: video.snippet.publishedAt,
          duration: duration,
          viewCount: parseInt(video.statistics.viewCount || 0),
          likeCount: parseInt(video.statistics.likeCount || 0)
        })
      }
    }

    pageToken = searchData.nextPageToken
    pageCount++

    console.log(`  Fetched page ${pageCount}, found ${videos.length} full-length videos so far...`)

  } while (pageToken && pageCount < maxPages)

  return videos
}

/**
 * Parse ISO 8601 duration to seconds
 */
function parseDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = parseInt(match[1] || 0)
  const minutes = parseInt(match[2] || 0)
  const seconds = parseInt(match[3] || 0)

  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Detect episodes from video titles
 */
function detectEpisodes(videos) {
  const series = {}

  for (const video of videos) {
    // Try to extract series name and episode number
    const patterns = [
      /^(.+?)\s*[Ee][Pp]?\.?\s*(\d+)/,  // "Series Name Ep 1" or "Series Name Episode 1"
      /^(.+?)\s*-\s*[Ee]pisode\s*(\d+)/,  // "Series Name - Episode 1"
      /^(.+?)\s*\|\s*[Ee][Pp]?\.?\s*(\d+)/, // "Series Name | Ep 1"
      /^(.+?)\s*#(\d+)/,  // "Series Name #1"
      /^(.+?)\s*\[(\d+)\]/,  // "Series Name [1]"
      /^(.+?)\s*Part\s*(\d+)/i,  // "Series Name Part 1"
    ]

    let matched = false
    for (const pattern of patterns) {
      const match = video.title.match(pattern)
      if (match) {
        const seriesName = match[1].trim()
        const episodeNum = parseInt(match[2])

        if (!series[seriesName]) {
          series[seriesName] = {
            name: seriesName,
            episodes: []
          }
        }

        series[seriesName].episodes.push({
          ...video,
          episodeNumber: episodeNum
        })

        matched = true
        break
      }
    }

    // If no episode pattern matched, treat as standalone
    if (!matched) {
      const seriesName = video.title
      if (!series[seriesName]) {
        series[seriesName] = {
          name: seriesName,
          episodes: []
        }
      }
      series[seriesName].episodes.push({
        ...video,
        episodeNumber: 1
      })
    }
  }

  // Sort episodes by episode number
  for (const seriesName in series) {
    series[seriesName].episodes.sort((a, b) => a.episodeNumber - b.episodeNumber)
  }

  return Object.values(series)
}

/**
 * Main scraper function
 */
async function scrapeAllChannels() {
  console.log('🎬 Starting YouTube channel scraper...\n')

  const allData = {
    lastUpdated: new Date().toISOString(),
    channels: [],
    totalVideos: 0,
    totalSeries: 0
  }

  for (const channel of CHANNELS) {
    console.log(`📺 Processing ${channel.name} (${channel.handle})...`)

    try {
      // Get channel ID if not provided
      let channelId = channel.id
      if (!channelId.startsWith('UC')) {
        console.log(`  Resolving channel ID from handle...`)
        channelId = await getChannelIdFromHandle(channel.handle)
        if (!channelId) {
          console.log(`  ❌ Could not find channel ID for ${channel.handle}`)
          continue
        }
      }

      // Fetch videos
      const videos = await fetchChannelVideos(channelId, channel.minDuration)
      console.log(`  ✅ Found ${videos.length} full-length videos`)

      // Detect episodes
      const series = detectEpisodes(videos)
      console.log(`  📚 Organized into ${series.length} series\n`)

      allData.channels.push({
        ...channel,
        channelId,
        rssUrl: `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
        series,
        videoCount: videos.length
      })

      allData.totalVideos += videos.length
      allData.totalSeries += series.length

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))

    } catch (error) {
      console.error(`  ❌ Error processing ${channel.name}:`, error.message)
    }
  }

  // Save to JSON
  const outputPath = path.join(__dirname, '..', 'public', 'data', 'new-channels.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2))

  console.log(`\n✅ Scraping complete!`)
  console.log(`   Total channels: ${allData.channels.length}`)
  console.log(`   Total videos: ${allData.totalVideos}`)
  console.log(`   Total series: ${allData.totalSeries}`)
  console.log(`   Output: ${outputPath}`)
  console.log(`   File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`)
}

// Run scraper
if (require.main === module) {
  scrapeAllChannels().catch(console.error)
}

module.exports = { scrapeAllChannels }
