"use server";

import prisma from "@/src/lib/prisma";
import { FinancialReportData } from "@/src/types";
import { handleError } from "@/src/lib/errorHandler";

export async function getFinancialReport(filters: { startDate?: string; endDate?: string } = {}) {
  try {
    const { startDate: startInput, endDate: endInput } = filters;

    const startDate = startInput ? new Date(startInput) : new Date(2000, 0, 1);
    const endDate = endInput ? new Date(endInput) : new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { error: "تواريخ غير صالحة" };
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const allTickets = await prisma.ticket.findMany({ include: { payments: true } });
    let totalCustomerDebts = 0;
    let allTimeTicketsRevenue = 0;

    allTickets.forEach(t => {
      const paid = (t.advancePayment || 0) + t.payments.reduce((sum, p) => sum + p.amount, 0);
      allTimeTicketsRevenue += paid;
      const debt = t.totalCost - paid;
      if (debt > 0) totalCustomerDebts += debt;
    });

    const allCompsSold = await prisma.compressor.aggregate({ where: { status: "SOLD" }, _sum: { sellingPrice: true } });
    const allTimeRevenue = allTimeTicketsRevenue + (allCompsSold._sum?.sellingPrice || 0);

    const allExpenses = await prisma.expense.aggregate({ _sum: { amount: true } });
    const allWorkerTx = await prisma.workerTransaction.aggregate({ where: { type: { in: ['PAYOUT', 'ADVANCE'] } }, _sum: { amount: true } });
    const allPurchasesCash = await prisma.purchaseInvoice.aggregate({ _sum: { paidAmount: true } });
    const allSupplierPayments = await prisma.supplierPayment.aggregate({ _sum: { amount: true } });

    const allTimeCosts = (allExpenses._sum?.amount || 0) + (allWorkerTx._sum?.amount || 0) + (allPurchasesCash._sum?.paidAmount || 0) + (allSupplierPayments._sum?.amount || 0);
    const totalNetCashAllTime = allTimeRevenue - allTimeCosts;
    const inventory = await prisma.sparePart.findMany({ select: { quantity: true, averageCost: true, sellingPrice: true } });

    const inventoryCost = inventory.reduce((acc, item) => {
      // إذا كانت التكلفة المتوسطة صفر، نستخدم سعر البيع مع خصم 30% كقيمة تقديرية لكي لا يظهر رأس المال صفر
      const cost = item.averageCost > 0 ? item.averageCost : (item.sellingPrice * 0.7);
      return acc + (item.quantity * cost);
    }, 0);
    const supplierDebts = await prisma.supplier.aggregate({ _sum: { totalDebt: true } });
    const totalSupplierDebts = supplierDebts._sum?.totalDebt || 0;

    const totalAssets = totalNetCashAllTime + totalCustomerDebts + inventoryCost - totalSupplierDebts;

    const [
      periodPayments,
      periodTicketsAdvance,
      periodCompressors,
      periodExpenses,
      periodWorkers,
      periodPurchasesCash,
      periodSupplierPayments
    ] = await Promise.all([
      prisma.payment.aggregate({ where: { createdAt: { gte: startDate, lte: endDate } }, _sum: { amount: true } }),
      prisma.ticket.aggregate({ where: { createdAt: { gte: startDate, lte: endDate } }, _sum: { advancePayment: true } }),
      prisma.compressor.aggregate({ where: { status: "SOLD", createdAt: { gte: startDate, lte: endDate } }, _sum: { sellingPrice: true } }),
      prisma.expense.aggregate({ where: { date: { gte: startDate, lte: endDate } }, _sum: { amount: true } }),
      prisma.workerTransaction.aggregate({ where: { date: { gte: startDate, lte: endDate }, type: { in: ['PAYOUT', 'ADVANCE'] } }, _sum: { amount: true } }),
      prisma.purchaseInvoice.aggregate({ where: { date: { gte: startDate, lte: endDate } }, _sum: { paidAmount: true } }),
      prisma.supplierPayment.aggregate({ where: { date: { gte: startDate, lte: endDate } }, _sum: { amount: true } })
    ]);

    const ticketsRev = (periodPayments._sum?.amount || 0) + (periodTicketsAdvance._sum?.advancePayment || 0);
    const compsRev = periodCompressors._sum?.sellingPrice || 0;
    const expCost = periodExpenses._sum?.amount || 0;
    const workersCost = periodWorkers._sum?.amount || 0;
    const purchasesCost = (periodPurchasesCash._sum?.paidAmount || 0) + (periodSupplierPayments._sum?.amount || 0);

    const periodRevenue = ticketsRev + compsRev;
    const periodCosts = expCost + workersCost + purchasesCost;
    const netCashPeriod = periodRevenue - periodCosts;

    const reportData: FinancialReportData = {
      totalAssets,
      inventoryCost,
      totalCustomerDebts,
      totalSupplierDebts,
      totalNetCashAllTime,
      totalRevenue: allTimeRevenue,
      totalCosts: allTimeCosts,
      netProfit: totalNetCashAllTime,
      period: {
        startDate: startInput,
        endDate: endInput,
        revenue: periodRevenue,
        expenses: expCost,
        purchasesPaid: purchasesCost,
        workerPayments: workersCost,
        netCash: netCashPeriod
      },
      ticketsRevenue: ticketsRev,
      compressorsRevenue: compsRev,
      generalExpenses: expCost,
      workersPayments: workersCost,
      purchasesCosts: purchasesCost
    };

    return { success: true, data: reportData };
  } catch (error) {
    return handleError(error, "فشل في إنشاء التقرير المالي");
  }
}