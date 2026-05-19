/**
 * Watch History & Bookmark Management
 * Client-side storage using localStorage
 */

export interface WatchHistoryItem {
  videoId: string
  title: string
  thumbnail: string
  channelName: string
  genre: string
  type: 'film' | 'anime'
  watchedAt: string
  progress: number // seconds watched
  duration: number // total duration
  episodeNumber?: number
  seriesName?: string
}

export interface BookmarkItem {
  videoId: string
  title: string
  thumbnail: string
  channelName: string
  genre: string
  type: 'film' | 'anime'
  bookmarkedAt: string
  episodeNumber?: number
  seriesName?: string
}

const HISTORY_KEY = 'vanx_watch_history'
const BOOKMARK_KEY = 'vanx_bookmarks'
const MAX_HISTORY = 100

/**
 * Get watch history
 */
export function getWatchHistory(): WatchHistoryItem[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * Add to watch history
 */
export function addToHistory(item: Omit<WatchHistoryItem, 'watchedAt'>): void {
  if (typeof window === 'undefined') return

  const history = getWatchHistory()

  // Remove existing entry for this video
  const filtered = history.filter(h => h.videoId !== item.videoId)

  // Add new entry at the beginning
  filtered.unshift({
    ...item,
    watchedAt: new Date().toISOString()
  })

  // Keep only last MAX_HISTORY items
  const trimmed = filtered.slice(0, MAX_HISTORY)

  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))

  // Dispatch event for UI updates
  window.dispatchEvent(new CustomEvent('watchHistoryUpdated'))
}

/**
 * Update watch progress
 */
export function updateWatchProgress(videoId: string, progress: number): void {
  if (typeof window === 'undefined') return

  const history = getWatchHistory()
  const item = history.find(h => h.videoId === videoId)

  if (item) {
    item.progress = progress
    item.watchedAt = new Date().toISOString()
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    window.dispatchEvent(new CustomEvent('watchHistoryUpdated'))
  }
}

/**
 * Clear watch history
 */
export function clearHistory(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(HISTORY_KEY)
  window.dispatchEvent(new CustomEvent('watchHistoryUpdated'))
}

/**
 * Get bookmarks
 */
export function getBookmarks(): BookmarkItem[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(BOOKMARK_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * Add bookmark
 */
export function addBookmark(item: Omit<BookmarkItem, 'bookmarkedAt'>): void {
  if (typeof window === 'undefined') return

  const bookmarks = getBookmarks()

  // Check if already bookmarked
  if (bookmarks.some(b => b.videoId === item.videoId)) {
    return
  }

  // Add new bookmark at the beginning
  bookmarks.unshift({
    ...item,
    bookmarkedAt: new Date().toISOString()
  })

  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks))
  window.dispatchEvent(new CustomEvent('bookmarksUpdated'))
}

/**
 * Remove bookmark
 */
export function removeBookmark(videoId: string): void {
  if (typeof window === 'undefined') return

  const bookmarks = getBookmarks()
  const filtered = bookmarks.filter(b => b.videoId !== videoId)

  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(filtered))
  window.dispatchEvent(new CustomEvent('bookmarksUpdated'))
}

/**
 * Check if video is bookmarked
 */
export function isBookmarked(videoId: string): boolean {
  if (typeof window === 'undefined') return false

  const bookmarks = getBookmarks()
  return bookmarks.some(b => b.videoId === videoId)
}

/**
 * Toggle bookmark
 */
export function toggleBookmark(item: Omit<BookmarkItem, 'bookmarkedAt'>): boolean {
  if (isBookmarked(item.videoId)) {
    removeBookmark(item.videoId)
    return false
  } else {
    addBookmark(item)
    return true
  }
}

/**
 * Clear all bookmarks
 */
export function clearBookmarks(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(BOOKMARK_KEY)
  window.dispatchEvent(new CustomEvent('bookmarksUpdated'))
}

/**
 * Get watch progress for a video
 */
export function getWatchProgress(videoId: string): number {
  const history = getWatchHistory()
  const item = history.find(h => h.videoId === videoId)
  return item?.progress || 0
}

/**
 * Get continue watching list (videos with progress > 0 and < 90%)
 */
export function getContinueWatching(): WatchHistoryItem[] {
  const history = getWatchHistory()
  return history.filter(item => {
    const progressPercent = (item.progress / item.duration) * 100
    return progressPercent > 0 && progressPercent < 90
  }).slice(0, 20)
}
