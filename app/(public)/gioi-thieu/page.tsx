import type { Metadata } from 'next'
import heroImg from '@/assets/images/den_tho_bac_002.jpg'
import architectureImg from '@/assets/images/den_tho_bac_003.jpg'
import Link from 'next/link'
import Image from 'next/image'
import { PageHero } from '@/components/public/PageHero'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { SectionHeader } from '@/components/public/SectionHeader'
import { Timeline } from '@/components/public/Timeline'
import { StatStrip } from '@/components/public/StatStrip'
import { QuoteBand } from '@/components/public/QuoteBand'
import { CrossLinkCards } from '@/components/public/CrossLinkCards'
import { MapEmbed } from '@/components/public/MapEmbed'
import { SITE_STATS, SITE_TIMELINE, VISIT_INFO } from '@/lib/visit-info'

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description: 'Lịch sử hình thành, kiến trúc và thông tin tham quan Đền thờ Chủ tịch Hồ Chí Minh tại Trà Vinh.',
  openGraph: {
    title: 'Giới thiệu | Đền thờ Bác',
    description: 'Lịch sử hình thành, kiến trúc và thông tin tham quan.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Di tích quốc gia"
        title="Giới thiệu"
        subtitle="Lịch sử, kiến trúc và ý nghĩa của khu di tích."
        image={heroImg}
        size="sm"
      />

      <SectionWrapper>
        <SectionHeader index="01" eyebrow="Câu chuyện" title="Ngôi đền dựng nên từ lòng dân" />
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-muted-foreground">
          <p>
            Đầu tháng 9/1969, nghe tin Chủ tịch Hồ Chí Minh qua đời, nhân dân xã Long Đức lập bàn
            thờ tưởng nhớ Bác. Tháng 3/1970, Thị ủy Trà Vinh chủ trương dựng đền thờ tại ấp Vĩnh Hội.
          </p>
          <p>
            Đền được xây dựng ngay trong vùng tranh chấp, cách đồn địch khoảng 1 km — toàn bộ quá
            trình thi công thực hiện vào ban đêm. Ba lần bị bom đạn tàn phá, ba lần nhân dân lại dựng
            lại, cho đến ngày đất nước thống nhất.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="muted">
        <SectionHeader index="02" eyebrow="Dòng thời gian" title="Xây & giữ giữa bom đạn" />
        <Timeline items={SITE_TIMELINE} />
      </SectionWrapper>

      <SectionWrapper>
        <SectionHeader index="03" eyebrow="Kiến trúc & khuôn viên" title="Khu di tích 5,4 ha" />
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-muted">
            <Image src={architectureImg} alt="Khuôn viên khu di tích" fill className="object-cover" />
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li>◆ Điện thờ mái hình hoa sen</li>
            <li>◆ Nhà trưng bày thân thế &amp; sự nghiệp Chủ tịch Hồ Chí Minh</li>
            <li>◆ Mô hình Nhà sàn Bác Hồ (tỷ lệ 97% so với nguyên bản Hà Nội)</li>
            <li>◆ Ao cá, vườn cây xanh, khu vui chơi &amp; cắm trại</li>
            <li>◆ Khu trưng bày máy bay, pháo thu được từ chiến trường</li>
          </ul>
        </div>
      </SectionWrapper>

      <StatStrip stats={SITE_STATS} />

      <QuoteBand
        quote="Ngôi đền này là biểu tượng bất diệt, tấm lòng sắt son của nhân dân Nam Bộ đối với Bác Hồ."
        by="Đại tướng Võ Nguyên Giáp (bút tích tại đền, 1991)"
      />

      <SectionWrapper>
        <SectionHeader index="04" eyebrow="Thông tin tham quan" title="Ghé thăm khu di tích" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <MapEmbed className="h-72 w-full rounded-lg border border-border" />
          <div className="space-y-2 text-muted-foreground">
            <p><span className="font-semibold text-foreground">Địa chỉ:</span> {VISIT_INFO.address}</p>
            <p><span className="font-semibold text-foreground">Giờ mở cửa:</span> {VISIT_INFO.hoursShort}</p>
            <p><span className="font-semibold text-foreground">Vé:</span> {VISIT_INFO.ticket}</p>
            <p><span className="font-semibold text-foreground">Điện thoại:</span> {VISIT_INFO.phone}</p>
            <Link href="/dang-ky-tham-quan" className="inline-block pt-2 font-medium text-red hover:underline">
              Đăng ký tham quan đoàn →
            </Link>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="muted">
        <SectionHeader eyebrow="Khám phá tiếp" title="Tìm hiểu thêm" />
        <CrossLinkCards
          links={[
            { href: '/hien-vat', title: 'Hiện vật', description: 'Bộ sưu tập của khu di tích.', icon: '🏺' },
            { href: '/trien-lam', title: 'Triển lãm', description: 'Các chuyên đề đang diễn ra.', icon: '🖼️' },
            { href: '/tin-tuc', title: 'Tin tức', description: 'Sự kiện & thông báo mới.', icon: '📰' },
            { href: '/lien-he', title: 'Liên hệ', description: 'Địa chỉ, điện thoại, bản đồ.', icon: '✉️' },
          ]}
        />
      </SectionWrapper>
    </>
  )
}
