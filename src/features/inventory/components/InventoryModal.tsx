import { Dispatch, FormEvent } from "react";
import { Input } from "@/src/components/ui/Input";
import { Modal } from "@/src/components/ui/Modal";
import { Loader2 } from "lucide-react";
import { InventoryState } from "@/src/types";
import { Action } from "@/src/constants/inventory";

interface InventoryModalProps {
  state: InventoryState;
  dispatch: Dispatch<Action>;
  onSave: (e: FormEvent) => void;
}

export const InventoryModal = ({ state, dispatch, onSave }: InventoryModalProps) => {
  return (
    <Modal 
      isOpen={state.modals.addEdit} 
      onClose={() => dispatch({ type: "CLOSE_MODALS" })} 
      title={state.editingId ? "تعديل بيانات القطعة" : "إضافة قطعة جديدة"}
    >
      <form onSubmit={onSave} className="space-y-5">
        <Input 
          label="اسم القطعة" 
          value={state.forms.part.name} 
          onChange={(e) => dispatch({ type: "UPDATE_FORM", field: "name", value: e.target.value })} 
          required 
        />
        
        <Input 
          label="الكمية المتوفرة" 
          type="number" 
          value={state.forms.part.quantity} 
          onChange={(e) => dispatch({ type: "UPDATE_FORM", field: "quantity", value: e.target.value })} 
          required 
        />

        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2">
          <Input 
            label="سعر التكلفة/الشراء (₪)" 
            type="number" 
            step="0.01" 
            value={state.forms.part.averageCost} 
            onChange={(e) => dispatch({ type: "UPDATE_FORM", field: "averageCost", value: e.target.value })} 
            required 
          />
          <Input 
            label="سعر البيع للزبون (₪)" 
            type="number" 
            step="0.01" 
            value={state.forms.part.sellingPrice} 
            onChange={(e) => dispatch({ type: "UPDATE_FORM", field: "sellingPrice", value: e.target.value })} 
            required 
          />
        </div>

        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-2">
          <Input 
            label="تنبيه النواقص (متى يظهر التنبيه؟)" 
            type="number" 
            value={state.forms.part.lowStockAlert} 
            onChange={(e) => dispatch({ type: "UPDATE_FORM", field: "lowStockAlert", value: e.target.value })} 
          />
        </div>

        <button disabled={state.isSubmitting} type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-indigo-700 mt-2 transition">
          {state.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ بيانات القطعة"}
        </button>
      </form>
    </Modal>
  );
};