import type { Metadata } from 'next'
import heroImg from '@/assets/images/den_tho_bac_006.jpg'
import { PageHero } from '@/components/public/PageHero'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { SectionHeader } from '@/components/public/SectionHeader'
import { MapEmbed } from '@/components/public/MapEmbed'
import { CrossLinkCards } from '@/components/public/CrossLinkCards'
import { ContactForm } from '@/components/public/ContactForm'
import { VISIT_INFO } from '@/lib/visit-info'

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Thông tin liên hệ Ban quản lý Khu di tích Đền thờ Chủ tịch Hồ Chí Minh.',
}

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Kết nối" title="Liên hệ" subtitle="Thông tin liên hệ và vị trí khu di tích." image={heroImg} size="sm" />

      <SectionWrapper>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-paper-card p-6 text-center"><div className="text-2xl">📍</div><h3 className="mt-2 font-heading font-semibold">Địa chỉ</h3><p className="mt-1 text-sm text-muted-foreground">{VISIT_INFO.address}</p></div>
          <div className="rounded-lg bg-paper-card p-6 text-center"><div className="text-2xl">📞</div><h3 className="mt-2 font-heading font-semibold">Điện thoại</h3><p className="mt-1 text-sm text-muted-foreground">{VISIT_INFO.phone}</p></div>
          <div className="rounded-lg bg-paper-card p-6 text-center"><div className="text-2xl">✉️</div><h3 className="mt-2 font-heading font-semibold">Email</h3><p className="mt-1 text-sm text-muted-foreground">{VISIT_INFO.email}</p></div>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="muted">
        <SectionHeader eyebrow="Gửi lời nhắn" title="Liên hệ với chúng tôi" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-paper-card p-6"><ContactForm /></div>
          <MapEmbed className="h-full min-h-72 w-full rounded-lg border border-border" />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <SectionHeader eyebrow="Chuẩn bị cho chuyến thăm" title="Có thể bạn cần" />
        <CrossLinkCards
          links={[
            { href: '/dang-ky-tham-quan', title: 'Đăng ký tham quan', description: 'Giờ mở cửa, quy định, đăng ký đoàn.', icon: '🎟️' },
            { href: '/gioi-thieu', title: 'Lịch sử ngôi đền', description: 'Tìm hiểu về khu di tích.', icon: '📖' },
            { href: '/hien-vat', title: 'Hiện vật', description: 'Bộ sưu tập của khu di tích.', icon: '🏺' },
          ]}
        />
      </SectionWrapper>
    </>
  )
}
