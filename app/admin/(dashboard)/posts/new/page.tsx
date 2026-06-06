import { PostForm } from '@/components/admin/PostForm'
import { PageHeader } from '@/components/admin/PageHeader'

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Tạo bài viết" backHref="/admin/posts" backLabel="Bài viết" />
      <PostForm />
    </div>
  )
}
