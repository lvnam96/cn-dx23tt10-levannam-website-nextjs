// Single source of truth for exhibition status (derived from its date range).
// Used by ExhibitionCard, the exhibitions list, and the exhibition detail page.

export type ExhibitionState = 'upcoming' | 'current' | 'past'

export function getExhibitionState(
  startDate: Date,
  endDate: Date,
  now: number = Date.now(),
): ExhibitionState {
  if (startDate.getTime() > now) return 'upcoming'
  if (endDate.getTime() < now) return 'past'
  return 'current'
}

export const EXHIBITION_STATUS_META: Record<
  ExhibitionState,
  { label: string; className: string }
> = {
  upcoming: { label: 'Sắp diễn ra', className: 'bg-gold-400 text-navy-950' },
  current: { label: 'Đang diễn ra', className: 'bg-navy-900 text-navy-50' },
  past: { label: 'Đã kết thúc', className: 'bg-navy-100 text-navy-700' },
}

export function getExhibitionStatus(startDate: Date, endDate: Date) {
  const state = getExhibitionState(startDate, endDate)
  return { state, ...EXHIBITION_STATUS_META[state] }
}
