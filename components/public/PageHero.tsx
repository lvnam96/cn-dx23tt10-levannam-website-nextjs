import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const sizeClasses = {
  lg: 'h-[60vh] min-h-[420px] md:h-[72vh] md:min-h-[560px]',
  sm: 'h-[36vh] min-h-[260px] md:h-[44vh] md:min-h-[340px]',
}

export function PageHero({
  title,
  subtitle,
  image,
  alt,
  cta,
  size = 'lg',
}: {
  title: string
  subtitle?: string
  image: string
  alt?: string
  cta?: { label: string; href: string }
  size?: 'lg' | 'sm'
}) {
  return (
    <section className={cn('relative w-full', sizeClasses[size])}>
      <Image
        src={image}
        alt={alt ?? title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-navy-950/55" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center text-navy-50">
        <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl md:text-6xl">{title}</h1>
        {subtitle && <p className="max-w-2xl text-base md:text-xl">{subtitle}</p>}
        {cta && (
          <Button asChild size="lg" className="mt-2 h-12 px-6 text-base">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        )}
      </div>
    </section>
  )
}
