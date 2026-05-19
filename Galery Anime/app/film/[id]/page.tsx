import { notFound } from "next/navigation"
import { Star, ExternalLink } from "lucide-react"
import { getMovieDetail, pickTrailer, tmdbImg, type TmdbMovie } from "@/lib/api/tmdb"
import { getEnhancedMovieData } from "@/lib/api/tmdb-enhanced"
import { findChannelSeries } from "@/lib/api/channels"
import SectionRow from "@/components/section-row"
import Poster from "@/components/poster"
import Translatable from "@/components/translatable"
import FavoriteButton from "@/components/favorite-button"
import { TrailerButton } from "@/components/trailer-button"
import EpisodePlayer from "@/components/episode-player"
import YoutubeSearchPlayer from "@/components/youtube-search-player"
import { VideoClipsPlayer } from "@/components/video-clips-player"
import { PhotoGallery } from "@/components/photo-gallery"

interface Props { params: Promise<{ id: string }> }

export const revalidate = 3600

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const m = await getMovieDetail(id)
  if (!m) return { title: "Film tidak ditemukan" }
  return { title: `${m.title} — VanX Stream`, description: m.overview?.slice(0, 160) }
}

export default async function FilmDetail({ params }: Props) {
  const { id } = await params
  const m = await getMovieDetail(id)
  if (!m) notFound()

  // Fetch enhanced data (videos, images, reviews)
  const enhanced = await getEnhancedMovieData(id)

  const trailer = pickTrailer((m as any).videos?.results)
  const cast = (m as any).credits?.cast || []
  const recs: TmdbMovie[] = (m as any).recommendations?.results || []
  const similar: TmdbMovie[] = (m as any).similar?.results || []
  const channelMatch = await findChannelSeries([m.title, m.original_title])

  const favItem = {
    type: "movie" as const,
    id: String(m.id),
    title: m.title,
    poster: tmdbImg(m.poster_path, "w500"),
    score: m.vote_average,
    sub: `Film · ${m.release_date?.slice(0, 4) || ""}`,
    ts: 0,
  }

  return (
    <>
      <div className="vx-hero" style={{ minHeight: "min(60vh, 540px)" }}>
        <div className="vx-hero-bg" style={{ backgroundImage: `url(${tmdbImg(m.backdrop_path, "original")})` }} />
        <div className="vx-hero-overlay" />
        <div className="vx-hero-content" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.5rem", alignItems: "flex-end", maxWidth: 1200 }}>
          <img
            src={tmdbImg(m.poster_path, "w500")}
            alt={m.title}
            style={{ width: 180, aspectRatio: "2/3", objectFit: "cover", borderRadius: 6, border: "2px solid var(--gold)", boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}
          />
          <div style={{ minWidth: 0 }}>
            <div className="vx-hero-eyebrow">Film {m.genres[0]?.name ? `· ${m.genres[0].name}` : ""}</div>
            <h1 className="vx-hero-title">
              {m.title}
              {m.original_title !== m.title && <> · <em>{m.original_title}</em></>}
            </h1>
            {m.tagline && <p className="vx-hero-sub" style={{ fontStyle: "italic", marginBottom: 8, fontFamily: "var(--serif-italic)" }}>"{m.tagline}"</p>}
            <div className="vx-hero-meta">
              <span style={{ color: "var(--gold)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Star size={12} fill="currentColor" /> {m.vote_average.toFixed(1)}
              </span>
              <span className="vx-hero-meta-divider">{m.release_date?.slice(0, 4)}</span>
              {m.runtime && <span className="vx-hero-meta-divider">{Math.floor(m.runtime / 60)}h {m.runtime % 60}m</span>}
              <span className="vx-hero-meta-divider" style={{ color: "var(--gold)" }}>{m.status}</span>
            </div>
            {m.genres.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "0.5rem 0 1rem" }}>
                {m.genres.map((g) => (
                  <span key={g.id} style={{
                    background: "var(--gold-soft)", border: "1px solid var(--gold)",
                    color: "var(--gold)", padding: "0.18rem 0.7rem", borderRadius: 4,
                    fontFamily: "var(--serif)", fontSize: "0.7rem", fontWeight: 600,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>{g.name}</span>
                ))}
              </div>
            )}
            <div className="vx-hero-actions">
              {trailer?.key && <TrailerButton youtubeId={trailer.key} title={m.title} />}
              <FavoriteButton item={favItem} />
              {(m as any).external_ids?.imdb_id && (
                <a className="vx-btn-ghost" href={`https://www.imdb.com/title/${(m as any).external_ids.imdb_id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} /> IMDb
                </a>
              )}
              {m.homepage && (
                <a className="vx-btn-ghost" href={m.homepage} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} /> Situs Resmi
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {m.overview && (
        <section className="vx-section" style={{ maxWidth: 1100 }}>
          <div className="vx-section-head">
            <div className="vx-section-title-group">
              <div className="vx-section-eyebrow">Sinopsis</div>
              <h2 className="vx-section-title">Cerita</h2>
            </div>
          </div>
          <Translatable text={m.overview} auto className="vx-hero-sub" style={{ WebkitLineClamp: "unset", display: "block", maxWidth: 900, fontSize: "1rem" }} />
        </section>
      )}

      {/* Channel episodes (YouTube) — channelMatch first, fallback to public search */}
      {channelMatch && channelMatch.episodes.length > 0 ? (
        <EpisodePlayer
          episodes={channelMatch.episodes}
          title={channelMatch.seriesName}
          channelName={channelMatch.channelName}
        />
      ) : (
        <YoutubeSearchPlayer
          query={`${m.title} ${m.release_date?.slice(0, 4) || ""} trailer`}
          fallbackTitles={[m.title, m.original_title].filter(Boolean) as string[]}
          label={`Trailer & Klip: ${m.title}`}
        />
      )}

      {/* Video Clips from TMDB */}
      {enhanced?.videos && enhanced.videos.length > 0 && (
        <VideoClipsPlayer videos={enhanced.videos} title={m.title} />
      )}

      {/* Photo Gallery */}
      {enhanced?.images && (enhanced.images.backdrops.length > 0 || enhanced.images.posters.length > 0) && (
        <PhotoGallery
          backdrops={enhanced.images.backdrops}
          posters={enhanced.images.posters}
          title={m.title}
        />
      )}

      {cast.length > 0 && (
        <section className="vx-section">
          <div className="vx-section-head">
            <div className="vx-section-title-group">
              <div className="vx-section-eyebrow">Cast</div>
              <h2 className="vx-section-title">Pemeran Utama</h2>
            </div>
          </div>
          <div className="vx-row">
            {cast.slice(0, 16).map((c: any) => (
              <div key={c.id} className="vx-poster" style={{ flex: "0 0 130px", width: 130 }}>
                <div className="vx-poster-thumb" style={{ aspectRatio: "1" }}>
                  <img src={tmdbImg(c.profile_path, "w185")} alt={c.name} loading="lazy" />
                </div>
                <div className="vx-poster-title" style={{ fontFamily: "var(--serif)" }}>{c.name}</div>
                <div className="vx-poster-sub">{c.character}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {recs.length > 0 && (
        <SectionRow eyebrow="Untuk Anda" title="Rekomendasi Mirip">
          {recs.slice(0, 16).map((r) => (
            <Poster key={r.id} href={`/film/${r.id}`} title={r.title} poster={tmdbImg(r.poster_path, "w500")} score={r.vote_average} sub={r.release_date?.slice(0, 4)} />
          ))}
        </SectionRow>
      )}
      {similar.length > 0 && (
        <SectionRow eyebrow="Genre Sama" title="Film Sejenis">
          {similar.slice(0, 16).map((r) => (
            <Poster key={r.id} href={`/film/${r.id}`} title={r.title} poster={tmdbImg(r.poster_path, "w500")} score={r.vote_average} sub={r.release_date?.slice(0, 4)} />
          ))}
        </SectionRow>
      )}

      <div className="greek-divider"><span className="greek-laurel">✦</span></div>
    </>
  )
}
