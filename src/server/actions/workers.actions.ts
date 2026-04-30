"use server";

import prisma from "@/src/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/src/constants/paths";
import { TypesWorkerTransaction } from "@prisma/client";
import { handleError } from "@/src/lib/errorHandler";

export async function registerWorker(data: { name: string; phone: string; password: string; baseSalary?: string | number }) {
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
    revalidatePath(ROUTES.WORKERS);
    return { success: true };
  } catch (error: any) {
    return handleError(error, "فشل إضافة العامل: " + (error.code === 'P2002' ? "الرقم مسجل مسبقاً" : "خطأ تقني"));
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
  } catch (error) { 
    handleError(error, "فشل جلب العمال");
    return []; 
  }
}

export async function addWorkerTransaction(data: { 
  userId: string, 
  amount: number, 
  type: TypesWorkerTransaction, 
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
    revalidatePath(ROUTES.WORKERS);
    return { success: true };
  } catch (error) {
    return handleError(error, "فشل تسجيل العملية");
  }
}

export async function deleteWorker(userId: string) {
  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath(ROUTES.WORKERS);
    return { success: true };
  } catch (error) { 
    return handleError(error, "فشل الحذف"); 
  }
}

export async function getWorkerDetails(userId: string) {
  try {
    const worker = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!worker) return { error: "العامل غير موجود" };

    const transactions = await prisma.workerTransaction.findMany({
      where: { userId }
    });

    const currentBalance = transactions.reduce((acc, t) => {
      if (t.type === "STAKE" || t.type === "BONUS") return acc + t.amount;
      if (t.type === "ADVANCE" || t.type === "PAYOUT") return acc - t.amount;
      return acc;
    }, 0);

    return { success: true, data: { ...worker, currentBalance } };
  } catch (error) {
    return handleError(error, "فشل في جلب سجل العامل");
  }
}

export async function getPaginatedWorkerTransactions(userId: string, page: number, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;
    const [totalItems, transactions] = await prisma.$transaction([
      prisma.workerTransaction.count({ where: { userId } }),
      prisma.workerTransaction.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { date: 'desc' }
      })
    ]);

    return {
      success: true,
      data: transactions,
      metadata: { totalItems, totalPages: Math.ceil(totalItems / limit), currentPage: page }
    };
  } catch (error) {
    return handleError(error, "فشل جلب الحركات المالية للعامل");
  }
}