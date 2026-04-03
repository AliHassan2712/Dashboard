import { FileText, Loader2, UserPlus, Wallet, X } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { Modal } from "@/src/components/ui/Modal";

// نمرر الـ State والـ Actions كـ Props
export const ExpensesModals = ({ state, dispatch, actions, updateForm }: any) => {
  return (
    <>
      {/* 1. نافذة المصروف */}
      <Modal isOpen={state.modals.expense} onClose={() => dispatch({ type: "CLOSE_MODALS" })} title="تسجيل مصروف جديد">
        <form onSubmit={actions.handleAddExpense} className="space-y-5">
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

      {/* 2. نافذة المشتريات (تحديث: دعم إضافة الأصناف للمخزون) */}
      <Modal isOpen={state.modals.purchase} onClose={() => dispatch({ type: "CLOSE_MODALS" })} title={<><FileText className="w-5 h-5 text-indigo-600" /> فاتورة مشتريات (وإدخال للمخزون)</>} maxWidth="xl">
        <form onSubmit={actions.handleAddPurchase} className="space-y-6">

          <div className="flex items-end gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-bold text-gray-700">المورد (التاجر)</label>
              <select value={state.forms.purchase.supplierId} onChange={e => updateForm("purchase", "supplierId", e.target.value)} required className="w-full bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-100 rounded-lg px-4 py-2 outline-none font-medium">
                <option value="">-- اختر من القائمة --</option>
                {state.suppliers.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <button type="button" onClick={() => dispatch({ type: "OPEN_MODAL", payload: "supplier" })} className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition" title="إضافة مورد جديد"><UserPlus className="w-5 h-5" /></button>
          </div>

          {/* قسم إضافة الأصناف */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-sm">أصناف الفاتورة:</h3>
              <button type="button" onClick={() => updateForm("purchase", "items", [...state.forms.purchase.items, { sparePartId: "", quantity: "", unitCost: "" }])} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100">
                + إضافة صنف
              </button>
            </div>

            {state.forms.purchase.items.length === 0 && (
              <div className="text-center p-4 border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-medium">
                لم يتم إضافة أي أصناف. اضغط على الزر أعلاه للبدء.
              </div>
            )}

            {state.forms.purchase.items.map((item: any, index: number) => (
              <div key={index} className="flex gap-2 items-center bg-white p-2 border border-gray-200 rounded-xl">
                <select
                  value={item.sparePartId}
                  onChange={e => {
                    const newItems = [...state.forms.purchase.items];
                    newItems[index].sparePartId = e.target.value;
                    updateForm("purchase", "items", newItems);
                  }}
                  required className="flex-1 border-none focus:ring-0 text-xs font-bold outline-none"
                >
                  <option value="">- القطعة -</option>
                  {state.spareParts.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <Input type="number" placeholder="الكمية" value={item.quantity} onChange={e => { const newItems = [...state.forms.purchase.items]; newItems[index].quantity = e.target.value; updateForm("purchase", "items", newItems); }} required wrapperClassName="w-20" className="!py-1.5 text-xs text-center" />
                <Input type="number" step="0.01" placeholder="السعر" leftIcon="₪" value={item.unitCost} onChange={e => { const newItems = [...state.forms.purchase.items]; newItems[index].unitCost = e.target.value; updateForm("purchase", "items", newItems); }} required wrapperClassName="w-24" className="!py-1.5 text-xs" />
                <button type="button" onClick={() => { const newItems = state.forms.purchase.items.filter((_: any, i: number) => i !== index); updateForm("purchase", "items", newItems); }} className="text-red-400 hover:text-red-600 p-2"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          {/* الملخص المالي */}
          <div className="bg-slate-900 text-white p-5 rounded-xl space-y-4">
            <div className="flex justify-between font-bold">
              <span>إجمالي الفاتورة:</span>
              <span className="text-xl text-emerald-400">₪ {state.forms.purchase.items.reduce((sum: number, item: any) => sum + (parseFloat(item.quantity || "0") * parseFloat(item.unitCost || "0")), 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="whitespace-nowrap font-medium text-sm text-gray-300">المدفوع كاش (₪):</span>
              <Input type="number" step="0.01" value={state.forms.purchase.paidAmount} onChange={e => updateForm("purchase", "paidAmount", e.target.value)} className="bg-slate-800 border-slate-700 text-white focus:ring-emerald-500 !py-1.5 text-center" wrapperClassName="w-full" />
            </div>
          </div>

          <button disabled={state.isSubmitting} type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-indigo-700 transition">
            {state.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "اعتماد وإدخال للمخزون"}
          </button>
        </form>
      </Modal>
      {/* 3. نافذة إضافة المورد الجديد (مستقلة تماماً) */}
      <Modal isOpen={state.modals.supplier} onClose={() => dispatch({ type: "OPEN_MODAL", payload: "purchase" })} title={<><UserPlus className="w-5 h-5 text-indigo-600" /> إضافة مورد جديد</>}>
        <form onSubmit={actions.handleAddSupplier} className="space-y-5">
          <Input label="اسم التاجر / الشركة" value={state.forms.supplier.name} onChange={e => updateForm("supplier", "name", e.target.value)} required />
          <Input label="رقم الجوال (اختياري)" value={state.forms.supplier.phone} onChange={e => updateForm("supplier", "phone", e.target.value)} />
          <div className="flex gap-3 pt-2">
            {/* زر الإلغاء يغلق هذه النافذة ويفتح نافذة الفاتورة من جديد */}
            <button type="button" onClick={() => dispatch({ type: "OPEN_MODAL", payload: "purchase" })} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold">رجوع للفاتورة</button>
            <button disabled={state.isSubmitting} type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex justify-center items-center">
              {state.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "إضافة التاجر"}
            </button>
          </div>
        </form>
      </Modal>

      {/* 4. نافذة تسديد دفعة لتاجر */}
      <Modal isOpen={state.modals.payment} onClose={() => dispatch({ type: "CLOSE_MODALS" })} title={<><Wallet className="w-5 h-5 text-emerald-600" /> تسديد دفعة لتاجر</>}>
        <form onSubmit={actions.handleAddPayment} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">اختر التاجر المراد التسديد له</label>
            <select value={state.forms.payment.supplierId} onChange={e => updateForm("payment", "supplierId", e.target.value)} required className="w-full bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-100 rounded-lg px-4 py-2.5 outline-none font-medium transition">
              <option value="">-- اختر من القائمة --</option>
              {state.suppliers.map((s: any) => <option key={s.id} value={s.id}>{s.name} (دين: ₪{s.totalDebt})</option>)}
            </select>
          </div>
          <Input label="المبلغ المسدد (كاش/تحويل)" type="number" step="0.01" value={state.forms.payment.amount} onChange={e => updateForm("payment", "amount", e.target.value)} required />
          <Textarea label="البيان / ملاحظات الدفع (اختياري)" rows={2} value={state.forms.payment.notes} onChange={e => updateForm("payment", "notes", e.target.value)} />
          <button disabled={state.isSubmitting} type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-emerald-700 mt-2">
            {state.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "اعتماد الدفعة وخصمها من الدين"}
          </button>
        </form>
      </Modal>
    </>
  );
};