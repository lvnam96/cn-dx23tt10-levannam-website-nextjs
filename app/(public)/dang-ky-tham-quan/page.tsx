import type { Metadata } from 'next'
import { PageHero } from '@/components/public/PageHero'
import { SectionWrapper } from '@/components/public/SectionWrapper'
import { TourForm } from '@/components/public/TourForm'

export const metadata: Metadata = {
  title: 'Đăng ký tham quan',
  description: 'Đăng ký tham quan theo đoàn tại di tích Đền thờ Bác.',
}

export default function TourRegistrationPage() {
  return (
    <>
      <PageHero
        title="Đăng ký tham quan"
        subtitle="Đăng ký tham quan theo đoàn — chúng tôi sẽ liên hệ xác nhận qua điện thoại."
        image="https://placehold.co/1920x600.png?text=Dang+ky+tham+quan"
        size="sm"
      />
      <SectionWrapper>
        <div className="mx-auto max-w-xl">
          <TourForm />
        </div>
      </SectionWrapper>
    </>
  )
}
