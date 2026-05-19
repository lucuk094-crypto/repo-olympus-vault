import { notFound } from "next/navigation"
import { discoverTv, tmdbImg } from "@/lib/api/tmdb"
import Poster from "@/components/poster"

interface Props {
  params: Promise<{ genre: string }>
  searchParams: Promise<{ page?: string }>
}

export const revalidate = 3600

const GENRE_MAP: Record<string, number> = {
  "action-adventure": 10759,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  kids: 10762,
  mystery: 9648,
  news: 10763,
  reality: 10764,
  "sci-fi-fantasy": 10765,
  soap: 10766,
  talk: 10767,
  "war-politics": 10768,
  western: 37,
}

const GENRE_NAMES: Record<string, string> = {
  "action-adventure": "Action & Adventure",
  animation: "Animation",
  comedy: "Comedy",
  crime: "Crime",
  documentary: "Documentary",
  drama: "Drama",
  family: "Family",
  kids: "Kids",
  mystery: "Mystery",
  news: "News",
  reality: "Reality",
  "sci-fi-fantasy": "Sci-Fi & Fantasy",
  soap: "Soap",
  talk: "Talk",
  "war-politics": "War & Politics",
  western: "Western",
}

export async function generateMetadata({ params }: Props) {
  const { genre } = await params
  const genreName = GENRE_NAMES[genre] || genre
  return { title: `${genreName} Drama — VanX Stream` }
}

export default async function DramaGenrePage({ params, searchParams }: Props) {
  const { genre } = await params
  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr || "1", 10)

  const genreId = GENRE_MAP[genre]
  const genreName = GENRE_NAMES[genre] || genre

  if (!genreId) notFound()

  const data = await discoverTv({ genre: genreId, page })

  if (!data || !data.results || data.results.length === 0) notFound()

  return (
    <>
      <div className="vx-section" style={{ paddingTop: "2rem" }}>
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Genre</div>
            <h1 className="vx-section-title">{genreName} Drama</h1>
          </div>
        </div>

        <div className="vx-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1.5rem",
          marginTop: "1.5rem"
        }}>
          {data.results.map((tv) => (
            <Poster
              key={tv.id}
              href={`/drama/${tv.id}`}
              title={tv.name}
              poster={tmdbImg(tv.poster_path, "w500")}
              score={tv.vote_average}
              sub={tv.first_air_date?.slice(0, 4) || ""}
            />
          ))}
        </div>

        {/* Pagination */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "3rem",
          paddingBottom: "2rem"
        }}>
          {page > 1 && (
            <a
              href={`/drama/genre/${genre}?page=${page - 1}`}
              className="vx-btn-ghost"
            >
              ← Sebelumnya
            </a>
          )}
          <span style={{
            padding: "0.5rem 1rem",
            color: "var(--gold)",
            fontFamily: "var(--serif)",
            fontWeight: 600
          }}>
            Halaman {page}
          </span>
          {data.total_pages && page < data.total_pages && (
            <a
              href={`/drama/genre/${genre}?page=${page + 1}`}
              className="vx-btn-ghost"
            >
              Selanjutnya →
            </a>
          )}
        </div>
      </div>
    </>
  )
}
