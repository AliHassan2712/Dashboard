"use server"; 

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { sparePartSchema, type SparePartFormValues } from "@/src/features/inventory/validations/validations";
import { ROUTES } from "@/src/constants/paths"; 
import { deleteFilesFromUploadThing } from "./uploadthing.actions";
import { handleError } from "@/src/lib/errorHandler";

// 1. دالة إضافة قطعة غيار جديدة
export async function addSparePart(data: SparePartFormValues) {
  try {
    const parsedData = sparePartSchema.safeParse(data);
    
    if (!parsedData.success) {
      return { success: false, error: "بيانات غير صالحة تم إرسالها للسيرفر" };
    }

    const newPart = await prisma.sparePart.create({
      data: parsedData.data,
    });

    revalidatePath(ROUTES.INVENTORY); 

    return { success: true, data: newPart };
  } catch (error) {
    return handleError(error, "حدث خطأ في قاعدة البيانات أثناء إضافة القطعة");
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
    return handleError(error, "حدث خطأ أثناء جلب المخزون");
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
    return handleError(error, "حدث خطأ أثناء تعديل القطعة");
  }
}

// 4. دالة حذف قطعة غيار
export async function deleteSparePart(id: string) {
  try {
    // 1. جلب القطعة لمعرفة رابط الصورة (إن وُجدت)
    const part = await prisma.sparePart.findUnique({
      where: { id },
      select: { imageUrl: true }
    });

    // 2. الحذف من قاعدة البيانات
    await prisma.sparePart.delete({
      where: { id },
    });

    // 3. تنظيف السحابة: الحذف الفيزيائي
    if (part?.imageUrl) {
      deleteFilesFromUploadThing(part.imageUrl).catch(err => 
        console.error("Failed to delete spare part image in background:", err)
      );
    }

    revalidatePath(ROUTES.INVENTORY); 
    return { success: true };
  } catch (error) {
    return handleError(error, "لا يمكن حذف القطعة لأنها قد تكون مرتبطة بتذاكر أو فواتير سابقة.");
  }
}

// 5. دالة بيع قطعة غيار مباشرة (تسجيلها كتذكرة مكتملة بدون عميل محدد)
export async function sellPartDirectly(sparePartId: string, quantity: number, price: number) {
  try {
    const part = await prisma.sparePart.findUnique({ where: { id: sparePartId } });
    
    if (!part || part.quantity < quantity) {
      return { success: false, error: "الكمية غير متوفرة في المخزن!" };
    }

    await prisma.$transaction(async (tx) => {
      // 1. إنشاء تذكرة "مكتملة" باسم مبيعات نقدية
      const ticket = await tx.ticket.create({
        data: {
          customerName: "مبيعات نقدية (قطعة غيار)",
          customerPhone: "000000000",
          status: "COMPLETED",
          totalCost: price * quantity,
          advancePayment: price * quantity // مدفوعة بالكامل
        }
      });

      // 2. تسجيل القطعة المباعة
      await tx.ticketPart.create({
        data: {
          ticketId: ticket.id,
          sparePartId: sparePartId,
          quantity: quantity,
          priceAtTime: price
        }
      });

      // 3. خصم من المخزن
      await tx.sparePart.update({
        where: { id: sparePartId },
        data: { quantity: { decrement: quantity } }
      });
    });

    revalidatePath(ROUTES.INVENTORY);
    revalidatePath(ROUTES.TRANSACTIONS); // لتحديث السجل المالي
    return { success: true };
  } catch (error) {
    return handleError(error, "حدث خطأ أثناء إتمام عملية البيع.");
  }
}

// 6. دالة جلب كل قطع الغيار (للقائمة المنسدلة)
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
    return handleError(error, "تعذر جلب قائمة قطع الغيار من المستودع.");
  }
}

// 7. دالة جلب المخزون مع التقسيم والبحث
export async function getPaginatedParts(params: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
}) {
  try {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    // استبدال any بـ Prisma.SparePartWhereInput لضمان أمان الأنواع
    const whereClause: Prisma.SparePartWhereInput = {}; 
    
    // ملاحظة: إذا كان حقل category موجود في الموديل يمكنك إلغاء تعليق السطر التالي
    // if (category && category !== "ALL") whereClause.category = category;
    
    if (search) {
      whereClause.name = { contains: search, mode: "insensitive" };
    }

    const [totalItems, parts] = await prisma.$transaction([
      prisma.sparePart.count({ where: whereClause }),
      prisma.sparePart.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { name: 'asc' }, // الترتيب الأبجدي للقطع
      })
    ]);

    return { 
      success: true, 
      data: parts, 
      metadata: { totalItems, totalPages: Math.ceil(totalItems / limit), currentPage: page }
    };
  } catch (error) {
    return handleError(error, "فشل جلب بيانات المخزون");
  }
}