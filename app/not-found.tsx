import Link from 'next/link'
import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="text-3xl font-bold md:text-5xl">Không tìm thấy trang</h1>
        <p className="max-w-md text-muted-foreground">
          Trang bạn tìm có thể chưa được xây dựng hoặc không tồn tại.
        </p>
        <Button asChild size="lg" className="mt-2 h-12 px-6 text-base">
          <Link href="/">Về trang chủ</Link>
        </Button>
      </main>
      <Footer />
    </div>
  )
}
