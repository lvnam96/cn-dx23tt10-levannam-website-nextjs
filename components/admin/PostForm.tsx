'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { Post } from '@prisma/client'
import { postSchema, type PostInput } from '@/lib/validations'
import { POST_CATEGORIES } from '@/lib/constants'
import { slugify } from '@/lib/slugify'
import { createPost, updatePost } from '@/actions/posts'
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

const TiptapEditor = dynamic(
  () => import('@/components/admin/TiptapEditor').then((m) => m.TiptapEditor),
  {
    ssr: false,
    loading: () => <div className="h-[340px] rounded-md border bg-muted" />,
  },
)

export function PostForm({ initialData }: { initialData?: Post }) {
  const router = useRouter()
  const [slugTouched, setSlugTouched] = useState(!!initialData)

  const form = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      excerpt: initialData?.excerpt ?? '',
      category: initialData?.category ?? POST_CATEGORIES[0],
      coverImage: initialData?.coverImage ?? '',
      content: initialData?.content ?? '',
      published: initialData?.published ?? false,
    },
  })

  const title = form.watch('title')
  useEffect(() => {
    if (!slugTouched) form.setValue('slug', slugify(title))
  }, [title, slugTouched, form])

  async function onSubmit(values: PostInput) {
    const result = initialData
      ? await updatePost(initialData.id, values)
      : await createPost(values)
    if ('error' in result) {
      toast.error(result.error)
      return
    }
    toast.success(initialData ? 'Đã cập nhật bài viết.' : 'Đã tạo bài viết.')
    router.push('/admin/posts')
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
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    setSlugTouched(true)
                    field.onChange(e)
                  }}
                />
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
                  {POST_CATEGORIES.map((c) => (
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
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tóm tắt (không bắt buộc)</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <TiptapEditor value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormLabel>Xuất bản</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {initialData ? 'Cập nhật' : 'Tạo bài viết'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/posts')}
          >
            Huỷ
          </Button>
        </div>
      </form>
    </Form>
  )
}
