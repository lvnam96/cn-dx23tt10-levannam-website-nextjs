'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ' },
  { href: '/gioi-thieu', label: 'Giới thiệu' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/hien-vat', label: 'Hiện vật' },
  { href: '/trien-lam', label: 'Triển lãm' },
  { href: '/lien-he', label: 'Liên hệ' },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  // Exact match or a true sub-path — avoids a sibling like /hien-vat-abc
  // wrongly activating /hien-vat.
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-header-bg text-navy-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-heading text-xl font-bold text-gold-400">
          Đền thờ Bác
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'text-sm font-medium underline-offset-8 transition-colors hover:text-gold-400',
                  active && 'text-gold-400 underline',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Mở menu" className="size-11 text-navy-50">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-header-bg text-navy-50">
            <SheetTitle className="px-4 pt-4 font-heading text-gold-400">Đền thờ Bác</SheetTitle>
            <SheetDescription className="sr-only">Liên kết điều hướng trang</SheetDescription>
            <nav aria-label="Điều hướng chính" className="mt-4 flex flex-col">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'px-6 py-3 text-base font-medium hover:bg-navy-900 hover:text-gold-400',
                      active && 'text-gold-400',
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
