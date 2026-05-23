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

  console.log('Seeded 3 rooms, 10 artifacts (4 featured), 5 posts, 2 exhibitions')
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
