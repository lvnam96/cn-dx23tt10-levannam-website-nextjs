import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { SectionHeader } from '@/components/public/SectionHeader'
import { ArtifactCard } from '@/components/public/ArtifactCard'
import { InfoCard, type InfoRow } from '@/components/public/InfoCard'
import { ExhibitionCard } from '@/components/public/ExhibitionCard'
import { VisitCTA } from '@/components/public/VisitCTA'
import { formatDateVi } from '@/lib/format'

const getExhibition = cache((id: string) =>
  prisma.exhibition.findUnique({
    where: { id },
    include: { artifacts: { include: { artifact: { include: { room: true } } } } },
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
    description: exhibition.description?.slice(0, 160) ?? `Triển lãm: ${exhibition.title}`,
  }
}

function getStatus(startDate: Date, endDate: Date) {
  const now = Date.now()
  if (startDate.getTime() > now) return { label: 'Sắp diễn ra', className: 'bg-gold-400 text-navy-950' }
  if (endDate.getTime() < now) return { label: 'Đã kết thúc', className: 'bg-navy-100 text-navy-700' }
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
  const others = await prisma.exhibition.findMany({
    where: { id: { not: exhibition.id } },
    orderBy: { startDate: 'desc' },
    take: 3,
  })

  const rows: InfoRow[] = [
    { label: 'Thời gian', value: `${formatDateVi(exhibition.startDate)} – ${formatDateVi(exhibition.endDate)}` },
    { label: 'Trạng thái', value: status.label },
    { label: 'Số hiện vật', value: `${artifacts.length} hiện vật` },
  ]

  return (
    <>
      <div className="relative h-[36vh] min-h-[260px] w-full md:h-[44vh] md:min-h-[340px]">
        <Image src={exhibition.coverImage ?? 'https://placehold.co/1920x600.png'} alt={exhibition.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-navy-950/85" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>{status.label}</span>
            <h1 className="mt-3 max-w-3xl font-heading text-3xl font-bold text-navy-50 sm:text-4xl md:text-5xl">
              {exhibition.title}
            </h1>
            <p className="mt-2 text-navy-50/90">
              {formatDateVi(exhibition.startDate)} – {formatDateVi(exhibition.endDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.6fr_1fr]">
        <div>
          {exhibition.description ? (
            <p className="leading-relaxed text-muted-foreground">{exhibition.description}</p>
          ) : (
            <p className="text-muted-foreground">Thông tin chi tiết đang được cập nhật.</p>
          )}
        </div>
        <InfoCard title="Thông tin triển lãm" rows={rows} />
      </div>

      {artifacts.length > 0 && (
        <SectionWrapper variant="muted">
          <SectionHeader eyebrow="Hiện vật trong triển lãm" title="Khám phá hiện vật" href="/hien-vat" />
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

      {others.length > 0 && (
        <SectionWrapper>
          <SectionHeader eyebrow="Triển lãm khác" title="Có thể bạn quan tâm" href="/trien-lam" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((e) => (
              <ExhibitionCard key={e.id} title={e.title} image={e.coverImage ?? 'https://placehold.co/800x450.png'} startDate={e.startDate} endDate={e.endDate} href={`/trien-lam/${e.id}`} />
            ))}
          </div>
        </SectionWrapper>
      )}

      <VisitCTA />
    </>
  )
}
