import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PostForm } from '@/components/admin/PostForm'
import { PageHeader } from '@/components/admin/PageHeader'

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
      <PageHeader title="Sửa bài viết" backHref="/admin/posts" backLabel="Bài viết" />
      <PostForm initialData={post} />
    </div>
  )
}
