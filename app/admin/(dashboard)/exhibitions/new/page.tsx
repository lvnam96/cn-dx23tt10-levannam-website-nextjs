import { prisma } from '@/lib/prisma'
import { ExhibitionForm } from '@/components/admin/ExhibitionForm'

export default async function NewExhibitionPage() {
  const artifacts = await prisma.artifact.findMany({ orderBy: { name: 'asc' } })
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Tạo triển lãm</h1>
      <ExhibitionForm artifacts={artifacts} />
    </div>
  )
}
