"use server";

import prisma from "@/src/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function registerWorker(data: any) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        password: hashedPassword,
        baseSalary: Number(data.baseSalary || 0),
        role: "WORKER",
      },
    });
    revalidatePath("/workers");
    return { success: true };
  } catch (error: any) {
    return { error: "فشل إضافة العامل: " + (error.code === 'P2002' ? "الرقم مسجل مسبقاً" : "خطأ تقني") };
  }
}

export async function getWorkersWithBalance() {
  try {
    const workers = await prisma.user.findMany({
      where: { role: "WORKER" },
      include: { transactions: true },
    });

    return workers.map(worker => {
      const currentBalance = worker.transactions.reduce((acc, t) => {
        if (t.type === "STAKE" || t.type === "BONUS") return acc + t.amount;
        if (t.type === "ADVANCE" || t.type === "PAYOUT") return acc - t.amount;
        return acc;
      }, 0);
      return { ...worker, currentBalance };
    });
  } catch (error) { return []; }
}

export async function addWorkerTransaction(data: { 
  userId: string, 
  amount: number, 
  type: string, 
  description: string,
}) {
  try {
    await prisma.workerTransaction.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        type: data.type,
        description: data.description,
      }
    });
    revalidatePath("/workers");
    return { success: true };
  } catch (error) {
    return { error: "فشل تسجيل العملية" };
  }
}

export async function deleteWorker(userId: string) {
  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/workers");
    return { success: true };
  } catch (error) { return { error: "فشل الحذف" }; }
}


export async function getWorkerDetails(userId: string) {
  try {
    const worker = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        transactions: {
          orderBy: { date: 'desc' } // الأحدث أولاً
        }
      }
    });

    if (!worker) return { error: "العامل غير موجود" };

    // حساب الرصيد الحالي
    const balance = worker.transactions.reduce((acc, t) => {
      if (t.type === "STAKE" || t.type === "BONUS") return acc + t.amount;
      if (t.type === "ADVANCE" || t.type === "PAYOUT") return acc - t.amount;
      return acc;
    }, 0);

    return { success: true, data: { ...worker, balance } };
  } catch (error) {
    return { error: "فشل في جلب سجل العامل" };
  }
}