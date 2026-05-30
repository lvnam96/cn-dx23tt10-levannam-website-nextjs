import Link from 'next/link'
import { VISIT_INFO } from '@/lib/visit-info'

export function Footer() {
  return (
    <footer className="bg-footer-bg text-navy-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-gold-400">Đền thờ Bác</h2>
          <p className="mt-2 max-w-xs text-sm text-navy-50/80">
            Khu di tích lịch sử, văn hóa cấp quốc gia — biểu tượng tấm lòng son sắt của
            nhân dân Nam Bộ đối với Bác Hồ.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">Liên kết</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/gioi-thieu" className="hover:text-gold-400">Giới thiệu</Link></li>
            <li><Link href="/hien-vat" className="hover:text-gold-400">Hiện vật</Link></li>
            <li><Link href="/trien-lam" className="hover:text-gold-400">Triển lãm</Link></li>
            <li><Link href="/tin-tuc" className="hover:text-gold-400">Tin tức</Link></li>
            <li><Link href="/dang-ky-tham-quan" className="hover:text-gold-400">Đăng ký tham quan</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">Liên hệ</h3>
          <ul className="mt-3 space-y-2 text-sm text-navy-50/80">
            <li>{VISIT_INFO.address}</li>
            <li>ĐT: {VISIT_INFO.phone}</li>
            <li>Email: {VISIT_INFO.email}</li>
            <li>{VISIT_INFO.hoursShort}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-50/10 py-4 text-center text-xs text-navy-50/60">
        © {new Date().getFullYear()} Đền thờ Bác. Bảo lưu mọi quyền.
      </div>
    </footer>
  )
}
