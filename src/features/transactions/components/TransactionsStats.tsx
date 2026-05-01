import { memo } from "react";
import { ArrowDownCircle, ArrowUpCircle, Calculator } from "lucide-react";
import { TransactionsSummary } from "@/src/types";

export const TransactionsStats = memo(({ summary }: { summary: TransactionsSummary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
      <div className="bg-success-50 dark:bg-success-900/20 border border-success-100 dark:border-success-900/50 p-4 rounded-xl flex justify-between items-center shadow-sm">
        <div>
            <p className="text-sm font-bold text-success-900 dark:text-success-100">إجمالي الداخل للصندوق</p>
            <p className="text-xl font-black text-success-600 dark:text-success-400">₪ {summary.totalIn.toFixed(2)}</p>
        </div>
        <ArrowUpCircle className="w-8 h-8 text-success-500 opacity-50" />
      </div>
      
      <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-100 dark:border-danger-900/50 p-4 rounded-xl flex justify-between items-center shadow-sm">
        <div>
            <p className="text-sm font-bold text-rose-800">إجمالي الخارج من الصندوق</p>
            <p className="text-xl font-black text-danger-600 dark:text-danger-500">₪ {summary.totalOut.toFixed(2)}</p>
        </div>
        <ArrowDownCircle className="w-8 h-8 text-danger-500 opacity-50" />
      </div>
      
      <div className="bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/60 p-4 rounded-xl flex justify-between items-center shadow-sm">
        <div>
            <p className="text-sm font-bold text-brand-900 dark:text-brand-200">صافي الحركة (الربح/الخسارة)</p>
            <p className={`text-xl font-black ${summary.net >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-500'}`}>₪ {summary.net.toFixed(2)}</p>
        </div>
        <Calculator className="w-8 h-8 text-brand-500 dark:text-brand-400 opacity-50" />
      </div>
    </div>
  );
});
TransactionsStats.displayName = "TransactionsStats";