import {
  getAnimeTrending,
  aniTitle,
} from "@/lib/api/anilist"
import { getMoviesTrending, getTvTrending, tmdbImg } from "@/lib/api/tmdb"
import { getMangaPopular, mdCover, mdTitle } from "@/lib/api/mangadex"
import SectionRow from "@/components/section-row"
import Poster from "@/components/poster"

export const metadata = { title: "Tren — VanX Stream" }
export const dynamic = "force-dynamic"

export default async function TrendingPage() {
  const [anime, movies, tv, manga] = await Promise.all([
    getAnimeTrending(20),
    getMoviesTrending("week"),
    getTvTrending("week"),
    getMangaPopular(20),
  ])
  return (
    <>
      <section className="vx-section" style={{ paddingTop: "2rem" }}>
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Tren Sekarang</div>
            <h1 className="vx-section-title">Sedang Populer</h1>
          </div>
        </div>
      </section>

      <SectionRow eyebrow="Anime" title="Top Trending Anime">
        {anime.map((a, i) => (
          <Poster
            key={a.id}
            href={`/anime/${a.id}`}
            title={aniTitle(a)}
            poster={a.coverImage.extraLarge || a.coverImage.large}
            score={a.averageScore ? a.averageScore / 10 : null}
            rank={i < 10 ? i + 1 : null}
            sub={String(a.seasonYear || "")}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="Cinema" title="Top Trending Film">
        {(movies?.results || []).slice(0, 16).map((m, i) => (
          <Poster
            key={m.id}
            href={`/film/${m.id}`}
            title={m.title}
            poster={tmdbImg(m.poster_path, "w500")}
            score={m.vote_average}
            rank={i < 10 ? i + 1 : null}
            sub={m.release_date?.slice(0, 4)}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="TV" title="Top Trending Drama">
        {(tv?.results || []).slice(0, 16).map((t, i) => (
          <Poster
            key={t.id}
            href={`/drama/${t.id}`}
            title={t.name}
            poster={tmdbImg(t.poster_path, "w500")}
            score={t.vote_average}
            rank={i < 10 ? i + 1 : null}
            sub={t.first_air_date?.slice(0, 4)}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="Komik" title="Top Manga Pekan Ini">
        {manga.slice(0, 16).map((m, i) => (
          <Poster
            key={m.id}
            href={`/komik/${m.id}`}
            title={mdTitle(m)}
            poster={mdCover(m)}
            rank={i < 10 ? i + 1 : null}
            sub={m.attributes.year ? String(m.attributes.year) : null}
          />
        ))}
      </SectionRow>
    </>
  )
}
