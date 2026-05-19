import { Button } from '@/components/ui/button'

export type FilterField = {
  name: string // URL param, e.g. 'room' | 'category'
  label: string // Vietnamese label
  options: { value: string; label: string }[]
  current?: string // active value from searchParams
}

export function FilterBar({
  action,
  fields,
}: {
  action: string
  fields: FilterField[]
}) {
  return (
    <form
      method="GET"
      action={action}
      className="mb-8 flex flex-wrap items-end gap-3"
    >
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <label
            htmlFor={`filter-${field.name}`}
            className="text-sm font-medium text-muted-foreground"
          >
            {field.label}
          </label>
          <select
            id={`filter-${field.name}`}
            name={field.name}
            defaultValue={field.current ?? ''}
            className="h-11 min-w-44 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <option value="">{`Tất cả ${field.label.toLowerCase()}`}</option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      <Button type="submit" variant="secondary" className="h-11 px-5">
        Lọc
      </Button>
    </form>
  )
}
