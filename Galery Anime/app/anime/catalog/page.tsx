import { Suspense } from "react"
import FilterBar, { type FilterDef } from "@/components/filter-bar"
import { getAnimeByGenre, aniTitle, getAnimePopularAllTime, getAnimeTopRated, getAnimeTrending } from "@/lib/api/anilist"
import Poster from "@/components/poster"

export const metadata = { title: "Katalog Anime — VanX Stream" }
export const dynamic = "force-dynamic"

const GENRES = ["Action","Adventure","Comedy","Drama","Ecchi","Fantasy","Horror","Mahou Shoujo","Mecha","Music","Mystery","Psychological","Romance","Sci-Fi","Slice of Life","Sports","Supernatural","Thriller"]

const FILTERS: FilterDef[] = [
  {
    key: "sort",
    label: "Urut",
    options: [
      { value: "trending", label: "Trending" },
      { value: "popularity", label: "Populer" },
      { value: "score", label: "Skor Tertinggi" },
    ],
    default: "trending",
  },
  {
    key: "genre",
    label: "Genre",
    options: [
      { value: "all", label: "Semua" },
      ...GENRES.map((g) => ({ value: g, label: g })),
    ],
  },
]

interface Props {
  searchParams: Promise<{ sort?: string; genre?: string; page?: string }>
}

export default async function AnimeCatalog({ searchParams }: Props) {
  const sp = await searchParams
  const sort = sp.sort || "trending"
  const genre = sp.genre

  let list: any[] = []
  if (genre) {
    list = await getAnimeByGenre(genre, 30, 1)
  } else if (sort === "popularity") {
    list = await getAnimePopularAllTime(30, 1)
  } else if (sort === "score") {
    list = await getAnimeTopRated(30, 1)
  } else {
    list = await getAnimeTrending(30, 1)
  }

  return (
    <>
      <section className="vx-section" style={{ paddingTop: "2rem" }}>
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Anime</div>
            <h1 className="vx-section-title">Katalog{genre ? ` · ${genre}` : ""}</h1>
          </div>
        </div>
        <Suspense>
          <FilterBar filters={FILTERS} />
        </Suspense>
        <div className="vx-grid">
          {list.map((a, i) => (
            <Poster
              key={a.id}
              href={`/anime/${a.id}`}
              title={aniTitle(a)}
              poster={a.coverImage.extraLarge || a.coverImage.large}
              score={a.averageScore ? a.averageScore / 10 : null}
              rank={sort !== "trending" && i < 10 ? i + 1 : null}
              sub={`${a.format || ""} · ${a.seasonYear || ""}`.trim()}
            />
          ))}
        </div>
      </section>
    </>
  )
}
