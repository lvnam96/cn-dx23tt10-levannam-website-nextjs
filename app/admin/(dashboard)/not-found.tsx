import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Không tìm thấy</h1>
      <p className="text-muted-foreground">
        Mục bạn tìm không tồn tại hoặc đã bị xoá.
      </p>
      <Button asChild>
        <Link href="/admin">Về bảng điều khiển</Link>
      </Button>
    </div>
  )
}
