"use server";

import prisma from "@/src/lib/prisma";
import { FinancialReportData } from "@/src/types";

export async function getFinancialReport(filters: { startDate?: string; endDate?: string } = {}) {
  try {
    const { startDate: startInput, endDate: endInput } = filters;

    // ضبط التواريخ
    const startDate = startInput ? new Date(startInput) : new Date(2000, 0, 1); // من البداية
    const endDate = endInput ? new Date(endInput) : new Date();
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { error: "تواريخ غير صالحة" };
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // ==========================================
    // 1. الإحصائيات التراكمية (لكل الأوقات - للميزانية)
    // ==========================================
    
    // جلب كل التذاكر لحساب ديون الزبائن والسيولة الكلية
    const allTickets = await prisma.ticket.findMany({ include: { payments: true } });
    let totalCustomerDebts = 0;
    let allTimeTicketsRevenue = 0;

    allTickets.forEach(t => {
      const paid = (t.advancePayment || 0) + t.payments.reduce((sum, p) => sum + p.amount, 0);
      allTimeTicketsRevenue += paid;
      const debt = t.totalCost - paid;
      if (debt > 0) totalCustomerDebts += debt;
    });

    // السيولة الكلية (الداخل)
    const allCompsSold = await prisma.compressor.aggregate({ where: { status: "SOLD" }, _sum: { sellingPrice: true } });
    const allTimeRevenue = allTimeTicketsRevenue + (allCompsSold._sum?.sellingPrice || 0);

    // السيولة الكلية (الخارج)
    const allExpenses = await prisma.expense.aggregate({ _sum: { amount: true } });
    const allWorkerTx = await prisma.workerTransaction.aggregate({ where: { type: { in: ['PAYOUT', 'ADVANCE'] } }, _sum: { amount: true } });
    const allPurchasesCash = await prisma.purchaseInvoice.aggregate({ _sum: { paidAmount: true } });
    const allSupplierPayments = await prisma.supplierPayment.aggregate({ _sum: { amount: true } });

    const allTimeCosts = (allExpenses._sum?.amount || 0) + (allWorkerTx._sum?.amount || 0) + (allPurchasesCash._sum?.paidAmount || 0) + (allSupplierPayments._sum?.amount || 0);
    const totalNetCashAllTime = allTimeRevenue - allTimeCosts;

    // الميزانية الثابتة
    const inventory = await prisma.sparePart.findMany({ select: { quantity: true, averageCost: true } });
    const inventoryCost = inventory.reduce((acc, item) => acc + (item.quantity * item.averageCost), 0);
    const supplierDebts = await prisma.supplier.aggregate({ _sum: { totalDebt: true } });
    const totalSupplierDebts = supplierDebts._sum?.totalDebt || 0;

    // صافي أصول الورشة الحقيقية (المعادلة المحاسبية)
    const totalAssets = totalNetCashAllTime + totalCustomerDebts + inventoryCost - totalSupplierDebts;

    // ==========================================
    // 2. التدفقات النقدية خلال الفترة المحددة (للفلتر)
    // ==========================================

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
      netProfit: totalNetCashAllTime, // تراكمي
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
  } catch (error: any) {
    return { error: "فشل في إنشاء التقرير المالي" };
  }
}