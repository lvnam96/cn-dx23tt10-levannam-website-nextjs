'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { roomSchema, type RoomInput } from '@/lib/validations'
import { revalidateRoom } from '@/lib/revalidate'

type Result = { success: true } | { error: string }

async function isAdmin(): Promise<boolean> {
  const session = await auth()
  return !!session?.user
}

export async function createRoom(input: RoomInput): Promise<Result> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }
  const parsed = roomSchema.safeParse(input)
  if (!parsed.success) return { error: 'Dữ liệu không hợp lệ.' }
  try {
    await prisma.room.create({
      data: { name: parsed.data.name, description: parsed.data.description || null },
    })
  } catch {
    return { error: 'Không thể tạo phòng.' }
  }
  revalidateRoom()
  return { success: true }
}

export async function updateRoom(id: string, input: RoomInput): Promise<Result> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }
  const parsed = roomSchema.safeParse(input)
  if (!parsed.success) return { error: 'Dữ liệu không hợp lệ.' }
  try {
    await prisma.room.update({
      where: { id },
      data: { name: parsed.data.name, description: parsed.data.description || null },
    })
  } catch {
    return { error: 'Không thể cập nhật phòng.' }
  }
  revalidateRoom()
  return { success: true }
}

export async function deleteRoom(id: string): Promise<Result> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }
  // Artifact.roomId is onDelete: SetNull → artifacts survive, become room-less.
  try {
    await prisma.room.delete({ where: { id } })
  } catch {
    return { error: 'Không thể xoá phòng.' }
  }
  revalidateRoom()
  return { success: true }
}
