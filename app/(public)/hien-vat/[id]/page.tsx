import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Gallery } from '@/components/public/Gallery'
import { InfoCard, type InfoRow } from '@/components/public/InfoCard'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { SectionHeader } from '@/components/public/SectionHeader'
import { ArtifactCard } from '@/components/public/ArtifactCard'

const getArtifact = cache((id: string) =>
  prisma.artifact.findUnique({
    where: { id },
    include: { room: true, exhibitions: { include: { exhibition: true } } },
  }),
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const artifact = await getArtifact(id)
  if (!artifact) return { title: 'Không tìm thấy hiện vật' }
  return {
    title: artifact.name,
    description: artifact.description?.slice(0, 160) ?? `Hiện vật: ${artifact.name}`,
  }
}

export default async function ArtifactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const artifact = await getArtifact(id)
  if (!artifact) notFound()

  const images = artifact.images.length > 0 ? artifact.images : ['https://placehold.co/800x600.png']

  const related = await prisma.artifact.findMany({
    where: {
      id: { not: artifact.id },
      OR: [{ roomId: artifact.roomId ?? undefined }, { category: artifact.category }],
    },
    include: { room: true },
    take: 4,
    orderBy: { createdAt: 'desc' },
  })

  const rows: InfoRow[] = [
    { label: 'Phân loại', value: artifact.category, href: `/hien-vat?category=${encodeURIComponent(artifact.category)}` },
    ...(artifact.room
      ? [{ label: 'Phòng trưng bày', value: artifact.room.name, href: `/hien-vat?room=${artifact.room.id}` }]
      : []),
    ...(artifact.exhibitions.length > 0
      ? [{ label: 'Thuộc triển lãm', value: artifact.exhibitions[0].exhibition.title, href: `/trien-lam/${artifact.exhibitions[0].exhibitionId}` }]
      : []),
    { label: 'Số hình ảnh', value: `${images.length} ảnh` },
  ]

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <nav className="text-xs text-muted-foreground">
          <Link href="/hien-vat" className="hover:underline">Hiện vật</Link>
          <span className="px-2">›</span>
          <span className="text-foreground">{artifact.name}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:py-12">
        <Gallery images={images} alt={artifact.name} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="inline-flex w-fit rounded-full bg-gold-500 px-3 py-0.5 text-xs font-semibold text-navy-950">
            {artifact.category}
          </span>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight md:text-4xl">
            {artifact.name}
          </h1>
          <div className="my-4 h-0.5 w-12 bg-gold-500" />
          {artifact.description && (
            <p className="leading-relaxed text-muted-foreground">{artifact.description}</p>
          )}
          <div className="mt-6">
            <InfoCard rows={rows} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <SectionWrapper variant="muted">
          <SectionHeader eyebrow="Hiện vật liên quan" title="Khám phá thêm" href="/hien-vat" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((a) => (
              <ArtifactCard
                key={a.id}
                name={a.name}
                image={a.images[0] ?? 'https://placehold.co/600x400.png'}
                category={a.category}
                roomName={a.room?.name}
                href={`/hien-vat/${a.id}`}
              />
            ))}
          </div>
        </SectionWrapper>
      )}
    </>
  )
}
