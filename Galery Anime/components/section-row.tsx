"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface Props {
  eyebrow?: string
  title: string
  href?: string
  children: React.ReactNode
}

export default function SectionRow({ eyebrow, title, href, children }: Props) {
  return (
    <section className="vx-section">
      <div className="vx-section-head">
        <div className="vx-section-title-group">
          {eyebrow && <div className="vx-section-eyebrow">{eyebrow}</div>}
          <h2 className="vx-section-title">{title}</h2>
        </div>
        {href && (
          <Link href={href} className="vx-section-action">
            Lihat Semua <ChevronRight size={14} />
          </Link>
        )}
      </div>
      <div className="vx-row">{children}</div>
    </section>
  )
}

export function GridSection({ eyebrow, title, href, children }: Props) {
  return (
    <section className="vx-section">
      <div className="vx-section-head">
        <div className="vx-section-title-group">
          {eyebrow && <div className="vx-section-eyebrow">{eyebrow}</div>}
          <h2 className="vx-section-title">{title}</h2>
        </div>
        {href && (
          <Link href={href} className="vx-section-action">
            Lihat Semua <ChevronRight size={14} />
          </Link>
        )}
      </div>
      <div className="vx-grid">{children}</div>
    </section>
  )
}
