import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PageHero } from '@/components/public/PageHero'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { ArtifactCard } from '@/components/public/ArtifactCard'
import { ExhibitionCard } from '@/components/public/ExhibitionCard'
import { PostCard } from '@/components/public/PostCard'

// Homepage keeps the layout's default title ("Đền thờ Bác", no template suffix);
// adds an explicit description + OpenGraph for SEO/sharing.
export const metadata: Metadata = {
  description:
    'Di tích lịch sử Đền thờ Bác — hiện vật tiêu biểu, triển lãm và tin tức mới nhất.',
  openGraph: {
    title: 'Đền thờ Bác',
    description: 'Di tích lịch sử Đền thờ Bác — hiện vật, triển lãm và tin tức.',
    type: 'website',
  },
}

export default async function HomePage() {
  const [featuredArtifacts, exhibitions, latestPosts] = await Promise.all([
    prisma.artifact.findMany({
      where: { featured: true },
      take: 4,
      include: { room: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.exhibition.findMany({
      where: { endDate: { gte: new Date() } },
      orderBy: { startDate: 'asc' },
      take: 4,
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
  ])

  return (
    <>
      <PageHero
        title="Đền thờ Bác"
        subtitle="Di tích lịch sử — nơi lưu giữ và lan tỏa những giá trị thiêng liêng."
        image="https://placehold.co/1920x800.png?text=Den+tho+Bac"
        cta={{ label: 'Tìm hiểu thêm', href: '/gioi-thieu' }}
      />

      {featuredArtifacts.length > 0 && (
        <SectionWrapper title="Hiện vật tiêu biểu" titleHref="/hien-vat">
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

      {exhibitions.length > 0 && (
        <SectionWrapper title="Triển lãm" titleHref="/trien-lam" variant="muted">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {exhibitions.map((e) => (
              <ExhibitionCard
                key={e.id}
                title={e.title}
                image={e.coverImage ?? 'https://placehold.co/800x450.png'}
                startDate={e.startDate}
                endDate={e.endDate}
              />
            ))}
          </div>
        </SectionWrapper>
      )}

      {latestPosts.length > 0 && (
        <SectionWrapper title="Tin tức mới nhất" titleHref="/tin-tuc">
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
    </>
  )
}
