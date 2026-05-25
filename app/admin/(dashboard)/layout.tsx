import { auth, signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/admin/AppSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  async function logout() {
    'use server'
    await signOut({ redirectTo: '/admin/login' })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b px-4">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {session?.user?.email}
            </span>
            <form action={logout}>
              <Button variant="outline" size="sm">
                Đăng xuất
              </Button>
            </form>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
