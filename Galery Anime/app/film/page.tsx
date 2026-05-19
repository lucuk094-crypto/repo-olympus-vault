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
    getMoviesTrending("week"),
    getMoviesPopular(1),
    getMoviesNowPlaying(1),
    getMoviesTopRated(1),
    getMoviesUpcoming(1),
  ])

  return (
    <>
      <SectionRow eyebrow="Trending" title="Film Trending Pekan Ini">
        {(trending?.results || []).slice(0, 20).map((m, i) => (
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

      <SectionRow eyebrow="Bioskop" title="Sedang Tayang Sekarang">
        {(nowPlaying?.results || []).slice(0, 20).map((m) => (
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

      <SectionRow eyebrow="Akan Datang" title="Film Mendatang">
        {(upcoming?.results || []).slice(0, 20).map((m) => (
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

      <SectionRow eyebrow="Top Rated" title="Skor Tertinggi Sepanjang Masa">
        {(topRated?.results || []).slice(0, 20).map((m, i) => (
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

      <SectionRow eyebrow="Populer" title="Film Populer">
        {(popular?.results || []).slice(0, 20).map((m) => (
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
    </>
  )
}
