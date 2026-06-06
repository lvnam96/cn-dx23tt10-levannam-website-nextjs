import Link from 'next/link'
import Image from 'next/image'
import { Images } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateVi } from '@/lib/format'
import { deleteExhibition } from '@/actions/exhibitions'
import { DeleteButton } from '@/components/admin/DeleteButton'

type ExhibitionRow = {
  id: string
  title: string
  coverImage: string | null
  startDate: Date
  endDate: Date
  _count: { artifacts: number }
}

export function ExhibitionsTable({ exhibitions }: { exhibitions: ExhibitionRow[] }) {
  if (exhibitions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
        <Images className="size-10 opacity-30" />
        <p className="text-sm">Chưa có triển lãm nào.</p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Ảnh</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead>Hiện vật</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exhibitions.map((e) => (
            <TableRow key={e.id}>
              <TableCell>
                <div className="relative h-12 w-20 overflow-hidden rounded-md bg-muted">
                  {e.coverImage && (
                    <Image
                      src={e.coverImage}
                      alt={e.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{e.title}</TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {formatDateVi(e.startDate)} – {formatDateVi(e.endDate)}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{e._count.artifacts}</Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/exhibitions/${e.id}/edit`}>Sửa</Link>
                </Button>
                <DeleteButton
                  onDelete={deleteExhibition.bind(null, e.id)}
                  itemName={e.title}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
