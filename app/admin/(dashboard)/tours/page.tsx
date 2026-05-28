import Link from 'next/link'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { ToursTable } from '@/components/admin/ToursTable'
import { TOUR_STATUSES, TOUR_STATUS_LABELS, isValidStatus } from '@/lib/tour-status'

export default async function AdminToursPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const active = status && isValidStatus(status) ? status : 'ALL'
  const where: Prisma.TourGroupWhereInput =
    active === 'ALL' ? {} : { status: active }
  const tours = await prisma.tourGroup.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Đoàn tham quan</h1>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant={active === 'ALL' ? 'default' : 'outline'} size="sm">
          <Link href="/admin/tours">Tất cả</Link>
        </Button>
        {TOUR_STATUSES.map((s) => (
          <Button
            key={s}
            asChild
            variant={active === s ? 'default' : 'outline'}
            size="sm"
          >
            <Link href={`/admin/tours?status=${s}`}>{TOUR_STATUS_LABELS[s]}</Link>
          </Button>
        ))}
      </div>
      <ToursTable tours={tours} />
    </div>
  )
}
