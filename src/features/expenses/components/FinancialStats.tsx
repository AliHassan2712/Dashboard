import { ArrowDownCircle, Truck, Store } from "lucide-react";
import { FinancialOverview } from "@/src/types";

export const FinancialStats = ({ overview }: { overview: FinancialOverview }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl"><ArrowDownCircle className="w-8 h-8" /></div>
        <div>
          <p className="text-sm font-bold text-gray-500">مصاريف التشغيل الشهرية</p>
          <p className="text-2xl font-black text-rose-600">₪ {overview.totalExpenses.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Truck className="w-8 h-8" /></div>
        <div>
          <p className="text-sm font-bold text-gray-500">إجمالي المشتريات الشهرية</p>
          <p className="text-2xl font-black text-indigo-600">₪ {overview.totalPurchases.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Store className="w-8 h-8" /></div>
        <div>
          <p className="text-sm font-bold text-gray-500">إجمالي ديون الموردين (علينا)</p>
          <p className="text-2xl font-black text-amber-600">₪ {overview.totalDebts.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};