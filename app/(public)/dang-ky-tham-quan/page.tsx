import type { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { SectionWrapper } from '@/components/public/SectionWrapper';
import { SectionHeader } from '@/components/public/SectionHeader';
import { MapEmbed } from '@/components/public/MapEmbed';
import { FaqAccordion } from '@/components/public/FaqAccordion';
import { CrossLinkCards } from '@/components/public/CrossLinkCards';
import { TourForm } from '@/components/public/TourForm';
import { VISIT_INFO } from '@/lib/visit-info';

export const metadata: Metadata = {
  title: 'Đăng ký tham quan',
  description: 'Đăng ký tham quan đoàn tại di tích Đền thờ Bác — giờ mở cửa, quy định, bản đồ.',
};

export default function TourPage() {
  return (
    <>
      <PageHero
        eyebrow="Kế hoạch chuyến thăm"
        title="Đăng ký tham quan"
        subtitle="Thông tin chuẩn bị và đăng ký cho đoàn."
        image="https://placehold.co/1920x800.png?text=Tham+quan"
        size="sm"
      />

      <SectionWrapper>
        <SectionHeader index="01" eyebrow="Chuẩn bị" title="Trước khi đến" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-paper-card p-5">
            <h3 className="font-heading font-semibold">🕗 Giờ mở cửa</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {VISIT_INFO.hoursShort} · {VISIT_INFO.ticket}
            </p>
          </div>
          <div className="rounded-lg bg-paper-card p-5">
            <h3 className="font-heading font-semibold">👔 Trang phục & quy định</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ăn mặc lịch sự, giữ trang nghiêm trong điện thờ; không hái hoa, bẻ cành.
            </p>
          </div>
          <div className="rounded-lg bg-paper-card p-5">
            <h3 className="font-heading font-semibold">📍 Vị trí</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {VISIT_INFO.address} — cách trung tâm TP Trà Vinh khoảng 4 km.
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="muted">
        <SectionHeader index="02" eyebrow="Đăng ký đoàn" title="Gửi thông tin đăng ký" />
        <div className="rounded-lg bg-paper-card p-6 md:p-8">
          <TourForm />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <SectionHeader index="03" eyebrow="Đường đi" title="Bản đồ khu di tích" />
        <MapEmbed className="h-80 w-full rounded-lg border border-border" />
      </SectionWrapper>

      <SectionWrapper variant="muted">
        <SectionHeader index="04" eyebrow="Câu hỏi thường gặp" title="Giải đáp nhanh" />
        <FaqAccordion
          items={[
            { q: 'Có mất phí tham quan không?', a: 'Khu di tích mở cửa tự do, vào cửa miễn phí cho mọi du khách.' },
            {
              q: 'Đoàn đông cần đặt trước bao lâu?',
              a: 'Nên đăng ký trước vài ngày để Ban quản lý sắp xếp đón tiếp; chúng tôi sẽ liên hệ lại qua điện thoại để xác nhận.',
            },
            {
              q: 'Có khu vực cho học sinh, sinh viên không?',
              a: 'Có khu vui chơi và cắm trại trong khuôn viên 5,4 ha, phù hợp cho các đoàn tham quan giáo dục.',
            },
          ]}
        />
      </SectionWrapper>

      <SectionWrapper>
        <SectionHeader eyebrow="Trong khi chờ, khám phá" title="Những gì bạn sẽ gặp" />
        <CrossLinkCards
          links={[
            { href: '/hien-vat', title: 'Hiện vật', description: 'Xem trước bộ sưu tập.', icon: '🏺' },
            { href: '/trien-lam', title: 'Triển lãm', description: 'Các chuyên đề đang diễn ra.', icon: '🖼️' },
            {
              href: '/lien-he',
              title: 'Liên hệ',
              description: 'Cần hỗ trợ thêm?',
              icon: '✉️',
              linkText: 'Hãy cho chúng tôi biết',
            },
          ]}
        />
      </SectionWrapper>
    </>
  );
}
