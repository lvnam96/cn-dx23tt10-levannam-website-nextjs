import { prisma } from '@/lib/prisma'
import { ContactsTable } from '@/components/admin/ContactsTable'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function AdminContactsPage() {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Liên hệ" />
      <ContactsTable contacts={contacts} />
    </div>
  )
}
