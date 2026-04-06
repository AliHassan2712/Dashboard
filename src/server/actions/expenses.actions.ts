"use server";

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { ExpenseCategory } from "@prisma/client";
import { ROUTES } from "@/src/constants/paths";

export async function getFinancialOverview() {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const expenses = await prisma.expense.aggregate({ where: { date: { gte: firstDayOfMonth } }, _sum: { amount: true } });
    const purchases = await prisma.purchaseInvoice.aggregate({ where: { date: { gte: firstDayOfMonth } }, _sum: { totalAmount: true } });
    const suppliers = await prisma.supplier.aggregate({ _sum: { totalDebt: true } });

    return {
      success: true,
      data: {
        totalExpenses: expenses._sum.amount || 0,
        totalPurchases: purchases._sum.totalAmount || 0,
        totalDebts: suppliers._sum.totalDebt || 0,
      }
    };
  } catch (error) { return { error: "فشل جلب الإحصائيات المالية" }; }
}

export async function getExpenses() {
  try {
    const expenses = await prisma.expense.findMany({ orderBy: { date: 'desc' } });
    return { success: true, data: expenses };
  } catch (error) { return { error: "فشل جلب المصاريف" }; }
}

export async function addExpense(data: { title: string; amount: number; notes: string; category: ExpenseCategory }) {
  try {
    await prisma.expense.create({ data });
    revalidatePath(ROUTES.EXPENSES);
    return { success: true };
  } catch (error) { return { error: "فشل إضافة المصروف" }; }
}

export async function deleteExpense(id: string) {
  try {
    await prisma.expense.delete({ where: { id } });
    revalidatePath(ROUTES.EXPENSES);
    return { success: true };
  } catch (error) { return { error: "فشل الحذف" }; }
}

export async function getSuppliers() {
  try {
    const suppliers = await prisma.supplier.findMany({ orderBy: { name: 'asc' } });
    return { success: true, data: suppliers };
  } catch (error) { return { error: "فشل جلب الموردين" }; }
}

export async function addSupplier(data: { name: string; phone?: string }) {
  try {
    const newSupplier = await prisma.supplier.create({ data });
    revalidatePath(ROUTES.EXPENSES);
    return { success: true, data: newSupplier };
  } catch (error) { return { error: "فشل إضافة المورد" }; }
}

export async function getPurchaseInvoices() {
  try {
    const invoices = await prisma.purchaseInvoice.findMany({
      include: { supplier: { select: { name: true } } },
      orderBy: { date: 'desc' }
    });
    return { success: true, data: invoices };
  } catch (error) { return { error: "فشل جلب فواتير المشتريات" }; }
}

export async function addPurchaseInvoice(data: {
  supplierId: string;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  items: { 
    sparePartId: string; 
    isNew?: boolean; 
    newItemName?: string; 
    newItemSellingPrice?: number;
    quantity: number; 
    unitCost: number 
  }[]; 
}) {
  try {
    await prisma.$transaction(async (tx) => {
      const processedItems = [];
      for (const item of data.items) {
        let finalPartId = item.sparePartId;

        if (item.isNew && item.newItemName) {
          const newPart = await tx.sparePart.create({
            data: {
              name: item.newItemName,
              quantity: 0, 
              averageCost: item.unitCost,
              sellingPrice: item.newItemSellingPrice || (item.unitCost * 1.5), 
              lowStockAlert: 5
            }
          });
          finalPartId = newPart.id;
        }

        processedItems.push({
          sparePartId: finalPartId,
          quantity: item.quantity,
          unitCost: item.unitCost,
          notes: item.notes
        });
      }

      await tx.purchaseInvoice.create({
        data: {
          supplierId: data.supplierId,
          totalAmount: data.totalAmount,
          paidAmount: data.paidAmount,
          notes: data.notes,
          items: {
            create: processedItems.map(item => ({
              sparePartId: item.sparePartId,
              quantity: item.quantity,
              unitCost: item.unitCost
            }))
          }
        }
      });

      const remainingDebt = data.totalAmount - data.paidAmount;
      if (remainingDebt > 0) {
        await tx.supplier.update({
          where: { id: data.supplierId },
          data: { totalDebt: { increment: remainingDebt } }
        });
      }

      for (const item of processedItems) {
        const part = await tx.sparePart.findUnique({ where: { id: item.sparePartId } });
        if (part) {
          const oldQty = part.quantity;
          const oldCost = part.averageCost;
          const totalQty = oldQty + item.quantity;
          const newAverageCost = totalQty > 0 ? ((oldQty * oldCost) + (item.quantity * item.unitCost)) / totalQty : item.unitCost;

          await tx.sparePart.update({
            where: { id: item.sparePartId },
            data: { quantity: { increment: item.quantity }, averageCost: newAverageCost }
          });
        }
      }
    }, { maxWait: 10000, timeout: 20000 });

    revalidatePath(ROUTES.EXPENSES);
    revalidatePath(ROUTES.INVENTORY);
    return { success: true };
  } catch (error) { 
    return { error: "فشل إضافة الفاتورة وتحديث المخزون" }; 
  }
}

export async function getSupplierPayments() {
  try {
    const payments = await prisma.supplierPayment.findMany({
      include: { supplier: { select: { name: true } } },
      orderBy: { date: 'desc' }
    });
    return { success: true, data: payments };
  } catch (error) { return { error: "فشل جلب سجل الدفعات" }; }
}

export async function addSupplierPayment(data: { supplierId: string; amount: number; notes: string }) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.supplierPayment.create({ data: { supplierId: data.supplierId, amount: data.amount, notes: data.notes } });
      await tx.supplier.update({ where: { id: data.supplierId }, data: { totalDebt: { decrement: data.amount } } });
    });
    revalidatePath(ROUTES.EXPENSES);
    return { success: true };
  } catch (error) { return { error: "فشل تسجيل الدفعة" }; }
}

export async function updateSupplierPayment(paymentId: string, data: { amount: number; notes: string }) {
  try {
    await prisma.$transaction(async (tx) => {
      const oldPayment = await tx.supplierPayment.findUnique({ where: { id: paymentId } });
      if (!oldPayment) throw new Error("Payment not found");

      const difference = oldPayment.amount - data.amount;

      await tx.supplierPayment.update({
        where: { id: paymentId },
        data: { amount: data.amount, notes: data.notes }
      });

      await tx.supplier.update({
        where: { id: oldPayment.supplierId },
        data: { totalDebt: { increment: difference } }
      });
    });
    revalidatePath(ROUTES.EXPENSES);
    return { success: true };
  } catch (error) { return { error: "فشل تعديل الدفعة" }; }
}

export async function deleteSupplierPayment(paymentId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      const payment = await tx.supplierPayment.findUnique({ where: { id: paymentId } });
      if (!payment) throw new Error("Payment not found");

      await tx.supplier.update({
        where: { id: payment.supplierId },
        data: { totalDebt: { increment: payment.amount } }
      });

      await tx.supplierPayment.delete({ where: { id: paymentId } });
    });
    revalidatePath(ROUTES.EXPENSES);
    return { success: true };
  } catch (error) { return { error: "فشل حذف الدفعة" }; }
}

export async function getSupplierStatement(supplierId: string) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
      include: {
        invoices: { orderBy: { date: 'asc' } },
        payments: { orderBy: { date: 'asc' } }
      }
    });
    
    if (!supplier) return { error: "التاجر غير موجود" };
    return { success: true, data: supplier };
  } catch (error) { return { error: "فشل جلب كشف الحساب" }; }
}