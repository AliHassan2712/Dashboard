import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().min(9, "رقم الهاتف غير صالح"),
});

export const passwordSchema = z.object({
  currentPass: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
  newPass: z.string().min(6, "يجب أن تكون 6 أحرف على الأقل"),
  confirmPass: z.string().min(6, "يجب أن تكون 6 أحرف على الأقل"),
}).refine((data) => data.newPass === data.confirmPass, {
  message: "كلمة المرور الجديدة غير متطابقة",
  path: ["confirmPass"],
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;