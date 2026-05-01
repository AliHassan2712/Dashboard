"use server";

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/src/constants/paths";
import { handleError } from "@/src/lib/errorHandler";

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
  } catch (error) {
    return handleError(error, "فشل جلب سجل العهد");
  }
}

export async function createTrialItem(data: { workerId: string; sparePartId: string; qty: number; notes: string }) {
  try {
    const part = await prisma.sparePart.findUnique({ where: { id: data.sparePartId } });
    if (!part || part.quantity < data.qty) {
      return { error: "الكمية في المخزن لا تكفي!" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.trialItem.create({
        data: {
          workerId: data.workerId,
          sparePartId: data.sparePartId,
          qty: data.qty,
          notes: data.notes,
          status: "ACTIVE"
        }
      });

      await tx.sparePart.update({
        where: { id: data.sparePartId },
        data: { quantity: { decrement: data.qty } }
      });
    });

    revalidatePath(ROUTES.TRIALS || "/trials");
    revalidatePath(ROUTES.INVENTORY || "/inventory");
    return { success: true };
  } catch (error) {
    return handleError(error, "فشل تسجيل العهدة");
  }
}

export async function returnTrialItem(id: string) {
  try {
    await prisma.$transaction(async (tx) => {
      const trial = await tx.trialItem.findUnique({ where: { id } });
      
      if (!trial || !trial.sparePartId) {
        throw new Error("العهدة غير موجودة أو غير مرتبطة بقطعة غيار");
      }

      await tx.sparePart.update({
        where: { id: trial.sparePartId }, 
        data: { quantity: { increment: trial.qty } }
      });

      await tx.trialItem.delete({ where: { id } });
    });

    revalidatePath(ROUTES.WORKERS);
    return { success: true };
  } catch (error) {
    return handleError(error, "فشل إرجاع العهدة للمخزن");
  }
}

export async function consumeTrialItem(trialId: string) {
  try {
    await prisma.trialItem.update({
      where: { id: trialId },
      data: { status: "EXPIRED" } 
    });
    revalidatePath(ROUTES.TRIALS || "/trials");
    return { success: true };
  } catch (error) {
    return handleError(error, "فشل تحديث الحالة");
  }
}

export async function getPaginatedTrialItems(page: number, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;
    const [totalItems, trials] = await prisma.$transaction([
      prisma.trialItem.count(),
      prisma.trialItem.findMany({
        skip,
        take: limit,
        include: {
          worker: { select: { name: true } },
          sparePart: { select: { name: true } },
          ticket: { select: { id: true, customerName: true } }
        },
        orderBy: { givenAt: 'desc' }
      })
    ]);

    return { 
      success: true, 
      data: trials, 
      metadata: { totalItems, totalPages: Math.ceil(totalItems / limit), currentPage: page } 
    };
  } catch (error) {
    return handleError(error, "فشل جلب سجل العهد");
  }
}