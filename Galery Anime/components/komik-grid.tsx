import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { type KomikItem, slugFromLink } from "@/lib/api/komiku"

interface Props {
  eyebrow?: string
  title: string
  viewAll?: string
  comics: KomikItem[]
}

export default function KomikGrid({ eyebrow, title, viewAll, comics }: Props) {
  if (!comics.length) return null

  return (
    <section className="vx-section">
      <div className="vx-section-head">
        <div className="vx-section-title-group">
          {eyebrow && <div className="vx-section-eyebrow">{eyebrow}</div>}
          <h2 className="vx-section-title">{title}</h2>
        </div>
        {viewAll && (
          <Link href={viewAll} className="vx-section-action">
            Lihat Semua <ChevronRight size={12} />
          </Link>
        )}
      </div>

      <div className="vx-row">
        {comics.map((c) => {
          const slug = c.slug || slugFromLink(c.link)
          return (
            <Link key={slug} href={`/komik/${slug}`} className="vx-poster" style={{ flex: "0 0 150px" }}>
              <div className="vx-poster-thumb">
                <img src={c.image} alt={c.title} loading="lazy" />
                {c.chapter && <span className="vx-poster-badge">{c.chapter.replace("Chapter ", "Ch ")}</span>}
              </div>
              <div className="vx-poster-title">{c.title}</div>
              <div className="vx-poster-sub">
                {c.genre || c.type || c.status || ""}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
