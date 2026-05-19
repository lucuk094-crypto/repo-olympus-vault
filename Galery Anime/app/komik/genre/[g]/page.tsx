import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getKomikByGenre, slugFromLink } from "@/lib/api/komiku"

export const revalidate = 600

interface Props {
  params: Promise<{ g: string }>
  searchParams?: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { g } = await params
  return { title: `Komik Genre ${g} · VanX Stream` }
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { g } = await params
  const sp = await searchParams
  const page = parseInt(sp?.page || "1", 10)
  const comics = await getKomikByGenre(g, page, 36).catch(() => [])

  const titleCase = g.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <>
      <div className="vx-section" style={{ paddingTop: "1.5rem" }}>
        <Link href="/komik" style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          color: "var(--gold)", textDecoration: "none",
          fontFamily: "var(--serif)", fontSize: "0.78rem",
          marginBottom: "1rem",
        }}>
          <ChevronLeft size={14} /> Kembali ke Komik
        </Link>
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Genre</div>
            <h1 className="vx-section-title">{titleCase}</h1>
          </div>
        </div>
      </div>

      <div className="vx-section">
        {comics.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "3rem 1rem",
            color: "var(--text-3)", fontFamily: "var(--serif-italic)",
          }}>
            Tidak ada komik untuk genre ini.
          </div>
        ) : (
          <>
            <div className="vx-grid">
              {comics.map((c) => {
                const slug = c.slug || slugFromLink(c.link)
                return (
                  <Link key={slug} href={`/komik/${slug}`} className="vx-poster">
                    <div className="vx-poster-thumb">
                      <img src={c.image} alt={c.title} loading="lazy" />
                      {c.chapter && <span className="vx-poster-badge">{c.chapter.replace("Chapter ", "Ch ")}</span>}
                    </div>
                    <div className="vx-poster-title">{c.title}</div>
                    <div className="vx-poster-sub">{c.status || c.type || ""}</div>
                  </Link>
                )
              })}
            </div>

            {/* Simple pagination */}
            <div style={{
              display: "flex", gap: 8, justifyContent: "center",
              marginTop: "2rem", flexWrap: "wrap",
            }}>
              {page > 1 && (
                <Link href={`/komik/genre/${g}?page=${page - 1}`} className="vx-btn-ghost">
                  <ChevronLeft size={14} /> Sebelumnya
                </Link>
              )}
              <span style={{
                padding: "0.7rem 1.2rem",
                background: "var(--gold-soft)",
                border: "1px solid var(--gold)",
                color: "var(--gold)",
                borderRadius: 4,
                fontFamily: "var(--serif)",
                fontWeight: 700,
              }}>Halaman {page}</span>
              {comics.length === 36 && (
                <Link href={`/komik/genre/${g}?page=${page + 1}`} className="vx-btn-primary">
                  Berikutnya
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      <div className="greek-divider"><span className="greek-laurel">✦</span></div>
    </>
  )
}
