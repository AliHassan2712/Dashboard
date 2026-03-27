import * as z from "zod";

export const loginSchema = z.object({
  phone: z.string().min(9, "رقم الهاتف يجب أن يكون 9 أرقام على الأقل"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;