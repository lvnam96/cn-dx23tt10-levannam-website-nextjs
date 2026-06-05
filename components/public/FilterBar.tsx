import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export type FilterField = {
  name: string // URL param, e.g. 'room' | 'category'
  label: string // Vietnamese label
  options: { value: string; label: string }[]
  current?: string // active value from searchParams
}

// GET form (no client JS): each <select> maps to a URL param; submitting
// rebuilds the query string. Responsive — fields stack full-width on mobile,
// sit inline from sm up. Styled to the public "paper" theme.
export function FilterBar({
  action,
  fields,
  className,
}: {
  action: string
  fields: FilterField[]
  className?: string
}) {
  return (
    <form
      method="GET"
      action={action}
      className={cn('flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end', className)}
    >
      {fields.map((field) => (
        <div key={field.name} className="flex w-full flex-col gap-1.5 sm:w-auto">
          <label
            htmlFor={`filter-${field.name}`}
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {field.label}
          </label>
          <div className="relative w-full sm:w-56">
            <select
              id={`filter-${field.name}`}
              name={field.name}
              defaultValue={field.current ?? ''}
              className="h-11 w-full appearance-none rounded-lg border border-border bg-paper-card pl-3 pr-9 text-sm text-foreground outline-none transition-colors hover:border-navy-700 focus-visible:border-navy-700 focus-visible:ring-2 focus-visible:ring-gold-400/40"
            >
              <option value="">{`Tất cả ${field.label.toLowerCase()}`}</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      ))}
      <Button type="submit" className="h-11 w-full px-6 sm:w-auto">
        Lọc
      </Button>
    </form>
  )
}
