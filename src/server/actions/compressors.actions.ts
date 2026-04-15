"use server";

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/src/constants/paths";
import { deleteFilesFromUploadThing } from "./uploadthing.actions";

// 1. جلب البيانات
export async function getCompressors() {
  try {
    const compressors = await prisma.compressor.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: compressors };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { error: "فشل جلب قائمة الكمبريسورات" };
  }
}

// 2. الإضافة
export async function addCompressor(data: {
  serialNumber?: string;
  modelName: string; 
  productionCost: number; // أجرة اليد والتكاليف الأخرى
  sellingPrice: number;
  description?: string;
  imageUrl?: string;
  parts: { sparePartId: string; quantity: number; unitCost: number }[]; 
}) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. حساب إجمالي تكلفة القطع
      const partsTotalCost = data.parts.reduce((sum, p) => sum + (p.quantity * p.unitCost), 0);
      
      // 2. إنشاء الكمبريسور
      const compressor = await tx.compressor.create({
        data: {
          modelName: data.modelName,
          serialNumber: data.serialNumber,
          productionCost: data.productionCost + partsTotalCost, // التكلفة الكلية
          sellingPrice: data.sellingPrice,
          description: data.description,
          imageUrl: data.imageUrl,
          status: "AVAILABLE",
          partsUsed: {
            create: data.parts.map(p => ({
              sparePartId: p.sparePartId,
              quantity: p.quantity,
              unitCost: p.unitCost
            }))
          }
        }
      });

      // 3. خصم القطع من المخزن
      for (const part of data.parts) {
        await tx.sparePart.update({
          where: { id: part.sparePartId },
          data: { quantity: { decrement: part.quantity } }
        });
      }
    });

    revalidatePath(ROUTES.COMPRESSORS);
    revalidatePath(ROUTES.INVENTORY);
    return { success: true };
  } catch (error) {
    console.error("🔥 Prisma Add Compressor Error:", error); 
    return { error: "فشل إضافة الكمبريسور وخصم القطع" };
  }
}

// 3. التحديث
export async function updateCompressorStatus(id: string, status: string) {
  try {
    await prisma.compressor.update({
      where: { id },
      data: { status }
    });
    revalidatePath(ROUTES.COMPRESSORS); 
    return { success: true };
  } catch (error) { 
    console.error("Update Error:", error);
    return { error: "فشل التحديث" }; 
  }
}

// 4. الحذف واسترجاع القطع للمخزن
export async function deleteCompressor(id: string) {
  try {
    // 1. جلب الكمبريسور مع القطع المرتبطة به لمعرفة الكميات المسحوبة
    const compressor = await prisma.compressor.findUnique({
      where: { id },
      include: { partsUsed: true } 
    });

    if (!compressor) return { error: "الكمبريسور غير موجود" };

    // 2. استخدام Transaction لضمان تزامن العمليات (إرجاع القطع ثم الحذف)
    await prisma.$transaction(async (tx) => {
      
      // أ. إرجاع القطع إلى المخزن (Increment)
      for (const part of compressor.partsUsed) {
        await tx.sparePart.update({
          where: { id: part.sparePartId },
          data: { quantity: { increment: part.quantity } }
        });
      }

      // ب. حذف القطع المرتبطة من الجدول الوسيط (CompressorPart)
      await tx.compressorPart.deleteMany({
        where: { compressorId: id }
      });

      // ج. حذف الكمبريسور نفسه
      await tx.compressor.delete({ 
        where: { id } 
      });
    });

    // 3. تنظيف السحابة: الحذف الفيزيائي للصورة
    if (compressor.imageUrl) {
      deleteFilesFromUploadThing(compressor.imageUrl).catch(err => 
        console.error("Failed to delete compressor image in background:", err)
      );
    }

    // 4. تحديث صفحة الكمبريسورات وصفحة المخزون لظهور القطع المسترجعة!
    revalidatePath(ROUTES.COMPRESSORS); 
    revalidatePath(ROUTES.INVENTORY); 
    return { success: true };

  } catch (error) { 
    console.error("Delete Error:", error);
    return { error: "حدث خطأ أثناء محاولة حذف الكمبريسور واسترجاع القطع." }; 
  }
}