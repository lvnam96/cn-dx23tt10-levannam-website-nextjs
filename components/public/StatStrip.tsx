import { cn } from '@/lib/utils'

export function StatStrip({
  stats,
  className,
}: {
  stats: { value: string; label: string }[]
  className?: string
}) {
  return (
    <section className={cn('bg-paper-2', className)}>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 md:gap-8">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-heading text-2xl font-bold text-gold-600 md:text-3xl">
              {s.value}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
