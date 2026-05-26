import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { PostsTable } from '@/components/admin/PostsTable'

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: 'desc' } })
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bài viết</h1>
        <Button asChild>
          <Link href="/admin/posts/new">Tạo bài viết</Link>
        </Button>
      </div>
      <PostsTable posts={posts} />
    </div>
  )
}
