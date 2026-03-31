"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, User, Wrench, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { createTicket } from "@/src/features/tickets/actions";

//  استيراد المكونات الموحدة
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";

const createTicketSchema = z.object({
  customerName: z.string().min(2, "الرجاء إدخال اسم الزبون"),
  customerPhone: z.string().min(9, "يجب أن يكون 9 أرقام على الأقل"),
  compressorModel: z.string().min(2, "الرجاء تحديد موديل الكمبريسور"),
  issueDescription: z.string().min(5, "الرجاء كتابة وصف المشكلة"),
  advancePayment: z.coerce.number().min(0, "لا يمكن أن تكون سالبة").default(0),
});

type FormValues = z.infer<typeof createTicketSchema>;

export default function NewTicketPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: { advancePayment: 0 }
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const result = await createTicket(data);
      if (result.error) toast.error(result.error); 
      else if (result.success && result.data) {
        toast.success("تم فتح التذكرة بنجاح!");
        router.push(`/tickets/${result.data.id}`); 
      }
    } catch {
      toast.error("حدث خطأ في الاتصال.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/tickets" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><ArrowRight className="w-6 h-6" /></Link>
        <div><h1 className="text-2xl font-bold">إنشاء تذكرة صيانة</h1></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <User className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold">بيانات الزبون</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="اسم الزبون" placeholder="شركة المجد أو أحمد..." error={errors.customerName?.message} {...register("customerName")} />
            <Input label="رقم الهاتف" placeholder="059xxxxxxx" dir="ltr" className="text-right" error={errors.customerPhone?.message} {...register("customerPhone")} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Wrench className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold">تفاصيل الكمبريسور</h2>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="نوع / موديل الكمبريسور" placeholder="ايطالي 200 لتر" error={errors.compressorModel?.message} {...register("compressorModel")} />
              <Input label="دفعة مقدمة (تحت الحساب)" type="number" leftIcon="₪" error={errors.advancePayment?.message} {...register("advancePayment")} />
            </div>
            <Textarea label="وصف المشكلة المبدئي" rows={4} placeholder="الجهاز لا يضغط هواء..." error={errors.issueDescription?.message} {...register("issueDescription")} />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Link href="/tickets" className="px-6 py-2.5 text-gray-700 border rounded-lg hover:bg-gray-50 font-medium">إلغاء</Link>
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 font-bold shadow-sm">
            <Save className="w-5 h-5" /> {isLoading ? "جاري الحفظ..." : "حفظ وفتح التذكرة"}
          </button>
        </div>
      </form>
    </div>
  );
}