/**
 * Format a date for Vietnamese UI, e.g. "5 tháng 6, 2026".
 * Shared by post + exhibition cards (Day 2) and list/detail pages (Days 3–6).
 */
export function formatDateVi(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
