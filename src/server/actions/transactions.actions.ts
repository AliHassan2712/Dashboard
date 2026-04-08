"use server";

import prisma from "@/src/lib/prisma";

export async function getAllTransactions(filters: { startDate?: string; endDate?: string }) {
  try {
    const { startDate, endDate } = filters;
    const start = startDate ? new Date(startDate) : new Date(2000, 0, 1);
    const end = endDate ? new Date(endDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // جلب البيانات من 5 جداول مختلفة
    const [payments, tickets, expenses, supplierPayments, workerTxs] = await Promise.all([
      prisma.payment.findMany({ where: { createdAt: { gte: start, lte: end } }, include: { ticket: true } }),
      prisma.ticket.findMany({ where: { createdAt: { gte: start, lte: end }, advancePayment: { gt: 0 } } }),
      prisma.expense.findMany({ where: { date: { gte: start, lte: end } } }),
      prisma.supplierPayment.findMany({ where: { date: { gte: start, lte: end } }, include: { supplier: true } }),
      prisma.workerTransaction.findMany({ where: { date: { gte: start, lte: end }, type: { in: ['ADVANCE', 'PAYOUT'] } }, include: { user: true } })
    ]);

    // توحيد البيانات في مصفوفة واحدة
    const unified = [
      ...payments.map(p => ({ id: p.id, date: p.createdAt, type: "IN", category: "دفعة صيانة", desc: `دفعة لتذكرة زبون: ${p.ticket.customerName}`, amount: p.amount })),
      ...tickets.map(t => ({ id: t.id, date: t.createdAt, type: "IN", category: "عربون صيانة", desc: `دفعة مقدمة من الزبون: ${t.customerName}`, amount: t.advancePayment })),
      ...expenses.map(e => ({ id: e.id, date: e.date, type: "OUT", category: "مصروف تشغيلي", desc: e.title, amount: e.amount })),
      ...supplierPayments.map(sp => ({ id: sp.id, date: sp.date, type: "OUT", category: "دفعة مورد", desc: `تسديد للتاجر: ${sp.supplier.name} ${sp.notes ? '- ' + sp.notes : ''}`, amount: sp.amount })),
      ...workerTxs.map(wt => ({ id: wt.id, date: wt.date, type: "OUT", category: wt.type === "ADVANCE" ? "سلفة عامل" : "تسليم راتب", desc: `العامل: ${wt.user.name}`, amount: wt.amount }))
    ];

    // ترتيب من الأحدث للأقدم
    unified.sort((a, b) => b.date.getTime() - a.date.getTime());

    return { success: true, data: unified };
  } catch (_error) {
    return { error: "فشل في جلب السجل المالي" };
  }
}