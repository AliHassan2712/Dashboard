import * as z from "zod";

export const compressorSchema = z.object({
  modelName: z.string().min(2, "الموديل / الوصف مطلوب"),
  serialNumber: z.string().optional(),
  productionCost: z.number({ error: "أدخل تكلفة صحيحة" }).min(0, "التكلفة يجب أن تكون صفر أو أكثر"),
  sellingPrice: z.number({ error: "أدخل سعر صحيح" }).min(0, "السعر يجب أن يكون صفر أو أكثر"),
  description: z.string().optional(),
  imageUrl: z.string().optional()
});

export type CompressorFormValues = z.infer<typeof compressorSchema>;