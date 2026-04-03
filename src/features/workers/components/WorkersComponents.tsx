import Link from "next/link";
import { Input } from "@/src/components/ui/Input";
import { Modal } from "@/src/components/ui/Modal";
import { 
  Plus, UserPlus, Trash2, Loader2, Banknote, 
  CreditCard, ChevronLeft, FileText 
} from "lucide-react";
import { WorkerWithTransactions } from "@/src/types";

// 1. مكون نموذج إضافة فني
export const AddWorkerForm = ({ state, dispatch, onAdd }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600">
      <UserPlus className="w-5 h-5" /> تسجيل فني جديد
    </h2>
    <form onSubmit={onAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Input label="الاسم" value={state.workerForm.name} onChange={e => dispatch({type: "UPDATE_WORKER_FORM", field: "name", value: e.target.value})} required />
      <Input label="الهاتف" value={state.workerForm.phone} onChange={e => dispatch({type: "UPDATE_WORKER_FORM", field: "phone", value: e.target.value})} required />
      <Input label="كلمة المرور" type="password" value={state.workerForm.password} onChange={e => dispatch({type: "UPDATE_WORKER_FORM", field: "password", value: e.target.value})} required />
      <div className="flex items-end pb-1">
        <button disabled={state.isSubmitting} className="w-full bg-indigo-600 text-white h-[42px] rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
          {state.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} إضافة
        </button>
      </div>
    </form>
  </div>
);

// 2. مكون جدول العمال (محدث لإضافة رابط كشف الحساب)
export const WorkersTable = ({ workers, dispatch, onDelete }: { workers: WorkerWithTransactions[], dispatch: any, onDelete: any }) => (
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
               {/* 👈 تم تحديث الرابط ليوجه لصفحة كشف الحساب */}
               <Link href={`/workers/${worker.id}/statement`} className="flex flex-col group-hover:text-indigo-600 transition">
                 <span className="font-bold text-gray-800 decoration-indigo-200 group-hover:underline underline-offset-4">{worker.name}</span>
                 <span className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-1">
                   <FileText className="w-3 h-3" /> عرض كشف الحساب المفصل <ChevronLeft className="w-3 h-3" />
                 </span>
               </Link>
            </td>
            <td className="p-4">
              <span className={`px-3 py-1 rounded-full font-black text-xs ${worker.currentBalance >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {worker.currentBalance.toFixed(2)} ₪
              </span>
            </td>
            <td className="p-4 flex justify-center items-center gap-2">
              <button onClick={() => dispatch({type: "OPEN_TX_MODAL", payload: { userId: worker.id, type: 'STAKE', name: worker.name }})} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all">استحقاق</button>
              <button onClick={() => dispatch({type: "OPEN_TX_MODAL", payload: { userId: worker.id, type: 'ADVANCE', name: worker.name }})} className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-rose-100 hover:bg-rose-500 hover:text-white transition-all">سلفة</button>
              <button onClick={() => dispatch({type: "OPEN_TX_MODAL", payload: { userId: worker.id, type: 'PAYOUT', name: worker.name }})} className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-black transition">تصفية</button>
              
              {/* فاصل بسيط */}
              <div className="w-px h-4 bg-gray-200 mx-1"></div>
              
              <button onClick={() => onDelete(worker.id, worker.name)} className="p-1.5 text-gray-300 hover:text-rose-600 transition-colors" title="حذف العامل">
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 3. مكون نافذة العمليات المالية
export const WorkerTransactionModal = ({ state, dispatch, onConfirm }: any) => {
  const { txModal, txData, isSubmitting } = state;
  const typeLabel = txModal.type === 'STAKE' ? 'استحقاق' : txModal.type === 'ADVANCE' ? 'سلفة' : 'تصفية';
  
  return (
    <Modal isOpen={txModal.isOpen} onClose={() => dispatch({ type: "CLOSE_TX_MODAL" })} title={`تسجيل ${typeLabel} لـ ${txModal.name}`}>
      <div className="space-y-5">
        <Input label="المبلغ (₪)" type="number" value={txData.amount} onChange={(e) => dispatch({type: "UPDATE_TX_DATA", field: "amount", value: e.target.value})} autoFocus />
        
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">طريقة التعامل</label>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => dispatch({type: "UPDATE_TX_DATA", field: "method", value: "كاش"})} className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${txData.method === 'كاش' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-500'}`}>
              <Banknote className="w-4 h-4" /> كاش
            </button>
            <button onClick={() => dispatch({type: "UPDATE_TX_DATA", field: "method", value: "بنكي"})} className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${txData.method === 'بنكي' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-500'}`}>
              <CreditCard className="w-4 h-4" /> بنكي
            </button>
          </div>
        </div>

        <Input label="ملاحظات (اختياري)" value={txData.notes} onChange={(e) => dispatch({type: "UPDATE_TX_DATA", field: "notes", value: e.target.value})} placeholder="مثلاً: بابت عمل كذا.." />

        <button onClick={onConfirm} disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex justify-center items-center gap-2">
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "تأكيد العملية المالية"}
        </button>
      </div>
    </Modal>
  );
};