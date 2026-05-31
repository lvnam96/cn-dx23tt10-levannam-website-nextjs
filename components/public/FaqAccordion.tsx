export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-paper-card">
      {items.map((it) => (
        <details key={it.q} className="group px-5">
          <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-medium text-foreground">
            {it.q}
            <span className="ml-4 text-gold-600 transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{it.a}</p>
        </details>
      ))}
    </div>
  )
}
