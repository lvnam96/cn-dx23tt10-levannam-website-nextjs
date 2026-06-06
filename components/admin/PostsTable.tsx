import Link from 'next/link'
import { FileText } from 'lucide-react'
import type { Post } from '@prisma/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateVi } from '@/lib/format'
import { deletePost } from '@/actions/posts'
import { DeleteButton } from '@/components/admin/DeleteButton'

export function PostsTable({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
        <FileText className="size-10 opacity-30" />
        <p className="text-sm">Chưa có bài viết nào.</p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Cập nhật</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.title}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>
                {p.published ? (
                  <Badge>Đã xuất bản</Badge>
                ) : (
                  <Badge variant="secondary">Bản nháp</Badge>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap">{formatDateVi(p.updatedAt)}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/posts/${p.id}/edit`}>Sửa</Link>
                </Button>
                <DeleteButton onDelete={deletePost.bind(null, p.id)} itemName={p.title} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
