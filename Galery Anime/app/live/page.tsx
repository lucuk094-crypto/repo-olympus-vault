import { Radio, Globe } from "lucide-react"

export const metadata = { title: "Live TV — VanX Stream" }

const FREE_LEGAL_LIVE = [
  { name: "NASA TV Public", url: "https://www.youtube.com/embed/21X5lGlDOfg", desc: "Streaming langsung dari NASA — peluncuran roket, ISS feed, briefing." },
  { name: "DW News (Inggris)", url: "https://www.youtube.com/embed/tZTqXKR7CGo", desc: "Berita internasional 24/7 dari Deutsche Welle." },
  { name: "Bloomberg TV", url: "https://www.youtube.com/embed/iEpJwprxDdk", desc: "Berita finansial & bisnis global, live 24/7." },
  { name: "Sky News", url: "https://www.youtube.com/embed/w_Ma8oQLmSM", desc: "Berita Inggris langsung 24 jam." },
  { name: "Al Jazeera English", url: "https://www.youtube.com/embed/F-TyW_Mks-4", desc: "Berita timur tengah & global, live 24/7." },
]

export default function LivePage() {
  return (
    <>
      <section className="vx-section" style={{ paddingTop: "2rem" }}>
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Berita & Acara Live</div>
            <h1 className="vx-section-title">Live TV</h1>
          </div>
        </div>

        <p style={{ fontFamily: "var(--serif-italic)", color: "var(--text-2)", maxWidth: 720, margin: "0 0 1.5rem", lineHeight: 1.7 }}>
          Streaming langsung 24/7 dari channel berita & program publik resmi. Semua sumber legal dan gratis.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.25rem" }}>
          {FREE_LEGAL_LIVE.map((ch) => (
            <div key={ch.name} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 10, overflow: "hidden",
            }}>
              <div style={{ position: "relative", aspectRatio: "16/9", background: "#000" }}>
                <iframe
                  src={ch.url}
                  title={ch.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                />
              </div>
              <div style={{ padding: "0.85rem 1rem 1rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#ff3b3b", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
                  <Radio size={11} /> Live
                </div>
                <h3 style={{ fontFamily: "var(--serif)", color: "var(--marble)", fontSize: "1rem", fontWeight: 700, margin: "0 0 0.3rem" }}>{ch.name}</h3>
                <p style={{ color: "var(--text-3)", fontSize: "0.82rem", lineHeight: 1.5, margin: 0 }}>{ch.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="greek-divider"><span className="greek-laurel">✦</span></div>

        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "1.5rem",
          display: "flex", gap: "1rem", alignItems: "flex-start",
        }}>
          <Globe size={28} style={{ color: "var(--gold)", flexShrink: 0 }} />
          <div>
            <h3 style={{ fontFamily: "var(--serif)", color: "var(--marble)", fontSize: "1rem", fontWeight: 700, margin: "0 0 0.4rem" }}>
              Tentang Live TV di VanX Stream
            </h3>
            <p style={{ color: "var(--text-2)", fontSize: "0.9rem", lineHeight: 1.7, margin: 0, fontFamily: "var(--serif-italic)" }}>
              Hanya channel berita & program publik resmi yang ditampilkan di sini, semuanya
              di-embed langsung dari YouTube channel official mereka. Channel berbayar (Netflix,
              Disney+, dll) tidak bisa di-embed karena lisensi.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
