import * as z from "zod";

export const quotationSchema = z.object({
  customerName: z.string().optional(),
  modelName: z.string().min(2, "وصف الجهاز / الموديل مطلوب"),
  specs: z.string().optional(),
  priceIls: z.number({ error: "السعر مطلوب" }).min(0, "السعر لا يمكن أن يكون سالباً"),
  exchangeRate: z.number({ error: "سعر الصرف مطلوب" }).min(1, "سعر الصرف غير صالح"),
  imageUrl: z.string().optional(),
  notes: z.string().optional(),
});

export type QuotationFormValues = z.infer<typeof quotationSchema>;