'use client'

import { useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Dialog } from 'radix-ui'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export function Lightbox({
  images,
  alt,
  open,
  index,
  onOpenChange,
  onIndexChange,
}: {
  images: string[]
  alt: string
  open: boolean
  index: number
  onOpenChange: (open: boolean) => void
  onIndexChange: (i: number) => void
}) {
  const prev = useCallback(
    () => onIndexChange((index - 1 + images.length) % images.length),
    [index, images.length, onIndexChange],
  )
  const next = useCallback(
    () => onIndexChange((index + 1) % images.length),
    [index, images.length, onIndexChange],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, prev, next])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/90" />
        <Dialog.Content aria-describedby={undefined} className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none">
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Đóng"
            className="absolute right-4 top-4 rounded-full bg-navy-50/10 p-2 text-navy-50 hover:bg-navy-50/20"
          >
            <X className="size-6" />
          </button>
          {images.length > 1 && (
            <button
              type="button"
              onClick={prev}
              aria-label="Ảnh trước"
              className="absolute left-4 rounded-full bg-navy-50/10 p-2 text-navy-50 hover:bg-navy-50/20"
            >
              <ChevronLeft className="size-7" />
            </button>
          )}
          <div className="relative h-[80vh] w-full max-w-5xl">
            <Image src={images[index]} alt={`${alt} — ${index + 1}`} fill sizes="100vw" className="object-contain" />
          </div>
          {images.length > 1 && (
            <button
              type="button"
              onClick={next}
              aria-label="Ảnh sau"
              className="absolute right-4 rounded-full bg-navy-50/10 p-2 text-navy-50 hover:bg-navy-50/20"
            >
              <ChevronRight className="size-7" />
            </button>
          )}
          <div className="absolute bottom-5 rounded-full bg-navy-950/70 px-3 py-1 text-sm text-navy-50">
            {index + 1} / {images.length}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
