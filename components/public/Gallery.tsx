'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Lightbox } from './Lightbox'

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-3/2 w-full overflow-hidden rounded-lg bg-muted shadow-md"
        aria-label="Phóng to ảnh"
      >
        <Image src={images[active]} alt={alt} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
        <span className="absolute right-3 top-3 rounded-full bg-navy-950/70 px-3 py-1 text-xs text-navy-50">
          ⌕ Phóng to
        </span>
        <span className="absolute bottom-3 left-3 rounded-full bg-navy-950/70 px-3 py-1 text-xs text-navy-50">
          {active + 1} / {images.length}
        </span>
      </button>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ảnh ${i + 1}`}
              className={cn(
                'relative aspect-square overflow-hidden rounded-md border-2',
                i === active ? 'border-gold-500' : 'border-transparent',
              )}
            >
              <Image src={src} alt={`${alt} — thu nhỏ ${i + 1}`} fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        images={images}
        alt={alt}
        open={open}
        index={active}
        onOpenChange={setOpen}
        onIndexChange={setActive}
      />
    </div>
  )
}
