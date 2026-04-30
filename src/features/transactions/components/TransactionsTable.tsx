import { memo } from "react";
import { TransactionRecord } from "@/src/types";

export const TransactionsTable = memo(({ transactions }: { transactions: TransactionRecord[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-right text-sm">
      <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
        <tr>
          <th className="p-4">التاريخ</th>
          <th className="p-4">التصنيف</th>
          <th className="p-4">البيان</th>
          <th className="p-4 text-center">القيمة</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {transactions.length === 0 ? (
          <tr><td colSpan={4} className="text-center py-12 text-gray-400 font-bold">لا توجد حركات مالية مسجلة في هذه الفترة.</td></tr>
        ) : (
          transactions.map(tx => (
            <tr key={tx.id} className="hover:bg-gray-50 transition">
              <td className="p-4 text-gray-500 font-mono text-xs">
                {new Date(tx.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
              </td>
              <td className="p-4">
                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold border border-gray-200">
                    {tx.category}
                </span>
              </td>
              <td className="p-4 font-bold text-gray-800 max-w-[300px] truncate" title={tx.desc}>{tx.desc}</td>
              <td className="p-4 text-center">
                <span className={`inline-flex items-center gap-1 font-black text-base px-3 py-1 rounded-lg ${tx.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {tx.type === 'IN' ? '+' : '-'} {tx.amount.toFixed(2)} ₪
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
));
TransactionsTable.displayName = "TransactionsTable";