"use server"; 

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/src/lib/auth"; 
import { UpdateTicketInput } from "@/src/types";
import { CreateTicketValues } from "@/src/features/tickets/validations/validations";
import { ROUTES } from "@/src/constants/paths";
import { deleteFilesFromUploadThing } from "./uploadthing.actions";

// ==========================================
// 1. إنشاء وتعديل التذاكر
// ==========================================
export async function createTicket(data: CreateTicketValues) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "يجب تسجيل الدخول أولاً" };

  try {
    const ticket = await prisma.ticket.create({
      data: {
        ...data,
        workerId: session.user.id, 
      }
    });
    revalidatePath(ROUTES.TICKETS);
    return { success: true, data: ticket };
  } catch (_error) {
    return { error: "خطأ في الحفظ" };
  }
}

export async function updateTicket(ticketId: string, data: UpdateTicketInput) {
  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: data,
    });
    revalidatePath(ROUTES.TICKET_DETAILS(ticketId));
    revalidatePath(ROUTES.TICKETS);
    return { success: true, data: updatedTicket };
  } catch (_error) {
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
  } catch (_error) {
    return { error: "حدث خطأ أثناء قراءة التذكرة من قاعدة البيانات." };
  }
}

export async function getAllTickets() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        partsUsed: true,
        worker: { select: { name: true } }
      } 
    });
    return { success: true, data: tickets };
  } catch (_error) {
    return { error: "تعذر جلب التذاكر." };
  }
}

// ==========================================
// 2. دوال الدفعات وصورة الفاتورة
// ==========================================
export async function addPaymentToTicket(ticketId: string, amount: number) {
  try {
    await prisma.payment.create({
      data: { ticketId, amount, notes: "دفعة إضافية" }
    });
    revalidatePath(ROUTES.TICKET_DETAILS(ticketId));
    return { success: true };
  } catch (_error) {
    return { error: "فشل تسجيل الدفعة." };
  }
}

export async function updateTicketInvoiceImage(ticketId: string, imageUrl: string) {
  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { invoiceImageUrl: imageUrl }
    });
    revalidatePath(ROUTES.TICKET_DETAILS(ticketId));
    return { success: true };
  } catch (_error) {
    return { error: "فشل حفظ صورة الفاتورة." };
  }
}

// ==========================================
// 3. دوال الجرد (سحب وإرجاع القطع)
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

    revalidatePath(ROUTES.TICKET_DETAILS(data.ticketId));
    return { success: true, data: result };
  } catch (_error) {
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

    revalidatePath(ROUTES.TICKET_DETAILS(ticketId));
    return { success: true };
  } catch (_error) {
    return { error: "حدث خطأ أثناء إرجاع القطعة للمخزون." };
  }
}



export async function deleteTicket(ticketId: string) {
  try {
    // 1. جلب التذكرة أولاً للتحقق من وجود صور مرفقة
    const ticket = await prisma.ticket.findUnique({ 
      where: { id: ticketId },
      select: { invoiceImageUrl: true } 
    });

    // 2. حذف التذكرة من قاعدة البيانات
    await prisma.ticket.delete({ where: { id: ticketId } });

    // 3. تنظيف السحابة: إذا كان هناك صور، قم بحذفها فيزيائياً
    if (ticket?.invoiceImageUrl) {
      const urlsToDelete = ticket.invoiceImageUrl.split(',').filter(Boolean);
      if (urlsToDelete.length > 0) {
        // لا ننتظر النتيجة (await) لكي لا نؤخر استجابة الواجهة للمستخدم
        deleteFilesFromUploadThing(urlsToDelete).catch(err => 
          console.error("Failed to cleanup ticket images in background:", err)
        );
      }
    }

    revalidatePath(ROUTES.TICKETS);
    return { success: true };
  } catch (_error) {
    return { error: "لا يمكن حذف التذكرة لاحتوائها على حركات مالية أو قطع مستهلكة. يرجى تصفيتها أولاً." };
  }
}