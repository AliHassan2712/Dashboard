import { Dispatch, FormEvent } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Modal } from "@/src/components/ui/Modal";
import { ExpensesState } from "@/src/types";
import { Action } from "@/src/constants/expenses";

interface Props {
  state: ExpensesState;
  dispatch: Dispatch<Action>;
  onSave: (e: FormEvent) => void;
  updateForm: (form: keyof ExpensesState["forms"], field: string, value: string) => void;
}

export const SupplierModal = ({ state, dispatch, onSave, updateForm }: Props) => (
  <Modal isOpen={state.modals.supplier} onClose={() => dispatch({ type: "OPEN_MODAL", payload: "purchase" })} title={<><UserPlus className="w-5 h-5 text-indigo-600" /> إضافة مورد جديد</>}>
    <form onSubmit={onSave} className="space-y-5">
      <Input label="اسم التاجر / الشركة" value={state.forms.supplier.name} onChange={e => updateForm("supplier", "name", e.target.value)} required />
      <Input label="رقم الجوال (اختياري)" value={state.forms.supplier.phone} onChange={e => updateForm("supplier", "phone", e.target.value)} />
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => dispatch({ type: "OPEN_MODAL", payload: "purchase" })} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold">رجوع للفاتورة</button>
        <button disabled={state.isSubmitting} type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex justify-center items-center">
          {state.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "إضافة التاجر"}
        </button>
      </div>
    </form>
  </Modal>
);