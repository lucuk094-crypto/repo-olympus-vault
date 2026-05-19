import { Suspense } from "react"
import FilterBar, { type FilterDef } from "@/components/filter-bar"
import { discoverDrama, getTvOnAir, getTvPopular, getTvTopRated, getTvTrending, tmdbImg } from "@/lib/api/tmdb"
import Poster from "@/components/poster"

export const metadata = { title: "Katalog Drama — VanX Stream" }
export const dynamic = "force-dynamic"

const FILTERS: FilterDef[] = [
  {
    key: "sort",
    label: "Urut",
    options: [
      { value: "trending", label: "Trending" },
      { value: "popular", label: "Populer" },
      { value: "score", label: "Skor Tertinggi" },
      { value: "onair", label: "Sedang Tayang" },
    ],
    default: "trending",
  },
  {
    key: "country",
    label: "Negara",
    options: [
      { value: "all", label: "Semua" },
      { value: "KR", label: "Korea (K-Drama)" },
      { value: "CN", label: "China (C-Drama)" },
      { value: "JP", label: "Jepang (J-Drama)" },
      { value: "TW", label: "Taiwan" },
      { value: "TH", label: "Thailand" },
      { value: "US", label: "Amerika" },
      { value: "GB", label: "Inggris" },
      { value: "ID", label: "Indonesia" },
    ],
  },
]

interface Props {
  searchParams: Promise<{ sort?: string; country?: string }>
}

export default async function DramaCatalog({ searchParams }: Props) {
  const sp = await searchParams
  const sort = sp.sort || "trending"
  const country = sp.country

  let data: any = null
  if (country) {
    data = await discoverDrama({
      country,
      page: 1,
      sortBy: sort === "score" ? "vote_average.desc" : "popularity.desc",
    })
  } else if (sort === "popular") {
    data = await getTvPopular(1)
  } else if (sort === "score") {
    data = await getTvTopRated(1)
  } else if (sort === "onair") {
    data = await getTvOnAir(1)
  } else {
    data = await getTvTrending("week")
  }
  const list = data?.results || []

  return (
    <>
      <section className="vx-section" style={{ paddingTop: "2rem" }}>
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Drama</div>
            <h1 className="vx-section-title">Katalog{country ? ` · ${country}` : ""}</h1>
          </div>
        </div>
        <Suspense>
          <FilterBar filters={FILTERS} />
        </Suspense>
        <div className="vx-grid">
          {list.map((t: any, i: number) => (
            <Poster
              key={t.id}
              href={`/drama/${t.id}`}
              title={t.name}
              poster={tmdbImg(t.poster_path, "w500")}
              score={t.vote_average}
              rank={sort !== "trending" && i < 10 ? i + 1 : null}
              sub={t.first_air_date?.slice(0, 4) || ""}
            />
          ))}
        </div>
      </section>
    </>
  )
}
