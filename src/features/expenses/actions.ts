"use server";

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { ExpenseCategory } from "@prisma/client";

// ==========================================
// 1. جلب الإحصائيات العلوية للصفحة
// ==========================================
export async function getFinancialOverview() {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // مجموع المصاريف هذا الشهر
    const expenses = await prisma.expense.aggregate({
      where: { date: { gte: firstDayOfMonth } },
      _sum: { amount: true }
    });

    // مجموع مشتريات هذا الشهر
    const purchases = await prisma.purchaseInvoice.aggregate({
      where: { date: { gte: firstDayOfMonth } },
      _sum: { totalAmount: true }
    });

    // إجمالي ديون الموردين (استخدمنا totalDebt حسب الداتا بيز عندك)
    const suppliers = await prisma.supplier.aggregate({
      _sum: { totalDebt: true }
    });

    return {
      success: true,
      data: {
        totalExpenses: expenses._sum.amount || 0,
        totalPurchases: purchases._sum.amount || 0,
        totalDebts: suppliers._sum.totalDebt || 0,
      }
    };
  } catch (error) {
    return { error: "فشل جلب الإحصائيات المالية" };
  }
}

// ==========================================
// 2. عمليات المصاريف (Expenses)
// ==========================================

// جلب كل المصاريف
export async function getExpenses() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' }
    });
    return { success: true, data: expenses };
  } catch (error) {
    return { error: "فشل جلب المصاريف" };
  }
}

// إضافة مصروف جديد (مطابق لحقول جدول Expense عندك)
export async function addExpense(data: { title: string; amount: number; notes: string; category: ExpenseCategory }) {
  try {
    await prisma.expense.create({
      data: {
        title: data.title,
        amount: data.amount,
        notes: data.notes,
        category: data.category,
      }
    });
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    return { error: "فشل إضافة المصروف" };
  }
}

// حذف مصروف
export async function deleteExpense(id: string) {
  try {
    await prisma.expense.delete({ where: { id } });
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    return { error: "فشل الحذف" };
  }
}


// ==========================================
// 3. عمليات الموردين والمشتريات (Purchases & Suppliers)
// ==========================================

// جلب كل الموردين لاستخدامهم في القائمة المنسدلة
export async function getSuppliers() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' }
    });
    return { success: true, data: suppliers };
  } catch (error) {
    return { error: "فشل جلب الموردين" };
  }
}

// إضافة مورد (تاجر) جديد
export async function addSupplier(data: { name: string; phone?: string }) {
  try {
    const newSupplier = await prisma.supplier.create({ data });
    revalidatePath("/expenses");
    return { success: true, data: newSupplier };
  } catch (error) {
    return { error: "فشل إضافة المورد" };
  }
}

// جلب فواتير المشتريات مع اسم المورد
export async function getPurchaseInvoices() {
  try {
    const invoices = await prisma.purchaseInvoice.findMany({
      include: { supplier: { select: { name: true } } },
      orderBy: { date: 'desc' }
    });
    return { success: true, data: invoices };
  } catch (error) {
    return { error: "فشل جلب فواتير المشتريات" };
  }
}

// إضافة فاتورة مشتريات وتحديث دين التاجر أوتوماتيكياً
export async function addPurchaseInvoice(data: {
  supplierId: string;
  totalAmount: number;
  paidAmount: number;
}) {
  try {
    // 1. تسجيل الفاتورة
    await prisma.purchaseInvoice.create({
      data: {
        supplierId: data.supplierId,
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount,
      }
    });

    // 2. تحديث ديون المورد (نضيف عليه المبلغ المتبقي غير المدفوع)
    const remainingDebt = data.totalAmount - data.paidAmount;
    if (remainingDebt > 0) {
      await prisma.supplier.update({
        where: { id: data.supplierId },
        data: {
          totalDebt: { increment: remainingDebt }
        }
      });
    }

    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    return { error: "فشل إضافة الفاتورة" };
  }
}



// ==========================================
// 4. سجل دفعات الموردين (Supplier Payments)
// ==========================================

// جلب سجل الدفعات
export async function getSupplierPayments() {
  try {
    const payments = await prisma.supplierPayment.findMany({
      include: { supplier: { select: { name: true } } },
      orderBy: { date: 'desc' }
    });
    return { success: true, data: payments };
  } catch (error) {
    return { error: "فشل جلب سجل الدفعات" };
  }
}

// تسديد دفعة من الحساب (تقليل الدين)
export async function addSupplierPayment(data: { supplierId: string; amount: number; notes: string }) {
  try {
    // 1. تسجيل الدفعة في السجل
    await prisma.supplierPayment.create({
      data: {
        supplierId: data.supplierId,
        amount: data.amount,
        notes: data.notes,
      }
    });

    // 2. تنزيل المبلغ من ديون التاجر
    await prisma.supplier.update({
      where: { id: data.supplierId },
      data: {
        totalDebt: { decrement: data.amount }
      }
    });

    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    return { error: "فشل تسجيل الدفعة" };
  }
}