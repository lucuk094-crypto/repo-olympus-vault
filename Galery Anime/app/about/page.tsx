import { Phone, Mail, MapPin, Code, Calendar, Heart, Sparkles, Database, ShieldCheck, Zap } from "lucide-react"

export const metadata = { title: "Tentang — VanX Stream" }

const SOCIALS = [
  { name: "TikTok",    handle: "@alwiy_80",        url: "https://www.tiktok.com/@alwiy_80?_r=1&_t=ZS-93nCbVsWca4" },
  { name: "Instagram", handle: "@alwiy_prst",       url: "https://www.instagram.com/alwiy_prst" },
  { name: "Facebook",  handle: "Vanx Dev",          url: "https://www.facebook.com/share/1ZSAs5yyWU/" },
  { name: "WhatsApp",  handle: "+62 878-1801-1099", url: "https://wa.me/+6287818011099" },
  { name: "GitHub",    handle: "lucuk094-crypto",   url: "https://github.com/lucuk094-crypto" },
  { name: "Telegram",  handle: "@D_bsy",            url: "https://t.me/D_bsy" },
  { name: "Discord",   handle: "Vanx Dev",          url: "https://discord.gg/qpPduRk8" },
]

const FEATURES = [
  { icon: Database, title: "Multi-API Aggregator", desc: "AniList, TMDB, Jikan, dan MangaDex digabung dalam satu antarmuka klasik." },
  { icon: Zap,      title: "Performa Tinggi",      desc: "Server-rendered, cache 30 menit, hidrasi minimal — cepat di mobile dan laptop." },
  { icon: ShieldCheck, title: "Sumber Resmi",       desc: "Trailer dari channel resmi, metadata dari API resmi. Bebas piracy." },
  { icon: Sparkles, title: "Tema Klasik Yunani",   desc: "Marmer, kolom Doric, gold akcent — terinspirasi estetika kuno." },
]

export default function AboutPage() {
  return (
    <>
      <section className="vx-section" style={{ paddingTop: "3rem", maxWidth: 880, margin: "0 auto" }}>
        <div className="vx-section-head">
          <div className="vx-section-title-group">
            <div className="vx-section-eyebrow">Acropolis</div>
            <h1 className="vx-section-title">Tentang VanX Stream</h1>
          </div>
        </div>

        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "2rem 1.5rem",
          textAlign: "center",
          marginBottom: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: "-1px",
            background: "radial-gradient(circle at 50% 0%, var(--gold-soft), transparent 60%)",
            pointerEvents: "none",
          }} />
          <p style={{
            fontFamily: "var(--serif-italic)",
            fontSize: "1.1rem",
            color: "var(--marble)",
            lineHeight: 1.7,
            maxWidth: 600,
            margin: "0 auto",
            position: "relative",
          }}>
            "Streaming bukan sekadar menonton — ini ritual modern pertemuan kita
            dengan cerita dari segala penjuru dunia."
          </p>
          <p style={{
            fontFamily: "var(--serif)",
            fontSize: "0.7rem",
            color: "var(--gold)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginTop: "1rem",
            position: "relative",
          }}>
            ✦ Vanx Dev ✦
          </p>
        </div>

        <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem", color: "var(--marble)" }}>
          Fitur
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.85rem", marginBottom: "2rem" }}>
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "1rem 1.1rem",
                display: "flex", gap: "0.85rem",
              }}>
                <span style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "var(--gold-soft)", color: "var(--gold)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={20} />
                </span>
                <div>
                  <strong style={{ display: "block", color: "var(--marble)", fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.2rem", fontFamily: "var(--serif)" }}>
                    {f.title}
                  </strong>
                  <small style={{ color: "var(--text-3)", fontSize: "0.78rem", lineHeight: 1.5 }}>
                    {f.desc}
                  </small>
                </div>
              </div>
            )
          })}
        </div>

        <div className="greek-divider"><span className="greek-laurel">✦ Vir Doctus ✦</span></div>

        <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem", color: "var(--marble)" }}>
          Tentang Developer
        </h2>
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--gold), var(--gold-2))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--bg)", fontWeight: 800, fontSize: "1.6rem",
              fontFamily: "var(--serif)",
              boxShadow: "0 8px 22px var(--gold-glow)",
            }}>
              V
            </div>
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, fontFamily: "var(--serif)", color: "var(--marble)" }}>
                Vanx Dev
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--gold)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Full-Stack Developer
              </div>
            </div>
          </div>

          <p style={{ color: "var(--text-2)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "1.25rem", fontFamily: "var(--serif-italic)" }}>
            Halo. Saya developer di balik VanX Stream. Membangun aplikasi web modern
            menggunakan Next.js, TypeScript, dan Python. Spesialisasi: UI bergaya
            klasik, integrasi multi-API, dan optimasi performa.
          </p>

          <div style={{ display: "grid", gap: "0.5rem", fontSize: "0.86rem", marginBottom: "1.25rem" }}>
            <Row icon={Mail} label="Nama" value="Vanx Dev (Alwi)" />
            <Row icon={Phone} label="Kontak" value="087818011099" link="tel:+6287818011099" />
            <Row icon={MapPin} label="Lokasi" value="Indonesia" />
            <Row icon={Code} label="Stack" value="Next.js · React · TypeScript · Python · Tailwind" />
            <Row icon={Calendar} label="Versi" value="v4.0.0 — VanX Stream (2026)" />
          </div>

          <h3 style={{ fontFamily: "var(--serif)", fontSize: "0.95rem", fontWeight: 700, color: "var(--marble)", marginBottom: "0.7rem" }}>
            Hubungi Saya
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.5rem" }}>
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center",
                  gap: "0.55rem", padding: "0.6rem 0.85rem",
                  background: "var(--bg-2)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--marble)",
                  textDecoration: "none",
                  transition: "all 0.18s ease",
                }}
              >
                <span style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "var(--gold-soft)", color: "var(--gold)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 800, fontFamily: "var(--serif)",
                  flexShrink: 0,
                }}>
                  {s.name[0]}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong style={{ fontSize: "0.82rem", fontFamily: "var(--serif)", color: "var(--marble)", display: "block" }}>
                    {s.name}
                  </strong>
                  <small style={{ color: "var(--text-3)", fontSize: "0.7rem", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.handle}
                  </small>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div style={{
          textAlign: "center", padding: "1.5rem 1rem", color: "var(--text-3)",
          fontSize: "0.78rem", fontFamily: "var(--serif-italic)",
        }}>
          Dibuat dengan{" "}
          <Heart size={12} style={{ display: "inline-block", verticalAlign: "-1px", color: "var(--gold)" }} />{" "}
          oleh <strong style={{ color: "var(--gold)", fontFamily: "var(--serif)" }}>Vanx Dev</strong>
          <div style={{ marginTop: "0.4rem", fontSize: "0.7rem" }}>© 2026 VanX Stream — Ad astra per aspera</div>
        </div>
      </section>
    </>
  )
}

function Row({ icon: Icon, label, value, link }: { icon: any; label: string; value: string; link?: string }) {
  const content = (
    <span style={{ color: link ? "var(--gold)" : "var(--text-2)" }}>{value}</span>
  )
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", color: "var(--text-2)" }}>
      <Icon size={14} style={{ color: "var(--gold)" }} />
      <strong style={{ fontFamily: "var(--serif)", color: "var(--marble)", marginRight: 4, fontSize: "0.78rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}:
      </strong>
      {link ? <a href={link}>{content}</a> : content}
    </div>
  )
}
