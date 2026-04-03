import { Calendar, Trash2 } from "lucide-react";
import { Expense } from "@prisma/client";
import { PurchaseInvoiceWithSupplier, SupplierPaymentWithSupplier } from "@/src/types";

// --- جدول المصاريف ---
export const ExpensesTable = ({ expenses, onDelete }: { expenses: Expense[], onDelete: (id: string) => void }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-right text-sm">
      <thead className="bg-gray-50 text-gray-500 font-bold border-b">
        <tr><th className="p-4">التاريخ</th><th className="p-4">البند (العنوان)</th><th className="p-4">التصنيف</th><th className="p-4">المبلغ</th><th className="p-4 text-center">إجراء</th></tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {expenses.length === 0 ? (
          <tr><td colSpan={5} className="text-center py-10 text-gray-400">لا توجد مصاريف مسجلة.</td></tr>
        ) : (
          expenses.map(exp => (
            <tr key={exp.id} className="hover:bg-gray-50 transition">
              <td className="p-4 font-medium text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4"/> {new Date(exp.date).toLocaleDateString('ar-EG')}</td>
              <td className="p-4 font-bold text-gray-800">{exp.title}{exp.notes && <p className="text-xs text-gray-400 mt-1 font-normal">{exp.notes}</p>}</td>
              <td className="p-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold ${exp.category === "STANDARD" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>{exp.category === "STANDARD" ? "أساسي / تشغيلي" : "نثريات / طوارئ"}</span></td>
              <td className="p-4 font-black text-rose-600">₪ {exp.amount.toFixed(2)}</td>
              <td className="p-4 text-center"><button onClick={() => onDelete(exp.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button></td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// --- جدول المشتريات ---
export const PurchasesTable = ({ purchases }: { purchases: PurchaseInvoiceWithSupplier[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-right text-sm">
      <thead className="bg-gray-50 text-gray-500 font-bold border-b">
        <tr><th className="p-4">رقم الفاتورة</th><th className="p-4">المورد / التاجر</th><th className="p-4">التاريخ</th><th className="p-4">الإجمالي</th><th className="p-4">المدفوع كاش</th><th className="p-4">المتبقي (دين)</th><th className="p-4 text-center">الحالة</th></tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {purchases.length === 0 ? (
          <tr><td colSpan={7} className="text-center py-10 text-gray-400">لا توجد فواتير مشتريات مسجلة.</td></tr>
        ) : (
          purchases.map(inv => {
            const remaining = inv.totalAmount - inv.paidAmount;
            const status = remaining <= 0 ? "مدفوعة" : (inv.paidAmount > 0 ? "دفع جزئي" : "آجل");
            const statusColor = remaining <= 0 ? "bg-emerald-50 text-emerald-600" : (inv.paidAmount > 0 ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600");
            return (
              <tr key={inv.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-gray-400 font-mono text-xs">#{inv.id.slice(-6).toUpperCase()}</td>
                <td className="p-4 font-bold text-gray-900">{inv.supplier?.name}</td>
                <td className="p-4 font-medium text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4"/> {new Date(inv.date).toLocaleDateString('ar-EG')}</td>
                <td className="p-4 font-black text-indigo-600">₪ {inv.totalAmount.toFixed(2)}</td>
                <td className="p-4 font-bold text-emerald-600">₪ {inv.paidAmount.toFixed(2)}</td>
                <td className="p-4 font-bold text-amber-600">₪ {remaining > 0 ? remaining.toFixed(2) : "0.00"}</td>
                <td className="p-4 text-center"><span className={`px-3 py-1 rounded-lg text-[10px] font-black ${statusColor}`}>{status}</span></td>
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  </div>
);

// --- جدول سجل الدفعات ---
export const PaymentsTable = ({ payments }: { payments: SupplierPaymentWithSupplier[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-right text-sm">
      <thead className="bg-gray-50 text-gray-500 font-bold border-b">
        <tr><th className="p-4">رقم الحركة</th><th className="p-4">تاريخ الدفعة</th><th className="p-4">اسم التاجر / المورد</th><th className="p-4">البيان / ملاحظات</th><th className="p-4">المبلغ المسدد</th></tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {payments.length === 0 ? (
          <tr><td colSpan={5} className="text-center py-10 text-gray-400">لا توجد حركات دفع مسجلة.</td></tr>
        ) : (
          payments.map(pay => (
            <tr key={pay.id} className="hover:bg-gray-50 transition">
              <td className="p-4 font-mono text-xs text-gray-400">#{pay.id.slice(-6).toUpperCase()}</td>
              <td className="p-4 font-medium text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4"/> {new Date(pay.date).toLocaleDateString('ar-EG')}</td>
              <td className="p-4 font-bold text-gray-800">{pay.supplier?.name}</td>
              <td className="p-4 text-gray-600">{pay.notes || "دفعة من الحساب"}</td>
              <td className="p-4 font-black text-emerald-600 text-lg">₪ {pay.amount.toFixed(2)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);