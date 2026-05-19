import { notFound } from "next/navigation"
import { discoverMovies, tmdbImg } from "@/lib/api/tmdb"
import Poster from "@/components/poster"

interface Props {
  params: Promise<{ genre: string }>
  searchParams: Promise<{ page?: string }>
}

export const revalidate = 3600

const GENRE_MAP: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "sci-fi": 878,
  thriller: 53,
  war: 10752,
  western: 37,
}

const GENRE_NAMES: Record<string, string> = {
  action: "Action",
  adventure: "Adventure",
  animation: "Animation",
  comedy: "Comedy",
  crime: "Crime",
  documentary: "Documentary",
  drama: "Drama",
  family: "Family",
  fantasy: "Fantasy",
  history: "History",
  horror: "Horror",
  music: "Music",
  mystery: "Mystery",
  romance: "Romance",
  "sci-fi": "Sci-Fi",
  thriller: "Thriller",
  war: "War",
  western: "Western",
}

export async function generateMetadata({ params }: Props) {
  const { genre } = await params
  const genreName = GENRE_NAMES[genre] || genre
  return { title: `${genreName} Film — VanX Stream` }
}

export default async function FilmGenrePage({ params, searchParams }: Props) {
  const { genre } = await params
  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr || "1", 10)

  const genreId = GENRE_MAP[genre]
  const genreName = GENRE_NAMES[genre] || genre

  if (!genreId) notFound()

  const data = await discoverMovies({ genre: genreId, page })

  if (!data || !data.results || data.results.length === 0) notFound()

  return (
    <>
      <div className="vx-section" style={{ paddingTop: "2rem" }}>
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Genre</div>
            <h1 className="vx-section-title">{genreName} Film</h1>
          </div>
        </div>

        <div className="vx-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1.5rem",
          marginTop: "1.5rem"
        }}>
          {data.results.map((movie) => (
            <Poster
              key={movie.id}
              href={`/film/${movie.id}`}
              title={movie.title}
              poster={tmdbImg(movie.poster_path, "w500")}
              score={movie.vote_average}
              sub={movie.release_date?.slice(0, 4) || ""}
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
              href={`/film/genre/${genre}?page=${page - 1}`}
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
              href={`/film/genre/${genre}?page=${page + 1}`}
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
