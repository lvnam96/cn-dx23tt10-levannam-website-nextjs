import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { ArtifactsTable } from '@/components/admin/ArtifactsTable'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function AdminArtifactsPage() {
  const artifacts = await prisma.artifact.findMany({
    include: { room: true },
    orderBy: { updatedAt: 'desc' },
  })
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Hiện vật"
        action={
          <Button asChild>
            <Link href="/admin/artifacts/new">Tạo hiện vật</Link>
          </Button>
        }
      />
      <ArtifactsTable artifacts={artifacts} />
    </div>
  )
}
