import type { Metadata } from 'next'
import { PageHero } from '@/components/public/PageHero'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { ContactForm } from '@/components/public/ContactForm'

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ với Ban quản lý di tích Đền thờ Bác.',
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Liên hệ"
        subtitle="Gửi câu hỏi hoặc góp ý tới Ban quản lý di tích."
        image="https://placehold.co/1920x600.png?text=Lien+he"
        size="sm"
      />
      <SectionWrapper>
        <div className="grid gap-10 md:grid-cols-2">
          <ContactForm />
          <div className="flex flex-col gap-4">
            <div className="aspect-video overflow-hidden rounded-lg border">
              <iframe
                title="Bản đồ di tích"
                src="https://maps.google.com/maps?q=Den+tho+Bac&output=embed"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Địa chỉ: (cập nhật địa chỉ thực tế của di tích)</p>
              <p>Điện thoại: (cập nhật số điện thoại)</p>
              <p>Giờ mở cửa: 8:00 – 17:00 hằng ngày</p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  )
}
