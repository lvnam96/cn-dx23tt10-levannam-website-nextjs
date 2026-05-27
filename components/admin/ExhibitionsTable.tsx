import Link from 'next/link'
import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
      <p className="py-12 text-center text-muted-foreground">
        Chưa có triển lãm nào.
      </p>
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ảnh</TableHead>
          <TableHead>Tiêu đề</TableHead>
          <TableHead>Thời gian</TableHead>
          <TableHead>Số hiện vật</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exhibitions.map((e) => (
          <TableRow key={e.id}>
            <TableCell>
              <div className="relative h-12 w-20 overflow-hidden rounded bg-muted">
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
            <TableCell>{e._count.artifacts}</TableCell>
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
  )
}
