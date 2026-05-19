import { notFound } from "next/navigation"
import { Star, ExternalLink } from "lucide-react"
import { getAnimeDetail, aniTitle, stripHtml } from "@/lib/api/anilist"
import { findChannelSeries } from "@/lib/api/channels"
import SectionRow from "@/components/section-row"
import Poster from "@/components/poster"
import Translatable from "@/components/translatable"
import FavoriteButton from "@/components/favorite-button"
import { TrailerButton } from "@/components/trailer-button"
import EpisodePlayer from "@/components/episode-player"
import DetailTabs from "@/components/detail-tabs"
import YoutubeSearchPlayer from "@/components/youtube-search-player"

interface Props { params: Promise<{ id: string }> }

export const revalidate = 3600

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const m = await getAnimeDetail(id)
  if (!m) return { title: "Anime tidak ditemukan" }
  return { title: `${aniTitle(m)} — VanX Stream`, description: stripHtml(m.description || "").slice(0, 160) }
}

const FORMAT: Record<string, string> = {
  TV: "TV Series", TV_SHORT: "TV Pendek", MOVIE: "Film", SPECIAL: "Special",
  OVA: "OVA", ONA: "ONA", MUSIC: "Musik",
}
const STATUS: Record<string, string> = {
  FINISHED: "Tamat", RELEASING: "Sedang Tayang", NOT_YET_RELEASED: "Belum Rilis",
  CANCELLED: "Dibatalkan", HIATUS: "Hiatus",
}
const COUNTRY: Record<string, string> = { JP: "Jepang", CN: "Tiongkok", KR: "Korea", TW: "Taiwan" }
const SEASON: Record<string, string> = { WINTER: "Musim Dingin", SPRING: "Musim Semi", SUMMER: "Musim Panas", FALL: "Musim Gugur" }
const STATUS_LABEL: Record<string, string> = {
  CURRENT: "Menonton", PLANNING: "Direncanakan", COMPLETED: "Selesai",
  DROPPED: "Berhenti", PAUSED: "Ditunda", REPEATING: "Mengulang",
}

export default async function AnimeDetailPage({ params }: Props) {
  const { id } = await params
  const m = await getAnimeDetail(id)
  if (!m) notFound()

  const title = aniTitle(m)
  const synopsis = stripHtml(m.description || "")
  const banner = m.bannerImage || m.coverImage.extraLarge
  const studios = m.studios?.nodes?.filter((s) => s.isAnimationStudio).map((s) => s.name) || []
  const ytId = m.trailer?.site === "youtube" ? m.trailer.id?.trim() : null
  const recs = m.recommendations?.edges?.map((e) => e.node.mediaRecommendation).filter(Boolean) || []
  const relations = m.relations?.edges?.filter((r) => (r.node as any).format) || []
  const streamingEpisodes = m.streamingEpisodes || []
  const channelMatch = await findChannelSeries([m.title.english, m.title.romaji, m.title.native])

  const tags = (m.tags || []).filter((t) => !t.isMediaSpoiler).slice(0, 30)
  const externalLinks = m.externalLinks || []
  const rankings = m.rankings || []
  const characters = m.characters?.edges || []
  const staff = m.staff?.edges || []
  const stats = m.stats || { scoreDistribution: [], statusDistribution: [] }

  // Group external links by type
  const social = externalLinks.filter((l) => l.type === "SOCIAL")
  const streaming = externalLinks.filter((l) => l.type === "STREAMING")
  const info = externalLinks.filter((l) => !l.type || (l.type !== "SOCIAL" && l.type !== "STREAMING"))

  const favItem = {
    type: "anime" as const,
    id: String(m.id),
    title,
    poster: m.coverImage.extraLarge || m.coverImage.large,
    score: m.averageScore ? m.averageScore / 10 : null,
    sub: `${m.format || "Anime"} · ${m.seasonYear || ""}`.trim(),
    ts: 0,
  }

  // Has streaming/episode content?
  const hasWatch = true // Always show Watch tab — uses fallback YouTube search

  const tabLabels = [
    "Overview",
    "Watch",
    ...(characters.length ? ["Karakter"] : []),
    ...(staff.length ? ["Staf"] : []),
    "Stats",
    ...(externalLinks.length ? ["Sosial"] : []),
  ]

  return (
    <>
      <div className="vx-hero" style={{ minHeight: "min(60vh, 540px)" }}>
        <div className="vx-hero-bg" style={{ backgroundImage: `url(${banner})` }} />
        <div className="vx-hero-overlay" />
        <div className="vx-hero-content vx-detail-hero" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.5rem", alignItems: "flex-end", maxWidth: 1200 }}>
          <img
            src={m.coverImage.extraLarge}
            alt={title}
            style={{ width: 180, aspectRatio: "2/3", objectFit: "cover", borderRadius: 6, border: "2px solid var(--gold)", boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}
          />
          <div style={{ minWidth: 0 }}>
            <div className="vx-hero-eyebrow">Anime · {COUNTRY[m.countryOfOrigin || ""] || "Jepang"}</div>
            <h1 className="vx-hero-title">
              {title}
              {m.title.native && m.title.native !== title && (<> · <em>{m.title.native}</em></>)}
            </h1>
            <div className="vx-hero-meta">
              {m.averageScore != null && (
                <span style={{ color: "var(--gold)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Star size={12} fill="currentColor" /> {(m.averageScore / 10).toFixed(2)}
                </span>
              )}
              {m.format && <span className="vx-hero-meta-divider">{FORMAT[m.format] || m.format}</span>}
              {m.episodes && <span className="vx-hero-meta-divider">{m.episodes} Episode</span>}
              {m.duration && <span className="vx-hero-meta-divider">{m.duration} mnt</span>}
              {m.seasonYear && <span className="vx-hero-meta-divider">{m.seasonYear}</span>}
              {m.status && <span className="vx-hero-meta-divider" style={{ color: "var(--gold)" }}>{STATUS[m.status] || m.status}</span>}
            </div>
            {m.genres.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "0.5rem 0 1rem" }}>
                {m.genres.map((g) => (
                  <span key={g} style={{
                    background: "var(--gold-soft)", border: "1px solid var(--gold)",
                    color: "var(--gold)", padding: "0.18rem 0.7rem", borderRadius: 4,
                    fontFamily: "var(--serif)", fontSize: "0.7rem", fontWeight: 600,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>{g}</span>
                ))}
              </div>
            )}
            <div className="vx-hero-actions">
              {ytId && <TrailerButton youtubeId={ytId} title={title} />}
              <FavoriteButton item={favItem} />
              <a className="vx-btn-ghost" href={m.siteUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} /> AniList
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings as quick highlights */}
      {rankings.length > 0 && (
        <section className="vx-section" style={{ paddingTop: "1.25rem", paddingBottom: 0 }}>
          <div className="vx-rank-row">
            {rankings.slice(0, 6).map((r) => (
              <span key={r.id} className="vx-rank-pill">
                #<strong>{r.rank}</strong> {r.context}
                {r.year && ` ${r.year}`}
              </span>
            ))}
          </div>
        </section>
      )}

      <DetailTabs labels={tabLabels}>
        {/* ===== OVERVIEW ===== */}
        <div>
          {synopsis && (
            <section className="vx-section" style={{ maxWidth: 1100, paddingTop: "0.5rem" }}>
              <div className="vx-section-head">
                <div className="vx-section-title-group">
                  <div className="vx-section-eyebrow">Sinopsis</div>
                  <h2 className="vx-section-title">Cerita</h2>
                </div>
              </div>
              <Translatable
                text={synopsis}
                auto
                className="vx-hero-sub"
                style={{ WebkitLineClamp: "unset", display: "block", maxWidth: 900, fontSize: "1rem", lineHeight: 1.7 }}
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
              {m.title.romaji && <Info label="Romaji" value={m.title.romaji} />}
              {m.title.english && <Info label="English" value={m.title.english} />}
              {(m as any).synonyms?.length > 0 && <Info label="Sinonim" value={(m as any).synonyms.slice(0, 3).join(", ")} />}
              {studios.length > 0 && <Info label="Studio" value={studios.join(", ")} />}
              {m.season && m.seasonYear && <Info label="Musim" value={`${SEASON[m.season] || m.season} ${m.seasonYear}`} />}
              {m.startDate?.year && <Info label="Mulai" value={[m.startDate.day, m.startDate.month, m.startDate.year].filter(Boolean).join("/")} />}
              {m.endDate?.year && <Info label="Selesai" value={[m.endDate.day, m.endDate.month, m.endDate.year].filter(Boolean).join("/")} />}
              {m.source && <Info label="Sumber" value={m.source.replace(/_/g, " ").toLowerCase()} />}
              {(m as any).meanScore != null && <Info label="Skor Rata-Rata" value={`${(m as any).meanScore}%`} />}
              {m.popularity != null && <Info label="Popularitas" value={m.popularity.toLocaleString("id-ID")} />}
              {m.favourites != null && m.favourites > 0 && <Info label="Favorit" value={m.favourites.toLocaleString("id-ID")} />}
              {(m as any).hashtag && <Info label="Hashtag" value={(m as any).hashtag} />}
            </div>
          </section>

          {/* Tags */}
          {tags.length > 0 && (
            <section className="vx-section">
              <div className="vx-section-head">
                <div className="vx-section-title-group">
                  <div className="vx-section-eyebrow">Tema</div>
                  <h2 className="vx-section-title">Tag</h2>
                </div>
              </div>
              <div className="vx-tag-grid">
                {tags.map((t) => (
                  <div key={t.id} className="vx-tag-card" title={t.description || ""}>
                    <div className="vx-tag-card-head">
                      <span className="vx-tag-card-name">{t.name}</span>
                      <span className="vx-tag-card-rank">{t.rank}%</span>
                    </div>
                    {t.category && <span className="vx-tag-card-cat">{t.category}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Relations */}
          {relations.length > 0 && (
            <SectionRow eyebrow="Relasi" title="Anime Terkait">
              {relations.map((r) => (
                <Poster
                  key={r.node.id}
                  href={`/anime/${r.node.id}`}
                  title={aniTitle(r.node)}
                  poster={r.node.coverImage.extraLarge || r.node.coverImage.large}
                  score={r.node.averageScore ? r.node.averageScore / 10 : null}
                  sub={r.relationType.replace(/_/g, " ").toLowerCase()}
                />
              ))}
            </SectionRow>
          )}

          {/* Recommendations */}
          {recs.length > 0 && (
            <SectionRow eyebrow="Untuk Anda" title="Rekomendasi Mirip">
              {recs.map((r) => r ? (
                <Poster
                  key={r.id}
                  href={`/anime/${r.id}`}
                  title={aniTitle(r)}
                  poster={r.coverImage.extraLarge || r.coverImage.large}
                  score={r.averageScore ? r.averageScore / 10 : null}
                  sub={`${r.format || ""} · ${r.seasonYear || ""}`.trim()}
                />
              ) : null)}
            </SectionRow>
          )}
        </div>

        {/* ===== WATCH ===== */}
        <div>
          {channelMatch && channelMatch.episodes.length > 0 ? (
            <EpisodePlayer
              episodes={channelMatch.episodes}
              title={channelMatch.seriesName}
              channelName={channelMatch.channelName}
            />
          ) : (
            <YoutubeSearchPlayer
              query={title + " episode 1"}
              fallbackTitles={[
                title,
                m.title.romaji || "",
                m.title.english || "",
                m.title.native || "",
              ].filter(Boolean) as string[]}
              label={`Tonton: ${title}`}
            />
          )}

          {streamingEpisodes.length > 0 && (
            <section className="vx-section">
              <div className="vx-section-head">
                <div className="vx-section-title-group">
                  <div className="vx-section-eyebrow">Episode</div>
                  <h2 className="vx-section-title">Daftar Tayang Resmi ({streamingEpisodes.length})</h2>
                </div>
              </div>
              <div className="vx-row">
                {streamingEpisodes.map((ep, i) => (
                  <a
                    key={i}
                    href={ep.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vx-backdrop-card"
                  >
                    <div className="vx-backdrop-card-thumb">
                      {ep.thumbnail && <img src={ep.thumbnail} alt={ep.title} loading="lazy" />}
                    </div>
                    <div className="vx-backdrop-card-info">
                      <div className="vx-backdrop-card-title">{ep.title || `Episode ${i + 1}`}</div>
                      <div className="vx-backdrop-card-sub">{ep.site}</div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {streaming.length > 0 && (
            <section className="vx-section">
              <div className="vx-section-head">
                <div className="vx-section-title-group">
                  <div className="vx-section-eyebrow">Platform Streaming</div>
                  <h2 className="vx-section-title">Tonton di Sumber Resmi</h2>
                </div>
              </div>
              <div className="vx-social-grid">
                {streaming.map((l) => (
                  <a key={l.id} className="vx-social-link" href={l.url} target="_blank" rel="noopener noreferrer">
                    <span className="vx-social-link-icon" style={l.color ? { background: l.color, color: "#fff" } : {}}>
                      {l.site.charAt(0)}
                    </span>
                    <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {l.site}
                      {l.language && <span className="vx-social-link-meta"> · {l.language}</span>}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ===== KARAKTER ===== */}
        {characters.length > 0 && (
          <div>
            <section className="vx-section">
              <div className="vx-section-head">
                <div className="vx-section-title-group">
                  <div className="vx-section-eyebrow">Cast</div>
                  <h2 className="vx-section-title">Karakter &amp; Pengisi Suara</h2>
                </div>
              </div>
              <div className="vx-cast-grid">
                {characters.map((c, i) => {
                  const va = c.voiceActors?.[0]
                  return (
                    <div key={i} className="vx-cast-card">
                      <img className="vx-cast-card-img" src={c.node.image?.medium} alt={c.node.name.full} loading="lazy" />
                      <div className="vx-cast-card-info">
                        <div className="vx-cast-card-name">{c.node.name.full}</div>
                        <div className="vx-cast-card-role">{c.role.toLowerCase()}</div>
                        {va && (
                          <div className="vx-cast-card-role" style={{ marginTop: 6, color: "var(--gold)" }}>
                            CV {va.name.full}
                          </div>
                        )}
                      </div>
                      {va?.image?.medium && (
                        <img className="vx-cast-card-va-img" src={va.image.medium} alt={va.name.full} loading="lazy" />
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        )}

        {/* ===== STAF ===== */}
        {staff.length > 0 && (
          <div>
            <section className="vx-section">
              <div className="vx-section-head">
                <div className="vx-section-title-group">
                  <div className="vx-section-eyebrow">Production Crew</div>
                  <h2 className="vx-section-title">Staf Produksi</h2>
                </div>
              </div>
              <div className="vx-cast-grid">
                {staff.map((s, i) => (
                  <div key={i} className="vx-cast-card" style={{ gridTemplateColumns: "56px 1fr" }}>
                    <img className="vx-cast-card-img round" src={s.node.image?.medium} alt={s.node.name.full} loading="lazy" />
                    <div className="vx-cast-card-info">
                      <div className="vx-cast-card-name">{s.node.name.full}</div>
                      <div className="vx-cast-card-role">{s.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ===== STATS ===== */}
        <div>
          <section className="vx-section">
            <div className="vx-section-head">
              <div className="vx-section-title-group">
                <div className="vx-section-eyebrow">Komunitas AniList</div>
                <h2 className="vx-section-title">Statistik</h2>
              </div>
            </div>
            <div className="vx-stats-grid">
              {stats.scoreDistribution.length > 0 && <ScoreChart data={stats.scoreDistribution} />}
              {stats.statusDistribution.length > 0 && <StatusList data={stats.statusDistribution} />}
            </div>
          </section>

          {rankings.length > 0 && (
            <section className="vx-section">
              <div className="vx-section-head">
                <div className="vx-section-title-group">
                  <div className="vx-section-eyebrow">Peringkat</div>
                  <h2 className="vx-section-title">Semua Ranking</h2>
                </div>
              </div>
              <div className="vx-rank-row">
                {rankings.map((r) => (
                  <span key={r.id} className="vx-rank-pill">
                    #<strong>{r.rank}</strong> {r.context}
                    {r.year && ` ${r.year}`}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ===== SOSIAL / EXTERNAL ===== */}
        {externalLinks.length > 0 && (
          <div>
            {social.length > 0 && (
              <section className="vx-section">
                <div className="vx-section-head">
                  <div className="vx-section-title-group">
                    <div className="vx-section-eyebrow">Social</div>
                    <h2 className="vx-section-title">Sosial Resmi</h2>
                  </div>
                </div>
                <div className="vx-social-grid">
                  {social.map((l) => (
                    <a key={l.id} className="vx-social-link" href={l.url} target="_blank" rel="noopener noreferrer">
                      <span className="vx-social-link-icon" style={l.color ? { background: l.color, color: "#fff" } : {}}>
                        {l.site.charAt(0)}
                      </span>
                      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.site}</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {info.length > 0 && (
              <section className="vx-section">
                <div className="vx-section-head">
                  <div className="vx-section-title-group">
                    <div className="vx-section-eyebrow">Database &amp; Info</div>
                    <h2 className="vx-section-title">Tautan Lain</h2>
                  </div>
                </div>
                <div className="vx-social-grid">
                  {info.map((l) => (
                    <a key={l.id} className="vx-social-link" href={l.url} target="_blank" rel="noopener noreferrer">
                      <span className="vx-social-link-icon" style={l.color ? { background: l.color, color: "#fff" } : {}}>
                        {l.site.charAt(0)}
                      </span>
                      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.site}</span>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </DetailTabs>

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
      <div style={{ color: "var(--marble)", fontWeight: 500, fontSize: "0.88rem", textTransform: label === "Sumber" ? "capitalize" : undefined }}>{value}</div>
    </div>
  )
}

function ScoreChart({ data }: { data: { score: number; amount: number }[] }) {
  const max = Math.max(...data.map((d) => d.amount), 1)
  const sorted = [...data].sort((a, b) => a.score - b.score)
  return (
    <div className="vx-stats-card">
      <div className="greek-caps" style={{ fontSize: "0.65rem", color: "var(--gold)", marginBottom: "0.5rem" }}>Distribusi Skor</div>
      <div className="vx-stats-bars">
        {sorted.map((d) => (
          <div
            key={d.score}
            className="vx-stats-bar"
            style={{ height: `${(d.amount / max) * 100}%` }}
            title={`Skor ${d.score}: ${d.amount.toLocaleString("id-ID")} pengguna`}
          >
            <span className="vx-stats-bar-value">{d.amount.toLocaleString("id-ID")}</span>
            <span className="vx-stats-bar-label">{d.score}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1.5rem", color: "var(--text-3)", fontSize: "0.7rem", fontFamily: "var(--serif-italic)" }}>
        Total: {sorted.reduce((s, d) => s + d.amount, 0).toLocaleString("id-ID")} suara
      </div>
    </div>
  )
}

function StatusList({ data }: { data: { status: string; amount: number }[] }) {
  const total = data.reduce((s, d) => s + d.amount, 0) || 1
  const order = ["CURRENT", "PLANNING", "COMPLETED", "DROPPED", "PAUSED", "REPEATING"]
  const sorted = [...data].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status))
  return (
    <div className="vx-stats-card">
      <div className="greek-caps" style={{ fontSize: "0.65rem", color: "var(--gold)", marginBottom: "0.65rem" }}>Status Pengguna</div>
      <div className="vx-status-list">
        {sorted.map((d) => {
          const pct = (d.amount / total) * 100
          return (
            <div key={d.status} className="vx-status-row">
              <span className="vx-status-row-label">{STATUS_LABEL[d.status] || d.status}</span>
              <span className="vx-status-row-bar"><span className="vx-status-row-fill" style={{ width: `${pct}%` }} /></span>
              <span className="vx-status-row-value">{d.amount.toLocaleString("id-ID")}</span>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: "0.85rem", color: "var(--text-3)", fontSize: "0.7rem", fontFamily: "var(--serif-italic)" }}>
        Total: {total.toLocaleString("id-ID")} pengguna
      </div>
    </div>
  )
}
