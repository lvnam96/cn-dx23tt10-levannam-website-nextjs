import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { RoomsTable } from '@/components/admin/RoomsTable'

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({
    include: { _count: { select: { artifacts: true } } },
    orderBy: { name: 'asc' },
  })
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Phòng</h1>
        <Button asChild>
          <Link href="/admin/rooms/new">Tạo phòng</Link>
        </Button>
      </div>
      <RoomsTable rooms={rooms} />
    </div>
  )
}
