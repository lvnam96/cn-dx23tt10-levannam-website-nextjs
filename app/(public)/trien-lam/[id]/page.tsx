import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { ArtifactCard } from '@/components/public/ArtifactCard'
import { formatDateVi } from '@/lib/format'

// cache() dedupes the query between generateMetadata and the page (one request);
// Next auto-memoizes fetch(), not Prisma.
const getExhibition = cache((id: string) =>
  prisma.exhibition.findUnique({
    where: { id },
    include: {
      artifacts: { include: { artifact: { include: { room: true } } } },
    },
  }),
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const exhibition = await getExhibition(id)
  if (!exhibition) return { title: 'Không tìm thấy triển lãm' }
  return {
    title: exhibition.title,
    description:
      exhibition.description?.slice(0, 160) ?? `Triển lãm: ${exhibition.title}`,
  }
}

function getStatus(startDate: Date, endDate: Date) {
  const now = Date.now()
  if (startDate.getTime() > now)
    return { label: 'Sắp diễn ra', className: 'bg-gold-400 text-navy-950' }
  if (endDate.getTime() < now)
    return { label: 'Đã kết thúc', className: 'bg-navy-100 text-navy-700' }
  return { label: 'Đang diễn ra', className: 'bg-navy-900 text-navy-50' }
}

export default async function ExhibitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const exhibition = await getExhibition(id)
  if (!exhibition) notFound()

  const status = getStatus(exhibition.startDate, exhibition.endDate)
  const artifacts = exhibition.artifacts.map((a) => a.artifact)

  return (
    <>
      <div className="relative h-[36vh] min-h-[260px] w-full md:h-[44vh] md:min-h-[340px]">
        <Image
          src={exhibition.coverImage ?? 'https://placehold.co/1920x600.png'}
          alt={exhibition.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center text-navy-50">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
          <h1 className="max-w-3xl font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            {exhibition.title}
          </h1>
          <p className="text-base md:text-lg">
            {formatDateVi(exhibition.startDate)} – {formatDateVi(exhibition.endDate)}
          </p>
        </div>
      </div>

      {exhibition.description && (
        <div className="mx-auto max-w-prose px-4 py-12 leading-relaxed text-muted-foreground">
          {exhibition.description}
        </div>
      )}

      {artifacts.length > 0 && (
        <SectionWrapper title="Hiện vật trong triển lãm" variant="muted">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {artifacts.map((a) => (
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
