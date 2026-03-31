"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; //  استيراد Link للتنقل
import { 
  registerWorker, 
  getWorkersWithBalance, 
  addWorkerTransaction, 
  deleteWorker 
} from "@/src/features/workers/actions";
import { Input } from "@/src/components/ui/Input";
import { toast } from "react-hot-toast";
import { 
  Plus, UserPlus, Trash2, 
  Loader2, X, Banknote, CreditCard,
  ChevronLeft
} from "lucide-react";

export default function WorkersPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // 🔹 State للمودال الجديد
  const [txModal, setTxModal] = useState({ open: false, userId: '', type: '', name: '' });
  const [txData, setTxData] = useState({ amount: '', method: 'كاش', notes: '' });

  const loadWorkers = async () => {
    setIsPageLoading(true);
    const data = await getWorkersWithBalance();
    setWorkers(data);
    setIsPageLoading(false);
  };

  useEffect(() => { loadWorkers(); }, []);

  const handleAddWorker = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const res = await registerWorker(data);
    if (res.success) {
      toast.success("تم تسجيل العامل بنجاح");
      form.reset();
      loadWorkers();
    } else toast.error(res.error || "خطأ ما");
    setLoading(false);
  };

  const handleConfirmTx = async () => {
    if (!txData.amount || isNaN(Number(txData.amount))) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }

    const typeLabel = txModal.type === 'STAKE' ? 'استحقاق' : txModal.type === 'ADVANCE' ? 'سلفة' : 'تصفية';
    const finalDesc = `${typeLabel} - ${txData.method}${txData.notes ? `: ${txData.notes}` : ''}`;

    const res = await addWorkerTransaction({
      userId: txModal.userId,
      amount: Number(txData.amount),
      type: txModal.type,
      description: finalDesc
    });

    if (res.success) {
      toast.success("تم تحديث الحساب المالي");
      setTxModal({ ...txModal, open: false });
      setTxData({ amount: '', method: 'كاش', notes: '' });
      loadWorkers();
    }
  };

  const handleDelete = async (userId: string, name: string) => {
    if (confirm(`حذف العامل (${name}) نهائياً؟`)) {
      const res = await deleteWorker(userId);
      if (res.success) { toast.success("تم الحذف"); loadWorkers(); }
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* نموذج إضافة عامل */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600">
          <UserPlus className="w-5 h-5" /> تسجيل فني جديد
        </h2>
        <form onSubmit={handleAddWorker} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="الاسم" name="name" required />
          <Input label="الهاتف" name="phone" required />
          <Input label="كلمة المرور" name="password" type="password" required />
          <div className="flex items-end pb-1">
            <button disabled={loading} className="w-full bg-indigo-600 text-white h-[42px] rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              إضافة
            </button>
          </div>
        </form>
      </div>

      {/* جدول الحسابات */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 text-gray-400 text-xs">
            <tr>
              <th className="p-4">الفني</th>
              <th className="p-4">الرصيد الحالي</th>
              <th className="p-4 text-center">إجراءات مالية</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {workers.map(worker => (
              <tr key={worker.id} className="hover:bg-gray-50/50 transition group">
                <td className="p-4">
                   {/* 👈 رابط لصفحة كشف الحساب الشخصي */}
                   <Link 
                    href={`/workers/${worker.id}`} 
                    className="flex flex-col group-hover:text-indigo-600 transition"
                   >
                     <span className="font-bold text-gray-800 decoration-indigo-200 group-hover:underline underline-offset-4">
                        {worker.name}
                     </span>
                     <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        عرض كشف الحساب <ChevronLeft className="w-3 h-3" />
                     </span>
                   </Link>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full font-black text-xs ${worker.currentBalance >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {worker.currentBalance.toFixed(2)} ₪
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => setTxModal({ open: true, userId: worker.id, type: 'STAKE', name: worker.name })} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all">استحقاق</button>
                  <button onClick={() => setTxModal({ open: true, userId: worker.id, type: 'ADVANCE', name: worker.name })} className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-100 hover:bg-rose-500 hover:text-white transition-all">سلفة</button>
                  <button onClick={() => setTxModal({ open: true, userId: worker.id, type: 'PAYOUT', name: worker.name })} className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-black transition">تصفية</button>
                  <button onClick={() => handleDelete(worker.id, worker.name)} className="p-1.5 text-gray-300 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🌟 مـودال الـدفع المطور 🌟 */}
      {txModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="font-black text-gray-800">
                تسجيل {txModal.type === 'STAKE' ? 'استحقاق' : 'دفعة'} لـ <span className="text-indigo-600">{txModal.name}</span>
              </h3>
              <button onClick={() => setTxModal({...txModal, open: false})} className="p-1 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            
            <div className="space-y-5">
              <Input label="المبلغ (₪)" type="number" value={txData.amount} onChange={(e) => setTxData({...txData, amount: e.target.value})} autoFocus />
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">طريقة التعامل</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setTxData({...txData, method: 'كاش'})} className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${txData.method === 'كاش' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-500'}`}>
                    <Banknote className="w-4 h-4" /> كاش
                  </button>
                  <button onClick={() => setTxData({...txData, method: 'بنكي'})} className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${txData.method === 'بنكي' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-500'}`}>
                    <CreditCard className="w-4 h-4" /> بنكي
                  </button>
                </div>
              </div>

              <Input label="ملاحظات (اختياري)" value={txData.notes} onChange={(e) => setTxData({...txData, notes: e.target.value})} placeholder="مثلاً: بابت عمل كذا.." />

              <button onClick={handleConfirmTx} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98]">
                تأكيد العملية المالية
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}