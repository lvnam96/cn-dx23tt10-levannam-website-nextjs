'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { postSchema, type PostInput } from '@/lib/validations'
import { revalidatePost } from '@/lib/revalidate'

type Result = { success: true } | { error: string }

async function isAdmin(): Promise<boolean> {
  const session = await auth()
  return !!session?.user
}

export async function createPost(input: PostInput): Promise<Result> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }
  const parsed = postSchema.safeParse(input)
  if (!parsed.success) return { error: 'Dữ liệu không hợp lệ.' }
  const data = parsed.data

  const existing = await prisma.post.findUnique({ where: { slug: data.slug } })
  if (existing) return { error: 'Slug đã tồn tại.' }

  try {
    await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        category: data.category,
        excerpt: data.excerpt || null,
        coverImage: data.coverImage || null,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
      },
    })
  } catch {
    return { error: 'Không thể tạo bài viết.' }
  }
  revalidatePost()
  return { success: true }
}

export async function updatePost(id: string, input: PostInput): Promise<Result> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }
  const parsed = postSchema.safeParse(input)
  if (!parsed.success) return { error: 'Dữ liệu không hợp lệ.' }
  const data = parsed.data

  const clash = await prisma.post.findFirst({
    where: { slug: data.slug, NOT: { id } },
  })
  if (clash) return { error: 'Slug đã tồn tại.' }

  const current = await prisma.post.findUnique({ where: { id } })
  if (!current) return { error: 'Không tìm thấy bài viết.' }

  // Set publishedAt only on the unpublished → published transition; preserve otherwise.
  const publishedAt = data.published
    ? (current.publishedAt ?? new Date())
    : null

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        category: data.category,
        excerpt: data.excerpt || null,
        coverImage: data.coverImage || null,
        published: data.published,
        publishedAt,
      },
    })
  } catch {
    return { error: 'Không thể cập nhật bài viết.' }
  }
  revalidatePost()
  return { success: true }
}

export async function deletePost(id: string): Promise<Result> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }
  try {
    await prisma.post.delete({ where: { id } })
  } catch {
    return { error: 'Không thể xoá bài viết.' }
  }
  revalidatePost()
  return { success: true }
}
