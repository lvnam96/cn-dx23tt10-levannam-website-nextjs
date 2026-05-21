import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PageHero } from '@/components/public/PageHero'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { ArtifactCard } from '@/components/public/ArtifactCard'
import { FilterBar } from '@/components/public/FilterBar'
import { Pagination } from '@/components/public/Pagination'
import { ARTIFACTS_PER_PAGE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Hiện vật',
  description: 'Bộ sưu tập hiện vật, tư liệu và hình ảnh tại di tích Đền thờ Bác.',
}

const CATEGORIES = ['Hiện vật gốc', 'Tư liệu', 'Hình ảnh']

export default async function ArtifactListPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string; category?: string; page?: string }>
}) {
  const sp = await searchParams
  const room = sp.room || undefined
  const category = sp.category || undefined
  const page = Math.max(1, Number(sp.page) || 1)

  const where = { roomId: room, category }

  const [rooms, total, artifacts] = await Promise.all([
    prisma.room.findMany({ orderBy: { name: 'asc' } }),
    prisma.artifact.count({ where }),
    prisma.artifact.findMany({
      where,
      include: { room: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * ARTIFACTS_PER_PAGE,
      take: ARTIFACTS_PER_PAGE,
    }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / ARTIFACTS_PER_PAGE))

  const spForPagination: Record<string, string> = {}
  if (room) spForPagination.room = room
  if (category) spForPagination.category = category

  return (
    <>
      <PageHero
        title="Hiện vật"
        subtitle="Bộ sưu tập hiện vật, tư liệu và hình ảnh."
        image="https://placehold.co/1920x600.png?text=Hien+vat"
        size="sm"
      />
      <SectionWrapper>
        <FilterBar
          action="/hien-vat"
          fields={[
            {
              name: 'room',
              label: 'Phòng',
              current: room,
              options: rooms.map((r) => ({ value: r.id, label: r.name })),
            },
            {
              name: 'category',
              label: 'Loại',
              current: category,
              options: CATEGORIES.map((c) => ({ value: c, label: c })),
            },
          ]}
        />

        {artifacts.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            Không tìm thấy hiện vật nào.
          </p>
        ) : (
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
        )}

        <Pagination
          currentPage={Math.min(page, totalPages)}
          totalPages={totalPages}
          basePath="/hien-vat"
          searchParams={spForPagination}
        />
      </SectionWrapper>
    </>
  )
}
