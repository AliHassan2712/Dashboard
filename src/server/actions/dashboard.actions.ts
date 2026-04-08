"use server";

import prisma from "@/src/lib/prisma";

export async function getDashboardStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const tickets = await prisma.ticket.findMany({
      include: { payments: true }
    });

    let totalExpectedRevenue = 0;
    let totalDebts = 0;

    tickets.forEach(ticket => {
      totalExpectedRevenue += ticket.totalCost;
      const totalPaidForTicket = (ticket.advancePayment || 0) + ticket.payments.reduce((sum, p) => sum + p.amount, 0);
      const debt = ticket.totalCost - totalPaidForTicket;
      if (debt > 0) totalDebts += debt;
    });

    const todaysPayments = await prisma.payment.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { amount: true }
    });
    
    const todaysAdvancePayments = await prisma.ticket.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { advancePayment: true }
    });

    const todaysCash = (todaysPayments._sum.amount || 0) + (todaysAdvancePayments._sum.advancePayment || 0);

    const statusCounts = {
      OPEN: await prisma.ticket.count({ where: { status: "OPEN" } }),
      IN_PROGRESS: await prisma.ticket.count({ where: { status: "IN_PROGRESS" } }),
      COMPLETED: await prisma.ticket.count({ where: { status: "COMPLETED" } }),
      CANCELED: await prisma.ticket.count({ where: { status: "CANCELED" } })
    };

    const allParts = await prisma.sparePart.findMany();
    const lowStockParts = allParts.filter(part => part.quantity <= part.lowStockAlert).slice(0, 5);
    const lowStockCount = allParts.filter(part => part.quantity <= part.lowStockAlert).length;

    const recentTickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const expensesToday = await prisma.expense.aggregate({
      where: { date: { gte: today } },
      _sum: { amount: true }
    });
    const todaysExpenses = expensesToday._sum.amount || 0;

    const suppliersDebt = await prisma.supplier.aggregate({
      _sum: { totalDebt: true }
    });
    const totalSupplierDebts = suppliersDebt._sum.totalDebt || 0;

    const netCash = todaysCash - todaysExpenses;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [pms, tks, exs] = await Promise.all([
      prisma.payment.findMany({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.ticket.findMany({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.expense.findMany({ where: { date: { gte: sevenDaysAgo } } })
    ]);

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dayName = date.toLocaleDateString('ar-EG', { weekday: 'short' });

      const isSameDay = (d1: Date, d2: Date) => 
        d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

      const dayRevenue = 
        pms.filter(p => isSameDay(p.createdAt, date)).reduce((s, p) => s + p.amount, 0) +
        tks.filter(t => isSameDay(t.createdAt, date)).reduce((s, t) => s + (t.advancePayment || 0), 0);
      
      const dayExpense = exs.filter(e => isSameDay(e.date, date)).reduce((s, e) => s + e.amount, 0);

      chartData.push({
        name: dayName,
        revenue: dayRevenue,
        expenses: dayExpense
      });
    }

    return {
      success: true,
      data: {
        totalTickets: tickets.length,
        totalExpectedRevenue,
        totalDebts,
        statusCounts,
        lowStockParts,
        lowStockCount,
        recentTickets,
        chartData, 
        todaysCash,
        todaysExpenses,
        netCash,
        totalSupplierDebts,
      }
    };
  } catch (_error) {
    return { error: "فشل في جلب إحصائيات لوحة التحكم" };
  }
}

export async function getWorkerDashboardStats(workerId: string) {
  try {
    const openTicketsCount = await prisma.ticket.count({
      where: { workerId, status: { in: ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_PARTS'] } }
    });

    const transactions = await prisma.workerTransaction.findMany({
      where: { userId: workerId }
    });

    const balance = transactions.reduce((acc, tx) => {
      if (tx.type === 'STAKE' || tx.type === 'BONUS') return acc + tx.amount;
      if (tx.type === 'ADVANCE' || tx.type === 'PAYOUT') return acc - tx.amount;
      return acc;
    }, 0);

    const activeTrials = await prisma.trialItem.count({
      where: { workerId, status: 'ACTIVE' }
    });

    return { success: true, data: { openTicketsCount, balance, activeTrials } };
  } catch (_error) {
    return { error: "فشل جلب بيانات الفني" };
  }
}