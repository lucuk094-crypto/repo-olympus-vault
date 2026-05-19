import { Suspense } from "react"
import FilterBar, { type FilterDef } from "@/components/filter-bar"
import { discoverMovieByLang, getMoviesPopular, getMoviesTopRated, getMoviesTrending, tmdbImg } from "@/lib/api/tmdb"
import Poster from "@/components/poster"

export const metadata = { title: "Katalog Film — VanX Stream" }
export const dynamic = "force-dynamic"

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
    key: "lang",
    label: "Bahasa",
    options: [
      { value: "all", label: "Semua" },
      { value: "en", label: "Inggris" },
      { value: "ja", label: "Jepang" },
      { value: "ko", label: "Korea" },
      { value: "zh", label: "Mandarin" },
      { value: "id", label: "Indonesia" },
      { value: "es", label: "Spanyol" },
      { value: "fr", label: "Perancis" },
    ],
  },
  {
    key: "year",
    label: "Tahun",
    options: [
      { value: "all", label: "Semua" },
      ...Array.from({ length: 10 }, (_, i) => {
        const y = 2026 - i
        return { value: String(y), label: String(y) }
      }),
    ],
  },
]

interface Props {
  searchParams: Promise<{ sort?: string; lang?: string; year?: string }>
}

export default async function FilmCatalog({ searchParams }: Props) {
  const sp = await searchParams
  const sort = sp.sort || "trending"
  const lang = sp.lang
  const year = sp.year ? Number(sp.year) : undefined

  let data: any = null
  if (lang || year) {
    data = await discoverMovieByLang({ language: lang, year, page: 1 })
  } else if (sort === "popularity") {
    data = await getMoviesPopular(1)
  } else if (sort === "score") {
    data = await getMoviesTopRated(1)
  } else {
    data = await getMoviesTrending("week")
  }
  const list = data?.results || []

  return (
    <>
      <section className="vx-section" style={{ paddingTop: "2rem" }}>
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Cinema</div>
            <h1 className="vx-section-title">Katalog Film</h1>
          </div>
        </div>
        <Suspense>
          <FilterBar filters={FILTERS} />
        </Suspense>
        <div className="vx-grid">
          {list.map((m: any, i: number) => (
            <Poster
              key={m.id}
              href={`/film/${m.id}`}
              title={m.title}
              poster={tmdbImg(m.poster_path, "w500")}
              score={m.vote_average}
              rank={sort !== "trending" && i < 10 ? i + 1 : null}
              sub={m.release_date?.slice(0, 4) || ""}
            />
          ))}
        </div>
      </section>
    </>
  )
}
