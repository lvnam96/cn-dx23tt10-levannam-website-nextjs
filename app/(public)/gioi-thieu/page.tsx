import type { Metadata } from 'next'
import { PageHero } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description: 'Lịch sử hình thành, sứ mệnh và thông tin tham quan Đền thờ Bác.',
  openGraph: {
    title: 'Giới thiệu | Đền thờ Bác',
    description: 'Lịch sử hình thành, sứ mệnh và thông tin tham quan Đền thờ Bác.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Giới thiệu"
        subtitle="Lịch sử, sứ mệnh và thông tin tham quan."
        image="https://placehold.co/1920x600?text=Gioi+thieu"
        size="sm"
      />
      <article className="mx-auto max-w-prose px-4 py-16 leading-relaxed">
        {/* CONTENT: replace with real history text */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Lịch sử hình thành</h2>
          <p className="text-muted-foreground">
            Nội dung mẫu (placeholder). Phần này sẽ trình bày lịch sử hình thành của di
            tích, sẽ được biên tập sau dựa trên tài liệu nghiên cứu. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
          </p>
        </section>

        {/* CONTENT: replace with real mission text */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Sứ mệnh &amp; Ý nghĩa</h2>
          <p className="text-muted-foreground">
            Nội dung mẫu (placeholder). Phần này nêu sứ mệnh gìn giữ, giáo dục và lan tỏa
            các giá trị lịch sử của di tích. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </section>

        {/* CONTENT: replace with real visit info (hours, ticket, address) */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Thông tin tham quan</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>Giờ mở cửa: (đang cập nhật)</li>
            <li>Giá vé: (đang cập nhật)</li>
            <li>Địa chỉ: (đang cập nhật)</li>
          </ul>
        </section>
      </article>
    </>
  )
}
