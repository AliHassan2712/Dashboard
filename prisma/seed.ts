import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'

// 1. إعداد الاتصال باستخدام المحول (Adapter) كما يطلب Prisma 7
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 2. تشفير كلمة المرور (123456)
  const hashedPassword = await bcrypt.hash('123456', 10)

  // 3. إنشاء المستخدم في قاعدة البيانات (حساب المدير)
  const admin = await prisma.user.create({
    data: {
      name: 'المدير العام',
      phone: '0599999999', // سنستخدم هذا الرقم لتسجيل الدخول
      password: hashedPassword,
      role: 'ADMIN', // إعطاء صلاحية المدير
    },
  })

  console.log('🎉 تم إنشاء حساب المدير بنجاح:', admin.name)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })