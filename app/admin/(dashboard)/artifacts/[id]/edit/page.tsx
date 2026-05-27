import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ArtifactForm } from '@/components/admin/ArtifactForm'

export default async function EditArtifactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [artifact, rooms] = await Promise.all([
    prisma.artifact.findUnique({ where: { id } }),
    prisma.room.findMany({ orderBy: { name: 'asc' } }),
  ])
  if (!artifact) notFound()
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Sửa hiện vật</h1>
      <ArtifactForm rooms={rooms} initialData={artifact} />
    </div>
  )
}
