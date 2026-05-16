import type { Metadata } from 'next'
import { Lora, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const lora = Lora({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-lora',
  display: 'swap',
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Đền thờ Bác',
    template: '%s | Đền thờ Bác',
  },
  description: 'Hệ thống Website Quản lý Di tích Lịch sử Đền thờ Bác',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={`${lora.variable} ${beVietnamPro.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
