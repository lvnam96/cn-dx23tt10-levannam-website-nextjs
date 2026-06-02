'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Lightbox } from './Lightbox'

export function PhotoMosaic({ images, alt = 'Khuôn viên khu di tích' }: { images: string[]; alt?: string }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const shown = images.slice(0, 5)

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
        {shown.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => {
              setIndex(i)
              setOpen(true)
            }}
            aria-label={`Mở ảnh ${i + 1}`}
            className={cn(
              'relative overflow-hidden rounded-lg',
              i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'aspect-square',
            )}
          >
            <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-300 hover:scale-105" />
          </button>
        ))}
      </div>
      <Lightbox images={shown} alt={alt} open={open} index={index} onOpenChange={setOpen} onIndexChange={setIndex} />
    </>
  )
}
