import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ExhibitionForm } from '@/components/admin/ExhibitionForm'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function EditExhibitionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [exhibition, artifacts] = await Promise.all([
    prisma.exhibition.findUnique({ where: { id }, include: { artifacts: true } }),
    prisma.artifact.findMany({ orderBy: { name: 'asc' } }),
  ])
  if (!exhibition) notFound()
  const initialData = {
    ...exhibition,
    artifactIds: exhibition.artifacts.map((a) => a.artifactId),
  }
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Sửa triển lãm" backHref="/admin/exhibitions" backLabel="Triển lãm" />
      <ExhibitionForm artifacts={artifacts} initialData={initialData} />
    </div>
  )
}
