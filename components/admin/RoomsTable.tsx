import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
      <p className="py-12 text-center text-muted-foreground">Chưa có phòng nào.</p>
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead>Số hiện vật</TableHead>
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
            <TableCell>{r._count.artifacts}</TableCell>
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
  )
}
