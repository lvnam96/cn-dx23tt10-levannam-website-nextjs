import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PageHero } from '@/components/public/PageHero'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { SectionHeader } from '@/components/public/SectionHeader'
import { FilterPills } from '@/components/public/FilterPills'
import { FeaturedItem } from '@/components/public/FeaturedItem'
import { PostCard } from '@/components/public/PostCard'
import { CrossLinkCards } from '@/components/public/CrossLinkCards'
import { Pagination } from '@/components/public/Pagination'
import { POSTS_PER_PAGE, POST_CATEGORIES } from '@/lib/constants'
import { formatDateVi } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Tin tức',
  description: 'Tin tức, sự kiện và thông báo từ di tích Đền thờ Bác.',
}

const PH = 'https://placehold.co/800x450.png'

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const sp = await searchParams
  const category = sp.category || undefined
  const page = Math.max(1, Number(sp.page) || 1)
  const where = { published: true, category }

  const [total, posts, featured] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.findFirst({ where: { published: true }, orderBy: { publishedAt: 'desc' } }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE))

  return (
    <>
      <PageHero eyebrow="Tin tức · Sự kiện" title="Tin tức & Bài viết" subtitle="Sự kiện, thông báo và câu chuyện về khu di tích." image="https://placehold.co/1920x800.png?text=Tin+tuc" size="sm" />

      {featured && !category && page === 1 && (
        <SectionWrapper>
          <SectionHeader eyebrow="Nổi bật" title="Bài viết mới nhất" />
          <FeaturedItem
            href={`/tin-tuc/${featured.slug}`}
            image={featured.coverImage ?? PH}
            eyebrow={featured.category}
            title={featured.title}
            meta={featured.publishedAt ? formatDateVi(featured.publishedAt) : undefined}
            description={featured.excerpt ?? undefined}
            cta="Đọc bài viết"
          />
        </SectionWrapper>
      )}

      <SectionWrapper variant="muted">
        <SectionHeader title="Tất cả bài viết" />
        <div className="mb-6">
          <FilterPills basePath="/tin-tuc" param="category" current={category} pills={POST_CATEGORIES.map((c) => ({ value: c, label: c }))} />
        </div>
        {posts.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">Chưa có bài viết nào.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} title={p.title} excerpt={p.excerpt} image={p.coverImage ?? PH} href={`/tin-tuc/${p.slug}`} publishedAt={p.publishedAt} />
            ))}
          </div>
        )}
        <Pagination currentPage={Math.min(page, totalPages)} totalPages={totalPages} basePath="/tin-tuc" searchParams={category ? { category } : {}} />
      </SectionWrapper>

      <SectionWrapper>
        <SectionHeader eyebrow="Khám phá tiếp" title="Tiếp tục hành trình" />
        <CrossLinkCards
          links={[
            { href: '/trien-lam', title: 'Triển lãm', description: 'Các chuyên đề sắp tới.', icon: '🖼️' },
            { href: '/hien-vat', title: 'Hiện vật', description: 'Bộ sưu tập của khu di tích.', icon: '🏺' },
            { href: '/dang-ky-tham-quan', title: 'Tham quan', description: 'Đăng ký đến thăm khu di tích.', icon: '🎟️' },
          ]}
        />
      </SectionWrapper>
    </>
  )
}
