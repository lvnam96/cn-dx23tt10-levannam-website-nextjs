import Link from 'next/link'
import Image from 'next/image'
import type { Artifact, Room } from '@prisma/client'
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
import { deleteArtifact } from '@/actions/artifacts'
import { DeleteButton } from '@/components/admin/DeleteButton'

type ArtifactWithRoom = Artifact & { room: Room | null }

export function ArtifactsTable({ artifacts }: { artifacts: ArtifactWithRoom[] }) {
  if (artifacts.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Chưa có hiện vật nào.
      </p>
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ảnh</TableHead>
          <TableHead>Tên</TableHead>
          <TableHead>Danh mục</TableHead>
          <TableHead>Phòng</TableHead>
          <TableHead>Nổi bật</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {artifacts.map((a) => (
          <TableRow key={a.id}>
            <TableCell>
              <div className="relative h-12 w-12 overflow-hidden rounded bg-muted">
                {a.images[0] && (
                  <Image
                    src={a.images[0]}
                    alt={a.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </div>
            </TableCell>
            <TableCell className="font-medium">{a.name}</TableCell>
            <TableCell>{a.category}</TableCell>
            <TableCell>
              {a.room ? <Badge variant="secondary">{a.room.name}</Badge> : '—'}
            </TableCell>
            <TableCell>{a.featured ? '✓' : '—'}</TableCell>
            <TableCell className="flex justify-end gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/artifacts/${a.id}/edit`}>Sửa</Link>
              </Button>
              <DeleteButton
                onDelete={deleteArtifact.bind(null, a.id)}
                itemName={a.name}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
