import { auth, signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { AppSidebar } from '@/components/admin/AppSidebar'
import { LogOut, UserCircle } from 'lucide-react'

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
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCircle className="size-4" />
              <span className="hidden sm:inline">{session?.user?.email}</span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <form action={logout}>
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </form>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
