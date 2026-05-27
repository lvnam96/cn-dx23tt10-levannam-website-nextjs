'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { Room } from '@prisma/client'
import { roomSchema, type RoomInput } from '@/lib/validations'
import { createRoom, updateRoom } from '@/actions/rooms'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export function RoomForm({ initialData }: { initialData?: Room }) {
  const router = useRouter()
  const form = useForm<RoomInput>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
    },
  })

  async function onSubmit(values: RoomInput) {
    const result = initialData
      ? await updateRoom(initialData.id, values)
      : await createRoom(values)
    if ('error' in result) {
      toast.error(result.error)
      return
    }
    toast.success(initialData ? 'Đã cập nhật phòng.' : 'Đã tạo phòng.')
    router.push('/admin/rooms')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-3xl flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên phòng</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả (không bắt buộc)</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {initialData ? 'Cập nhật' : 'Tạo phòng'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/rooms')}
          >
            Huỷ
          </Button>
        </div>
      </form>
    </Form>
  )
}
