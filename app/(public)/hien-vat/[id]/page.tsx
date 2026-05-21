import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

// cache() dedupes the query between generateMetadata and the page (one request);
// Next auto-memoizes fetch(), not Prisma.
const getArtifact = cache((id: string) =>
  prisma.artifact.findUnique({ where: { id }, include: { room: true } }),
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const artifact = await getArtifact(id)
  if (!artifact) return { title: 'Không tìm thấy hiện vật' }
  return {
    title: artifact.name,
    description: artifact.description?.slice(0, 160) ?? `Hiện vật: ${artifact.name}`,
  }
}

export default async function ArtifactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const artifact = await getArtifact(id)
  if (!artifact) notFound()

  const images =
    artifact.images.length > 0
      ? artifact.images
      : ['https://placehold.co/600x400.png']

  return (
    <article className="mx-auto max-w-5xl px-4 py-16">
      <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
        {artifact.category}
      </span>
      <h1 className="mt-4 font-heading text-3xl font-bold md:text-4xl">
        {artifact.name}
      </h1>
      {artifact.room && (
        <p className="mt-2 text-sm text-muted-foreground">
          Phòng: {artifact.room.name}
        </p>
      )}

      {artifact.description && (
        <p className="mt-6 max-w-prose leading-relaxed text-muted-foreground">
          {artifact.description}
        </p>
      )}

      <div
        className={
          images.length === 1 ? 'mt-8' : 'mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2'
        }
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="relative aspect-3/2 w-full overflow-hidden rounded-lg bg-muted"
          >
            <Image
              src={src}
              alt={`${artifact.name} — hình ${i + 1}`}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </article>
  )
}
