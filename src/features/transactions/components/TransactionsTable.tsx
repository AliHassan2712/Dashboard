import { memo } from "react";
import { TransactionRecord } from "@/src/types";

export const TransactionsTable = memo(({ transactions }: { transactions: TransactionRecord[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-right text-sm">
      <thead className="bg-zinc-50 dark:bg-zinc-900 text-app-text-secondary-light dark:text-app-text-secondary-dark font-bold border-b border-app-border-light dark:border-app-border-dark">
        <tr>
          <th className="p-4">التاريخ</th>
          <th className="p-4">التصنيف</th>
          <th className="p-4">البيان</th>
          <th className="p-4 text-center">القيمة</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {transactions.length === 0 ? (
          <tr><td colSpan={4} className="text-center py-12 text-app-text-muted-light dark:text-app-text-muted-dark font-bold">لا توجد حركات مالية مسجلة في هذه الفترة.</td></tr>
        ) : (
          transactions.map(tx => (
            <tr key={tx.id} className="hover:bg-gray-50 transition">
              <td className="p-4 text-app-text-secondary-light dark:text-app-text-secondary-dark font-mono text-xs">
                {new Date(tx.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
              </td>
              <td className="p-4">
                <span className="bg-zinc-100 dark:bg-zinc-800 text-app-text-secondary-light dark:text-app-text-secondary-dark px-2.5 py-1 rounded-md text-xs font-bold border border-app-border-light dark:border-app-border-dark">
                    {tx.category}
                </span>
              </td>
              <td className="p-4 font-bold text-app-text-primary-light dark:text-app-text-primary-dark max-w-[300px] truncate" title={tx.desc}>{tx.desc}</td>
              <td className="p-4 text-center">
                <span className={`inline-flex items-center gap-1 font-black text-base px-3 py-1 rounded-lg ${tx.type === 'IN' ? 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400' : 'bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-500'}`}>
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