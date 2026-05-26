'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { artifactSchema, type ArtifactInput } from '@/lib/validations'

type Result = { success: true } | { error: string }

async function isAdmin(): Promise<boolean> {
  const session = await auth()
  return !!session?.user
}

function revalidateArtifacts() {
  revalidatePath('/admin/artifacts')
  revalidatePath('/hien-vat')
  revalidatePath('/')
}

export async function createArtifact(input: ArtifactInput): Promise<Result> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }
  const parsed = artifactSchema.safeParse(input)
  if (!parsed.success) return { error: 'Dữ liệu không hợp lệ.' }
  const data = parsed.data
  try {
    await prisma.artifact.create({
      data: {
        name: data.name,
        category: data.category,
        description: data.description || null,
        roomId: data.roomId || null,
        featured: data.featured,
        images: data.images,
      },
    })
  } catch {
    return { error: 'Không thể tạo hiện vật.' }
  }
  revalidateArtifacts()
  return { success: true }
}

export async function updateArtifact(
  id: string,
  input: ArtifactInput,
): Promise<Result> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }
  const parsed = artifactSchema.safeParse(input)
  if (!parsed.success) return { error: 'Dữ liệu không hợp lệ.' }
  const data = parsed.data
  try {
    await prisma.artifact.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        description: data.description || null,
        roomId: data.roomId || null,
        featured: data.featured,
        images: data.images,
      },
    })
  } catch {
    return { error: 'Không thể cập nhật hiện vật.' }
  }
  revalidateArtifacts()
  return { success: true }
}

export async function deleteArtifact(id: string): Promise<Result> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }
  try {
    await prisma.artifact.delete({ where: { id } })
  } catch {
    return { error: 'Không thể xoá hiện vật.' }
  }
  revalidateArtifacts()
  return { success: true }
}
