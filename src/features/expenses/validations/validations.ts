import * as z from "zod";
import { ExpenseCategory } from "@prisma/client";

export const expenseSchema = z.object({
  title: z.string().min(2, "الرجاء إدخال عنوان المصروف"),
  amount: z.number({ message: "الرجاء إدخال مبلغ صحيح" })
           .min(0.01, "المبلغ يجب أن يكون أكبر من صفر"),
  category: z.nativeEnum(ExpenseCategory),
  notes: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;


// --- تحقق المورد الجديد ---
export const supplierSchema = z.object({
  name: z.string().min(2, "الرجاء إدخال اسم التاجر"),
  phone: z.string().optional(),
});
export type SupplierFormValues = z.infer<typeof supplierSchema>;

// --- تحقق الدفعات ---
export const paymentSchema = z.object({
  supplierId: z.string().min(1, "الرجاء اختيار التاجر"),
  amount: z.number({ message: "الرجاء إدخال مبلغ صحيح" }).min(0.01, "المبلغ يجب أن يكون أكبر من صفر"),
  notes: z.string().optional(),
});
export type PaymentFormValues = z.infer<typeof paymentSchema>;


// --- تحقق عناصر الفاتورة (القطع) ---
export const invoiceItemSchema = z.object({
  sparePartId: z.string().optional().transform(val => val || ""),
  isNew: z.boolean().optional(),
  newItemName: z.string().optional(),
  newItemSellingPrice: z.number({ message: "أدخل سعر البيع" }).optional(),
  quantity: z.number({ message: "الكمية مطلوبة" }).min(1, "الكمية 1 على الأقل"),
  unitCost: z.number({ message: "تكلفة الوحدة مطلوبة" }).min(0.01, "التكلفة يجب أن تكون أكبر من 0"),
  notes: z.string().optional()
});

// --- تحقق الفاتورة بالكامل ---
export const invoiceSchema = z.object({
  supplierId: z.string().min(1, "الرجاء اختيار التاجر"),
  totalAmount: z.number({ message: "الإجمالي مطلوب" }).min(0, "الإجمالي غير صالح"),
  paidAmount: z.number({ message: "المدفوع مطلوب" }).min(0, "المبلغ المدفوع غير صالح"),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "يجب إضافة صنف واحد على الأقل للفاتورة")
});

export type InvoiceFormInput = z.input<typeof invoiceSchema>;   // نوع الإدخال (للفورم)
export type InvoiceFormValues = z.output<typeof invoiceSchema>; // نوع المخرج النظيف (للسيرفر)