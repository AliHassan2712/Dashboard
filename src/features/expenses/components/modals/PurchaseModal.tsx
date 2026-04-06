import { Dispatch, FormEvent } from "react";
import { FileText, Loader2, UserPlus, X, PlusCircle } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea"; 
import { Modal } from "@/src/components/ui/Modal";
import { ExpensesState, PurchaseItemForm } from "@/src/types";
import { Action } from "@/src/constants/expenses";

interface Props {
  state: ExpensesState;
  dispatch: Dispatch<Action>;
  onSave: (e: FormEvent) => void;
  updateForm: (form: keyof ExpensesState["forms"], field: string, value: string | PurchaseItemForm[]) => void;
}

export const PurchaseModal = ({ state, dispatch, onSave, updateForm }: Props) => {
  const items = state.forms.purchase.items;
  const invoiceNotes = state.forms.purchase.notes || ""; 
  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.quantity || "0") * parseFloat(item.unitCost || "0")), 0);

  return (
    <Modal isOpen={state.modals.purchase} onClose={() => dispatch({ type: "CLOSE_MODALS" })} title={<><FileText className="w-5 h-5 text-indigo-600" /> فاتورة مشتريات</>} maxWidth="xl">
      <form onSubmit={onSave} className="space-y-6">
        
        {/* اختيار المورد */}
        <div className="flex items-end gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-bold text-gray-700">المورد (التاجر)</label>
            <select value={state.forms.purchase.supplierId} onChange={e => updateForm("purchase", "supplierId", e.target.value)} required className="w-full bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-100 rounded-lg px-4 py-2 outline-none font-medium transition">
              <option value="">-- اختر التاجر --</option>
              {state.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <button type="button" onClick={() => dispatch({ type: "OPEN_MODAL", payload: "supplier" })} className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition shadow-sm" title="إضافة مورد جديد">
            <UserPlus className="w-5 h-5" />
          </button>
        </div>

        {/* قسم الأصناف */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-sm">أصناف الفاتورة:</h3>
            <button type="button" onClick={() => updateForm("purchase", "items", [...items, { sparePartId: "", quantity: "", unitCost: "", isNew: false, notes: "" }])} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition">
              + إضافة صنف
            </button>
          </div>
          
          {items.length === 0 && <div className="text-center p-4 border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-medium">لم يتم إضافة أي أصناف. اضغط على الزر أعلاه للبدء.</div>}

          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-2 bg-white p-3 border border-gray-200 rounded-xl shadow-sm">
              <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                
                {/* اسم الصنف (موجود أو جديد) */}
                {!item.isNew ? (
                  <select 
                    value={item.sparePartId} 
                    onChange={e => { 
                      const newItems = [...items]; 
                      if (e.target.value === "NEW_ITEM") {
                        newItems[index].isNew = true;
                        newItems[index].sparePartId = "";
                      } else {
                        newItems[index].sparePartId = e.target.value; 
                      }
                      updateForm("purchase", "items", newItems); 
                    }} 
                    required={!item.isNew} 
                    className="flex-1 min-w-[120px] border border-gray-200 rounded-lg focus:ring-indigo-500 text-xs font-bold outline-none py-2"
                  >
                    <option value="">- اختر القطعة -</option>
                    <option value="NEW_ITEM" className="font-black text-indigo-600">✨ + إضافة صنف جديد للمخزون</option>
                    {state.spareParts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                ) : (
                  <div className="flex-1 min-w-[120px] flex gap-2 items-center">
                    <Input placeholder="اسم الصنف الجديد" value={item.newItemName || ""} onChange={e => { const newItems = [...items]; newItems[index].newItemName = e.target.value; updateForm("purchase", "items", newItems); }} required wrapperClassName="flex-1" className="!py-1.5 text-xs border-indigo-300 bg-indigo-50" />
                    <button type="button" onClick={() => { const newItems = [...items]; newItems[index].isNew = false; updateForm("purchase", "items", newItems); }} className="text-xs text-gray-400 hover:text-gray-600 underline">إلغاء</button>
                  </div>
                )}
                
                {/* 👈 وصف الصنف الفردي (اللون، المقاس، تفاصيل إضافية) */}
                <Input placeholder="وصف للقطعة (اختياري)" value={item.notes || ""} onChange={e => { const newItems = [...items]; newItems[index].notes = e.target.value; updateForm("purchase", "items", newItems); }} wrapperClassName="w-full sm:w-1/4" className="!py-1.5 text-xs text-gray-600" />
                
                {/* الكمية والسعر */}
                <Input type="number" placeholder="الكمية" value={item.quantity} onChange={e => { const newItems = [...items]; newItems[index].quantity = e.target.value; updateForm("purchase", "items", newItems); }} required wrapperClassName="w-20" className="!py-1.5 text-xs text-center" />
                <Input type="number" step="0.01" placeholder="التكلفة" leftIcon="₪" value={item.unitCost} onChange={e => { const newItems = [...items]; newItems[index].unitCost = e.target.value; updateForm("purchase", "items", newItems); }} required wrapperClassName="w-24" className="!py-1.5 text-xs" />
                
                {/* حذف الصنف من القائمة */}
                <button type="button" onClick={() => { const newItems = items.filter((_, i) => i !== index); updateForm("purchase", "items", newItems); }} className="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-lg transition"><X className="w-4 h-4" /></button>
              </div>

              {/* سعر البيع المقترح للصنف الجديد */}
              {item.isNew && (
                <div className="flex items-center gap-2 pl-1 mt-1">
                  <PlusCircle className="w-4 h-4 text-indigo-400" />
                  <Input type="number" step="0.01" placeholder="سعر البيع للزبون (اختياري، الافتراضي: التكلفة × 1.5)" leftIcon="₪" value={item.newItemSellingPrice || ""} onChange={e => { const newItems = [...items]; newItems[index].newItemSellingPrice = e.target.value; updateForm("purchase", "items", newItems); }} wrapperClassName="w-full sm:w-2/3" className="!py-1 text-xs text-indigo-700" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 👈 الملاحظات العامة للفاتورة */}
        <Textarea 
          label="ملاحظات الفاتورة العامة (اختياري)" 
          rows={2} 
          value={invoiceNotes} 
          onChange={e => updateForm("purchase", "notes", e.target.value)} 
          placeholder="مثلاً: بضاعة صيني، تم شراء جزء منها دين..."
        />

        {/* الملخص المالي */}
        <div className="bg-slate-900 text-white p-5 rounded-xl space-y-4 mt-6 shadow-md">
          <div className="flex justify-between font-bold">
            <span>إجمالي الفاتورة:</span>
            <span className="text-xl text-emerald-400">₪ {totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="whitespace-nowrap font-medium text-sm text-gray-300">المدفوع كاش (₪):</span>
            <Input type="number" step="0.01" value={state.forms.purchase.paidAmount} onChange={e => updateForm("purchase", "paidAmount", e.target.value)} className="bg-slate-800 border-slate-700 text-white focus:ring-emerald-500 !py-1.5 text-center font-bold" wrapperClassName="w-full" />
          </div>
        </div>

        <button disabled={state.isSubmitting} type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-indigo-700 transition shadow-lg">
          {state.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "اعتماد الفاتورة وتحديث المخزون"}
        </button>
      </form>
    </Modal>
  );
};