'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { tourGroupSchema, type TourGroupInput } from '@/lib/validations'
import { createTourGroup } from '@/actions/tour-groups'
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

const TODAY = new Date().toISOString().split('T')[0]

export function TourForm() {
  const [submitted, setSubmitted] = useState(false)
  const honeypot = useRef<HTMLInputElement>(null)
  const form = useForm<TourGroupInput>({
    resolver: zodResolver(tourGroupSchema),
    defaultValues: {
      groupName: '',
      contactName: '',
      phone: '',
      date: '',
      size: '',
      note: '',
    },
  })

  async function onSubmit(values: TourGroupInput) {
    const result = await createTourGroup({
      ...values,
      website: honeypot.current?.value,
    })
    if ('error' in result) {
      toast.error(result.error)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-md border bg-muted p-6 text-center">
        <p className="font-medium">Cảm ơn bạn đã đăng ký tham quan.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Chúng tôi sẽ liên hệ qua điện thoại để xác nhận thông tin.
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          ref={honeypot}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
        />
        <FormField
          control={form.control}
          name="groupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đoàn</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Người liên hệ</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày tham quan</FormLabel>
              <FormControl>
                <Input type="date" min={TODAY} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng khách</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú (không bắt buộc)</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Gửi đăng ký
        </Button>
      </form>
    </Form>
  )
}
