import Image from 'next/image'
import { formatDateVi } from '@/lib/format'

export function ExhibitionCard({
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
  const upcoming = startDate.getTime() > Date.now()
  const status = upcoming
    ? { label: 'Sắp diễn ra', className: 'bg-gold-400 text-navy-950' }
    : { label: 'Đang diễn ra', className: 'bg-navy-900 text-navy-50' }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
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
    </article>
  )
}
