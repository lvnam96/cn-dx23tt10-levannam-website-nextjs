import { VISIT_INFO } from '@/lib/visit-info'

export function MapEmbed({ className }: { className?: string }) {
  return (
    <iframe
      title="Bản đồ Đền thờ Chủ tịch Hồ Chí Minh"
      src={VISIT_INFO.mapSrc}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={className ?? 'h-full min-h-64 w-full rounded-lg border border-border'}
    />
  )
}
