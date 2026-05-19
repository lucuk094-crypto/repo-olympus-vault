import {
  getAnimeTrending,
  getAnimePopularAllTime,
  getAnimePopularThisSeason,
  getAnimeTopRated,
  aniTitle,
} from "@/lib/api/anilist"
import SectionRow from "@/components/section-row"
import Poster from "@/components/poster"

export const metadata = { title: "Anime — VanX Stream" }
export const dynamic = "force-dynamic"

export default async function AnimePage() {
  const [trending, season, popular, top] = await Promise.all([
    getAnimeTrending(20),
    getAnimePopularThisSeason(20),
    getAnimePopularAllTime(20),
    getAnimeTopRated(20),
  ])

  return (
    <>
      <SectionRow eyebrow="Anime" title="Trending Sekarang">
        {trending.map((a, i) => (
          <Poster
            key={a.id}
            href={`/anime/${a.id}`}
            title={aniTitle(a)}
            poster={a.coverImage.extraLarge || a.coverImage.large}
            score={a.averageScore ? a.averageScore / 10 : null}
            rank={i < 10 ? i + 1 : null}
            sub={`${a.format || "TV"} · ${a.seasonYear || ""}`.trim()}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="Musim Ini" title="Anime Sedang Tayang">
        {season.map((a) => (
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

      <SectionRow eyebrow="Popular" title="Anime Populer Sepanjang Masa">
        {popular.map((a) => (
          <Poster
            key={a.id}
            href={`/anime/${a.id}`}
            title={aniTitle(a)}
            poster={a.coverImage.extraLarge || a.coverImage.large}
            score={a.averageScore ? a.averageScore / 10 : null}
            sub={String(a.seasonYear || "")}
          />
        ))}
      </SectionRow>

      <SectionRow eyebrow="Top Rated" title="Skor Tertinggi">
        {top.map((a, i) => (
          <Poster
            key={a.id}
            href={`/anime/${a.id}`}
            title={aniTitle(a)}
            poster={a.coverImage.extraLarge || a.coverImage.large}
            score={a.averageScore ? a.averageScore / 10 : null}
            rank={i < 10 ? i + 1 : null}
            sub={`${a.format || ""} · ${a.seasonYear || ""}`.trim()}
          />
        ))}
      </SectionRow>
    </>
  )
}
