import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { slugify } from '../lib/slugify'
import { ARTIFACT_CATEGORIES, POST_CATEGORIES } from '../lib/constants'

const prisma = new PrismaClient()

const LOREM =
  'Đây là nội dung mẫu (placeholder). Nội dung thật sẽ được biên tập sau dựa trên ' +
  'tài liệu nghiên cứu về di tích. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

// .png suffix forces a raster format — placehold.co's default is SVG, which
// next/image rejects (400) without dangerouslyAllowSVG.
const img = (w: number, h: number, text: string) =>
  `https://placehold.co/${w}x${h}.png?text=${encodeURIComponent(text)}`

const daysFromNow = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000)

async function seedAdmin() {
  const email = 'admin@den-tho-bac.local'
  const password = 'admin123'
  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, hashedPassword, role: 'ADMIN' },
  })
  console.log(`Seeded admin user: ${email} (password: ${password})`)
}

async function seedFeatures() {
  // FK-safe wipe so re-running is idempotent (join → leaves → roots).
  await prisma.tourGroup.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.artifactOnExhibition.deleteMany()
  await prisma.artifact.deleteMany()
  await prisma.post.deleteMany()
  await prisma.exhibition.deleteMany()
  await prisma.room.deleteMany()

  const rooms = await Promise.all(
    [
      'Phòng 1: Thân thế & Sự nghiệp',
      'Phòng 2: Hiện vật kỷ niệm',
      'Phòng 3: Tư liệu & Hình ảnh',
    ].map((name) =>
      prisma.room.create({ data: { name, description: LOREM } }),
    ),
  )

  const categories = ARTIFACT_CATEGORIES
  const artifacts = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.artifact.create({
        data: {
          name: `Hiện vật mẫu ${i + 1}`,
          description: LOREM,
          category: categories[i % categories.length],
          images: [img(600, 400, `Hien vat ${i + 1}`)],
          featured: i < 4, // first 4 surface on the homepage
          roomId: rooms[i % rooms.length].id,
        },
      }),
    ),
  )

  const postCategories = POST_CATEGORIES
  await Promise.all(
    Array.from({ length: 5 }, (_, i) => {
      const title = `Bài viết mẫu ${i + 1}`
      return prisma.post.create({
        data: {
          title,
          slug: slugify(title),
          content: `<p>${LOREM}</p><p>${LOREM}</p>`,
          excerpt: LOREM.slice(0, 120),
          category: postCategories[i % postCategories.length],
          coverImage: img(800, 450, `Bai viet ${i + 1}`),
          published: true,
          publishedAt: daysFromNow(-i), // most recent first
        },
      })
    }),
  )

  // One ongoing exhibition, one upcoming — both satisfy endDate >= now.
  const ongoing = await prisma.exhibition.create({
    data: {
      title: 'Triển lãm đang diễn ra (mẫu)',
      description: LOREM,
      startDate: daysFromNow(-30),
      endDate: daysFromNow(30),
      coverImage: img(800, 450, 'Trien lam dang dien ra'),
    },
  })
  const upcoming = await prisma.exhibition.create({
    data: {
      title: 'Triển lãm sắp diễn ra (mẫu)',
      description: LOREM,
      startDate: daysFromNow(30),
      endDate: daysFromNow(90),
      coverImage: img(800, 450, 'Trien lam sap dien ra'),
    },
  })

  // Link 3–4 artifacts to each exhibition.
  await prisma.artifactOnExhibition.createMany({
    data: [
      ...artifacts.slice(0, 4).map((a) => ({ artifactId: a.id, exhibitionId: ongoing.id })),
      ...artifacts.slice(4, 7).map((a) => ({ artifactId: a.id, exhibitionId: upcoming.id })),
    ],
  })

  await prisma.tourGroup.createMany({
    data: [
      { groupName: 'Trường THPT Nguyễn Huệ', contactName: 'Cô Lan', phone: '0901234567', date: daysFromNow(7), size: 40, status: 'PENDING' },
      { groupName: 'Đoàn cựu chiến binh Quận 1', contactName: 'Ông Minh', phone: '0912345678', date: daysFromNow(14), size: 25, status: 'APPROVED' },
      { groupName: 'Công ty Du lịch Sài Gòn', contactName: 'Anh Tuấn', phone: '0987654321', date: daysFromNow(3), size: 60, note: 'Cần hướng dẫn viên tiếng Anh', status: 'PENDING' },
      { groupName: 'Đại học KHXH&NV', contactName: 'Thầy Hùng', phone: '0934567890', date: daysFromNow(21), size: 35, status: 'REJECTED' },
      { groupName: 'Hội phụ nữ phường 5', contactName: 'Chị Hoa', phone: '0945678901', date: daysFromNow(10), size: 20, status: 'PENDING' },
    ],
  })

  await prisma.contact.createMany({
    data: [
      { name: 'Nguyễn Văn A', email: 'vana@example.com', message: 'Cho tôi hỏi giờ mở cửa của di tích vào cuối tuần?' },
      { name: 'Trần Thị B', email: 'thib@example.com', message: 'Di tích có hỗ trợ thuyết minh cho đoàn học sinh không ạ?' },
      { name: 'Lê Văn C', email: 'vanc@example.com', message: 'Tôi muốn góp một số tư liệu, hiện vật. Xin liên hệ lại giúp tôi.' },
      { name: 'Phạm Thị D', email: 'thid@example.com', message: 'Bãi đỗ xe ô tô có gần cổng vào không?' },
    ],
  })

  console.log(
    'Seeded 3 rooms, 10 artifacts (4 featured), 5 posts, 2 exhibitions, 5 tour groups, 4 contacts',
  )
}

async function main() {
  await seedAdmin()
  await seedFeatures()
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
