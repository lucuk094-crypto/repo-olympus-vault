import { notFound } from "next/navigation"
import { getAnimeByGenre, aniTitle } from "@/lib/api/anilist"
import Poster from "@/components/poster"

interface Props {
  params: Promise<{ genre: string }>
  searchParams: Promise<{ page?: string }>
}

export const revalidate = 3600

const GENRE_MAP: Record<string, string> = {
  action: "Action",
  adventure: "Adventure",
  comedy: "Comedy",
  drama: "Drama",
  fantasy: "Fantasy",
  horror: "Horror",
  "mahou-shoujo": "Mahou Shoujo",
  mecha: "Mecha",
  music: "Music",
  mystery: "Mystery",
  psychological: "Psychological",
  romance: "Romance",
  "sci-fi": "Sci-Fi",
  "slice-of-life": "Slice of Life",
  sports: "Sports",
  supernatural: "Supernatural",
  thriller: "Thriller",
}

export async function generateMetadata({ params }: Props) {
  const { genre } = await params
  const genreName = GENRE_MAP[genre] || genre
  return { title: `${genreName} Anime — VanX Stream` }
}

export default async function AnimeGenrePage({ params, searchParams }: Props) {
  const { genre } = await params
  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr || "1", 10)

  const genreName = GENRE_MAP[genre] || genre
  const data = await getAnimeByGenre(genreName, page)

  if (!data || !data.length) notFound()

  return (
    <>
      <div className="vx-section" style={{ paddingTop: "2rem" }}>
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Genre</div>
            <h1 className="vx-section-title">{genreName} Anime</h1>
          </div>
        </div>

        <div className="vx-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1.5rem",
          marginTop: "1.5rem"
        }}>
          {data.map((anime) => (
            <Poster
              key={anime.id}
              href={`/anime/${anime.id}`}
              title={aniTitle(anime)}
              poster={anime.coverImage.extraLarge || anime.coverImage.large}
              score={anime.averageScore ? anime.averageScore / 10 : null}
              sub={`${anime.format || ""} · ${anime.seasonYear || ""}`.trim()}
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
              href={`/anime/genre/${genre}?page=${page - 1}`}
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
          <a
            href={`/anime/genre/${genre}?page=${page + 1}`}
            className="vx-btn-ghost"
          >
            Selanjutnya →
          </a>
        </div>
      </div>
    </>
  )
}
