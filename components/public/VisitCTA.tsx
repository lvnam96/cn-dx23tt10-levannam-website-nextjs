import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { VISIT_INFO } from '@/lib/visit-info'

export function VisitCTA() {
  return (
    <section className="bg-gradient-to-br from-navy-900 to-navy-950 text-navy-50">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 md:py-20">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">Về thăm Đền thờ Bác</h2>
        <p className="mt-3 text-navy-50/80">
          {VISIT_INFO.hoursShort} · {VISIT_INFO.ticket}
          <br />
          {VISIT_INFO.address}
        </p>
        <Button asChild size="lg" className="mt-6 h-12 px-6 text-base">
          <Link href="/dang-ky-tham-quan">Đăng ký tham quan →</Link>
        </Button>
      </div>
    </section>
  )
}
