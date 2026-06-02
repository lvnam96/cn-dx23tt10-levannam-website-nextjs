import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PageHero } from '@/components/public/PageHero'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { SectionHeader } from '@/components/public/SectionHeader'
import { StatusTabs } from '@/components/public/StatusTabs'
import { FeaturedItem } from '@/components/public/FeaturedItem'
import { ExhibitionCard } from '@/components/public/ExhibitionCard'
import { CrossLinkCards } from '@/components/public/CrossLinkCards'
import { formatDateVi } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Triển lãm',
  description: 'Các triển lãm chuyên đề tại di tích Đền thờ Bác.',
}

const PH = 'https://placehold.co/800x450.png'

export default async function ExhibitionListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const now = new Date()

  const all = await prisma.exhibition.findMany({ orderBy: { startDate: 'desc' } })
  const withStatus = all.map((e) => ({
    ...e,
    state: e.startDate > now ? 'upcoming' : e.endDate < now ? 'past' : 'current',
  }))

  const filtered = status ? withStatus.filter((e) => e.state === status) : withStatus
  const featured = withStatus.find((e) => e.state === 'current') ?? withStatus[0]

  return (
    <>
      <PageHero
        eyebrow="Sự kiện · Chuyên đề"
        title="Triển lãm"
        subtitle="Các chuyên đề trưng bày tại khu di tích."
        image="https://placehold.co/1920x800.png?text=Trien+lam"
        size="sm"
      />

      {featured && !status && (
        <SectionWrapper>
          <SectionHeader eyebrow="Nổi bật" title="Triển lãm đáng chú ý" />
          <FeaturedItem
            href={`/trien-lam/${featured.id}`}
            image={featured.coverImage ?? PH}
            eyebrow={featured.state === 'current' ? 'Đang diễn ra' : featured.state === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}
            title={featured.title}
            meta={`${formatDateVi(featured.startDate)} – ${formatDateVi(featured.endDate)}`}
            description={featured.description ?? undefined}
            cta="Xem triển lãm"
          />
        </SectionWrapper>
      )}

      <SectionWrapper variant="muted">
        <SectionHeader title="Tất cả triển lãm" />
        <div className="mb-6">
          <StatusTabs
            basePath="/trien-lam"
            current={status}
            tabs={[
              { value: '', label: 'Tất cả' },
              { value: 'current', label: 'Đang diễn ra' },
              { value: 'upcoming', label: 'Sắp diễn ra' },
              { value: 'past', label: 'Đã kết thúc' },
            ]}
          />
        </div>
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">Chưa có triển lãm nào.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <ExhibitionCard
                key={e.id}
                title={e.title}
                image={e.coverImage ?? PH}
                startDate={e.startDate}
                endDate={e.endDate}
                href={`/trien-lam/${e.id}`}
              />
            ))}
          </div>
        )}
      </SectionWrapper>

      <SectionWrapper>
        <SectionHeader eyebrow="Khám phá tiếp" title="Tiếp tục hành trình" />
        <CrossLinkCards
          links={[
            { href: '/hien-vat', title: 'Hiện vật trưng bày', description: 'Xem hiện vật trong các chuyên đề.', icon: '🏺' },
            { href: '/tin-tuc', title: 'Tin khai mạc', description: 'Bài viết về các lễ khai mạc.', icon: '📰' },
            { href: '/dang-ky-tham-quan', title: 'Đến tham quan', description: 'Đăng ký xem trực tiếp.', icon: '🎟️' },
          ]}
        />
      </SectionWrapper>
    </>
  )
}
