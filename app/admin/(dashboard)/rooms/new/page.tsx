import { RoomForm } from '@/components/admin/RoomForm'
import { PageHeader } from '@/components/admin/PageHeader'

export default function NewRoomPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Tạo phòng" backHref="/admin/rooms" backLabel="Phòng" />
      <RoomForm />
    </div>
  )
}
