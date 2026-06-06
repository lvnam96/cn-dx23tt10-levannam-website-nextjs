import { redirect } from 'next/navigation'
import { AuthError } from 'next-auth'
import { signIn, auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await auth()
  if (session?.user) redirect('/admin')
  const { error } = await searchParams

  async function login(formData: FormData) {
    'use server'
    try {
      await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirectTo: '/admin',
      })
    } catch (err) {
      if (err instanceof AuthError) redirect('/admin/login?error=CredentialsSignin')
      throw err
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-8">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="size-6 text-primary" />
          </div>
          <h1 className="font-heading text-xl font-bold">Đền thờ Bác</h1>
          <p className="mt-1 text-sm text-muted-foreground">Trang quản trị hệ thống</p>
        </div>
        <Card>
          <CardHeader className="pb-4">
            <p className="text-sm font-medium">Đăng nhập</p>
          </CardHeader>
          <CardContent>
            <form action={login} className="flex flex-col gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>Email hoặc mật khẩu không đúng.</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" name="password" type="password" required autoComplete="current-password" />
              </div>
              <Button type="submit" className="mt-1 w-full">
                Đăng nhập
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
