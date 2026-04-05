"use server"; 

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/src/lib/auth"; 
import { UpdateTicketInput } from "@/src/types";





export async function createTicket(data: any) {
  const session = await getServerSession(authOptions); // جلب المستخدم الحالي
  
  if (!session) return { error: "يجب تسجيل الدخول أولاً" };

  try {
    const ticket = await prisma.ticket.create({
      data: {
        ...data,
        workerId: session.user.id, 
      }
    });
    return { success: true, data: ticket };
  } catch (e) {
    return { error: "خطأ في الحفظ" };
  }
}
export async function updateTicket(ticketId: string, data: UpdateTicketInput) {
  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: data,
    });
    revalidatePath(`/tickets/${ticketId}`);
    revalidatePath("/tickets");
    return { success: true, data: updatedTicket };
  } catch (error) {
    console.error("Update Ticket Error:", error);
    return { error: "حدث خطأ أثناء تعديل بيانات التذكرة." };
  }
}

export async function getTicketById(ticketId: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        partsUsed: { include: { sparePart: true } },
        worker: { select: { name: true } },
        payments: { orderBy: { createdAt: 'desc' } } 
      }
    });
    
    if (!ticket) return { error: "لم يتم العثور على هذه التذكرة." };
    
    return { success: true, data: ticket };
  } catch (error) {
    console.error("Get Ticket Error:", error);
    return { error: "حدث خطأ أثناء قراءة التذكرة من قاعدة البيانات." };
  }
}

export async function getAllTickets() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        partsUsed: true,
        worker: { select: { name: true } } // مفيد لو أردنا عرض اسم الموظف في الجدول الرئيسي
      } 
    });
    return { success: true, data: tickets };
  } catch (error) {
    console.error("Get All Tickets Error:", error);
    return { error: "تعذر جلب التذاكر." };
  }
}

// ==========================================
// 3. دوال الدفعات وصورة الفاتورة
// ==========================================

export async function addPaymentToTicket(ticketId: string, amount: number) {
  try {
    await prisma.payment.create({
      data: {
        ticketId,
        amount,
        notes: "دفعة إضافية"
      }
    });
    revalidatePath(`/tickets/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Add Payment Error:", error);
    return { error: "فشل تسجيل الدفعة." };
  }
}

export async function updateTicketInvoiceImage(ticketId: string, imageUrl: string) {
  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { invoiceImageUrl: imageUrl }
    });
    revalidatePath(`/tickets/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Update Invoice Image Error:", error);
    return { error: "فشل حفظ صورة الفاتورة." };
  }
}

// ==========================================
// 4. دوال الجرد (سحب وإرجاع القطع)
// ==========================================

export async function addPartToTicket(data: { ticketId: string; sparePartId: string; quantity: number }) {
  try {
    const sparePart = await prisma.sparePart.findUnique({ where: { id: data.sparePartId } });
    if (!sparePart || sparePart.quantity < data.quantity) {
      return { error: "الكمية غير كافية بالمخزون." };
    }

    const result = await prisma.$transaction(async (tx) => {
      const ticketPart = await tx.ticketPart.create({
        data: {
          ticketId: data.ticketId,
          sparePartId: data.sparePartId,
          quantity: data.quantity,
          priceAtTime: sparePart.sellingPrice, 
        }
      });
      await tx.sparePart.update({
        where: { id: data.sparePartId },
        data: { quantity: { decrement: data.quantity } }
      });
      return ticketPart;
    });

    revalidatePath(`/tickets/${data.ticketId}`);
    return { success: true, data: result };
  } catch (error) {
    console.error("Add Part To Ticket Error:", error);
    return { error: "حدث خطأ أثناء سحب القطعة من المخزون." };
  }
}

export async function removePartFromTicket(ticketPartId: string, ticketId: string) {
  try {
    const ticketPart = await prisma.ticketPart.findUnique({ where: { id: ticketPartId } });
    if (!ticketPart) return { error: "القطعة غير موجودة." };

    await prisma.$transaction(async (tx) => {
      await tx.ticketPart.delete({ where: { id: ticketPartId } });
      await tx.sparePart.update({
        where: { id: ticketPart.sparePartId },
        data: { quantity: { increment: ticketPart.quantity } }
      });
    });

    revalidatePath(`/tickets/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Remove Part From Ticket Error:", error);
    return { error: "حدث خطأ أثناء إرجاع القطعة للمخزون." };
  }
}