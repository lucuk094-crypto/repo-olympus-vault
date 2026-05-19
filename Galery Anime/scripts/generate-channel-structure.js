/**
 * Simplified YouTube Channel Data Generator
 * Creates sample data structure for 8 new channels
 * In production, this would be replaced with actual API calls or web scraping
 */

const fs = require('fs')
const path = require('path')

// Channel configurations
const CHANNELS = [
  {
    channelId: 'UC_ApexAction1',
    handle: '@ApexAction1',
    name: 'Apex Action',
    genre: 'action',
    type: 'film',
    description: 'Full-length action movies'
  },
  {
    channelId: 'UC_JagoanDonghua',
    handle: '@JagoanDonghua',
    name: 'Jagoan Donghua',
    genre: 'action',
    type: 'anime',
    description: 'Chinese animation series'
  },
  {
    channelId: 'UC_HitFlix',
    handle: '@HitFlix-RC',
    name: 'HitFlix',
    genre: 'action',
    type: 'film',
    description: 'Action and thriller movies'
  },
  {
    channelId: 'UC_MovieSphere',
    handle: '@MovieSphereHorror-SciFi',
    name: 'MovieSphere Horror & SciFi',
    genre: 'horror',
    type: 'film',
    description: 'Horror and sci-fi movies'
  },
  {
    channelId: 'UC_AmazingAnime',
    handle: '@AmazingAnimeMan',
    name: 'Amazing Anime Man',
    genre: 'action',
    type: 'anime',
    description: 'Anime series and movies'
  },
  {
    channelId: 'UC_SuperheroFXL',
    handle: '@SuperheroFXLGames',
    name: 'Superhero FXL Games',
    genre: 'action',
    type: 'film',
    description: 'Superhero action movies'
  },
  {
    channelId: 'UC_HotAnime',
    handle: '@hotanime-ri9zc',
    name: 'Hot Anime',
    genre: 'action',
    type: 'anime',
    description: 'Popular anime series'
  },
  {
    channelId: 'UC_FILVOXFOX',
    handle: '@FILVOXFOX',
    name: 'FILVOX FOX',
    genre: 'action',
    type: 'film',
    description: 'Action movies collection'
  }
]

/**
 * Generate sample video data for each channel
 * This creates a realistic data structure that matches the expected format
 */
function generateChannelData() {
  console.log('🎬 Generating channel data structure...\n')

  const allData = {
    lastUpdated: new Date().toISOString(),
    channels: [],
    totalVideos: 0,
    totalSeries: 0,
    note: 'This is a template structure. Run RSS update API to fetch real data from YouTube.'
  }

  for (const channel of CHANNELS) {
    console.log(`📺 Setting up ${channel.name}...`)

    // Create channel structure with RSS URL
    const channelData = {
      ...channel,
      rssUrl: `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.channelId}`,
      series: [],
      videoCount: 0,
      instructions: `Use /api/rss-update?channelId=${channel.channelId} to fetch latest videos`
    }

    allData.channels.push(channelData)
    console.log(`  ✅ Channel structure created`)
  }

  // Save to JSON
  const outputPath = path.join(__dirname, '..', 'public', 'data', 'new-channels.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2))

  console.log(`\n✅ Channel data structure created!`)
  console.log(`   Total channels: ${allData.channels.length}`)
  console.log(`   Output: ${outputPath}`)
  console.log(`\n📝 Next steps:`)
  console.log(`   1. Deploy the app to get the RSS update API endpoint`)
  console.log(`   2. Call /api/rss-update to fetch real video data from YouTube`)
  console.log(`   3. Videos will be automatically organized by series and episodes`)
}

// Run generator
if (require.main === module) {
  generateChannelData()
}

module.exports = { generateChannelData }
