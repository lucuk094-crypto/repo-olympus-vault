// Favorites — works with both localStorage (offline / no Supabase) and Supabase (when configured)
"use client"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"

export type FavType = "anime" | "movie" | "tv" | "manga"

export interface Favorite {
  type: FavType
  id: string
  title: string
  poster: string
  score?: number | null
  sub?: string | null
  ts: number
}

const KEY = "vx_favorites_v1"

export function getLocalFavorites(): Favorite[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]")
  } catch { return [] }
}

export function saveLocalFavorites(list: Favorite[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(list))
}

export async function isFavorited(type: FavType, id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const sb = createClient()
      const { data } = await sb.from("favorites")
        .select("id").eq("type", type).eq("ref_id", id).maybeSingle()
      if (data) return true
    } catch {}
  }
  // local fallback
  return getLocalFavorites().some((x) => x.type === type && x.id === id)
}

export async function toggleFavorite(item: Favorite): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (user) {
        const { data: existing } = await sb.from("favorites")
          .select("id").eq("type", item.type).eq("ref_id", item.id).maybeSingle()
        if (existing) {
          await sb.from("favorites").delete().eq("id", existing.id)
          return false
        } else {
          await sb.from("favorites").insert({
            user_id: user.id,
            type: item.type,
            ref_id: item.id,
            title: item.title,
            poster: item.poster,
            score: item.score,
            sub: item.sub,
          })
          return true
        }
      }
    } catch {}
  }
  // local
  const list = getLocalFavorites()
  const idx = list.findIndex((x) => x.type === item.type && x.id === item.id)
  if (idx >= 0) {
    list.splice(idx, 1)
    saveLocalFavorites(list)
    return false
  }
  list.unshift({ ...item, ts: Date.now() })
  saveLocalFavorites(list.slice(0, 500))
  return true
}

export async function loadFavorites(): Promise<Favorite[]> {
  if (isSupabaseConfigured()) {
    try {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (user) {
        const { data } = await sb.from("favorites")
          .select("*").eq("user_id", user.id).order("created_at", { ascending: false })
        if (data) {
          return data.map((row: any) => ({
            type: row.type, id: row.ref_id,
            title: row.title, poster: row.poster,
            score: row.score, sub: row.sub,
            ts: new Date(row.created_at).getTime(),
          }))
        }
      }
    } catch {}
  }
  return getLocalFavorites()
}

export function favHref(f: Favorite): string {
  switch (f.type) {
    case "anime": return `/anime/${f.id}`
    case "movie": return `/film/${f.id}`
    case "tv":    return `/drama/${f.id}`
    case "manga": return `/komik/${f.id}`
    default:      return "/"
  }
}
