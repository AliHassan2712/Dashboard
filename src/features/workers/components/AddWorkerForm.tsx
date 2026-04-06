import { Dispatch, FormEvent } from "react";
import { Input } from "@/src/components/ui/Input";
import { Plus, UserPlus, Loader2 } from "lucide-react";
import { WorkersState } from "@/src/types";
import { Action } from "@/src/constants/worker";

interface AddWorkerFormProps {
  state: WorkersState;
  dispatch: Dispatch<Action>;
  onAdd: (e: FormEvent) => void;
}

export const AddWorkerForm = ({ state, dispatch, onAdd }: AddWorkerFormProps) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600">
      <UserPlus className="w-5 h-5" /> تسجيل فني جديد
    </h2>
    <form onSubmit={onAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Input label="الاسم" value={state.workerForm.name} onChange={e => dispatch({ type: "UPDATE_WORKER_FORM", field: "name", value: e.target.value })} required />
      <Input label="الهاتف" value={state.workerForm.phone} onChange={e => dispatch({ type: "UPDATE_WORKER_FORM", field: "phone", value: e.target.value })} required />
      <Input label="كلمة المرور" type="password" value={state.workerForm.password} onChange={e => dispatch({ type: "UPDATE_WORKER_FORM", field: "password", value: e.target.value })} required />
      <div className="flex items-end pb-1">
        <button disabled={state.isSubmitting} className="w-full bg-indigo-600 text-white h-[42px] rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
          {state.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} إضافة
        </button>
      </div>
    </form>
  </div>
);