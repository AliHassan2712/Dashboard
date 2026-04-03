"use server";

import prisma from "@/src/lib/prisma";

export async function getDashboardStats() {
  try {
    // تحديد بداية اليوم الحالي (الساعة 12:00 بالليل) لدقة الحسابات
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    // 1. جلب كل التذاكر مع الدفعات لحساب الديون والإيرادات الإجمالية
    const tickets = await prisma.ticket.findMany({
      include: { payments: true }
    });

    let totalExpectedRevenue = 0;
    let totalDebts = 0;

    tickets.forEach(ticket => {
      totalExpectedRevenue += ticket.totalCost;
      
      // حساب إجمالي المدفوع للتذكرة (الدفعة المقدمة + سجل الدفعات)
      const totalPaidForTicket = (ticket.advancePayment || 0) + ticket.payments.reduce((sum, p) => sum + p.amount, 0);
      const debt = ticket.totalCost - totalPaidForTicket;
      
      if (debt > 0) {
        totalDebts += debt;
      }
    });

    // 2. حساب كاش اليوم (دفعات عادية اليوم + مقدم تذاكر اليوم)
    const todaysPayments = await prisma.payment.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { amount: true }
    });
    
    const todaysAdvancePayments = await prisma.ticket.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { advancePayment: true }
    });

    const todaysCash = (todaysPayments._sum.amount || 0) + (todaysAdvancePayments._sum.advancePayment || 0);

    // 3. إحصائيات حالة التذاكر
    const statusCounts = {
      OPEN: await prisma.ticket.count({ where: { status: "OPEN" } }),
      IN_PROGRESS: await prisma.ticket.count({ where: { status: "IN_PROGRESS" } }),
      COMPLETED: await prisma.ticket.count({ where: { status: "COMPLETED" } }),
      CANCELED: await prisma.ticket.count({ where: { status: "CANCELED" } })
    };

    // 4. نواقص المخزون (بناءً على حد التنبيه لكل قطعة)
    const allParts = await prisma.sparePart.findMany();
    const lowStockParts = allParts.filter(part => part.quantity <= part.lowStockAlert).slice(0, 5);
    const lowStockCount = allParts.filter(part => part.quantity <= part.lowStockAlert).length;

    // 5. أحدث 5 تذاكر
    const recentTickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // ==========================================
    // 💰 القسم المالي (المصاريف والموردين)
    // ==========================================

    // 6. إجمالي مصاريف اليوم من الدرج
    const expensesToday = await prisma.expense.aggregate({
      where: { date: { gte: today } },
      _sum: { amount: true }
    });
    const todaysExpenses = expensesToday._sum.amount || 0;

    // 7. إجمالي ديون الموردين (المبالغ المستحقة للتجار علينا)
    const suppliersDebt = await prisma.supplier.aggregate({
      _sum: { totalDebt: true }
    });
    const totalSupplierDebts = suppliersDebt._sum.totalDebt || 0;

    // 8. صافي الصندوق لليوم
    const netCash = todaysCash - todaysExpenses;

    // ==========================================
    // 📊 بناء بيانات المخطط البياني (آخر 7 أيام)
    // ==========================================
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // جلب البيانات اللازمة للمخطط دفعة واحدة لتحسين الأداء
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
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return { error: "فشل في جلب إحصائيات لوحة التحكم" };
  }
}