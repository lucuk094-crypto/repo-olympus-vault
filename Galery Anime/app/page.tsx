// VanX Stream — Home (Greek Classical theme)
// Aggregates: AniList trending anime, TMDB trending movies/tv, MangaDex top manga
// All metadata fetched server-side and cached.

import {
  getAnimeTrending,
  getAnimePopularThisSeason,
  aniTitle,
  stripHtml,
} from "@/lib/api/anilist"
import {
  getMoviesTrending,
  getMoviesPopular,
  getTvTrending,
  discoverDrama,
  tmdbImg,
} from "@/lib/api/tmdb"
import { getMangaPopular, mdCover, mdTitle } from "@/lib/api/mangadex"
import HeroCarousel, { type HeroSlide } from "@/components/hero-carousel"
import SectionRow from "@/components/section-row"
import Poster from "@/components/poster"
import LatestEpisodes from "@/components/latest-episodes"
import ChannelsSection from "@/components/channels-section"

export const revalidate = 1800 // 30 min
export const dynamic = "force-dynamic" // always fetch fresh, no build-time prerender that can fail

export default async function HomePage() {
  // === Fetch all in parallel ===
  const [
    animeTrending,
    animeSeason,
    moviesTrending,
    moviesPopular,
    tvTrending,
    kdrama,
    cdrama,
    mangaPopular,
  ] = await Promise.all([
    getAnimeTrending(20).catch(() => []),
    getAnimePopularThisSeason(16).catch(() => []),
    getMoviesTrending("week").catch(() => null),
    getMoviesPopular(1).catch(() => null),
    getTvTrending("week").catch(() => null),
    discoverDrama({ country: "KR", page: 1 }).catch(() => null),
    discoverDrama({ country: "CN", page: 1 }).catch(() => null),
    getMangaPopular(16).catch(() => []),
  ])

  // === Build hero slides (mix of anime + movies + drama for variety) ===
  const heroSlides: HeroSlide[] = []
  // Top trending anime
  for (const a of animeTrending.slice(0, 3)) {
    if (!a.bannerImage) continue
    heroSlides.push({
      href: `/anime/${a.id}`,
      title: aniTitle(a),
      titleItalic: a.title.native || null,
      backdrop: a.bannerImage,
      overview: stripHtml(a.description || "").slice(0, 200) || "Anime trending saat ini.",
      score: a.averageScore ? a.averageScore / 10 : null,
      meta: [
        a.format || "Anime",
        a.seasonYear ? String(a.seasonYear) : "",
        a.episodes ? `${a.episodes} Episode` : "",
      ].filter(Boolean),
    })
  }
  // Top trending movie
  for (const m of (moviesTrending?.results || []).slice(0, 2)) {
    if (!m.backdrop_path) continue
    heroSlides.push({
      href: `/film/${m.id}`,
      title: m.title,
      titleItalic: m.original_title !== m.title ? m.original_title : null,
      backdrop: tmdbImg(m.backdrop_path, "original"),
      overview: m.overview || "Film trending minggu ini.",
      score: m.vote_average,
      meta: [
        "Film",
        m.release_date?.slice(0, 4) || "",
      ].filter(Boolean),
    })
  }

  return (
    <>
      {heroSlides.length > 0 && <HeroCarousel slides={heroSlides} />}

      <LatestEpisodes />

      <SectionRow eyebrow="Tren Anime" title="Anime Trending" href="/anime/trending">
        {animeTrending.slice(0, 16).map((a, i) => (
          <Poster
            key={a.id}
            href={`/anime/${a.id}`}
            title={aniTitle(a)}
            poster={a.coverImage.extraLarge || a.coverImage.large}
            score={a.averageScore ? a.averageScore / 10 : null}
            badge={i === 0 ? "#1" : null}
            sub={`${a.format || "TV"} · ${a.seasonYear || ""}`.trim()}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="Musim Ini" title="Anime Sedang Tayang" href="/anime/now">
        {animeSeason.map((a) => (
          <Poster
            key={a.id}
            href={`/anime/${a.id}`}
            title={aniTitle(a)}
            poster={a.coverImage.extraLarge || a.coverImage.large}
            score={a.averageScore ? a.averageScore / 10 : null}
            badge={a.status === "RELEASING" ? "TAYANG" : null}
            sub={a.episodes ? `${a.episodes} eps` : a.format || ""}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="Cinema" title="Film Trending Pekan Ini" href="/film/trending">
        {(moviesTrending?.results || []).slice(0, 16).map((m, i) => (
          <Poster
            key={m.id}
            href={`/film/${m.id}`}
            title={m.title}
            poster={tmdbImg(m.poster_path, "w500")}
            score={m.vote_average}
            badge={i === 0 ? "#1" : null}
            sub={m.release_date?.slice(0, 4) || ""}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="Drama Korea" title="K-Drama Populer" href="/drama?country=KR">
        {(kdrama?.results || []).slice(0, 16).map((t) => (
          <Poster
            key={t.id}
            href={`/drama/${t.id}`}
            title={t.name}
            poster={tmdbImg(t.poster_path, "w500")}
            score={t.vote_average}
            sub={t.first_air_date?.slice(0, 4) || ""}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="Drama China" title="C-Drama Populer" href="/drama?country=CN">
        {(cdrama?.results || []).slice(0, 16).map((t) => (
          <Poster
            key={t.id}
            href={`/drama/${t.id}`}
            title={t.name}
            poster={tmdbImg(t.poster_path, "w500")}
            score={t.vote_average}
            sub={t.first_air_date?.slice(0, 4) || ""}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="Cinema" title="Film Populer" href="/film">
        {(moviesPopular?.results || []).slice(0, 16).map((m) => (
          <Poster
            key={m.id}
            href={`/film/${m.id}`}
            title={m.title}
            poster={tmdbImg(m.poster_path, "w500")}
            score={m.vote_average}
            sub={m.release_date?.slice(0, 4) || ""}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="TV Series" title="Drama TV Internasional" href="/drama">
        {(tvTrending?.results || []).slice(0, 16).map((t) => (
          <Poster
            key={t.id}
            href={`/drama/${t.id}`}
            title={t.name}
            poster={tmdbImg(t.poster_path, "w500")}
            score={t.vote_average}
            sub={t.first_air_date?.slice(0, 4) || ""}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="Komik" title="Manga Populer" href="/komik">
        {mangaPopular.slice(0, 16).map((m) => (
          <Poster
            key={m.id}
            href={`/komik/${m.id}`}
            title={mdTitle(m)}
            poster={mdCover(m)}
            sub={m.attributes.year ? String(m.attributes.year) : null}
          />
        ))}
      </SectionRow>

      {/* YouTube Channels Section */}
      <ChannelsSection />

      <div className="greek-divider">
        <span className="greek-laurel">✦ φιλοσοφία ✦</span>
      </div>
    </>
  )
}
