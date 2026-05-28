import type { Contact } from '@prisma/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateVi } from '@/lib/format'

export function ContactsTable({ contacts }: { contacts: Contact[] }) {
  if (contacts.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">Chưa có liên hệ nào.</p>
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Họ tên</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Nội dung</TableHead>
          <TableHead>Ngày gửi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell>{c.email}</TableCell>
            <TableCell className="max-w-md whitespace-pre-wrap">{c.message}</TableCell>
            <TableCell className="whitespace-nowrap">
              {formatDateVi(c.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
