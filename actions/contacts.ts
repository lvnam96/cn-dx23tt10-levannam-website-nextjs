'use server'

import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'
import { contactSchema, type ContactInput } from '@/lib/validations'

type Result = { success: true } | { error: string }

async function clientIp(): Promise<string> {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

export async function createContact(
  input: ContactInput & { website?: string },
): Promise<Result> {
  if (!checkRateLimit(await clientIp()).allowed) {
    return { error: 'Bạn đã gửi quá nhiều lần. Vui lòng thử lại sau.' }
  }
  if (input.website) return { success: true } // honeypot: pretend success for bots
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) return { error: 'Dữ liệu không hợp lệ.' }
  try {
    await prisma.contact.create({ data: parsed.data })
  } catch {
    return { error: 'Không thể gửi liên hệ. Vui lòng thử lại.' }
  }
  return { success: true }
}
