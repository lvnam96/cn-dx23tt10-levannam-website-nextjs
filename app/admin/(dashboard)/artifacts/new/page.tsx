import { prisma } from '@/lib/prisma'
import { ArtifactForm } from '@/components/admin/ArtifactForm'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function NewArtifactPage() {
  const rooms = await prisma.room.findMany({ orderBy: { name: 'asc' } })
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Tạo hiện vật" backHref="/admin/artifacts" backLabel="Hiện vật" />
      <ArtifactForm rooms={rooms} />
    </div>
  )
}
