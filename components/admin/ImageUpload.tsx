'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { X, Loader2, Upload } from 'lucide-react'

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export function ImageUpload({
  value,
  onChange,
  multiple = false,
}: {
  value: string[]
  onChange: (urls: string[]) => void
  multiple?: boolean
}) {
  const [uploading, setUploading] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    if (!CLOUD || !PRESET) {
      toast.error('Thiếu cấu hình Cloudinary.')
      return
    }
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('upload_preset', PRESET)
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
          { method: 'POST', body: fd },
        )
        if (!res.ok) throw new Error('upload failed')
        const json = await res.json()
        uploaded.push(json.secure_url as string)
      }
      onChange(multiple ? [...value, ...uploaded] : uploaded.slice(-1))
    } catch {
      toast.error('Tải ảnh lên thất bại. Vui lòng thử lại.')
    } finally {
      setUploading(false)
    }
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url))
  }

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded border">
              <Image src={url} alt="" fill sizes="96px" className="object-cover" />
              <button
                type="button"
                aria-label="Xoá ảnh"
                onClick={() => remove(url)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-2 text-sm">
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
    </div>
  )
}
