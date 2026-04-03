import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🚀 بدء تهيئة قاعدة البيانات لشركة حسن أبو صفية...");

  // 1. جلب البيانات الحساسة من المتغيرات البيئية (أو وضع قيم وهمية في حال نسيانها)
  const admin1Phone = process.env.ADMIN1_PHONE || '0590000001';
  const admin2Phone = process.env.ADMIN2_PHONE || '0590000002';
  const worker1Phone = process.env.WORKER1_PHONE || '0590000003';
  const defaultPasswordStr = process.env.DEFAULT_PASSWORD || '123456';

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(defaultPasswordStr, 10);

  // 2. إنشاء المستخدمين باستخدام (upsert) لمنع التكرار أو مسح الحسابات لو كانت موجودة
  console.log("👤 جاري التحقق من حسابات الإدارة والعمال...");
  
  const admin1 = await prisma.user.upsert({
    where: { phone: admin1Phone },
    update: {}, // لا تقم بتحديث شيء إذا كان موجوداً
    create: { name: 'محمد ابو صفيه', phone: admin1Phone, password: hashedPassword, role: 'ADMIN', baseSalary: 0 }
  });

  const admin2 = await prisma.user.upsert({
    where: { phone: admin2Phone },
    update: {},
    create: { name: 'علي ابو صفيه', phone: admin2Phone, password: hashedPassword, role: 'ADMIN', baseSalary: 0 }
  });

  const worker1 = await prisma.user.upsert({
    where: { phone: worker1Phone },
    update: {},
    create: { name: 'احمد ابو صفيه', phone: worker1Phone, password: hashedPassword, role: 'WORKER', baseSalary: 0 }
  });

  // 3. التحقق من وجود قطع الغيار (لمنع إضافتها مرة أخرى إذا كان النظام شغالاً)
  const existingPartsCount = await prisma.sparePart.count();
  
  if (existingPartsCount === 0) {
    console.log("📦 جرد وإضافة الأصناف للمخزن لأول مرة...");
    const parts = [
      { name: "بيل ٦٢٠٥", quantity: 50, sellingPrice: 50 },
      { name: "بيل ٦٢٠٤", quantity: 10, sellingPrice: 50 },
      { name: "بستون مقاس ٦٠", quantity: 3, sellingPrice: 150 },
      { name: "بستون ٢ حصان مقاس ٥٥", quantity: 15, sellingPrice: 130 },
      { name: "بستون مقاس ٣٥ صغير", quantity: 1, sellingPrice: 80 },
      { name: "بستون مقاس ٣٥ كبير", quantity: 1, sellingPrice: 90 },
      { name: "ذراع ٣ حصان", quantity: 16, sellingPrice: 200 },
      { name: "ذراع ٢ حصان", quantity: 17, sellingPrice: 150 },
      { name: "رذاذ ثلاث اثمان", quantity: 6, sellingPrice: 100 },
      { name: "غطاء راس ٣ حصان", quantity: 2, sellingPrice: 200 },
      { name: "رينج اويليست مقاس ٦٠", quantity: 15, sellingPrice: 200 },
      { name: "فلاتر ربع", quantity: 10, sellingPrice: 50 },
      { name: "ساعات ثمن", quantity: 3, sellingPrice: 40 },
      { name: "نشام زيت ثلاث اثمان", quantity: 7, sellingPrice: 30 },
      { name: "نشام زيت ثمن", quantity: 5, sellingPrice: 20 },
      { name: "عدسة زيت ثلاث ارباع", quantity: 22, sellingPrice: 40 },
      { name: "عدسة زيت نص انش ١/٥", quantity: 10, sellingPrice: 40 },
      { name: "كوع نص انش صيني", quantity: 7, sellingPrice: 100 },
      { name: "بربايش اويليست", quantity: 12, sellingPrice: 120 },
      { name: "فلاتر انش", quantity: 4, sellingPrice: 150 },
      { name: "رينغ مقاس ٣٥ اويليف", quantity: 8, sellingPrice: 120 },
      { name: "زطمة زيت صيني", quantity: 20, sellingPrice: 20 },
      { name: "افرلوت كهرب", quantity: 2, sellingPrice: 50 },
      { name: "بلاط صيني", quantity: 6, sellingPrice: 80 },
      { name: "كاسكيت صيني حز", quantity: 13, sellingPrice: 50 },
      { name: "كاسكيت زيت تحت السلندر", quantity: 12, sellingPrice: 20 },
      { name: "كاسكيت المنيوم", quantity: 4, sellingPrice: 40 },
      { name: "عجل", quantity: 8, sellingPrice: 100 },
      { name: "6 بلف نص انس", quantity: 20, sellingPrice: 70 },
      { name: "تنفيسة ريع", quantity: 12, sellingPrice: 20 },
      { name: "تحويلة من ثلاث اثمان ل نص", quantity: 17, sellingPrice: 25 },
      { name: "زطمة ثمن", quantity: 5, sellingPrice: 20 },
      { name: "زطمة نص انش", quantity: 6, sellingPrice: 10 },
      { name: "زقاقة ربع على اثنا عشر", quantity: 10, sellingPrice: 20 },
      { name: "زقاقة تي ٨", quantity: 4, sellingPrice: 30 },
      { name: "زقاقة ربع علي ٨", quantity: 5, sellingPrice: 20 },
      { name: "تحويلة من ثمن ل ربع", quantity: 15, sellingPrice: 20 },
      { name: "كوع ثلاث اثمان", quantity: 50, sellingPrice: 50 },
      { name: "سلندر اويليست", quantity: 10, sellingPrice: 150 },
      { name: "سيلكتور كهرب", quantity: 25, sellingPrice: 30 },
      { name: "بكرة صيني", quantity: 2, sellingPrice: 500 },
      { name: "رينج طقم صيني مقاس ٨٠", quantity: 19, sellingPrice: 250 },
      { name: "رينج طقم صنيي مقاس ٤٢", quantity: 19, sellingPrice: 150 },
      { name: "رينج طقم صيني مقاس ٦٠", quantity: 6, sellingPrice: 200 },
      { name: "رينج طقم طيني مقاس ٤٧", quantity: 6, sellingPrice: 150 },
      { name: "رينج طقم صيني مقاس ٥١", quantity: 24, sellingPrice: 150 },
      { name: "رينج طقم صيني مقاس ٧٠", quantity: 4, sellingPrice: 200 },
      { name: "كوندانسور ٢٥", quantity: 12, sellingPrice: 40 },
      { name: "لبادة ٣ حصان", quantity: 30, sellingPrice: 30 },
    ];

    for (const part of parts) {
      await prisma.sparePart.create({ data: part });
    }
  } else {
    console.log("✅ المخزن يحتوي على بيانات بالفعل، تخطي إضافة الأصناف.");
  }

  // 4. التحقق من وجود التذاكر لمنع التكرار
  const existingTicketsCount = await prisma.ticket.count();
  if (existingTicketsCount === 0) {
    console.log("🎫 توثيق التذاكر التاريخية...");
    const completedTickets = [
      { customerName: "بدوان", issueDescription: "6 قطع كاسكيت 2 من كل نوع", workerId: worker1.id, customerPhone: "0590000000", status: "COMPLETED" },
      { customerName: "ابو كميل", issueDescription: "رينع 47", workerId: worker1.id, customerPhone: "0590000000", status: "COMPLETED" },
      { customerName: "دغمش", issueDescription: "بيل 6204 + بيل 6205 + لبادة + طقم كاسكيت", workerId: worker1.id, customerPhone: "0590000000", status: "COMPLETED" },
      { customerName: "محمود ابو مقديم", issueDescription: "تنفيسة ربع", laborCost: 30, workerId: admin2.id, customerPhone: "0590000000", status: "COMPLETED" },
    ];

    for (const t of completedTickets) {
      await prisma.ticket.create({ data: t as any });
    }

    await prisma.ticket.create({
      data: {
        customerName: "الحلو",
        customerPhone: "0590000000",
        status: "OPEN",
        compressorModel: "كومبيرسور 200 لتر ازرق",
        issueDescription: "محتاجة قطع غيار",
      }
    });
  } else {
    console.log("✅ سجل التذاكر يحتوي على بيانات بالفعل، تخطي الإضافة.");
  }

  console.log('🎉 تم استيراد وتهيئة بيانات النظام بنجاح!');
}

main()
  .catch((e) => {
    console.error("❌ حدث خطأ:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });