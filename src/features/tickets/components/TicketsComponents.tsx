import Link from "next/link";
import { Ticket as TicketIcon, User, Wrench, Save } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { ROUTES } from "@/src/constants/routes"; 

// ==========================================
// 1. مكون جدول عرض كل التذاكر
// ==========================================
export const TicketsTable = ({ tickets }: { tickets: any[] }) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
        <TicketIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p>لا توجد أي تذاكر صيانة حتى الآن.</p>
        {/* 👈 ربط نظيف */}
        <Link href={ROUTES.NEW_TICKET} className="text-indigo-600 hover:underline text-sm mt-2 inline-block font-bold">
          اضغط هنا لإنشاء أول تذكرة
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 font-medium">رقم التذكرة</th>
              <th className="px-4 py-3 font-medium">الزبون</th>
              <th className="px-4 py-3 font-medium">تاريخ الدخول</th>
              <th className="px-4 py-3 font-medium">الحالة</th>
              <th className="px-4 py-3 font-medium">عدد القطع المستهلكة</th>
              <th className="px-4 py-3 font-medium text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tickets.map((ticket: any) => (
              <tr key={ticket.id} className="hover:bg-gray-50/50 transition">
                <td className="px-4 py-3 font-bold text-gray-400 font-mono text-xs">
                  #{ticket.id.slice(-6).toUpperCase()}
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-gray-900">{ticket.customerName}</div>
                  <div className="text-xs text-gray-500 mt-1">{ticket.customerPhone}</div>
                </td>
                <td className="px-4 py-3 text-gray-600 font-medium">
                  {new Date(ticket.createdAt).toLocaleDateString('ar-EG')}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${
                    ticket.status === 'OPEN' ? 'bg-amber-50 text-amber-600' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' :
                    ticket.status === 'WAITING_FOR_PARTS' ? 'bg-orange-50 text-orange-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {ticket.status === 'OPEN' ? 'مفتوحة' : 
                     ticket.status === 'IN_PROGRESS' ? 'قيد الصيانة' :
                     ticket.status === 'WAITING_FOR_PARTS' ? 'بانتظار قطع' : 'مكتملة'}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-gray-700">
                  {ticket.partsUsed?.length || 0} قطع
                </td>
                <td className="px-4 py-3 text-center">
                  {/* 👈 استخدام المسار الديناميكي */}
                  <Link href={ROUTES.TICKET_DETAILS(ticket.id)} className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                    عرض التفاصيل
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 2. مكون نموذج إضافة تذكرة جديدة
// ==========================================
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
        {/* 👈 ربط الإلغاء بالقائمة الرئيسية للتذاكر */}
        <Link href={ROUTES.TICKETS} className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 font-bold transition">إلغاء الرجوع</Link>
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-70 font-bold shadow-lg transition">
          <Save className="w-5 h-5" /> {isLoading ? "جاري الحفظ والتحويل..." : "حفظ وفتح التذكرة"}
        </button>
      </div>
    </form>
  );
};