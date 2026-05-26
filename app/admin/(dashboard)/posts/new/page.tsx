import { PostForm } from '@/components/admin/PostForm'

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Tạo bài viết</h1>
      <PostForm />
    </div>
  )
}
