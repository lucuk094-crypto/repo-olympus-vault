import { Suspense } from "react"
import { getJikanSchedule, type JikanAnime } from "@/lib/api/jikan"
import FilterBar, { type FilterDef } from "@/components/filter-bar"
import Poster from "@/components/poster"

export const metadata = { title: "Jadwal Tayang — VanX Stream" }
export const dynamic = "force-dynamic"

const DAYS = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"] as const
const DAY_LABEL: Record<string, string> = {
  sunday: "Minggu", monday: "Senin", tuesday: "Selasa", wednesday: "Rabu",
  thursday: "Kamis", friday: "Jumat", saturday: "Sabtu",
}

const FILTERS: FilterDef[] = [{
  key: "day",
  label: "Hari",
  options: DAYS.map((d) => ({ value: d, label: DAY_LABEL[d] })),
  default: "monday",
}]

interface Props {
  searchParams: Promise<{ day?: string }>
}

export default async function JadwalPage({ searchParams }: Props) {
  const sp = await searchParams
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
  const dayParam = (sp.day || today) as typeof DAYS[number]
  const day = (DAYS.includes(dayParam) ? dayParam : "monday") as typeof DAYS[number]

  const data = await getJikanSchedule(day)

  return (
    <>
      <section className="vx-section" style={{ paddingTop: "2rem" }}>
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Jadwal Tayang</div>
            <h1 className="vx-section-title">{DAY_LABEL[day]}</h1>
          </div>
        </div>
        <Suspense>
          <FilterBar filters={FILTERS} />
        </Suspense>
        <div className="vx-grid">
          {data.map((a: JikanAnime) => (
            <Poster
              key={a.mal_id}
              href={`/anime/${a.mal_id}`}
              title={a.title_english || a.title}
              poster={a.images.webp.large_image_url || a.images.jpg.large_image_url}
              score={a.score}
              badge={a.status === "Currently Airing" ? "TAYANG" : null}
              sub={`${a.episodes ? a.episodes + " eps · " : ""}${a.year || ""}`.trim()}
            />
          ))}
        </div>
        {data.length === 0 && (
          <p className="vx-empty">Tidak ada anime tayang di hari {DAY_LABEL[day]}</p>
        )}
      </section>
    </>
  )
}
