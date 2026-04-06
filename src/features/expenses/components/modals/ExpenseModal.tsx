import { Dispatch, FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { Modal } from "@/src/components/ui/Modal";
import { ExpensesState } from "@/src/types";
import { Action } from "@/src/constants/expenses";

interface Props {
  state: ExpensesState;
  dispatch: Dispatch<Action>;
  onSave: (e: FormEvent) => void;
  updateForm: (form: keyof ExpensesState["forms"], field: string, value: string) => void;
}

export const ExpenseModal = ({ state, dispatch, onSave, updateForm }: Props) => (
  <Modal isOpen={state.modals.expense} onClose={() => dispatch({ type: "CLOSE_MODALS" })} title="تسجيل مصروف جديد">
    <form onSubmit={onSave} className="space-y-5">
      <Input label="عنوان المصروف" value={state.forms.expense.title} onChange={e => updateForm("expense", "title", e.target.value)} required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="المبلغ (شيكل)" type="number" step="0.01" value={state.forms.expense.amount} onChange={e => updateForm("expense", "amount", e.target.value)} required />
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">نوع المصروف</label>
          <select value={state.forms.expense.category} onChange={e => updateForm("expense", "category", e.target.value)} className="w-full bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-100 rounded-lg px-4 py-2.5 outline-none font-medium transition">
            <option value="STANDARD">أساسي تشغيلي</option>
            <option value="EXTRA">نثريات وطوارئ</option>
          </select>
        </div>
      </div>
      <Textarea label="ملاحظات (اختياري)" rows={2} value={state.forms.expense.notes} onChange={e => updateForm("expense", "notes", e.target.value)} />
      <button disabled={state.isSubmitting} type="submit" className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold flex justify-center items-center mt-2">
        {state.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ المصروف"}
      </button>
    </form>
  </Modal>
);