import { redirect } from 'next/navigation'
import { AuthError } from 'next-auth'
import { signIn, auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) redirect('/admin')

  async function login(formData: FormData) {
    'use server'
    try {
      await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirectTo: '/admin',
      })
    } catch (error) {
      if (error instanceof AuthError) return
      throw error
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <form action={login} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-bold">Đăng nhập quản trị</h1>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit">Đăng nhập</Button>
      </form>
    </main>
  )
}
