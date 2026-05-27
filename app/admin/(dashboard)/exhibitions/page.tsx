import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { ExhibitionsTable } from '@/components/admin/ExhibitionsTable'

export default async function AdminExhibitionsPage() {
  const exhibitions = await prisma.exhibition.findMany({
    include: { _count: { select: { artifacts: true } } },
    orderBy: { startDate: 'desc' },
  })
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Triển lãm</h1>
        <Button asChild>
          <Link href="/admin/exhibitions/new">Tạo triển lãm</Link>
        </Button>
      </div>
      <ExhibitionsTable exhibitions={exhibitions} />
    </div>
  )
}
