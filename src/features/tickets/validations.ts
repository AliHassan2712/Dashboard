import * as z from "zod";

export const createTicketSchema = z.object({
  customerName: z.string().min(2, "الرجاء إدخال اسم الزبون"),
  customerPhone: z.string().min(9, "يجب أن يكون 9 أرقام على الأقل"),
  compressorModel: z.string().min(2, "الرجاء تحديد موديل الكمبريسور"),
  issueDescription: z.string().min(5, "الرجاء كتابة وصف المشكلة"),
  advancePayment: z.coerce.number().min(0, "لا يمكن أن تكون سالبة").default(0),
});

export type CreateTicketValues = z.infer<typeof createTicketSchema>;