import { prisma } from '@/lib/prisma'
import { ContactsTable } from '@/components/admin/ContactsTable'

export default async function AdminContactsPage() {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Liên hệ</h1>
      <ContactsTable contacts={contacts} />
    </div>
  )
}
