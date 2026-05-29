import Link from 'next/link'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'muted' | 'navy'

const variantClasses: Record<Variant, string> = {
  default: 'bg-paper text-foreground',
  muted: 'bg-paper-2 text-foreground',
  navy: 'bg-navy-950 text-navy-50',
}

export function SectionWrapper({
  children,
  title,
  titleHref,
  variant = 'default',
  className,
}: {
  children: React.ReactNode
  title?: string
  titleHref?: string
  variant?: Variant
  className?: string
}) {
  return (
    <section className={cn('py-16 md:py-24', variantClasses[variant])}>
      <div className={cn('mx-auto max-w-7xl px-4 sm:px-6', className)}>
        {title && (
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
            {titleHref && (
              <Link
                href={titleHref}
                className="shrink-0 text-sm font-medium text-primary hover:underline"
              >
                Xem tất cả →
              </Link>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
