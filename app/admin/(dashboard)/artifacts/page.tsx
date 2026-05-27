import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { ArtifactsTable } from '@/components/admin/ArtifactsTable'

export default async function AdminArtifactsPage() {
  const artifacts = await prisma.artifact.findMany({
    include: { room: true },
    orderBy: { updatedAt: 'desc' },
  })
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hiện vật</h1>
        <Button asChild>
          <Link href="/admin/artifacts/new">Tạo hiện vật</Link>
        </Button>
      </div>
      <ArtifactsTable artifacts={artifacts} />
    </div>
  )
}
