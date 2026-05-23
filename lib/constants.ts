// Pagination page sizes for public list pages (Day 3).
// POSTS_PER_PAGE = 4 → fits a 1/2/3-column news grid cleanly.
// ARTIFACTS_PER_PAGE = 8 → two full rows in the 4-column artifact grid.
export const POSTS_PER_PAGE = 4
export const ARTIFACTS_PER_PAGE = 8

// Shared category lists — single source for public filters, admin form selects, and seed.
export const ARTIFACT_CATEGORIES = ['Hiện vật gốc', 'Tư liệu', 'Hình ảnh'] as const
export const POST_CATEGORIES = ['Tin tức', 'Sự kiện', 'Nghiên cứu'] as const
