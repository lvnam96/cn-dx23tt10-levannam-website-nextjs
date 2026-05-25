import Link from 'next/link'
import {
  FileText,
  Landmark,
  DoorOpen,
  Images,
  ClipboardList,
  Mail,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    { label: 'Bài viết', value: posts, icon: FileText, href: '/admin/posts' },
    { label: 'Hiện vật', value: artifacts, icon: Landmark, href: '/admin/artifacts' },
    { label: 'Phòng', value: rooms, icon: DoorOpen, href: '/admin/rooms' },
    { label: 'Triển lãm', value: exhibitions, icon: Images, href: '/admin/exhibitions' },
    {
      label: 'Đăng ký chờ duyệt',
      value: pendingTours,
      icon: ClipboardList,
      href: '/admin/tours',
    },
    { label: 'Liên hệ', value: contacts, icon: Mail, href: null },
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Bảng điều khiển</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const card = (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
                <s.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{s.value}</p>
              </CardContent>
            </Card>
          )
          return s.href ? (
            <Link key={s.label} href={s.href}>
              {card}
            </Link>
          ) : (
            <div key={s.label}>{card}</div>
          )
        })}
      </div>
    </div>
  )
}
