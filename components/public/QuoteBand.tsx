export function QuoteBand({ quote, by }: { quote: string; by?: string }) {
  return (
    <section className="bg-navy-950 text-navy-50">
      <figure className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 md:py-20">
        <blockquote className="font-heading text-2xl italic leading-snug md:text-3xl">
          “{quote}”
        </blockquote>
        {by && (
          <figcaption className="mt-5 text-sm uppercase tracking-[0.08em] text-gold-400">
            — {by}
          </figcaption>
        )}
      </figure>
    </section>
  )
}
