'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function DeleteButton({
  onDelete,
  itemName,
  description,
}: {
  onDelete: () => Promise<{ success: true } | { error: string }>
  itemName?: string
  description?: string
}) {
  const [isPending, startTransition] = useTransition()

  function confirmDelete() {
    startTransition(async () => {
      const result = await onDelete()
      if ('error' in result) toast.error(result.error)
      else toast.success('Đã xoá thành công.')
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending} aria-label="Xoá">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xoá?</AlertDialogTitle>
          <AlertDialogDescription>
            {itemName ? `Xoá "${itemName}". ` : ''}
            {description ?? 'Hành động này không thể hoàn tác.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete}>Xoá</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
