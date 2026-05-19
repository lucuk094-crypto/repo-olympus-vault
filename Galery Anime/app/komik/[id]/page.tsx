import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, BookOpen, ExternalLink, Star } from "lucide-react"
import { getKomikDetail, slugFromLink, type KomikItem } from "@/lib/api/komiku"
import Translatable from "@/components/translatable"
import FavoriteButton from "@/components/favorite-button"

export const revalidate = 600

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const m = await getKomikDetail(id).catch(() => null)
  if (!m) return { title: "Komik tidak ditemukan · VanX Stream" }
  return {
    title: `${m.title} — Komik · VanX Stream`,
    description: (m.synopsis || "").slice(0, 160),
  }
}

export default async function KomikDetailPage({ params }: Props) {
  const { id } = await params
  const m = await getKomikDetail(id).catch(() => null)
  if (!m) notFound()

  const banner = m.image
  const firstChapter = m.chapters?.[m.chapters.length - 1]
  const latestChapter = m.chapters?.[0]
  const similar: KomikItem[] = m.similar_manga || []

  const favItem = {
    type: "manga" as const,
    id: m.slug,
    title: m.title,
    poster: m.image,
    score: null,
    sub: m.metadata?.type || "Komik",
    ts: 0,
  }

  return (
    <>
      <div className="vx-hero" style={{ minHeight: "min(58vh, 520px)" }}>
        <div className="vx-hero-bg" style={{
          backgroundImage: `url(${banner})`,
          filter: "blur(20px) brightness(0.5)",
          transform: "scale(1.1)",
        }} />
        <div className="vx-hero-overlay" />
        <div className="vx-hero-content" style={{
          display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.5rem",
          alignItems: "flex-end", maxWidth: 1200,
        }}>
          <img
            src={m.image}
            alt={m.title}
            style={{
              width: "min(180px, 32vw)", aspectRatio: "2/3",
              objectFit: "cover", borderRadius: 6,
              border: "2px solid var(--gold)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div className="vx-hero-eyebrow">
              {m.metadata?.type || "Komik"}
              {m.metadata?.status && ` · ${m.metadata.status}`}
            </div>
            <h1 className="vx-hero-title">
              {m.title}
              {m.title_indonesian && m.title_indonesian !== m.title && (
                <> · <em>{m.title_indonesian}</em></>
              )}
            </h1>
            <div className="vx-hero-meta">
              {m.metadata?.author && <span>oleh <strong style={{ color: "var(--gold)" }}>{m.metadata.author}</strong></span>}
              {m.metadata?.concept && <span className="vx-hero-meta-divider">{m.metadata.concept}</span>}
              {m.metadata?.age_rating && <span className="vx-hero-meta-divider">{m.metadata.age_rating}</span>}
              {m.metadata?.reading_direction && <span className="vx-hero-meta-divider">{m.metadata.reading_direction}</span>}
            </div>
            {m.genres?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "0.5rem 0 1rem" }}>
                {m.genres.map((g) => (
                  <Link key={g.slug} href={`/komik/genre/${g.slug}`} style={{
                    background: "var(--gold-soft)", border: "1px solid var(--gold)",
                    color: "var(--gold)", padding: "0.18rem 0.7rem", borderRadius: 4,
                    fontFamily: "var(--serif)", fontSize: "0.7rem", fontWeight: 600,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    textDecoration: "none",
                  }}>{g.name}</Link>
                ))}
              </div>
            )}
            <div className="vx-hero-actions">
              {firstChapter && (
                <Link href={`/komik/${id}/chapter/${firstChapter.slug}`} className="vx-btn-primary">
                  <BookOpen size={14} /> Mulai Baca
                </Link>
              )}
              {latestChapter && latestChapter.slug !== firstChapter?.slug && (
                <Link href={`/komik/${id}/chapter/${latestChapter.slug}`} className="vx-btn-ghost">
                  <ChevronRight size={14} /> {latestChapter.chapter}
                </Link>
              )}
              <FavoriteButton item={favItem} />
            </div>
          </div>
        </div>
      </div>

      {/* Sinopsis */}
      {m.synopsis && (
        <section className="vx-section" style={{ maxWidth: 1100 }}>
          <div className="vx-section-head">
            <div className="vx-section-title-group">
              <div className="vx-section-eyebrow">Sinopsis</div>
              <h2 className="vx-section-title">Cerita</h2>
            </div>
          </div>
          <Translatable
            text={m.synopsis_full || m.synopsis}
            auto
            className="vx-hero-sub"
            style={{
              WebkitLineClamp: "unset", display: "block",
              maxWidth: 900, fontSize: "1rem", lineHeight: 1.7,
              whiteSpace: "pre-line",
            }}
          />
        </section>
      )}

      {/* Info grid */}
      <section className="vx-section">
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Detail</div>
            <h2 className="vx-section-title">Informasi</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.7rem" }}>
          {m.metadata?.type && <Info label="Tipe" value={m.metadata.type} />}
          {m.metadata?.author && <Info label="Pengarang" value={m.metadata.author} />}
          {m.metadata?.status && <Info label="Status" value={m.metadata.status} />}
          {m.metadata?.concept && <Info label="Konsep" value={m.metadata.concept} />}
          {m.metadata?.age_rating && <Info label="Rating Usia" value={m.metadata.age_rating} />}
          {m.metadata?.reading_direction && <Info label="Arah Baca" value={m.metadata.reading_direction} />}
          <Info label="Total Chapter" value={String(m.chapters?.length || 0)} />
        </div>
      </section>

      {/* Chapter list */}
      {m.chapters?.length > 0 && (
        <section className="vx-section">
          <div className="vx-section-head">
            <div className="vx-section-title-group">
              <div className="vx-section-eyebrow">Chapter</div>
              <h2 className="vx-section-title">Daftar Chapter ({m.chapters.length})</h2>
            </div>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "0.5rem",
            maxHeight: 480, overflowY: "auto",
            padding: "0.25rem",
            background: "rgba(10,14,26,0.3)",
            border: "1px solid var(--border)",
            borderRadius: 8,
          }}>
            {m.chapters.map((ch) => (
              <Link
                key={ch.slug}
                href={`/komik/${id}/chapter/${ch.slug}`}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "0.55rem 0.75rem",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 5,
                  color: "var(--text-2)",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  fontFamily: "var(--serif)",
                  fontSize: "0.82rem",
                }}
              >
                <span style={{ fontWeight: 600 }}>{ch.chapter}</span>
                <span style={{ fontSize: "0.68rem", color: "var(--text-3)", fontFamily: "var(--serif-italic)" }}>{ch.date}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <section className="vx-section">
          <div className="vx-section-head">
            <div className="vx-section-title-group">
              <div className="vx-section-eyebrow">Untuk Anda</div>
              <h2 className="vx-section-title">Komik Mirip</h2>
            </div>
          </div>
          <div className="vx-row">
            {similar.map((s) => {
              const slug = s.slug || slugFromLink(s.link)
              return (
                <Link key={slug} href={`/komik/${slug}`} className="vx-poster" style={{ flex: "0 0 150px" }}>
                  <div className="vx-poster-thumb">
                    <img src={s.image} alt={s.title} loading="lazy" />
                  </div>
                  <div className="vx-poster-title">{s.title}</div>
                  <div className="vx-poster-sub">{s.genre || ""}</div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <div className="greek-divider"><span className="greek-laurel">✦</span></div>
    </>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 6,
      padding: "0.7rem 0.85rem",
    }}>
      <div className="greek-caps" style={{ fontSize: "0.65rem", color: "var(--gold)", marginBottom: "0.25rem" }}>{label}</div>
      <div style={{ color: "var(--marble)", fontWeight: 500, fontSize: "0.88rem" }}>{value}</div>
    </div>
  )
}
