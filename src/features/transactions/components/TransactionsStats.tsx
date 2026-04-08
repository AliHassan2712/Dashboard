import { ArrowDownCircle, ArrowUpCircle, Calculator } from "lucide-react";
import { TransactionRecord } from "../hooks/useTransactions";

export const TransactionsStats = ({ transactions }: { transactions: TransactionRecord[] }) => {
  const totalIn = transactions.filter(t => t.type === "IN").reduce((acc, t) => acc + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === "OUT").reduce((acc, t) => acc + t.amount, 0);
  const net = totalIn - totalOut;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center shadow-sm">
        <div>
            <p className="text-sm font-bold text-emerald-800">إجمالي الداخل للصندوق</p>
            <p className="text-xl font-black text-emerald-600">₪ {totalIn.toFixed(2)}</p>
        </div>
        <ArrowUpCircle className="w-8 h-8 text-emerald-500 opacity-50" />
      </div>
      
      <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex justify-between items-center shadow-sm">
        <div>
            <p className="text-sm font-bold text-rose-800">إجمالي الخارج من الصندوق</p>
            <p className="text-xl font-black text-rose-600">₪ {totalOut.toFixed(2)}</p>
        </div>
        <ArrowDownCircle className="w-8 h-8 text-rose-500 opacity-50" />
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex justify-between items-center shadow-sm">
        <div>
            <p className="text-sm font-bold text-indigo-800">صافي الحركة (الربح/الخسارة)</p>
            <p className={`text-xl font-black ${net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>₪ {net.toFixed(2)}</p>
        </div>
        <Calculator className="w-8 h-8 text-indigo-500 opacity-50" />
      </div>
    </div>
  );
};