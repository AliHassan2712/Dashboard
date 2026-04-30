import { memo } from "react";
import { ArrowDownCircle, ArrowUpCircle, Calculator } from "lucide-react";
import { TransactionsSummary } from "@/src/types";

export const TransactionsStats = memo(({ summary }: { summary: TransactionsSummary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center shadow-sm">
        <div>
            <p className="text-sm font-bold text-emerald-800">إجمالي الداخل للصندوق</p>
            <p className="text-xl font-black text-emerald-600">₪ {summary.totalIn.toFixed(2)}</p>
        </div>
        <ArrowUpCircle className="w-8 h-8 text-emerald-500 opacity-50" />
      </div>
      
      <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex justify-between items-center shadow-sm">
        <div>
            <p className="text-sm font-bold text-rose-800">إجمالي الخارج من الصندوق</p>
            <p className="text-xl font-black text-rose-600">₪ {summary.totalOut.toFixed(2)}</p>
        </div>
        <ArrowDownCircle className="w-8 h-8 text-rose-500 opacity-50" />
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex justify-between items-center shadow-sm">
        <div>
            <p className="text-sm font-bold text-indigo-800">صافي الحركة (الربح/الخسارة)</p>
            <p className={`text-xl font-black ${summary.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>₪ {summary.net.toFixed(2)}</p>
        </div>
        <Calculator className="w-8 h-8 text-indigo-500 opacity-50" />
      </div>
    </div>
  );
});
TransactionsStats.displayName = "TransactionsStats";