import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatDateVi } from '@/lib/format'

function CardInner({
  title,
  image,
  startDate,
  endDate,
}: {
  title: string
  image: string
  startDate: Date
  endDate: Date
}) {
  const now = Date.now()
  const status =
    startDate.getTime() > now
      ? { label: 'Sắp diễn ra', className: 'bg-gold-400 text-navy-950' }
      : endDate.getTime() < now
        ? { label: 'Đã kết thúc', className: 'bg-navy-100 text-navy-700' }
        : { label: 'Đang diễn ra', className: 'bg-navy-900 text-navy-50' }

  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
        <p className="mt-auto text-sm text-muted-foreground">
          {formatDateVi(startDate)} – {formatDateVi(endDate)}
        </p>
      </div>
    </>
  )
}

export function ExhibitionCard({
  title,
  image,
  startDate,
  endDate,
  href,
}: {
  title: string
  image: string
  startDate: Date
  endDate: Date
  href?: string
}) {
  // `group` is NOT in `base`: it goes only on the Link wrapper, so the image
  // `group-hover:scale-105` (in CardInner) animates only for clickable cards —
  // matching ArtifactCard. The non-link <article> (homepage) stays static.
  const base =
    'flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card'
  const inner = (
    <CardInner title={title} image={image} startDate={startDate} endDate={endDate} />
  )
  if (href) {
    return (
      <Link href={href} className={cn(base, 'group transition-shadow hover:shadow-lg')}>
        {inner}
      </Link>
    )
  }
  return <article className={base}>{inner}</article>
}
