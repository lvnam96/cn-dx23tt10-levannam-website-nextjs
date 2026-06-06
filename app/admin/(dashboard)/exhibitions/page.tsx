import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { ExhibitionsTable } from '@/components/admin/ExhibitionsTable'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function AdminExhibitionsPage() {
  const exhibitions = await prisma.exhibition.findMany({
    include: { _count: { select: { artifacts: true } } },
    orderBy: { startDate: 'desc' },
  })
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Triển lãm"
        action={
          <Button asChild>
            <Link href="/admin/exhibitions/new">Tạo triển lãm</Link>
          </Button>
        }
      />
      <ExhibitionsTable exhibitions={exhibitions} />
    </div>
  )
}
