import Link from 'next/link'
import { cn } from '@/lib/utils'

export function StatusTabs({
  basePath,
  param = 'status',
  current,
  tabs,
}: {
  basePath: string
  param?: string
  current?: string
  tabs: { value: string; label: string }[]
}) {
  return (
    <div className="flex gap-2 overflow-x-auto border-b border-border pb-px">
      {tabs.map((t) => {
        const active = (current ?? tabs[0].value) === t.value
        const href = t.value ? `${basePath}?${param}=${t.value}` : basePath
        return (
          <Link
            key={t.value || 'all'}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'shrink-0 -mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors',
              active
                ? 'border-gold-600 text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </Link>
        )
      })}
    </div>
  )
}
