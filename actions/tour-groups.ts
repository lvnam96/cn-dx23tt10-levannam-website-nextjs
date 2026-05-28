'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'
import { tourGroupSchema, type TourGroupInput } from '@/lib/validations'
import { isValidStatus } from '@/lib/tour-status'
import { revalidateTour } from '@/lib/revalidate'

type Result = { success: true } | { error: string }

async function isAdmin(): Promise<boolean> {
  const session = await auth()
  return !!session?.user
}

async function clientIp(): Promise<string> {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

export async function createTourGroup(
  input: TourGroupInput & { website?: string },
): Promise<Result> {
  if (!checkRateLimit(await clientIp()).allowed) {
    return { error: 'Bạn đã gửi quá nhiều lần. Vui lòng thử lại sau.' }
  }
  if (input.website) return { success: true } // honeypot
  const parsed = tourGroupSchema.safeParse(input)
  if (!parsed.success) return { error: 'Dữ liệu không hợp lệ.' }
  const { groupName, contactName, phone, date, size, note } = parsed.data
  try {
    await prisma.tourGroup.create({
      data: {
        groupName,
        contactName,
        phone,
        date: new Date(date),
        size: Number(size),
        note: note || null,
      },
    })
  } catch {
    return { error: 'Không thể gửi đăng ký. Vui lòng thử lại.' }
  }
  revalidateTour()
  return { success: true }
}

export async function updateTourStatus(
  id: string,
  status: string,
): Promise<Result> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }
  if (!isValidStatus(status)) return { error: 'Trạng thái không hợp lệ.' }
  try {
    await prisma.tourGroup.update({ where: { id }, data: { status } })
  } catch {
    return { error: 'Không thể cập nhật trạng thái.' }
  }
  revalidateTour()
  return { success: true }
}
