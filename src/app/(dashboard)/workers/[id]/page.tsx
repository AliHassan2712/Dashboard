import { getWorkerDetails } from "@/src/server/actions/workers.actions";
import { WorkerTransaction } from "@prisma/client";
import { 
  ArrowRight, 
  Calendar, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  User, 
  Phone,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// 1.  params إلى Promise
export default async function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. فك الـ Promise للحصول على الـ id
  const { id } = await params;

  // 3. تمرير الـ id لدالة جلب البيانات
  const result = await getWorkerDetails(id);

  if (result.error || !result.data) {
    return notFound();
  }

  const worker = result.data;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* الترويسة وزر العودة */}
      <div className="flex items-center justify-between">
        <Link href="/workers" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition">
          <ArrowRight className="w-5 h-5" /> رجوع لقائمة العمال
        </Link>
      </div>

      {/* بطاقة تعريف العامل */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl">
            {worker.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">{worker.name}</h1>
            <div className="flex gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {worker.phone}</span>
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {worker.role}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left min-w-[200px]">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1 text-right">الرصيد المستحق الحالي</p>
          <div className={`text-3xl font-black flex items-center justify-end gap-2 ${worker.currentBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {worker.currentBalance.toFixed(2)} ₪ //console.log()
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* سجل المعاملات المالية */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex items-center gap-2 font-bold text-gray-700">
          <Calendar className="w-5 h-5 text-indigo-500" /> كشف حساب الحركات المالية
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4 font-medium">التاريخ</th>
                <th className="p-4 font-medium">النوع</th>
                <th className="p-4 font-medium">التفاصيل / ملاحظات</th>
                <th className="p-4 font-medium">المبلغ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {worker.transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-400 font-medium">لا توجد حركات مالية مسجلة بعد لهذا العامل.</td>
                </tr>
              ) : (
                worker.transactions.map((tx: WorkerTransaction) => (
                  <tr key={tx.id} className="hover:bg-gray-50/30 transition">
                    <td className="p-4 text-gray-500 font-mono text-xs">
                      {new Date(tx.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="p-4">
                      {tx.type === "STAKE" || tx.type === "BONUS" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <ArrowUpCircle className="w-4 h-4" /> استحقاق/مكافأة
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                          <ArrowDownCircle className="w-4 h-4" /> سحبيات/دفعات
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600 font-medium">
                      {tx.description || "---"}
                    </td>
                    <td className={`p-4 font-black text-lg ${tx.type === "STAKE" || tx.type === "BONUS" ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === "STAKE" || tx.type === "BONUS" ? "+" : "-"}
                      {tx.amount.toFixed(2)} ₪
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}