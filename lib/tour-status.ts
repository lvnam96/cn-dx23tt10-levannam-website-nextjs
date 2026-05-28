import type { TourStatus } from '@prisma/client'

export const TOUR_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const

export const TOUR_STATUS_LABELS: Record<TourStatus, string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
}

// Free-flip model: any real status is a valid target (see Day 6 design §1.3).
export function isValidStatus(value: string): value is TourStatus {
  return (TOUR_STATUSES as readonly string[]).includes(value)
}
