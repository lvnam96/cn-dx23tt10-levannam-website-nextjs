import Link from 'next/link'
import {
  FileText,
  Landmark,
  DoorOpen,
  Images,
  ClipboardList,
  Mail,
  ArrowRight,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default async function AdminDashboard() {
  const [posts, artifacts, rooms, exhibitions, pendingTours, contacts] =
    await Promise.all([
      prisma.post.count(),
      prisma.artifact.count(),
      prisma.room.count(),
      prisma.exhibition.count(),
      prisma.tourGroup.count({ where: { status: 'PENDING' } }),
      prisma.contact.count(),
    ])

  const stats = [
    {
      label: 'Bài viết',
      value: posts,
      icon: FileText,
      href: '/admin/posts',
      iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    },
    {
      label: 'Hiện vật',
      value: artifacts,
      icon: Landmark,
      href: '/admin/artifacts',
      iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    },
    {
      label: 'Phòng',
      value: rooms,
      icon: DoorOpen,
      href: '/admin/rooms',
      iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    },
    {
      label: 'Triển lãm',
      value: exhibitions,
      icon: Images,
      href: '/admin/exhibitions',
      iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
    },
    {
      label: 'Đăng ký chờ duyệt',
      value: pendingTours,
      icon: ClipboardList,
      href: '/admin/tours',
      iconClass: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
    },
    {
      label: 'Liên hệ',
      value: contacts,
      icon: Mail,
      href: '/admin/contacts',
      iconClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Bảng điều khiển</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tổng quan dữ liệu hệ thống</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group block rounded-xl ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className={`rounded-lg p-2 ${s.iconClass}`}>
                  <s.icon className="size-5" />
                </div>
                <ArrowRight className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-3xl font-bold tabular-nums">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
