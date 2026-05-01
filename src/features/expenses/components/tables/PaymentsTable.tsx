import { Calendar, Trash2, Edit } from "lucide-react";
import { SupplierPaymentWithSupplier } from "@/src/types";

interface PaymentsTableProps {
  payments: SupplierPaymentWithSupplier[];
  onEdit: (pay: SupplierPaymentWithSupplier) => void;
  onDelete: (id: string) => void;
}

export const PaymentsTable = ({ payments, onEdit, onDelete }: PaymentsTableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full text-right text-sm">
      <thead className="bg-zinc-50 dark:bg-zinc-900 text-app-text-secondary-light dark:text-app-text-secondary-dark font-bold border-b">
        <tr>
          <th className="p-4">رقم الحركة</th>
          <th className="p-4">تاريخ الدفعة</th>
          <th className="p-4">اسم التاجر / المورد</th>
          <th className="p-4">البيان / ملاحظات</th>
          <th className="p-4">المبلغ المسدد</th>
          <th className="p-4 text-center">إجراءات</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {payments.length === 0 ? (
          <tr><td colSpan={6} className="text-center py-10 text-app-text-muted-light dark:text-app-text-muted-dark">لا توجد حركات دفع مسجلة.</td></tr>
        ) : (
          payments.map(pay => (
            <tr key={pay.id} className="hover:bg-gray-50 transition">
              <td className="p-4 font-mono text-xs text-app-text-muted-light dark:text-app-text-muted-dark">#{pay.id.slice(-6).toUpperCase()}</td>
              <td className="p-4 font-medium text-app-text-secondary-light dark:text-app-text-secondary-dark flex items-center gap-2">
                <Calendar className="w-4 h-4"/> {new Date(pay.date).toLocaleDateString('ar-EG')}
              </td>
              <td className="p-4 font-bold text-app-text-primary-light dark:text-app-text-primary-dark">{pay.supplier?.name}</td>
              <td className="p-4 text-app-text-secondary-light dark:text-app-text-secondary-dark">{pay.notes || "دفعة من الحساب"}</td>
              <td className="p-4 font-black text-success-600 dark:text-success-400 text-lg">₪ {pay.amount.toFixed(2)}</td>
              <td className="p-4 flex justify-center gap-2">
                <button onClick={() => onEdit(pay)} className="p-2 text-app-text-muted-light dark:text-app-text-muted-dark hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(pay.id)} className="p-2 text-app-text-muted-light dark:text-app-text-muted-dark hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);