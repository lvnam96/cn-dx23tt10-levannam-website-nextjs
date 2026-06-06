import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { PostsTable } from '@/components/admin/PostsTable'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: 'desc' } })
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bài viết"
        action={
          <Button asChild>
            <Link href="/admin/posts/new">Tạo bài viết</Link>
          </Button>
        }
      />
      <PostsTable posts={posts} />
    </div>
  )
}
