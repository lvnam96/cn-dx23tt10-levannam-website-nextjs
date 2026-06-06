import { prisma } from '@/lib/prisma'
import { ExhibitionForm } from '@/components/admin/ExhibitionForm'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function NewExhibitionPage() {
  const artifacts = await prisma.artifact.findMany({ orderBy: { name: 'asc' } })
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Tạo triển lãm" backHref="/admin/exhibitions" backLabel="Triển lãm" />
      <ExhibitionForm artifacts={artifacts} />
    </div>
  )
}
