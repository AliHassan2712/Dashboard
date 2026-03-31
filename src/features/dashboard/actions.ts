"use server";

import prisma from "@/src/lib/prisma";

export async function getDashboardStats() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        partsUsed: true,
        payments: true,
      },
    });

    const lowStockParts = await prisma.sparePart.findMany({
      where: { quantity: { lte: prisma.sparePart.fields.lowStockAlert } },
      select: { id: true, name: true, quantity: true, lowStockAlert: true },
      take: 5 
    });

    let totalExpectedRevenue = 0; 
    let totalPaid = 0; 
    let todaysCash = 0; // 👈 المتغير الجديد للكاش اليومي
    const statusCounts = { OPEN: 0, IN_PROGRESS: 0, WAITING_FOR_PARTS: 0, COMPLETED: 0 };

    // تحديد بداية اليوم الحالي لحساب كاش اليوم فقط
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    tickets.forEach(ticket => {
      const partsTotal = ticket.partsUsed.reduce((sum, p) => sum + (p.priceAtTime * p.quantity), 0);
      const subTotal = partsTotal + ticket.laborCost;
      const discountAmount = subTotal * (ticket.discount / 100);
      const grandTotal = subTotal - discountAmount;
      
      let ticketPaid = 0;
      
      // حساب الدفعة المقدمة وهل تمت اليوم؟
      ticketPaid += ticket.advancePayment;
      if (new Date(ticket.createdAt) >= todayStart) {
        todaysCash += ticket.advancePayment;
      }

      // حساب الدفعات الإضافية وهل تمت اليوم؟
      ticket.payments.forEach(p => {
        ticketPaid += p.amount;
        if (new Date(p.createdAt) >= todayStart) {
          todaysCash += p.amount;
        }
      });
      
      totalExpectedRevenue += grandTotal;
      totalPaid += ticketPaid;
      
      if (ticket.status === "OPEN") statusCounts.OPEN++;
      if (ticket.status === "IN_PROGRESS") statusCounts.IN_PROGRESS++;
      if (ticket.status === "WAITING_FOR_PARTS") statusCounts.WAITING_FOR_PARTS++;
      if (ticket.status === "COMPLETED") statusCounts.COMPLETED++;
    });

    const totalDebts = totalExpectedRevenue - totalPaid;

    const last7Days = Array.from({length: 7}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0]; 
    }).reverse();

    const chartData = last7Days.map(date => {
      const count = tickets.filter(t => t.createdAt.toISOString().split('T')[0] === date).length;
      const shortDate = new Date(date).toLocaleDateString('ar-EG', { month: 'numeric', day: 'numeric' });
      return { name: shortDate, "التذاكر": count };
    });

    const lowStockCount = await prisma.sparePart.count({
      where: { quantity: { lte: prisma.sparePart.fields.lowStockAlert } }
    });

    // 👈 جلب أحدث 5 تذاكر فقط وترتيبهم من الأحدث للأقدم
    const recentTickets = [...tickets]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        customerName: t.customerName,
        status: t.status,
        createdAt: t.createdAt
      }));

    return {
      success: true,
      data: {
        totalTickets: tickets.length,
        totalDebts,
        totalExpectedRevenue,
        todaysCash, // 👈 إرجاع الكاش اليومي
        statusCounts,
        lowStockParts,
        lowStockCount,
        chartData,
        recentTickets // 👈 إرجاع أحدث التذاكر
      }
    };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return { error: "فشل في تحميل إحصائيات لوحة التحكم" };
  }
}