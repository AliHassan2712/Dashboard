import { Dispatch } from "react";
import { Input } from "@/src/components/ui/Input";
import { Modal } from "@/src/components/ui/Modal";
import { Loader2, Banknote, CreditCard } from "lucide-react";
import { WorkersState } from "@/src/types";
import { Action } from "@/src/constants/worker";

interface WorkerTransactionModalProps {
  state: WorkersState;
  dispatch: Dispatch<Action>;
  onConfirm: () => void;
}

export const WorkerTransactionModal = ({ state, dispatch, onConfirm }: WorkerTransactionModalProps) => {
  const { txModal, txData, isSubmitting } = state;
  const typeLabel = txModal.type === 'STAKE' ? 'استحقاق' : txModal.type === 'ADVANCE' ? 'سلفة' : 'تصفية';

  return (
    <Modal isOpen={txModal.isOpen} onClose={() => dispatch({ type: "CLOSE_TX_MODAL" })} title={`تسجيل ${typeLabel} لـ ${txModal.name}`}>
      <div className="space-y-5">
        <Input label="المبلغ (₪)" type="number" value={txData.amount} onChange={(e) => dispatch({ type: "UPDATE_TX_DATA", field: "amount", value: e.target.value })} autoFocus />
        
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">طريقة التعامل</label>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => dispatch({ type: "UPDATE_TX_DATA", field: "method", value: "كاش" })} className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${txData.method === 'كاش' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-500'}`}>
              <Banknote className="w-4 h-4" /> كاش
            </button>
            <button onClick={() => dispatch({ type: "UPDATE_TX_DATA", field: "method", value: "بنكي" })} className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${txData.method === 'بنكي' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-500'}`}>
              <CreditCard className="w-4 h-4" /> بنكي
            </button>
          </div>
        </div>

        <Input label="ملاحظات (اختياري)" value={txData.notes} onChange={(e) => dispatch({ type: "UPDATE_TX_DATA", field: "notes", value: e.target.value })} placeholder="مثلاً: بابت عمل كذا.." />

        <button onClick={onConfirm} disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex justify-center items-center gap-2">
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "تأكيد العملية المالية"}
        </button>
      </div>
    </Modal>
  );
};