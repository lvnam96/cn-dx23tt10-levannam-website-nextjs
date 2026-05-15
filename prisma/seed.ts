import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
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

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
