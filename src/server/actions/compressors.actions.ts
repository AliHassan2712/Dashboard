"use server";

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/src/constants/paths";
import { deleteFilesFromUploadThing } from "./uploadthing.actions";
import { handleError } from "@/src/lib/errorHandler";

export async function getCompressors() {
  try {
    const compressors = await prisma.compressor.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: compressors };
  } catch (error) {
    return handleError(error, "فشل جلب قائمة الكمبريسورات");
  }
}

export async function addCompressor(data: {
  serialNumber?: string;
  modelName: string; 
  productionCost: number; 
  sellingPrice: number;
  description?: string;
  imageUrl?: string;
  parts: { sparePartId: string; quantity: number; unitCost: number }[]; 
}) {
  try {
    await prisma.$transaction(async (tx) => {
      const partsTotalCost = data.parts.reduce((sum, p) => sum + (p.quantity * p.unitCost), 0);
      
      const compressor = await tx.compressor.create({
        data: {
          modelName: data.modelName,
          serialNumber: data.serialNumber,
          productionCost: data.productionCost + partsTotalCost,
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

      for (const part of data.parts) {
        const currentPart = await tx.sparePart.findUnique({
          where: { id: part.sparePartId },
          select: { name: true, quantity: true } 
        });

        if (!currentPart || currentPart.quantity < part.quantity) {
          throw new Error(`الكمية المتاحة من (${currentPart?.name || 'قطعة مجهولة'}) لا تكفي. المتاح فقط: ${currentPart?.quantity || 0}`);
        }

        await tx.sparePart.update({
          where: { id: part.sparePartId },
          data: { quantity: { decrement: part.quantity } }
        });
      }
    });

    revalidatePath(ROUTES.COMPRESSORS);
    revalidatePath(ROUTES.INVENTORY);
    return { success: true };
  } catch (error: any) {
    return handleError(error, error.message || "فشل إضافة الكمبريسور وخصم القطع");
  }
}

export async function updateCompressorStatus(id: string, status: string) {
  try {
    await prisma.compressor.update({
      where: { id },
      data: { status }
    });
    revalidatePath(ROUTES.COMPRESSORS); 
    return { success: true };
  } catch (error) { 
    return handleError(error, "فشل التحديث"); 
  }
}

export async function deleteCompressor(id: string) {
  try {
    const compressor = await prisma.compressor.findUnique({
      where: { id },
      include: { partsUsed: true } 
    });

    if (!compressor) return { error: "الكمبريسور غير موجود" };

    await prisma.$transaction(async (tx) => {
      for (const part of compressor.partsUsed) {
        await tx.sparePart.update({
          where: { id: part.sparePartId },
          data: { quantity: { increment: part.quantity } }
        });
      }

      await tx.compressorPart.deleteMany({
        where: { compressorId: id }
      });

      await tx.compressor.delete({ 
        where: { id } 
      });
    });

    if (compressor.imageUrl) {
      deleteFilesFromUploadThing(compressor.imageUrl).catch(err => 
        console.error("Failed to delete compressor image in background:", err)
      );
    }

    revalidatePath(ROUTES.COMPRESSORS); 
    revalidatePath(ROUTES.INVENTORY); 
    return { success: true };

  } catch (error) { 
    return handleError(error, "حدث خطأ أثناء محاولة حذف الكمبريسور واسترجاع القطع."); 
  }
}

export async function getPaginatedCompressors(page: number, limit: number = 9, search?: string) {
  try {
    const skip = (page - 1) * limit;
    
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { modelName: { contains: search, mode: "insensitive" } },
        { serialNumber: { contains: search, mode: "insensitive" } }
      ];
    }

    const [totalItems, compressors] = await prisma.$transaction([
      prisma.compressor.count({ where: whereClause }),
      prisma.compressor.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return { 
      success: true, 
      data: compressors, 
      metadata: { totalItems, totalPages: Math.ceil(totalItems / limit), currentPage: page } 
    };
  } catch (error) {
    return handleError(error, "فشل جلب قائمة الكمبريسورات");
  }
}