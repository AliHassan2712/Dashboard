"use server";

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/src/constants/paths";

// 1. جلب كل العهد والقطع التجريبية
export async function getTrialItems() {
  try {
    const trials = await prisma.trialItem.findMany({
      include: {
        worker: { select: { name: true } },
        sparePart: { select: { name: true } },
        ticket: { select: { id: true, customerName: true } }
      },
      orderBy: { givenAt: 'desc' }
    });
    return { success: true, data: trials };
  } catch (_error) {
    return { error: "فشل جلب سجل العهد" };
  }
}

// 2. إعطاء قطعة كعهدة لفني (تخصم من المخزن)
export async function createTrialItem(data: { workerId: string; sparePartId: string; qty: number; notes: string }) {
  try {
    const part = await prisma.sparePart.findUnique({ where: { id: data.sparePartId } });
    if (!part || part.quantity < data.qty) {
      return { error: "الكمية في المخزن لا تكفي!" };
    }

    await prisma.$transaction(async (tx) => {
      // تسجيل العهدة
      await tx.trialItem.create({
        data: {
          workerId: data.workerId,
          sparePartId: data.sparePartId,
          qty: data.qty,
          notes: data.notes,
          status: "ACTIVE"
        }
      });

      // خصم القطعة من المخزن مؤقتاً
      await tx.sparePart.update({
        where: { id: data.sparePartId },
        data: { quantity: { decrement: data.qty } }
      });
    });

    revalidatePath(ROUTES.TRIALS || "/trials");
    revalidatePath(ROUTES.INVENTORY || "/inventory");
    return { success: true };
  } catch (_error) {
    return { error: "فشل تسجيل العهدة" };
  }
}

// 3. إرجاع القطعة للمخزن
export async function returnTrialItem(id: string) {
  try {
    await prisma.$transaction(async (tx) => {
      const trial = await tx.trialItem.findUnique({ where: { id } });
      
      // تأكد أن العهدة موجودة وأنها مرتبطة بقطعة غيار
      if (!trial || !trial.sparePartId) {
        throw new Error("العهدة غير موجودة أو غير مرتبطة بقطعة غيار");
      }

      // إرجاع القطع للمخزن
      await tx.sparePart.update({
        where: { id: trial.sparePartId }, 
        data: { quantity: { increment: trial.qty } }
      });

      // حذف سجل العهدة بعد الإرجاع
      await tx.trialItem.delete({ where: { id } });
    });

    revalidatePath(ROUTES.WORKERS);
    return { success: true };
  } catch (_error) {
    return { error: "فشل إرجاع العهدة للمخزن" };
  }
}
// 4. استهلاك القطعة (EXPIRED)
export async function consumeTrialItem(trialId: string) {
  try {
    await prisma.trialItem.update({
      where: { id: trialId },
      data: { status: "EXPIRED" } // ستبقى مخصومة ولن ترجع
    });
    revalidatePath(ROUTES.TRIALS || "/trials");
    return { success: true };
  } catch (_error) {
    return { error: "فشل تحديث الحالة" };
  }
}