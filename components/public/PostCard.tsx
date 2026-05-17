import Image from 'next/image'
import Link from 'next/link'
import { formatDateVi } from '@/lib/format'

export function PostCard({
  title,
  excerpt,
  image,
  href,
  publishedAt,
}: {
  title: string
  excerpt?: string | null
  image: string
  href: string
  publishedAt: Date | null
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
        {excerpt && <p className="line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>}
        {publishedAt && (
          <p className="mt-auto text-xs text-muted-foreground">{formatDateVi(publishedAt)}</p>
        )}
      </div>
    </Link>
  )
}
