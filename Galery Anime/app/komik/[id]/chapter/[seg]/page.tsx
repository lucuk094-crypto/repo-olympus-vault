import Link from "next/link"
import { notFound } from "next/navigation"
import { getChapter, getKomikDetail } from "@/lib/api/komiku"
import ChapterReader from "@/components/chapter-reader"

export const revalidate = 3600

interface Props { params: Promise<{ id: string; seg: string }> }

export async function generateMetadata({ params }: Props) {
  const { id, seg } = await params
  const ch = await getChapter(seg).catch(() => null)
  return { title: `${ch?.title || seg} — ${id} · VanX Stream` }
}

export default async function ChapterPage({ params }: Props) {
  const { id, seg } = await params

  const [chapter, detail] = await Promise.all([
    getChapter(seg).catch(() => null),
    getKomikDetail(id).catch(() => null),
  ])

  if (!chapter || !chapter.pages.length) notFound()

  // Find prev/next from chapter list (more reliable than API metadata)
  let prevSlug: string | null = chapter.prev
  let nextSlug: string | null = chapter.next
  if (detail?.chapters) {
    const i = detail.chapters.findIndex((c) => c.slug === seg)
    if (i !== -1) {
      // chapters are in DESC order: index 0 = latest, last = first
      nextSlug = i > 0 ? detail.chapters[i - 1].slug : null
      prevSlug = i < detail.chapters.length - 1 ? detail.chapters[i + 1].slug : null
    }
  }

  return (
    <ChapterReader
      title={detail?.title || id}
      chapterTitle={chapter.title || seg}
      slug={id}
      pages={chapter.pages}
      prevSlug={prevSlug}
      nextSlug={nextSlug}
      allChapters={detail?.chapters || []}
      currentSeg={seg}
    />
  )
}
