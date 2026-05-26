import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PostForm } from '@/components/admin/PostForm'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) notFound()
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Sửa bài viết</h1>
      <PostForm initialData={post} />
    </div>
  )
}
