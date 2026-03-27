import 'dotenv/config' // 👈 هذا السطر الجديد هو الذي سيقرأ ملف .env
import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  }
})