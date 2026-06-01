import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PageHero } from '@/components/public/PageHero'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { SectionHeader } from '@/components/public/SectionHeader'
import { ArtifactCard } from '@/components/public/ArtifactCard'
import { FilterPills } from '@/components/public/FilterPills'
import { RoomEntryCards } from '@/components/public/RoomEntryCards'
import { FeaturedItem } from '@/components/public/FeaturedItem'
import { QuoteBand } from '@/components/public/QuoteBand'
import { CrossLinkCards } from '@/components/public/CrossLinkCards'
import { Pagination } from '@/components/public/Pagination'
import { ARTIFACTS_PER_PAGE, ARTIFACT_CATEGORIES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Hiện vật',
  description: 'Bộ sưu tập hiện vật, tư liệu và hình ảnh tại di tích Đền thờ Bác.',
}

const PLACEHOLDER = 'https://placehold.co/600x400.png'

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

  const [rooms, roomCounts, total, artifacts, featured] = await Promise.all([
    prisma.room.findMany({ orderBy: { name: 'asc' }, include: { artifacts: { take: 1, select: { images: true } } } }),
    prisma.artifact.groupBy({ by: ['roomId'], _count: { _all: true } }),
    prisma.artifact.count({ where }),
    prisma.artifact.findMany({
      where,
      include: { room: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * ARTIFACTS_PER_PAGE,
      take: ARTIFACTS_PER_PAGE,
    }),
    prisma.artifact.findFirst({ where: { featured: true }, include: { room: true }, orderBy: { createdAt: 'desc' } }),
  ])

  const countByRoom = new Map(roomCounts.map((r) => [r.roomId, r._count._all]))
  const roomCards = rooms.slice(0, 4).map((r) => ({
    id: r.id,
    name: r.name,
    count: countByRoom.get(r.id) ?? 0,
    image: r.artifacts[0]?.images[0] ?? PLACEHOLDER,
  }))

  const totalPages = Math.max(1, Math.ceil(total / ARTIFACTS_PER_PAGE))
  const otherParams = { room, category }

  return (
    <>
      <PageHero
        eyebrow="Bộ sưu tập"
        title="Hiện vật"
        subtitle="Bộ sưu tập hiện vật, tư liệu và hình ảnh của khu di tích."
        image="https://placehold.co/1920x800.png?text=Hien+vat"
        size="sm"
      />

      {roomCards.length > 0 && (
        <SectionWrapper>
          <SectionHeader eyebrow="Khám phá theo phòng" title="Chọn không gian trưng bày" />
          <RoomEntryCards rooms={roomCards} />
        </SectionWrapper>
      )}

      <SectionWrapper variant="muted">
        <SectionHeader title="Tất cả hiện vật" />
        <div className="mb-6 space-y-3">
          <FilterPills
            basePath="/hien-vat"
            param="category"
            current={category}
            otherParams={{ room }}
            pills={ARTIFACT_CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <FilterPills
            basePath="/hien-vat"
            param="room"
            current={room}
            otherParams={{ category }}
            allLabel="Mọi phòng"
            pills={rooms.map((r) => ({ value: r.id, label: r.name }))}
          />
        </div>

        {artifacts.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">Không tìm thấy hiện vật nào.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artifacts.map((a) => (
              <ArtifactCard
                key={a.id}
                name={a.name}
                image={a.images[0] ?? PLACEHOLDER}
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
          searchParams={Object.fromEntries(Object.entries(otherParams).filter(([, v]) => v)) as Record<string, string>}
        />
      </SectionWrapper>

      {featured && (
        <SectionWrapper>
          <SectionHeader eyebrow="Hiện vật nổi bật" title="Mỗi hiện vật một câu chuyện" />
          <FeaturedItem
            href={`/hien-vat/${featured.id}`}
            image={featured.images[0] ?? PLACEHOLDER}
            eyebrow="★ Nổi bật"
            title={featured.name}
            meta={featured.room?.name}
            description={featured.description ?? undefined}
            cta="Đọc câu chuyện hiện vật"
          />
        </SectionWrapper>
      )}

      <QuoteBand quote="Mỗi hiện vật ở đây là một mảnh ký ức của lòng dân Nam Bộ." by="Khu di tích Đền thờ Bác" />

      <SectionWrapper variant="muted">
        <SectionHeader eyebrow="Khám phá tiếp" title="Tiếp tục hành trình" />
        <CrossLinkCards
          links={[
            { href: '/trien-lam', title: 'Triển lãm', description: 'Hiện vật trong các chuyên đề trưng bày.', icon: '🖼️' },
            { href: '/tin-tuc', title: 'Tin tức', description: 'Câu chuyện sưu tầm & bảo tồn hiện vật.', icon: '📰' },
            { href: '/gioi-thieu', title: 'Lịch sử ngôi đền', description: 'Vì sao những hiện vật này có mặt tại đây.', icon: '📖' },
            { href: '/dang-ky-tham-quan', title: 'Đến xem tận mắt', description: 'Đăng ký tham quan khu di tích.', icon: '🎟️' },
          ]}
        />
      </SectionWrapper>
    </>
  )
}
