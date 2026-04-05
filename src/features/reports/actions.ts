"use server";

import prisma from "@/src/lib/prisma";

// تعديل الدالة لتستقبل كائن يحتوي على التواريخ أو المتغيرات مباشرة
export async function getFinancialReport(filters: { startDate?: string; endDate?: string } = {}) {
  try {
    const { startDate: startInput, endDate: endInput } = filters;

    // تحويل التواريخ ومعالجتها
    const startDate = startInput ? new Date(startInput) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endDate = endInput ? new Date(endInput) : new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { error: "تواريخ غير صالحة" };
    }

    // ضبط الوقت لضمان شمول اليوم بالكامل
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // حساب البيانات المطلوبة للـ Template (الميزانية الشاملة والتدفقات)
    const [
      payments, 
      compressorSales, 
      expenses, 
      workerPayouts,
      inventory,
      customerDebts,
      supplierDebts
    ] = await Promise.all([
      // إيرادات التذاكر في الفترة
      prisma.payment.aggregate({
        where: { createdAt: { gte: startDate, lte: endDate } },
        _sum: { amount: true }
      }),
      // مبيعات الكمبريسورات في الفترة
      prisma.compressor.aggregate({
        where: { status: "SOLD", createdAt: { gte: startDate, lte: endDate } },
        _sum: { sellingPrice: true, productionCost: true }
      }),
      // المصاريف في الفترة
      prisma.expense.aggregate({
        where: { date: { gte: startDate, lte: endDate } },
        _sum: { amount: true }
      }),
      // رواتب وسلف في الفترة
      prisma.workerTransaction.aggregate({
        where: { date: { gte: startDate, lte: endDate }, type: { in: ['PAYOUT', 'ADVANCE'] } },
        _sum: { amount: true }
      }),
      // --- بيانات الميزانية الثابتة (تراكمي) ---
      prisma.sparePart.findMany({ select: { quantity: true, averageCost: true } }),
      prisma.ticket.aggregate({ where: { status: { not: 'COMPLETED' } }, _sum: { totalCost: true } }), 
      prisma.supplier.aggregate({ _sum: { totalDebt: true } })
    ]);

    // حساب قيمة المخزن
    const inventoryVal = inventory.reduce((acc, item) => acc + (item.quantity * item.averageCost), 0);
    
    const ticketsRev = payments._sum?.amount || 0;
    const compsRev = compressorSales._sum?.sellingPrice || 0;
    const expCost = expenses._sum?.amount || 0;
    const workersCost = workerPayouts._sum?.amount || 0;
    const purchasesCost = compressorSales._sum?.productionCost || 0;

    const netCashPeriod = (ticketsRev + compsRev) - (expCost + workersCost);

    return {
      success: true,
      data: {
        totalAssets: inventoryVal + (customerDebts._sum?.totalCost || 0) + netCashPeriod, // حساب تقريبي للأصول
        inventoryCost: inventoryVal,
        totalCustomerDebts: customerDebts._sum?.totalCost || 0,
        totalSupplierDebts: supplierDebts._sum?.totalDebt || 0,
        totalNetCashAllTime: netCashPeriod, // يمكن جلب إجمالي الصندوق الحقيقي هنا
        totalRevenue: ticketsRev + compsRev,
        totalCosts: expCost + workersCost + purchasesCost,
        netProfit: (ticketsRev + compsRev) - (expCost + workersCost + purchasesCost),
        // الحقول المطلوبة للـ Template
        period: {
          startDate: startInput,
          endDate: endInput,
          revenue: ticketsRev + compsRev,
          expenses: expCost,
          purchasesPaid: purchasesCost,
          workerPayments: workersCost,
          netCash: netCashPeriod
        },
        // الحقول المطلوبة لـ Excel
        ticketsRevenue: ticketsRev,
        compressorsRevenue: compsRev,
        generalExpenses: expCost,
        workersPayments: workersCost,
        purchasesCosts: purchasesCost
      }
    };
  } catch (error: any) {
    console.error("Report Action Error:", error);
    return { error: "فشل في إنشاء التقرير: " + error.message };
  }
}