'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import type { TourStatus } from '@prisma/client'
import { updateTourStatus } from '@/actions/tour-groups'
import { TOUR_STATUSES, TOUR_STATUS_LABELS } from '@/lib/tour-status'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function TourStatusSelect({
  id,
  status,
}: {
  id: string
  status: TourStatus
}) {
  const [isPending, startTransition] = useTransition()

  function onValueChange(value: string) {
    startTransition(async () => {
      const result = await updateTourStatus(id, value)
      if ('error' in result) toast.error(result.error)
      else toast.success('Đã cập nhật trạng thái.')
    })
  }

  return (
    <Select value={status} onValueChange={onValueChange} disabled={isPending}>
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TOUR_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {TOUR_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
