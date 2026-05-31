import Link from 'next/link'

export type InfoRow = { label: string; value: string; href?: string }

export function InfoCard({ title, rows }: { title?: string; rows: InfoRow[] }) {
  return (
    <div className="rounded-lg bg-paper-2 p-5">
      {title && <h3 className="mb-3 font-heading text-lg font-semibold">{title}</h3>}
      <dl className="divide-y divide-border">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className="text-right font-medium">
              {r.href ? (
                <Link href={r.href} className="rounded-full bg-paper-card px-2.5 py-0.5 hover:underline">
                  {r.value}
                </Link>
              ) : (
                r.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
