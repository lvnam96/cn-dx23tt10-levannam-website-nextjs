import type { TourGroup } from '@prisma/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateVi } from '@/lib/format'
import { TourStatusSelect } from '@/components/admin/TourStatusSelect'

export function ToursTable({ tours }: { tours: TourGroup[] }) {
  if (tours.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Chưa có đăng ký nào.
      </p>
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên đoàn</TableHead>
          <TableHead>Người liên hệ</TableHead>
          <TableHead>Điện thoại</TableHead>
          <TableHead>Ngày</TableHead>
          <TableHead>Số khách</TableHead>
          <TableHead>Ghi chú</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tours.map((t) => (
          <TableRow key={t.id}>
            <TableCell className="font-medium">{t.groupName}</TableCell>
            <TableCell>{t.contactName}</TableCell>
            <TableCell className="whitespace-nowrap">{t.phone}</TableCell>
            <TableCell className="whitespace-nowrap">{formatDateVi(t.date)}</TableCell>
            <TableCell>{t.size}</TableCell>
            <TableCell
              className="max-w-48 truncate text-muted-foreground"
              title={t.note ?? undefined}
            >
              {t.note ?? '—'}
            </TableCell>
            <TableCell>
              <TourStatusSelect id={t.id} status={t.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
