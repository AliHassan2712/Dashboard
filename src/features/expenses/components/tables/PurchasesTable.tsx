import { Calendar, FileText } from "lucide-react";
import { PurchaseInvoiceWithSupplier } from "@/src/types";

interface PurchasesTableProps {
  purchases: PurchaseInvoiceWithSupplier[];
  onOpenLedger: (supplierId: string) => void;
}

export const PurchasesTable = ({ purchases, onOpenLedger }: PurchasesTableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full text-right text-sm">
      <thead className="bg-zinc-50 dark:bg-zinc-900 text-app-text-secondary-light dark:text-app-text-secondary-dark font-bold border-b">
        <tr>
          <th className="p-4">رقم الفاتورة</th>
          <th className="p-4">المورد / التاجر</th>
          <th className="p-4">التاريخ</th>
          <th className="p-4">الإجمالي</th>
          <th className="p-4 text-success-600 dark:text-success-400">المدفوع نقداً (كاش)</th>
          <th className="p-4 text-danger-500">قُيد كدين للحساب</th>
          <th className="p-4 text-center">الحالة</th>
          <th className="p-4">ملاحظات</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {purchases.length === 0 ? (
          <tr>
            <td colSpan={8} className="text-center py-10 text-app-text-muted-light dark:text-app-text-muted-dark">لا توجد فواتير مشتريات مسجلة.</td>
          </tr>
        ) : (
          purchases.map(inv => {
            const addedToDebt = inv.totalAmount - inv.paidAmount;
            const invoiceNotes = inv.notes || "---";

            const status = addedToDebt <= 0 ? "مدفوعة بالكامل" : (inv.paidAmount > 0 ? "دفع جزئي" : "آجل (دين كامل)");
            const statusColor = addedToDebt <= 0 ? "bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400" : (inv.paidAmount > 0 ? "bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400" : "bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-500");

            return (
              <tr key={inv.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-app-text-muted-light dark:text-app-text-muted-dark font-mono text-xs">#{inv.id.slice(-6).toUpperCase()}</td>
                <td className="p-4">
                  <div className="font-bold text-app-text-primary-light dark:text-app-text-primary-dark">{inv.supplier?.name}</div>
                  <button onClick={() => onOpenLedger(inv.supplierId)} className="text-[10px] text-brand-500 dark:text-brand-400 hover:text-indigo-700 font-bold flex items-center gap-1 mt-1 transition">
                    <FileText className="w-3 h-3" /> عرض كشف الحساب
                  </button>
                </td>
                <td className="p-4 font-medium text-app-text-secondary-light dark:text-app-text-secondary-dark flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {new Date(inv.date).toLocaleDateString('ar-EG')}
                </td>
                <td className="p-4 font-black text-brand-600 dark:text-brand-400">₪ {inv.totalAmount.toFixed(2)}</td>
                <td className="p-4 font-bold text-success-600 dark:text-success-400">₪ {inv.paidAmount.toFixed(2)}</td>
                <td className="p-4 font-bold text-danger-500">
                  {addedToDebt > 0 ? `₪ ${addedToDebt.toFixed(2)}` : "---"}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black ${statusColor}`}>
                    {status}
                  </span>
                </td>
                <td className="p-4 text-xs text-app-text-secondary-light dark:text-app-text-secondary-dark max-w-[150px] truncate" title={invoiceNotes}>
                  {invoiceNotes}
                </td>
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  </div>
);