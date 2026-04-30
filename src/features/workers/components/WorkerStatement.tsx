import { memo } from "react";
import { Calendar } from "lucide-react";
import { WorkerTransaction } from "@prisma/client";
import { getTypeText } from "@/src/lib/utils";

export const WorkerStatementTable = memo(({ transactions }: { transactions: WorkerTransaction[] }) => {
  return (
    <div className="bg-app-card-light dark:bg-app-card-dark rounded-3xl border border-app-border-light dark:border-app-border-dark overflow-hidden shadow-sm">
      <div className="p-6 border-b bg-zinc-50/70 dark:bg-zinc-900/70 flex items-center gap-2 font-bold text-app-text-primary-light dark:text-app-text-primary-dark">
        <Calendar className="w-5 h-5 text-brand-500 dark:text-brand-400" /> كشف حساب الحركات المالية
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900 text-app-text-secondary-light dark:text-app-text-secondary-dark font-bold border-b">
            <tr>
              <th className="p-4">التاريخ</th>
              <th className="p-4">نوع المعاملة</th>
              <th className="p-4">الوصف / البيان</th>
              <th className="p-4">القيمة (₪)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-bold">
            {transactions.length === 0 ? (
              <tr><td colSpan={4} className="p-10 text-center text-app-text-muted-light dark:text-app-text-muted-dark font-medium">لا توجد حركات مالية مسجلة.</td></tr>
            ) : (
              transactions.map((tx) => {
                const config = getTypeText(tx.type);
                const Icon = config.icon;
                return (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-app-text-muted-light dark:text-app-text-muted-dark flex items-center gap-2 whitespace-nowrap">
                      <Calendar className="w-4 h-4" />
                      {new Date(tx.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-lg flex items-center gap-2 w-fit ${config.bg} ${config.color} text-[10px]`}>
                        <Icon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                    </td>
                    <td className="p-4 text-app-text-primary-light dark:text-app-text-primary-dark">{tx.description || "---"}</td>
                    <td className={`p-4 font-black ${tx.type === 'STAKE' || tx.type === 'BONUS' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-500'}`}>
                      {tx.type === 'ADVANCE' || tx.type === 'PAYOUT' ? '-' : '+'} {tx.amount.toFixed(2)}
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
});

WorkerStatementTable.displayName = "WorkerStatementTable";