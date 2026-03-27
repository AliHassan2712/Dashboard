"use server"; // 👈 هذا السطر السحري يخبر Next.js أن كل الدوال هنا تعمل على السيرفر فقط ولا تصل للمتصفح (أمان عالي)

import prisma from "@/src/lib/prisma";
import { sparePartSchema, type SparePartFormValues } from "./validations";
import { revalidatePath } from "next/cache";

// 1. دالة إضافة قطعة غيار جديدة
export async function createSparePart(data: SparePartFormValues) {
  try {
    // تحقق أمني إضافي في السيرفر (Server-side Validation)
    // حتى لو حاول شخص تجاوز الـ Frontend، السيرفر سيوقفه هنا
    const parsedData = sparePartSchema.safeParse(data);
    
    if (!parsedData.success) {
      return { error: "بيانات غير صالحة تم إرسالها للسيرفر" };
    }

    // إدخال البيانات في قاعدة بيانات Neon عبر Prisma
    const newPart = await prisma.sparePart.create({
      data: parsedData.data,
    });

    // تحديث الصفحة "وراء الكواليس" لكي تظهر القطعة الجديدة فوراً في الجدول
    revalidatePath("/inventory");

    return { success: true, data: newPart };
  } catch (error) {
    console.error("Error creating spare part:", error);
    return { error: "حدث خطأ في قاعدة البيانات أثناء إضافة القطعة" };
  }
}

// 2. دالة جلب كل قطع الغيار
export async function getSpareParts() {
  try {
    const parts = await prisma.sparePart.findMany({
      orderBy: { name: 'asc' }, // ترتيب أبجدي حسب الاسم
    });
    
    return { success: true, data: parts };
  } catch (error) {
    console.error("Error fetching spare parts:", error);
    return { error: "حدث خطأ أثناء جلب المخزون" };
  }
}