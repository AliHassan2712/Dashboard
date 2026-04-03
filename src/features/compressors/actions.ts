"use server";

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

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

// 2. الإضافة (تأكد من الحقول الاختيارية)
export async function addCompressor(data: {
  serialNumber?: string;
  modelName: string; 
  productionCost: number;
  sellingPrice: number;
  description?: string;
  imageUrl?: string; // 👈 إضافة الحقل هنا
}) {
  try {
    const compressor = await prisma.compressor.create({
      data: {
        modelName: data.modelName,
        productionCost: data.productionCost,
        sellingPrice: data.sellingPrice,
        status: "AVAILABLE",
        imageUrl: data.imageUrl, // 👈 حفظ الرابط
        ...(data.serialNumber ? { serialNumber: data.serialNumber } : {}),
      }
    });
    revalidatePath("/compressors");
    return { success: true, data: compressor };
  } catch (error) {
    return { error: "فشل إضافة الكمبريسور" };
  }
}

// 3. التحديث والحذف (بقيت كما هي مع revalidatePath)
export async function updateCompressorStatus(id: string, status: string) {
  try {
    await prisma.compressor.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/compressors");
    return { success: true };
  } catch (error) { return { error: "فشل التحديث" }; }
}

export async function deleteCompressor(id: string) {
  try {
    await prisma.compressor.delete({ where: { id } });
    revalidatePath("/compressors");
    return { success: true };
  } catch (error) { return { error: "فشل الحذف" }; }
}