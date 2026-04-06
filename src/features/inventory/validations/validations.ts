import * as z from "zod";

// مخطط التحقق من بيانات قطعة الغيار
export const sparePartSchema = z.object({
  name: z.string().min(2, "اسم القطعة يجب أن يكون حرفين على الأقل"),
  // نستخدم z.coerce.number() لأن حقول الإدخال في HTML ترسل البيانات كنصوص (Strings) 
  // وهذه الدالة تحولها تلقائياً إلى أرقام (Numbers) وتتحقق منها
  quantity: z.coerce.number().min(0, "الكمية لا يمكن أن تكون سالبة"),
  averageCost: z.coerce.number().min(0, "التكلفة يجب أن تكون صفر أو أكثر"),
  sellingPrice: z.coerce.number().min(0, "سعر البيع يجب أن يكون صفر أو أكثر"),
  lowStockAlert: z.coerce.number().min(1, "حد التنبيه يجب أن يكون 1 على الأقل"),
});

// استخراج النوع (Type) لنستخدمه لاحقاً في الواجهات
export type SparePartFormValues = z.infer<typeof sparePartSchema>;