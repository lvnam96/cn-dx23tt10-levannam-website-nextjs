import Image from 'next/image'
import Link from 'next/link'

export function FeaturedItem({
  href,
  image,
  eyebrow,
  title,
  description,
  meta,
  cta = 'Xem chi tiết',
}: {
  href: string
  image: string
  eyebrow?: string
  title: string
  description?: string
  meta?: string
  cta?: string
}) {
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-lg bg-paper-2 md:grid-cols-2">
      <div className="relative aspect-video w-full md:aspect-auto md:min-h-[280px]">
        <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center p-6 md:p-10">
        {eyebrow && (
          <span className="mb-2 w-fit rounded-full bg-gold-500 px-3 py-0.5 text-xs font-semibold text-navy-950">
            {eyebrow}
          </span>
        )}
        <h3 className="font-heading text-2xl font-bold leading-tight md:text-3xl">{title}</h3>
        {meta && <p className="mt-2 text-sm text-muted-foreground">{meta}</p>}
        {description && <p className="mt-3 text-muted-foreground">{description}</p>}
        <Link href={href} className="mt-5 w-fit text-sm font-medium text-red hover:underline">
          {cta} →
        </Link>
      </div>
    </div>
  )
}
