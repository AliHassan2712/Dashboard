//في Next.js (بسبب الـ Hot Reloading في بيئة التطوير)،
//  قد يتم إنشاء اتصالات متعددة بقاعدة البيانات مما يسبب أخطاء.
//  لنتجنب ذلك،  ملف إعداد الاتصال.

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  // ننشئ اتصالاً باستخدام الرابط الموجود في ملف .env
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  
  // نمرر الـ adapter للـ PrismaClient كما طلب التحديث الجديد
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma