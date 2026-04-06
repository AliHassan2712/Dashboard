"use server"; 

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { sparePartSchema, type SparePartFormValues } from "@/src/features/inventory/validations/validations";
import { ROUTES } from "@/src/constants/paths"; 

// 1. دالة إضافة قطعة غيار جديدة
export async function addSparePart(data: SparePartFormValues) {
  try {
    const parsedData = sparePartSchema.safeParse(data);
    
    if (!parsedData.success) {
      return { error: "بيانات غير صالحة تم إرسالها للسيرفر" };
    }

    const newPart = await prisma.sparePart.create({
      data: parsedData.data,
    });

    revalidatePath(ROUTES.INVENTORY); 

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
      orderBy: { name: 'asc' }, 
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

    revalidatePath(ROUTES.INVENTORY); 
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

    revalidatePath(ROUTES.INVENTORY); 
    return { success: true };
  } catch (error) {
    console.error("Error deleting spare part:", error);
    return { error: "لا يمكن حذف القطعة لأنها قد تكون مرتبطة بتذاكر أو فواتير سابقة." };
  }
}

// دالة جلب كل قطع الغيار (للقائمة المنسدلة)
export async function getAllSparePartsForDropdown() {
  try {
    const parts = await prisma.sparePart.findMany({
      select: {
        id: true,
        name: true,
        sellingPrice: true,
        quantity: true, 
      },
      orderBy: { name: 'asc' } 
    });
    return { success: true, data: parts };
  } catch (error) {
    console.error("خطأ في جلب قطع الغيار:", error);
    return { error: "تعذر جلب قائمة قطع الغيار من المستودع." };
  }
}