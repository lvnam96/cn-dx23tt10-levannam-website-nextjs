import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
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

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post || !post.published) notFound()

  return (
    <article className="py-16">
      <div className="mx-auto max-w-prose px-4">
        <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
          {post.category}
        </span>
        <h1 className="mt-4 font-heading text-3xl font-bold md:text-4xl">
          {post.title}
        </h1>
        {post.publishedAt && (
          <p className="mt-2 text-sm text-muted-foreground">
            {formatDateVi(post.publishedAt)}
          </p>
        )}
      </div>

      <div className="relative mx-auto mt-8 aspect-video w-full max-w-3xl overflow-hidden rounded-lg bg-muted">
        <Image
          src={post.coverImage ?? 'https://placehold.co/800x450.png'}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      <div className="mx-auto mt-8 max-w-prose px-4">
        <div
          className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:text-foreground prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  )
}
