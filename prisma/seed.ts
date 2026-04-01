import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'

// 1. إعداد الاتصال المتوافق مع بيئتك
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🚀 بدء تنظيف وصيانة قاعدة البيانات لشركة حسن أبو صفية...");

  // 2. تنظيف شامل لكل الجداول بالترتيب
  await prisma.payment.deleteMany();
  await prisma.ticketPart.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.supplierPayment.deleteMany();
  await prisma.purchaseItem.deleteMany();
  await prisma.purchaseInvoice.deleteMany();
  await prisma.trialItem.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
  await prisma.sparePart.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.compressor.deleteMany();

  // 3. تشفير كلمة المرور الموحدة (123456)
  const hashedPassword = await bcrypt.hash('123456', 10);

  // 4. إنشاء المستخدمين (المدراء والعمال)
  console.log("👤 إنشاء حسابات الإدارة والعمال...");
  const admin1 = await prisma.user.create({
    data: { name: 'محمد ابو صفيه', phone: '0599238610', password: hashedPassword, role: 'ADMIN' }
  });
  const admin2 = await prisma.user.create({
    data: { name: 'علي ابو صفيه', phone: '0592452711', password: hashedPassword, role: 'ADMIN' }
  });
  const worker1 = await prisma.user.create({
    data: { name: 'احمد ابو صفيه', phone: '0599809769', password: hashedPassword, role: 'WORKER' }
  });

  // 5. إضافة قائمة قطع الغيار الحقيقية
  console.log("📦 جرد وإضافة الأصناف للمخزن...");
  const parts = [
    { name: "بيل ٦٢٠٥", quantity: 50, sellingPrice: 50 },
    { name: "بيل ٦٢٠٤", quantity: 10, sellingPrice: 50 },
    { name: "بستون مقاس ٦٠", quantity: 3, sellingPrice: 150 }, // سعر تقديري
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

  // 6. إضافة التذاكر المكتملة
  console.log("📝 توثيق التذاكر المكتملة...");
  const completedTickets = [
    { customerName: "بدوان", issueDescription: "6 قطع كاسكيت 2 من كل نوع", workerId: worker1.id },
    { customerName: "ابو كميل", issueDescription: "رينع 47", workerId: worker1.id },
    { customerName: "دغمش", issueDescription: "بيل 6204 + بيل 6205 + لبادة + طقم كاسكيت", workerId: worker1.id },
    { customerName: "محمود ابو مقديم", issueDescription: "تنفيسة ربع", laborCost: 30, workerId: admin2.id },
  ];

  for (const t of completedTickets) {
    await prisma.ticket.create({
      data: { ...t, customerPhone: "0590000000", status: "COMPLETED" }
    });
  }

  // 7. إضافة التذاكر قيد الصيانة
  console.log("🛠️ توثيق التذاكر قيد الصيانة...");
  await prisma.ticket.create({
    data: {
      customerName: "الحلو",
      customerPhone: "0590000000",
      status: "OPEN",
      compressorModel: "كومبيرسور 200 لتر ازرق",
      issueDescription: "محتاجة قطع غيار",
    }
  });

  console.log('🎉 تم استيراد بيانات شركة حسن أبو صفية بنجاح!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });