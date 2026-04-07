import { Dispatch, FormEvent } from "react";
import { Loader2, Wallet } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { Modal } from "@/src/components/ui/Modal";
import { ExpensesState } from "@/src/types";
import { Action } from "@/src/constants/expenses";

export const PaymentModal = ({ state, dispatch, onSave, updateForm }: { state: ExpensesState, dispatch: Dispatch<Action>, onSave: (e: FormEvent) => void, updateForm: (form: keyof ExpensesState["forms"], field: string, value: string) => void }) => (  <Modal isOpen={state.modals.payment} onClose={() => dispatch({ type: "CLOSE_MODALS" })} title={<><Wallet className="w-5 h-5 text-emerald-600" /> تسديد دفعة لتاجر</>}>
    <form onSubmit={onSave} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">اختر التاجر المراد التسديد له</label>
        <select value={state.forms.payment.supplierId} onChange={e => updateForm("payment", "supplierId", e.target.value)} required className="w-full bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-100 rounded-lg px-4 py-2.5 outline-none font-medium transition">
          <option value="">-- اختر من القائمة --</option>
          {state.suppliers.map(s => <option key={s.id} value={s.id}>{s.name} (دين: ₪{s.totalDebt})</option>)}
        </select>
      </div>
      <Input label="المبلغ المسدد (كاش/تحويل)" type="number" step="0.01" value={state.forms.payment.amount} onChange={e => updateForm("payment", "amount", e.target.value)} required />
      <Textarea label="البيان / ملاحظات الدفع (اختياري)" rows={2} value={state.forms.payment.notes} onChange={e => updateForm("payment", "notes", e.target.value)} />
      <button disabled={state.isSubmitting} type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-emerald-700 mt-2">
        {state.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "اعتماد الدفعة وخصمها من الدين"}
      </button>
    </form>
  </Modal>
);