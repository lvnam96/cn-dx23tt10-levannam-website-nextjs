import Link from 'next/link'
import { cn } from '@/lib/utils'

export type Pill = { value: string; label: string }

function buildHref(basePath: string, params: Record<string, string | undefined>) {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v)
  const qs = sp.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export function FilterPills({
  basePath,
  param,
  pills,
  current,
  otherParams = {},
  allLabel = 'Tất cả',
}: {
  basePath: string
  param: string
  pills: Pill[]
  current?: string
  otherParams?: Record<string, string | undefined>
  allLabel?: string
}) {
  const items = [{ value: '', label: allLabel }, ...pills]
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {items.map((p) => {
        const active = (current ?? '') === p.value
        const href = buildHref(basePath, { ...otherParams, [param]: p.value || undefined })
        return (
          <Link
            key={p.value || 'all'}
            href={href}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
              active
                ? 'border-navy-900 bg-navy-900 text-navy-50'
                : 'border-border bg-paper-card text-muted-foreground hover:border-navy-700',
            )}
          >
            {p.label}
          </Link>
        )
      })}
    </div>
  )
}
