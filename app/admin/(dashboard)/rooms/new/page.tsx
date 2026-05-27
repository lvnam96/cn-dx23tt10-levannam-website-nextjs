import { RoomForm } from '@/components/admin/RoomForm'

export default function NewRoomPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Tạo phòng</h1>
      <RoomForm />
    </div>
  )
}
