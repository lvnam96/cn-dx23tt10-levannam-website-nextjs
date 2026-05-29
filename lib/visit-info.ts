// Real data for the Trà Vinh memorial site (see docs/content-media-guide.md).
export const VISIT_INFO = {
  name: 'Đền thờ Chủ tịch Hồ Chí Minh',
  address: 'Ấp Vĩnh Hội, phường Long Đức, TP Trà Vinh, tỉnh Vĩnh Long',
  phone: '(0294) 3 855.369',
  email: 'bqlditich@travinh.gov.vn',
  hoursShort: 'Hằng ngày · 7:30–11:30, 13:30–17:00',
  ticket: 'Vào cửa miễn phí',
  // Google Maps embed centered on 9.9837, 106.330134
  mapSrc:
    'https://www.google.com/maps?q=9.9837,106.330134&z=16&output=embed',
} as const

export const SITE_STATS: { value: string; label: string }[] = [
  { value: '1971', label: 'Khánh thành lần đầu' },
  { value: '1989', label: 'Di tích quốc gia' },
  { value: '5,4 ha', label: 'Khuôn viên' },
  { value: '100.000+', label: 'Lượt khách / năm' },
]

export const SITE_TIMELINE: { year: string; caption: string }[] = [
  { year: '1969', caption: 'Bác mất — nhân dân Long Đức lập bàn thờ tưởng nhớ' },
  { year: '1970', caption: 'Khởi công xây dựng, thi công hoàn toàn về đêm' },
  { year: '1971', caption: 'Khánh thành lần đầu (đền tre, nứa, lá)' },
  { year: '1972', caption: 'Dựng lại sau khi bị bom phá' },
  { year: '1975', caption: 'Bị phá lần ba — đất nước thống nhất' },
  { year: '1989', caption: 'Công nhận Di tích lịch sử, văn hóa cấp quốc gia' },
]
