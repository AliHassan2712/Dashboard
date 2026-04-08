import {  Calendar } from "lucide-react";
import { WorkerTransaction } from "@prisma/client";
import { getTypeText } from "@/src/lib/utils";
export const WorkerStatementTable = ({ transactions }: { transactions: WorkerTransaction[] }) => {

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b bg-gray-50/50 flex items-center gap-2 font-bold text-gray-700">
        <Calendar className="w-5 h-5 text-indigo-500" /> كشف حساب الحركات المالية
      </div>
      <table className="w-full text-right text-sm">
        <thead className="bg-gray-50 text-gray-500 font-bold border-b">
          <tr>
            <th className="p-4">التاريخ</th>
            <th className="p-4">نوع المعاملة</th>
            <th className="p-4">الوصف / البيان</th>
            <th className="p-4">القيمة (₪)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 font-bold">
          {transactions.length === 0 ? (
            <tr><td colSpan={4} className="p-10 text-center text-gray-400 font-medium">لا توجد حركات مالية مسجلة بعد لهذا العامل.</td></tr>
          ) : (
            transactions.map((tx) => {
              const config = getTypeText(tx.type);
              const Icon = config.icon;
              return (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(tx.date).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-lg flex items-center gap-2 w-fit ${config.bg} ${config.color} text-[10px]`}>
                      <Icon className="w-3.5 h-3.5" />
                      {config.label}
                    </span>
                  </td>
                  <td className="p-4 text-gray-800">{tx.description || "---"}</td>
                  <td className={`p-4 font-black ${tx.type === 'STAKE' || tx.type === 'BONUS' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'ADVANCE' || tx.type === 'PAYOUT' ? '-' : '+'} {tx.amount.toFixed(2)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};