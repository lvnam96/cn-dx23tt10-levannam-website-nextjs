import Link from 'next/link'
import { DoorOpen } from 'lucide-react'
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
import { deleteRoom } from '@/actions/rooms'
import { DeleteButton } from '@/components/admin/DeleteButton'

type RoomRow = {
  id: string
  name: string
  description: string | null
  _count: { artifacts: number }
}

export function RoomsTable({ rooms }: { rooms: RoomRow[] }) {
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
        <DoorOpen className="size-10 opacity-30" />
        <p className="text-sm">Chưa có phòng nào.</p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Hiện vật</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell
                className="max-w-md truncate text-muted-foreground"
                title={r.description ?? undefined}
              >
                {r.description ?? '—'}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{r._count.artifacts}</Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/rooms/${r.id}/edit`}>Sửa</Link>
                </Button>
                <DeleteButton
                  onDelete={deleteRoom.bind(null, r.id)}
                  itemName={r.name}
                  description={
                    r._count.artifacts > 0
                      ? `${r._count.artifacts} hiện vật sẽ không còn thuộc phòng nào (không bị xoá). Hành động này không thể hoàn tác.`
                      : undefined
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
