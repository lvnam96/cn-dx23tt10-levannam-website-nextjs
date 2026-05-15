import { signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  async function logout() {
    'use server'
    await signOut({ redirectTo: '/admin/login' })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Bảng điều khiển</h1>
      <p className="text-muted-foreground">Khu vực quản trị (xây dựng từ Day 3+).</p>
      <form action={logout}>
        <Button type="submit" variant="outline">Đăng xuất</Button>
      </form>
    </main>
  )
}
