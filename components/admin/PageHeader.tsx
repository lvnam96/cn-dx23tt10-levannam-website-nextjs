import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  backHref?: string
  backLabel?: string
  action?: React.ReactNode
}

export function PageHeader({ title, backHref, backLabel, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-3.5" />
            {backLabel ?? 'Quay lại'}
          </Link>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {action && <div className="shrink-0 pt-1">{action}</div>}
    </div>
  )
}
