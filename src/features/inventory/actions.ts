"use server"; // هذا السطر السحري يخبر Next.js أن كل الدوال هنا تعمل على السيرفر فقط ولا تصل للمتصفح (أمان عالي)

import prisma from "@/src/lib/prisma";
import { sparePartSchema, type SparePartFormValues } from "./validations";
import { revalidatePath } from "next/cache";

// 1. دالة إضافة قطعة غيار جديدة
export async function addSparePart(data: SparePartFormValues) {
  try {
    // تحقق أمني إضافي في السيرفر (Server-side Validation)
    const parsedData = sparePartSchema.safeParse(data);
    
    if (!parsedData.success) {
      return { error: "بيانات غير صالحة تم إرسالها للسيرفر" };
    }

    // إدخال البيانات في قاعدة بيانات عبر Prisma
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
export async function getInventory() {
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

// 3. دالة تعديل قطعة غيار
export async function updateSparePart(id: string, data: Partial<SparePartFormValues> & { imageUrl?: string }) {
  try {
    const updatedPart = await prisma.sparePart.update({
      where: { id },
      data: data,
    });

    revalidatePath("/inventory");
    return { success: true, data: updatedPart };
  } catch (error) {
    console.error("Error updating spare part:", error);
    return { error: "حدث خطأ أثناء تعديل القطعة" };
  }
}

// 4. دالة حذف قطعة غيار
export async function deleteSparePart(id: string) {
  try {
    await prisma.sparePart.delete({
      where: { id },
    });

    revalidatePath("/inventory");
    return { success: true };
  } catch (error) {
    console.error("Error deleting spare part:", error);
    // ملاحظة أمنية: إذا كانت القطعة مستخدمة في تذكرة سابقة، Prisma سترفض الحذف لحماية الحسابات المالية
    return { error: "لا يمكن حذف القطعة لأنها قد تكون مرتبطة بتذاكر أو فواتير سابقة." };
  }
}

// 🟡 دالة جلب كل قطع الغيار (لعرضها في القائمة المنسدلة داخل التذكرة)
export async function getAllSparePartsForDropdown() {
  try {
    const parts = await prisma.sparePart.findMany({
      select: {
        id: true,
        name: true,
        sellingPrice: true,
        quantity: true, // مهم لنعرف إذا كانت القطعة متوفرة أم لا
      },
      orderBy: { name: 'asc' } 
    });
    return { success: true, data: parts };
  } catch (error) {
    console.error("خطأ في جلب قطع الغيار:", error);
    return { error: "تعذر جلب قائمة قطع الغيار من المستودع." };
  }
}