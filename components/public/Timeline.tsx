import { cn } from '@/lib/utils'

export function Timeline({
  items,
  onDark = false,
}: {
  items: { year: string; caption: string }[]
  onDark?: boolean
}) {
  return (
    <ol className="relative ml-3 border-l-2 border-gold-500/60 md:ml-0 md:flex md:border-l-0">
      {items.map((it) => (
        <li key={it.year} className="relative pb-8 pl-6 last:pb-0 md:flex-1 md:pb-0 md:pl-0 md:pr-4 md:pt-6">
          {/* node */}
          <span className="absolute -left-[7px] top-1 size-3 rounded-full bg-gold-500 md:left-0 md:top-0 md:-translate-y-1/2" />
          {/* horizontal rule on md+ */}
          <span className="hidden md:absolute md:left-0 md:top-0 md:block md:h-0.5 md:w-full md:bg-gold-500/40" />
          <div className={cn('font-heading text-lg font-bold', onDark ? 'text-navy-50' : 'text-foreground')}>
            {it.year}
          </div>
          <p className={cn('mt-1 text-sm leading-relaxed md:pr-6', onDark ? 'text-navy-50/80' : 'text-muted-foreground')}>
            {it.caption}
          </p>
        </li>
      ))}
    </ol>
  )
}
