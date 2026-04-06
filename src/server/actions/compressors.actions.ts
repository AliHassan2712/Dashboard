"use server";

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/src/constants/paths";

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
  productionCost: number;
  sellingPrice: number;
  description?: string;
  imageUrl?: string; 
}) {
  try {
    const compressor = await prisma.compressor.create({
      data: {
        modelName: data.modelName,
        productionCost: data.productionCost,
        sellingPrice: data.sellingPrice,
        status: "AVAILABLE",
        imageUrl: data.imageUrl, 
        ...(data.serialNumber ? { serialNumber: data.serialNumber } : {}),
      }
    });
    revalidatePath(ROUTES.COMPRESSORS); 
    return { success: true, data: compressor };
  } catch (error) {
    console.error("Add Error:", error);
    return { error: "فشل إضافة الكمبريسور" };
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

// 4. الحذف
export async function deleteCompressor(id: string) {
  try {
    await prisma.compressor.delete({ where: { id } });
    revalidatePath(ROUTES.COMPRESSORS); 
    return { success: true };
  } catch (error) { 
    console.error("Delete Error:", error);
    return { error: "فشل الحذف" }; 
  }
}