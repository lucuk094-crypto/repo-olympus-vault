import { Suspense } from "react"
import {
  getKomikTerbaru,
  getKomikPopuler,
  getKomikRealtime,
  getKomikByGenre,
  KOMIKU_GENRES,
} from "@/lib/api/komiku"
import KomikGrid from "@/components/komik-grid"
import KomikSearch from "@/components/komik-search"

export const revalidate = 300
export const dynamic = "force-dynamic"
export const metadata = {
  title: "Komik · VanX Stream",
  description: "Baca ribuan manga, manhwa, dan manhua sub Indonesia di VanX Stream",
}

export default async function KomikPage() {
  const [latest, popular, realtime, action, fantasy, romance] = await Promise.all([
    getKomikTerbaru(1, 18).catch(() => []),
    getKomikPopuler(1, 18).catch(() => []),
    getKomikRealtime(12, true).catch(() => []),
    getKomikByGenre("action", 1, 18).catch(() => []),
    getKomikByGenre("fantasy", 1, 18).catch(() => []),
    getKomikByGenre("romance", 1, 18).catch(() => []),
  ])

  return (
    <>
      <div className="vx-section" style={{ paddingTop: "1.5rem" }}>
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Library Komik</div>
            <h1 className="vx-section-title" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.1rem)" }}>
              Manga, Manhwa &amp; Manhua
            </h1>
          </div>
        </div>
        <p style={{
          color: "var(--text-2)", maxWidth: 720, margin: "0 0 1.5rem",
          fontFamily: "var(--serif-italic)", fontSize: "0.95rem", lineHeight: 1.6,
        }}>
          Sumber data resmi dari Sanka Vollerei API · ribuan komik bahasa Indonesia · update real-time
        </p>

        <Suspense fallback={null}>
          <KomikSearch />
        </Suspense>
      </div>

      <KomikGrid eyebrow="Update Hari Ini" title="Komik Terbaru" comics={latest} viewAll="/komik?sort=terbaru" />

      <KomikGrid eyebrow="Pilihan Pembaca" title="Komik Populer" comics={popular} viewAll="/komik?sort=populer" />

      {realtime.length > 0 && (
        <KomikGrid eyebrow="Real-time" title="Sedang Trending" comics={realtime} />
      )}

      {action.length > 0 && (
        <KomikGrid eyebrow="Genre" title="Aksi Penuh Adrenalin" comics={action} viewAll="/komik/genre/action" />
      )}

      {fantasy.length > 0 && (
        <KomikGrid eyebrow="Genre" title="Fantasi Tanpa Batas" comics={fantasy} viewAll="/komik/genre/fantasy" />
      )}

      {romance.length > 0 && (
        <KomikGrid eyebrow="Genre" title="Romansa Manis" comics={romance} viewAll="/komik/genre/romance" />
      )}

      {/* Genre quick links */}
      <div className="vx-section">
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Jelajahi</div>
            <h2 className="vx-section-title">Genre Populer</h2>
          </div>
        </div>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "0.5rem",
        }}>
          {KOMIKU_GENRES.map((g) => (
            <a
              key={g}
              href={`/komik/genre/${g.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                background: "var(--gold-soft)",
                border: "1px solid var(--gold)",
                color: "var(--gold)",
                padding: "0.5rem 1rem",
                borderRadius: 4,
                fontFamily: "var(--serif)",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              {g}
            </a>
          ))}
        </div>
      </div>

      <div className="greek-divider"><span className="greek-laurel">✦</span></div>
    </>
  )
}
