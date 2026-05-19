import { Newspaper } from "lucide-react"

export const metadata = { title: "Novel — VanX Stream" }

export default function NovelPage() {
  return (
    <>
      <section className="vx-section" style={{ paddingTop: "3rem" }}>
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Sastra</div>
            <h1 className="vx-section-title">Novel</h1>
          </div>
        </div>
        <div className="vx-empty" style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "3rem 1.5rem",
          textAlign: "center",
        }}>
          <Newspaper size={42} style={{ color: "var(--gold)", margin: "0 auto 1rem" }} />
          <h3 style={{ fontFamily: "var(--serif)", color: "var(--marble)", fontSize: "1.4rem", margin: "0 0 0.6rem" }}>
            Bagian Novel Sedang Disiapkan
          </h3>
          <p style={{ fontFamily: "var(--serif-italic)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            Light novel, web novel, dan novel akan ditambahkan tahap berikutnya.
            Sumber yang dipertimbangkan: AniList novel feed, MangaDex (long-form novel),
            dan integrasi dengan platform terbuka.
          </p>
        </div>
      </section>
    </>
  )
}
