import { Calendar, Trash2 } from "lucide-react";
import { Expense } from "@prisma/client";

interface ExpensesTableProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export const ExpensesTable = ({ expenses, onDelete }: ExpensesTableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full text-right text-sm">
      <thead className="bg-zinc-50 dark:bg-zinc-900 text-app-text-secondary-light dark:text-app-text-secondary-dark font-bold border-b">
        <tr>
          <th className="p-4">التاريخ</th>
          <th className="p-4">البند (العنوان)</th>
          <th className="p-4">التصنيف</th>
          <th className="p-4">المبلغ</th>
          <th className="p-4 text-center">إجراء</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {expenses.length === 0 ? (
          <tr><td colSpan={5} className="text-center py-10 text-app-text-muted-light dark:text-app-text-muted-dark">لا توجد مصاريف مسجلة.</td></tr>
        ) : (
          expenses.map(exp => (
            <tr key={exp.id} className="hover:bg-gray-50 transition">
              <td className="p-4 font-medium text-app-text-secondary-light dark:text-app-text-secondary-dark flex items-center gap-2">
                <Calendar className="w-4 h-4"/> {new Date(exp.date).toLocaleDateString('ar-EG')}
              </td>
              <td className="p-4 font-bold text-app-text-primary-light dark:text-app-text-primary-dark">
                {exp.title}
                {exp.notes && <p className="text-xs text-app-text-muted-light dark:text-app-text-muted-dark mt-1 font-normal">{exp.notes}</p>}
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${exp.category === "STANDARD" ? "bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400" : "bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-500"}`}>
                  {exp.category === "STANDARD" ? "أساسي / تشغيلي" : "نثريات / طوارئ"}
                </span>
              </td>
              <td className="p-4 font-black text-danger-600 dark:text-danger-500">₪ {exp.amount.toFixed(2)}</td>
              <td className="p-4 text-center">
                <button onClick={() => onDelete(exp.id)} className="p-2 text-app-text-muted-light dark:text-app-text-muted-dark hover:text-red-600 hover:bg-red-50 rounded-lg transition">
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