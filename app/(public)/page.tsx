import type { Metadata } from 'next'
import heroImg from '@/assets/images/den_tho_bac_001.jpg'
import { prisma } from '@/lib/prisma'
import { PageHero } from '@/components/public/PageHero'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { SectionHeader } from '@/components/public/SectionHeader'
import { StatStrip } from '@/components/public/StatStrip'
import { Timeline } from '@/components/public/Timeline'
import { PhotoMosaic } from '@/components/public/PhotoMosaic'
import { VisitCTA } from '@/components/public/VisitCTA'
import { ArtifactCard } from '@/components/public/ArtifactCard'
import { ExhibitionCard } from '@/components/public/ExhibitionCard'
import { PostCard } from '@/components/public/PostCard'
import { SITE_STATS, SITE_TIMELINE } from '@/lib/visit-info'

export const revalidate = 3600

export const metadata: Metadata = {
  description: 'Di tích lịch sử Đền thờ Bác — hiện vật tiêu biểu, triển lãm và tin tức mới nhất.',
  openGraph: {
    title: 'Đền thờ Bác',
    description: 'Di tích lịch sử Đền thờ Bác — hiện vật, triển lãm và tin tức.',
    type: 'website',
  },
}

const PH = 'https://placehold.co/800x600.png'

export default async function HomePage() {
  const [featuredArtifacts, exhibitions, latestPosts] = await Promise.all([
    prisma.artifact.findMany({ where: { featured: true }, take: 4, include: { room: true }, orderBy: { createdAt: 'desc' } }),
    prisma.exhibition.findMany({ where: { endDate: { gte: new Date() } }, orderBy: { startDate: 'asc' }, take: 4 }),
    prisma.post.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' }, take: 3 }),
  ])

  const mosaic = featuredArtifacts.flatMap((a) => a.images).filter(Boolean).slice(0, 5)
  while (mosaic.length < 5) mosaic.push(PH)

  return (
    <>
      <PageHero
        eyebrow="Di tích quốc gia · Trà Vinh"
        title="Đền thờ Chủ tịch Hồ Chí Minh"
        subtitle="Tấm lòng son sắt của nhân dân Nam Bộ — công trình dựng giữa lòng địch, ba lần xây lại trong bom đạn."
        image={heroImg}
        cta={{ label: 'Tìm hiểu thêm', href: '/gioi-thieu' }}
      />

      <StatStrip stats={SITE_STATS} />

      <SectionWrapper>
        <SectionHeader index="01" eyebrow="Câu chuyện" title="Ngôi đền dựng nên từ lòng dân" />
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Đầu tháng 9/1969, nghe tin Bác mất, nhân dân Long Đức lập bàn thờ tưởng nhớ. Tháng 3/1970
          ngôi đền khởi công — thi công hoàn toàn về đêm, cách đồn địch hơn 1 km. Ba lần bị bom phá,
          ba lần dựng lại.
        </p>
      </SectionWrapper>

      {featuredArtifacts.length > 0 && (
        <SectionWrapper variant="muted">
          <SectionHeader index="02" eyebrow="Bộ sưu tập" title="Hiện vật tiêu biểu" href="/hien-vat" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredArtifacts.map((a) => (
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

      <SectionWrapper variant="navy">
        <SectionHeader index="03" eyebrow="Dòng thời gian" title="Xây & giữ giữa bom đạn" onDark />
        <Timeline items={SITE_TIMELINE} onDark />
      </SectionWrapper>

      {exhibitions.length > 0 && (
        <SectionWrapper>
          <SectionHeader index="04" eyebrow="Triển lãm" title="Đang & sắp diễn ra" href="/trien-lam" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {exhibitions.map((e) => (
              <ExhibitionCard
                key={e.id}
                title={e.title}
                image={e.coverImage ?? 'https://placehold.co/800x450.png'}
                startDate={e.startDate}
                endDate={e.endDate}
                href={`/trien-lam/${e.id}`}
              />
            ))}
          </div>
        </SectionWrapper>
      )}

      {latestPosts.length > 0 && (
        <SectionWrapper variant="muted">
          <SectionHeader index="05" eyebrow="Tin tức" title="Mới nhất" href="/tin-tuc" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((p) => (
              <PostCard
                key={p.id}
                title={p.title}
                excerpt={p.excerpt}
                image={p.coverImage ?? 'https://placehold.co/800x450.png'}
                href={`/tin-tuc/${p.slug}`}
                publishedAt={p.publishedAt}
              />
            ))}
          </div>
        </SectionWrapper>
      )}

      <SectionWrapper>
        <SectionHeader index="06" eyebrow="Không gian" title="Khám phá khuôn viên" />
        <PhotoMosaic images={mosaic} />
      </SectionWrapper>

      <VisitCTA />
    </>
  )
}
