'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { Artifact, Room } from '@prisma/client'
import { artifactSchema, type ArtifactInput } from '@/lib/validations'
import { ARTIFACT_CATEGORIES } from '@/lib/constants'
import { createArtifact, updateArtifact } from '@/actions/artifacts'
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
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUpload } from '@/components/admin/ImageUpload'

export function ArtifactForm({
  rooms,
  initialData,
}: {
  rooms: Room[]
  initialData?: Artifact
}) {
  const router = useRouter()
  const form = useForm<ArtifactInput>({
    resolver: zodResolver(artifactSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      category: initialData?.category ?? ARTIFACT_CATEGORIES[0],
      roomId: initialData?.roomId ?? '',
      featured: initialData?.featured ?? false,
      images: initialData?.images ?? [],
    },
  })

  async function onSubmit(values: ArtifactInput) {
    const result = initialData
      ? await updateArtifact(initialData.id, values)
      : await createArtifact(values)
    if ('error' in result) {
      toast.error(result.error)
      return
    }
    toast.success(initialData ? 'Đã cập nhật hiện vật.' : 'Đã tạo hiện vật.')
    router.push('/admin/artifacts')
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
              <FormLabel>Tên hiện vật</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ARTIFACT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(v === 'none' ? '' : v)}
                value={field.value || 'none'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Không có phòng</SelectItem>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh (ảnh đầu tiên là ảnh bìa)</FormLabel>
              <ImageUpload multiple value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-3">
              <FormLabel>Nổi bật (hiển thị trang chủ)</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {initialData ? 'Cập nhật' : 'Tạo hiện vật'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/artifacts')}
          >
            Huỷ
          </Button>
        </div>
      </form>
    </Form>
  )
}
