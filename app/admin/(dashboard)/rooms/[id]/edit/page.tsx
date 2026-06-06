import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { RoomForm } from '@/components/admin/RoomForm'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const room = await prisma.room.findUnique({
    where: { id },
    include: { artifacts: { orderBy: { name: 'asc' } } },
  })
  if (!room) notFound()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Sửa phòng" backHref="/admin/rooms" backLabel="Phòng" />
      <RoomForm initialData={room} />
      <div className="flex max-w-3xl flex-col gap-2">
        <h2 className="text-lg font-semibold">
          Hiện vật trong phòng ({room.artifacts.length})
        </h2>
        {room.artifacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Chưa có hiện vật nào trong phòng này. Gán hiện vật từ trang sửa hiện vật.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {room.artifacts.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/artifacts/${a.id}/edit`}
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
