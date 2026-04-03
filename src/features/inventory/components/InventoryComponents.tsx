import { Input } from "@/src/components/ui/Input";
import { Modal } from "@/src/components/ui/Modal";
import { Loader2, Package, Search, Edit, Trash2, AlertTriangle } from "lucide-react";
import { SparePart } from "@prisma/client";

// 1. مكون شريط البحث والأزرار
export const InventoryToolbar = ({ state, dispatch }: any) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div>
      <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
        <Package className="w-6 h-6 text-indigo-600" /> إدارة المخزون
      </h1>
      <p className="text-gray-500 text-sm mt-1">تتبع كميات قطع الغيار وأسعارها وتنبيهات النواقص</p>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <div className="relative flex-1 sm:w-64">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="ابحث عن قطعة..." 
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
          className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-sm transition"
        />
      </div>
      <button 
        onClick={() => dispatch({ type: "OPEN_MODAL", payload: { type: "addEdit" } })}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition whitespace-nowrap"
      >
        + إضافة صنف جديد
      </button>
    </div>
  </div>
);

// 2. مكون جدول المخزون 
export const InventoryTable = ({ parts, dispatch, onDelete }: { parts: SparePart[], dispatch: any, onDelete: any }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="bg-gray-50 text-gray-400 font-bold border-b">
          <tr>
            <th className="p-4">اسم القطعة</th>
            <th className="p-4 text-center">الكمية المتوفرة</th>
            <th className="p-4">سعر التكلفة (₪)</th>
            <th className="p-4">سعر البيع (₪)</th>
            <th className="p-4 text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {parts.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-10 text-gray-400">لا توجد قطع مطابقة.</td></tr>
          ) : (
            parts.map(part => {
              const isLowStock = part.quantity <= part.lowStockAlert;
              return (
                <tr key={part.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-gray-800">{part.name}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs ${isLowStock ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {isLowStock && <AlertTriangle className="w-3 h-3" />}
                      {part.quantity}
                    </span>
                  </td>
                  {/* 👈 تعديل الاسم هنا للجدول */}
                  <td className="p-4 font-bold text-gray-500">₪ {part.averageCost?.toFixed(2) || "0.00"}</td>
                  <td className="p-4 font-black text-indigo-600">₪ {part.sellingPrice.toFixed(2)}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button 
                      onClick={() => dispatch({ type: "OPEN_MODAL", payload: { type: "addEdit", editData: part } })}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(part.id, part.name)} 
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// 3. مكون نافذة الإضافة/التعديل
export const InventoryModal = ({ state, dispatch, onSave }: any) => {
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
          {/* 👈 تعديل حقل السعر هنا */}
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