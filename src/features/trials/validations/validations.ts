import * as z from "zod";

export const trialSchema = z.object({
  workerId: z.string().min(1, "الرجاء اختيار الفني"),
  sparePartId: z.string().min(1, "الرجاء اختيار القطعة"),
  qty: z.coerce.number().min(1, "الكمية يجب أن تكون 1 على الأقل"),
  notes: z.string().optional(),
});

export type TrialFormValues = z.infer<typeof trialSchema>;