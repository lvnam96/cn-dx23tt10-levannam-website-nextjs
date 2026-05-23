import { z } from 'zod'

export const requiredString = (label: string) =>
  z.string().trim().min(1, `${label} is required`)

export const tourGroupSchema = z.object({
  groupName: requiredString('Tên đoàn'),
  contactName: requiredString('Người liên hệ'),
  phone: requiredString('Số điện thoại').regex(
    /^[0-9+\-\s]{8,}$/,
    'Số điện thoại không hợp lệ',
  ),
  date: requiredString('Ngày tham quan').refine((s) => {
    const d = new Date(s)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return !Number.isNaN(d.getTime()) && d >= today
  }, 'Ngày tham quan phải từ hôm nay trở đi'),
  size: requiredString('Số lượng')
    .regex(/^\d+$/, 'Số lượng phải là số')
    .refine((s) => Number(s) >= 1, 'Số lượng tối thiểu là 1'),
  note: z.string().optional(),
})
export type TourGroupInput = z.infer<typeof tourGroupSchema>

export const contactSchema = z.object({
  name: requiredString('Họ tên'),
  email: z.email('Email không hợp lệ'),
  message: requiredString('Nội dung').min(10, 'Nội dung tối thiểu 10 ký tự'),
})
export type ContactInput = z.infer<typeof contactSchema>
