import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PageHero } from '@/components/public/PageHero'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { ExhibitionCard } from '@/components/public/ExhibitionCard'

export const metadata: Metadata = {
  title: 'Triển lãm',
  description:
    'Các triển lãm đang diễn ra, sắp diễn ra và đã kết thúc tại Đền thờ Bác.',
}

export default async function ExhibitionListPage() {
  const exhibitions = await prisma.exhibition.findMany({
    orderBy: { startDate: 'asc' },
  })

  return (
    <>
      <PageHero
        title="Triển lãm"
        subtitle="Các triển lãm tại di tích Đền thờ Bác."
        image="https://placehold.co/1920x600.png?text=Trien+lam"
        size="sm"
      />
      <SectionWrapper>
        {exhibitions.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            Chưa có triển lãm nào.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {exhibitions.map((e) => (
              <ExhibitionCard
                key={e.id}
                title={e.title}
                image={e.coverImage ?? 'https://placehold.co/800x450.png'}
                startDate={e.startDate}
                endDate={e.endDate}
                href={`/trien-lam/${e.id}`}
              />
            ))}
          </div>
        )}
      </SectionWrapper>
    </>
  )
}
