"use client"

import { useState } from "react"
import { ExternalLink, Eye, Calendar, Clock } from "lucide-react"
import { ytEmbed, type ChannelEpisode } from "@/lib/api/channels"

interface Props {
  episodes: ChannelEpisode[]
  title: string
  channelName: string
}

export default function EpisodePlayer({ episodes, title, channelName }: Props) {
  const list = episodes.filter((e) => e.kind === "episode")
  const others = episodes.filter((e) => e.kind !== "episode")
  const sorted = list.length > 0 ? list : episodes
  const [active, setActive] = useState<ChannelEpisode>(sorted[0])

  if (!episodes.length) return null

  return (
    <section className="vx-section">
      <div className="vx-section-head">
        <div className="vx-section-title-group">
          <div className="vx-section-eyebrow">Tayang Resmi</div>
          <h2 className="vx-section-title">Episode &amp; Klip</h2>
        </div>
        <a
          className="vx-section-action"
          href={`https://www.youtube.com/${active.channelName ? "@" + active.channelName.replace(/\s+/g, "") : ""}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {channelName} <ExternalLink size={12} />
        </a>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr",
        gap: "1rem", marginBottom: "1rem",
      }}>
        <div style={{
          position: "relative", aspectRatio: "16/9",
          background: "#000", borderRadius: 8, overflow: "hidden",
          border: "1px solid var(--gold)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px var(--gold-glow)",
        }}>
          <iframe
            key={active.id}
            src={ytEmbed(active.id, { autoplay: false })}
            title={active.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: 0 }}
          />
        </div>

        {/* Active video meta */}
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: 8, padding: "0.85rem 1rem",
        }}>
          <h3 style={{
            fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 700,
            margin: "0 0 0.4rem", color: "var(--marble)",
          }}>
            {active.title}
          </h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: "0.78rem", color: "var(--text-3)", fontFamily: "var(--serif-italic)" }}>
            {active.published && <span><Calendar size={11} style={{ display: "inline-block", verticalAlign: "-2px", color: "var(--gold)" }} /> {active.published}</span>}
            {active.length && <span><Clock size={11} style={{ display: "inline-block", verticalAlign: "-2px", color: "var(--gold)" }} /> {active.length}</span>}
            {active.views && <span><Eye size={11} style={{ display: "inline-block", verticalAlign: "-2px", color: "var(--gold)" }} /> {active.views}</span>}
          </div>
        </div>
      </div>

      {/* Episode pills */}
      {sorted.length > 1 && (
        <>
          <div className="vx-section-eyebrow" style={{ marginBottom: "0.5rem" }}>
            Daftar Episode ({sorted.length})
          </div>
          <div style={{
            display: "flex", gap: 6, flexWrap: "wrap",
            paddingBottom: "1rem", marginBottom: "1rem",
            borderBottom: "1px solid var(--border)",
          }}>
            {sorted.slice(0, 80).map((ep) => {
              const isActive = ep.id === active.id
              return (
                <button
                  key={ep.id}
                  onClick={() => setActive(ep)}
                  style={{
                    minWidth: 56, height: 44,
                    padding: "0 0.85rem", borderRadius: 4,
                    background: isActive ? "var(--gold)" : "transparent",
                    color: isActive ? "var(--bg)" : "var(--gold)",
                    border: `1.5px solid var(--gold)`,
                    fontFamily: "var(--serif)", fontSize: "0.85rem",
                    fontWeight: 700, letterSpacing: "0.05em",
                    cursor: "pointer", transition: "all 0.15s ease",
                  }}
                  title={ep.title}
                >
                  {ep.ep != null ? ep.ep : "•"}
                </button>
              )
            })}
            {sorted.length > 80 && (
              <span style={{ alignSelf: "center", color: "var(--text-3)", fontSize: "0.78rem", padding: "0 0.5rem", fontFamily: "var(--serif-italic)" }}>
                +{sorted.length - 80} lagi
              </span>
            )}
          </div>
        </>
      )}

      {/* Trailer & klip */}
      {others.length > 0 && (
        <>
          <div className="vx-section-eyebrow" style={{ marginBottom: "0.5rem" }}>
            Trailer &amp; Klip ({others.length})
          </div>
          <div className="vx-row">
            {others.slice(0, 12).map((ep) => (
              <button
                key={ep.id}
                onClick={() => setActive(ep)}
                className="vx-backdrop-card"
                style={{ background: "transparent", border: 0, font: "inherit", color: "inherit", cursor: "pointer", textAlign: "left" }}
              >
                <div className="vx-backdrop-card-thumb">
                  <img src={ep.thumbnail} alt={ep.title} loading="lazy" />
                  <span style={{
                    position: "absolute", top: 6, right: 6,
                    background: "var(--gold)", color: "var(--bg)",
                    fontFamily: "var(--serif)", fontSize: "0.6rem",
                    fontWeight: 800, letterSpacing: "0.08em",
                    padding: "2px 7px", borderRadius: 3,
                  }}>{ep.kind.toUpperCase()}</span>
                </div>
                <div className="vx-backdrop-card-info">
                  <div className="vx-backdrop-card-title">{ep.title}</div>
                  <div className="vx-backdrop-card-sub">{ep.published || ""}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
