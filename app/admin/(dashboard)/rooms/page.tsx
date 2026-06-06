import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { RoomsTable } from '@/components/admin/RoomsTable'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({
    include: { _count: { select: { artifacts: true } } },
    orderBy: { name: 'asc' },
  })
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Phòng"
        action={
          <Button asChild>
            <Link href="/admin/rooms/new">Tạo phòng</Link>
          </Button>
        }
      />
      <RoomsTable rooms={rooms} />
    </div>
  )
}
