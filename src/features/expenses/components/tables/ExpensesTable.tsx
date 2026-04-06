import { Calendar, Trash2 } from "lucide-react";
import { Expense } from "@prisma/client";

interface ExpensesTableProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export const ExpensesTable = ({ expenses, onDelete }: ExpensesTableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full text-right text-sm">
      <thead className="bg-gray-50 text-gray-500 font-bold border-b">
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
          <tr><td colSpan={5} className="text-center py-10 text-gray-400">لا توجد مصاريف مسجلة.</td></tr>
        ) : (
          expenses.map(exp => (
            <tr key={exp.id} className="hover:bg-gray-50 transition">
              <td className="p-4 font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4"/> {new Date(exp.date).toLocaleDateString('ar-EG')}
              </td>
              <td className="p-4 font-bold text-gray-800">
                {exp.title}
                {exp.notes && <p className="text-xs text-gray-400 mt-1 font-normal">{exp.notes}</p>}
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${exp.category === "STANDARD" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
                  {exp.category === "STANDARD" ? "أساسي / تشغيلي" : "نثريات / طوارئ"}
                </span>
              </td>
              <td className="p-4 font-black text-rose-600">₪ {exp.amount.toFixed(2)}</td>
              <td className="p-4 text-center">
                <button onClick={() => onDelete(exp.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
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