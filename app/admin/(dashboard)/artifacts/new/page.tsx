import { prisma } from '@/lib/prisma'
import { ArtifactForm } from '@/components/admin/ArtifactForm'

export default async function NewArtifactPage() {
  const rooms = await prisma.room.findMany({ orderBy: { name: 'asc' } })
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Tạo hiện vật</h1>
      <ArtifactForm rooms={rooms} />
    </div>
  )
}
