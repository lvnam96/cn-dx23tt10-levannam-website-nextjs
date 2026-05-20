import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
  pageParam = 'page',
}: {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string>
  pageParam?: string
}) {
  if (totalPages <= 1) return null

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  // Absolute href (basePath + query): unambiguous from an RSC (no usePathname),
  // and merges existing filters so paging never drops them.
  const buildHref = (n: number) => {
    const params = new URLSearchParams(searchParams)
    params.set(pageParam, String(n))
    return `${basePath}?${params.toString()}`
  }

  const edge = 'h-11 px-5'
  const disabledEdge = cn(
    edge,
    'inline-flex items-center rounded-lg border border-border text-sm text-muted-foreground opacity-50',
  )

  return (
    <nav
      aria-label="Phân trang"
      className="mt-10 flex items-center justify-center gap-3"
    >
      {hasPrev ? (
        <Button asChild variant="outline" className={edge}>
          <Link href={buildHref(currentPage - 1)} rel="prev">
            ← Trang trước
          </Link>
        </Button>
      ) : (
        <span aria-disabled="true" className={disabledEdge}>
          ← Trang trước
        </span>
      )}

      <span className="text-sm text-muted-foreground">
        Trang {currentPage} / {totalPages}
      </span>

      {hasNext ? (
        <Button asChild variant="outline" className={edge}>
          <Link href={buildHref(currentPage + 1)} rel="next">
            Trang sau →
          </Link>
        </Button>
      ) : (
        <span aria-disabled="true" className={disabledEdge}>
          Trang sau →
        </span>
      )}
    </nav>
  )
}
