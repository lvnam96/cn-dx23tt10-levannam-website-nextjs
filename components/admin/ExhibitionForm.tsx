'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { Artifact, Exhibition } from '@prisma/client'
import { exhibitionSchema, type ExhibitionInput } from '@/lib/validations'
import { createExhibition, updateExhibition } from '@/actions/exhibitions'
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
import { ImageUpload } from '@/components/admin/ImageUpload'

function toDateInput(d: Date): string {
  return new Date(d).toISOString().split('T')[0]
}

export function ExhibitionForm({
  artifacts,
  initialData,
}: {
  artifacts: Artifact[]
  initialData?: Exhibition & { artifactIds: string[] }
}) {
  const router = useRouter()
  const form = useForm<ExhibitionInput>({
    resolver: zodResolver(exhibitionSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      startDate: initialData ? toDateInput(initialData.startDate) : '',
      endDate: initialData ? toDateInput(initialData.endDate) : '',
      coverImage: initialData?.coverImage ?? '',
      artifactIds: initialData?.artifactIds ?? [],
    },
  })

  async function onSubmit(values: ExhibitionInput) {
    const result = initialData
      ? await updateExhibition(initialData.id, values)
      : await createExhibition(values)
    if ('error' in result) {
      toast.error(result.error)
      return
    }
    toast.success(initialData ? 'Đã cập nhật triển lãm.' : 'Đã tạo triển lãm.')
    router.push('/admin/exhibitions')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-3xl flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ảnh bìa</FormLabel>
              <ImageUpload
                value={field.value ? [field.value] : []}
                onChange={(urls) => field.onChange(urls[0] ?? '')}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="artifactIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hiện vật trong triển lãm</FormLabel>
              <div className="max-h-64 overflow-y-auto rounded-md border p-3">
                {artifacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Chưa có hiện vật nào.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {artifacts.map((a) => (
                      <label key={a.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="size-4 accent-primary"
                          checked={field.value.includes(a.id)}
                          onChange={(e) =>
                            field.onChange(
                              e.target.checked
                                ? [...field.value, a.id]
                                : field.value.filter((id) => id !== a.id),
                            )
                          }
                        />
                        {a.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {initialData ? 'Cập nhật' : 'Tạo triển lãm'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/exhibitions')}
          >
            Huỷ
          </Button>
        </div>
      </form>
    </Form>
  )
}
