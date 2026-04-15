import * as z from "zod";

export const compressorSchema = z.object({
  modelName: z.string().min(2, "الموديل / الوصف مطلوب"),
  serialNumber: z.string().optional(),
  productionCost: z.number().min(0, "التكلفة يجب أن تكون صفر أو أكثر"),
  sellingPrice: z.number().min(0, "السعر يجب أن يكون صفر أو أكثر"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  parts: z.array(z.object({
    sparePartId: z.string().min(1, "اختر قطعة"),
    quantity: z.number().min(1, "الكمية 1 على الأقل"),
    unitCost: z.number().min(0, "التكلفة مطلوبة")
  }))
});

export type CompressorFormValues = z.infer<typeof compressorSchema>;