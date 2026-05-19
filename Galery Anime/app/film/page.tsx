import {
  getMoviesTrending,
  getMoviesPopular,
  getMoviesNowPlaying,
  getMoviesTopRated,
  getMoviesUpcoming,
  tmdbImg,
} from "@/lib/api/tmdb"
import SectionRow from "@/components/section-row"
import Poster from "@/components/poster"

export const metadata = { title: "Film — VanX Stream" }
export const dynamic = "force-dynamic"

export default async function FilmPage() {
  const [trending, popular, nowPlaying, topRated, upcoming] = await Promise.all([
    getMoviesTrending("week").catch(() => null),
    getMoviesPopular(1).catch(() => null),
    getMoviesNowPlaying(1).catch(() => null),
    getMoviesTopRated(1).catch(() => null),
    getMoviesUpcoming(1).catch(() => null),
  ])

  // If all failed, show error message
  if (!trending && !popular && !nowPlaying && !topRated && !upcoming) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Film</h1>
        <p style={{ color: "var(--text-3)" }}>Gagal memuat data film. Silakan coba lagi nanti.</p>
      </div>
    )
  }

  return (
    <>
      {trending?.results && trending.results.length > 0 && (
        <SectionRow eyebrow="Trending" title="Film Trending Pekan Ini">
          {trending.results.slice(0, 20).map((m, i) => (
            <Poster
              key={m.id}
              href={`/film/${m.id}`}
              title={m.title}
              poster={tmdbImg(m.poster_path, "w500")}
              score={m.vote_average}
              rank={i < 10 ? i + 1 : null}
              sub={m.release_date?.slice(0, 4) || ""}
            />
          ))}
        </SectionRow>
      )}

      {nowPlaying?.results && nowPlaying.results.length > 0 && (
        <SectionRow eyebrow="Bioskop" title="Sedang Tayang Sekarang">
          {nowPlaying.results.slice(0, 20).map((m) => (
            <Poster
              key={m.id}
              href={`/film/${m.id}`}
              title={m.title}
              poster={tmdbImg(m.poster_path, "w500")}
              score={m.vote_average}
              badge="BIOSKOP"
              sub={m.release_date?.slice(0, 4) || ""}
            />
          ))}
        </SectionRow>
      )}

      {upcoming?.results && upcoming.results.length > 0 && (
        <SectionRow eyebrow="Akan Datang" title="Film Mendatang">
          {upcoming.results.slice(0, 20).map((m) => (
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
      )}

      {topRated?.results && topRated.results.length > 0 && (
        <SectionRow eyebrow="Top Rated" title="Skor Tertinggi Sepanjang Masa">
          {topRated.results.slice(0, 20).map((m, i) => (
            <Poster
              key={m.id}
              href={`/film/${m.id}`}
              title={m.title}
              poster={tmdbImg(m.poster_path, "w500")}
              score={m.vote_average}
              rank={i < 10 ? i + 1 : null}
              sub={m.release_date?.slice(0, 4) || ""}
            />
          ))}
        </SectionRow>
      )}

      {popular?.results && popular.results.length > 0 && (
        <SectionRow eyebrow="Populer" title="Film Populer">
          {popular.results.slice(0, 20).map((m) => (
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
      )}
    </>
  )
}
