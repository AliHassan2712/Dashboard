import * as z from "zod";
import { TypesWorkerTransaction } from "@prisma/client";

// 1. تحقق إضافة عامل جديد
export const addWorkerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().min(9, "رقم الجوال غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  baseSalary: z.number({ error: "أدخل راتباً صحيحاً" }).min(0).optional(),
});

// 2. تحقق العمليات المالية (سلفة، مكافأة، خصم، إلخ)
export const workerTxSchema = z.object({
  amount: z.number({ error: "أدخل مبلغاً صحيحاً" }).min(0.01, "المبلغ يجب أن يكون أكبر من صفر"),
  type: z.nativeEnum(TypesWorkerTransaction),
  notes: z.string().optional(),
});

export type AddWorkerValues = z.infer<typeof addWorkerSchema>;
export type WorkerTxValues = z.infer<typeof workerTxSchema>;