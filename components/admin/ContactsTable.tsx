import { Mail } from 'lucide-react'
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
      <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
        <Mail className="size-10 opacity-30" />
        <p className="text-sm">Chưa có liên hệ nào.</p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Họ tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead className="whitespace-nowrap">Ngày gửi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="whitespace-nowrap font-medium">{c.name}</TableCell>
              <TableCell className="whitespace-nowrap">{c.email}</TableCell>
              <TableCell className="max-w-md whitespace-pre-wrap text-sm text-muted-foreground">
                {c.message}
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {formatDateVi(c.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
