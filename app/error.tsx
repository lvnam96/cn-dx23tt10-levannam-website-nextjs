'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold md:text-4xl">Đã xảy ra lỗi</h1>
      <p className="max-w-md text-muted-foreground">
        Xin lỗi, đã có sự cố xảy ra. Vui lòng thử lại.
      </p>
      <Button onClick={reset} size="lg" className="mt-2">
        Thử lại
      </Button>
    </div>
  )
}
