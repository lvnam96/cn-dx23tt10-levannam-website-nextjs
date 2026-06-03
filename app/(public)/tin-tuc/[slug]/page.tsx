import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { SectionHeader } from '@/components/public/SectionHeader'
import { PostCard } from '@/components/public/PostCard'
import { CrossLinkCards } from '@/components/public/CrossLinkCards'
import { formatDateVi } from '@/lib/format'

// cache() dedupes the identical query between generateMetadata and the page
// within one request. Next auto-memoizes fetch() — NOT Prisma — so without this
// wrapper the detail page would hit the DB twice.
const getPost = cache((slug: string) => prisma.post.findUnique({ where: { slug } }))

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Không tìm thấy bài viết' }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post || !post.published) notFound()

  const related = await prisma.post.findMany({
    where: { published: true, category: post.category, slug: { not: post.slug } },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  })

  return (
    <>
      {/* Title block */}
      <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gold-600">
          {post.category}{post.publishedAt ? ` · ${formatDateVi(post.publishedAt)}` : ''}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight md:text-4xl">{post.title}</h1>
      </div>

      {/* Hero image */}
      {post.coverImage && (
        <div className="relative mx-auto mt-8 aspect-video w-full max-w-5xl overflow-hidden rounded-lg">
          <Image src={post.coverImage} alt={post.title} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}

      {/* Body — keep the existing prose classes verbatim */}
      <article className="mx-auto max-w-prose px-4 py-12 sm:px-6">
        <div
          className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:text-foreground prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {related.length > 0 && (
        <SectionWrapper variant="muted">
          <SectionHeader eyebrow="Bài cùng chuyên mục" title="Đọc tiếp" href="/tin-tuc" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} title={p.title} excerpt={p.excerpt} image={p.coverImage ?? 'https://placehold.co/800x450.png'} href={`/tin-tuc/${p.slug}`} publishedAt={p.publishedAt} />
            ))}
          </div>
        </SectionWrapper>
      )}

      <SectionWrapper>
        <SectionHeader eyebrow="Khám phá tiếp" title="Tiếp tục hành trình" />
        <CrossLinkCards
          links={[
            { href: '/hien-vat', title: 'Hiện vật', description: 'Bộ sưu tập của khu di tích.', icon: '🏺' },
            { href: '/trien-lam', title: 'Triển lãm', description: 'Các chuyên đề trưng bày.', icon: '🖼️' },
            { href: '/dang-ky-tham-quan', title: 'Tham quan', description: 'Đăng ký đến thăm.', icon: '🎟️' },
          ]}
        />
      </SectionWrapper>
    </>
  )
}
