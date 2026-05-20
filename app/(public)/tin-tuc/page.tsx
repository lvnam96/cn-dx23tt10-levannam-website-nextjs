import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PageHero } from '@/components/public/PageHero'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { PostCard } from '@/components/public/PostCard'
import { FilterBar } from '@/components/public/FilterBar'
import { Pagination } from '@/components/public/Pagination'
import { POSTS_PER_PAGE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Tin tức',
  description: 'Tin tức, sự kiện và nghiên cứu mới nhất về di tích Đền thờ Bác.',
}

const CATEGORIES = ['Tin tức', 'Sự kiện', 'Nghiên cứu']

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const sp = await searchParams
  const category = sp.category || undefined
  const page = Math.max(1, Number(sp.page) || 1)

  const where = { published: true, category }

  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE))

  const spForPagination: Record<string, string> = {}
  if (category) spForPagination.category = category

  return (
    <>
      <PageHero
        title="Tin tức"
        subtitle="Tin tức, sự kiện và nghiên cứu mới nhất."
        image="https://placehold.co/1920x600.png?text=Tin+tuc"
        size="sm"
      />
      <SectionWrapper>
        <FilterBar
          action="/tin-tuc"
          fields={[
            {
              name: 'category',
              label: 'Chuyên mục',
              current: category,
              options: CATEGORIES.map((c) => ({ value: c, label: c })),
            },
          ]}
        />

        {posts.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            Không tìm thấy bài viết nào.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
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
        )}

        <Pagination
          currentPage={Math.min(page, totalPages)}
          totalPages={totalPages}
          basePath="/tin-tuc"
          searchParams={spForPagination}
        />
      </SectionWrapper>
    </>
  )
}
