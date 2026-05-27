'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { exhibitionSchema, type ExhibitionInput } from '@/lib/validations'
import { revalidateExhibition } from '@/lib/revalidate'

type Result = { success: true } | { error: string }

async function isAdmin(): Promise<boolean> {
  const session = await auth()
  return !!session?.user
}

export async function createExhibition(input: ExhibitionInput): Promise<Result> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }
  const parsed = exhibitionSchema.safeParse(input)
  if (!parsed.success) return { error: 'Dữ liệu không hợp lệ.' }
  const data = parsed.data
  const artifactIds = [...new Set(data.artifactIds)] // guard against duplicate join rows
  try {
    await prisma.exhibition.create({
      data: {
        title: data.title,
        description: data.description || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        coverImage: data.coverImage || null,
        artifacts: { create: artifactIds.map((artifactId) => ({ artifactId })) },
      },
    })
  } catch {
    return { error: 'Không thể tạo triển lãm.' }
  }
  revalidateExhibition()
  return { success: true }
}

export async function updateExhibition(
  id: string,
  input: ExhibitionInput,
): Promise<Result> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }
  const parsed = exhibitionSchema.safeParse(input)
  if (!parsed.success) return { error: 'Dữ liệu không hợp lệ.' }
  const data = parsed.data
  const artifactIds = [...new Set(data.artifactIds)] // guard against duplicate join rows
  try {
    // Re-sync the join table: drop all links, then recreate from the submitted set.
    await prisma.$transaction([
      prisma.artifactOnExhibition.deleteMany({ where: { exhibitionId: id } }),
      prisma.exhibition.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description || null,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          coverImage: data.coverImage || null,
          artifacts: { create: artifactIds.map((artifactId) => ({ artifactId })) },
        },
      }),
    ])
  } catch {
    return { error: 'Không thể cập nhật triển lãm.' }
  }
  revalidateExhibition()
  return { success: true }
}

export async function deleteExhibition(id: string): Promise<Result> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }
  // ArtifactOnExhibition rows cascade on delete (onDelete: Cascade).
  try {
    await prisma.exhibition.delete({ where: { id } })
  } catch {
    return { error: 'Không thể xoá triển lãm.' }
  }
  revalidateExhibition()
  return { success: true }
}
