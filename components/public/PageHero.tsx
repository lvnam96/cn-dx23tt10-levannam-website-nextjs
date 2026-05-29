import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const sizeClasses = {
  lg: 'h-[64vh] min-h-[460px] md:h-[78vh] md:min-h-[600px]',
  sm: 'h-[38vh] min-h-[280px] md:h-[46vh] md:min-h-[360px]',
}

export function PageHero({
  title,
  subtitle,
  eyebrow,
  image,
  alt,
  cta,
  size = 'lg',
}: {
  title: string
  subtitle?: string
  eyebrow?: string
  image: string
  alt?: string
  cta?: { label: string; href: string }
  size?: 'lg' | 'sm'
}) {
  return (
    <section className={cn('relative w-full', sizeClasses[size])}>
      <Image src={image} alt={alt ?? title} fill priority sizes="100vw" className="object-cover" />
      {/* Light building reads at top; navy gradient only at the base for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/20 to-navy-950/85" />
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 md:pb-16">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
              {eyebrow}
            </p>
          )}
          <h1 className="max-w-3xl font-heading text-3xl font-bold leading-[1.05] text-navy-50 drop-shadow-md sm:text-4xl md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-base text-navy-50/90 md:text-lg">{subtitle}</p>
          )}
          {cta && (
            <Button asChild size="lg" className="mt-6 h-12 px-6 text-base">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
