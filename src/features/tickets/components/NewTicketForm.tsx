import Link from "next/link";
import { User, Wrench, Save } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { ROUTES } from "@/src/constants/routes";



export const NewTicketForm = ({ form, isLoading, onSubmit }: any) => {
    const { register, handleSubmit, formState: { errors } } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><User className="w-5 h-5" /></div>
                    <h2 className="text-lg font-bold text-gray-800">بيانات الزبون</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="اسم الزبون" placeholder="شركة المجد أو أحمد..." error={errors.customerName?.message} {...register("customerName")} />
                    <Input label="رقم الهاتف" placeholder="059xxxxxxx" dir="ltr" className="text-right" error={errors.customerPhone?.message} {...register("customerPhone")} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Wrench className="w-5 h-5" /></div>
                    <h2 className="text-lg font-bold text-gray-800">تفاصيل الكمبريسور</h2>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="نوع / موديل الكمبريسور" placeholder="ايطالي 200 لتر" error={errors.compressorModel?.message} {...register("compressorModel")} />
                        <Input label="دفعة مقدمة (تحت الحساب)" type="number" leftIcon="₪" error={errors.advancePayment?.message} {...register("advancePayment")} />
                    </div>
                    <Textarea label="وصف المشكلة المبدئي" rows={4} placeholder="الجهاز لا يضغط هواء..." error={errors.issueDescription?.message} {...register("issueDescription")} />
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-4">
                <Link href={ROUTES.TICKETS} className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 font-bold transition">إلغاء الرجوع</Link>
                <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-70 font-bold shadow-lg transition">
                    <Save className="w-5 h-5" /> {isLoading ? "جاري الحفظ والتحويل..." : "حفظ وفتح التذكرة"}
                </button>
            </div>
        </form>
    );
};