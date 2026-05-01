"use server";

import prisma from "@/src/lib/prisma";
import { TransactionRecord, TransactionsSummary } from "@/src/types";
import { handleError } from "@/src/lib/errorHandler";

export async function getTransactionsData(
  page: number,
  limit: number = 10,
  filters: { startDate?: string; endDate?: string } = {}
) {
  try {
    const { startDate, endDate } = filters;
    const start = startDate ? new Date(startDate) : new Date(2000, 0, 1);
    const end = endDate ? new Date(endDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const [payments, tickets, expenses, supplierPayments, workerTxs] = await Promise.all([
      prisma.payment.findMany({ where: { createdAt: { gte: start, lte: end } }, include: { ticket: true } }),
      prisma.ticket.findMany({ where: { createdAt: { gte: start, lte: end }, advancePayment: { gt: 0 } } }),
      prisma.expense.findMany({ where: { date: { gte: start, lte: end } } }),
      prisma.supplierPayment.findMany({ where: { date: { gte: start, lte: end } }, include: { supplier: true } }),
      prisma.workerTransaction.findMany({ where: { date: { gte: start, lte: end }, type: { in: ['ADVANCE', 'PAYOUT'] } }, include: { user: true } })
    ]);

    const unified: TransactionRecord[] = [
      ...payments.map(p => ({ id: p.id, date: p.createdAt, type: "IN" as const, category: "دفعة صيانة", desc: `دفعة لتذكرة زبون: ${p.ticket.customerName}`, amount: p.amount })),
      ...tickets.map(t => ({ id: t.id, date: t.createdAt, type: "IN" as const, category: "عربون صيانة", desc: `دفعة مقدمة من الزبون: ${t.customerName}`, amount: t.advancePayment })),
      ...expenses.map(e => ({ id: e.id, date: e.date, type: "OUT" as const, category: "مصروف تشغيلي", desc: e.title, amount: e.amount })),
      ...supplierPayments.map(sp => ({ id: sp.id, date: sp.date, type: "OUT" as const, category: "دفعة مورد", desc: `تسديد للتاجر: ${sp.supplier.name} ${sp.notes ? '- ' + sp.notes : ''}`, amount: sp.amount })),
      ...workerTxs.map(wt => ({ id: wt.id, date: wt.date, type: "OUT" as const, category: wt.type === "ADVANCE" ? "سلفة عامل" : "تسليم راتب", desc: `العامل: ${wt.user.name}`, amount: wt.amount }))
    ];

    unified.sort((a, b) => b.date.getTime() - a.date.getTime());

    const summary: TransactionsSummary = unified.reduce((acc, curr) => {
      if (curr.type === "IN") acc.totalIn += curr.amount;
      else acc.totalOut += curr.amount;
      acc.net = acc.totalIn - acc.totalOut;
      return acc;
    }, { totalIn: 0, totalOut: 0, net: 0 });

    const totalItems = unified.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedData = unified.slice((page - 1) * limit, page * limit);

    return { 
      success: true, 
      data: paginatedData, 
      summary,
      metadata: { totalItems, totalPages, currentPage: page },
      allDataForExport: unified 
    };
  } catch (error) {
    return handleError(error, "فشل في جلب السجل المالي");
  }
}