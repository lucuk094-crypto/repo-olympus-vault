import { discoverDrama, getTvTrending, getTvTopRated, getTvOnAir, tmdbImg } from "@/lib/api/tmdb"
import SectionRow from "@/components/section-row"
import Poster from "@/components/poster"

export const metadata = { title: "Drama — VanX Stream" }
export const dynamic = "force-dynamic"

export default async function DramaPage() {
  const [trending, kdrama, cdrama, jdrama, onAir, top] = await Promise.all([
    getTvTrending("week"),
    discoverDrama({ country: "KR" }),
    discoverDrama({ country: "CN" }),
    discoverDrama({ country: "JP" }),
    getTvOnAir(1),
    getTvTopRated(1),
  ])
  return (
    <>
      <SectionRow eyebrow="Trending" title="Drama Trending Pekan Ini">
        {(trending?.results || []).slice(0, 20).map((t, i) => (
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

      <SectionRow eyebrow="Korea" title="K-Drama Populer">
        {(kdrama?.results || []).slice(0, 20).map((t) => (
          <Poster
            key={t.id}
            href={`/drama/${t.id}`}
            title={t.name}
            poster={tmdbImg(t.poster_path, "w500")}
            score={t.vote_average}
            sub={t.first_air_date?.slice(0, 4)}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="Tiongkok" title="C-Drama Populer">
        {(cdrama?.results || []).slice(0, 20).map((t) => (
          <Poster
            key={t.id}
            href={`/drama/${t.id}`}
            title={t.name}
            poster={tmdbImg(t.poster_path, "w500")}
            score={t.vote_average}
            sub={t.first_air_date?.slice(0, 4)}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="Jepang" title="J-Drama Populer">
        {(jdrama?.results || []).slice(0, 20).map((t) => (
          <Poster
            key={t.id}
            href={`/drama/${t.id}`}
            title={t.name}
            poster={tmdbImg(t.poster_path, "w500")}
            score={t.vote_average}
            sub={t.first_air_date?.slice(0, 4)}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="On Air" title="Sedang Tayang">
        {(onAir?.results || []).slice(0, 20).map((t) => (
          <Poster
            key={t.id}
            href={`/drama/${t.id}`}
            title={t.name}
            poster={tmdbImg(t.poster_path, "w500")}
            score={t.vote_average}
            badge="TAYANG"
            sub={t.first_air_date?.slice(0, 4)}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="Top Rated" title="Drama Skor Tertinggi">
        {(top?.results || []).slice(0, 20).map((t, i) => (
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
    </>
  )
}
