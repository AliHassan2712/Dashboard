import { ArrowDownCircle, Truck, Store } from "lucide-react";
import { FinancialOverview } from "@/src/types";

export const FinancialStats = ({ overview }: { overview: FinancialOverview }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-app-card-light dark:bg-app-card-dark p-6 rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm flex items-center gap-4">
        <div className="p-4 bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-500 rounded-2xl"><ArrowDownCircle className="w-8 h-8" /></div>
        <div>
          <p className="text-sm font-bold text-app-text-secondary-light dark:text-app-text-secondary-dark">مصاريف التشغيل الشهرية</p>
          <p className="text-2xl font-black text-danger-600 dark:text-danger-500">₪ {overview.totalExpenses.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-app-card-light dark:bg-app-card-dark p-6 rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm flex items-center gap-4">
        <div className="p-4 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 rounded-2xl"><Truck className="w-8 h-8" /></div>
        <div>
          <p className="text-sm font-bold text-app-text-secondary-light dark:text-app-text-secondary-dark">إجمالي المشتريات الشهرية</p>
          <p className="text-2xl font-black text-brand-600 dark:text-brand-400">₪ {overview.totalPurchases.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-app-card-light dark:bg-app-card-dark p-6 rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm flex items-center gap-4">
        <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Store className="w-8 h-8" /></div>
        <div>
          <p className="text-sm font-bold text-app-text-secondary-light dark:text-app-text-secondary-dark">إجمالي ديون الموردين (علينا)</p>
          <p className="text-2xl font-black text-amber-600">₪ {overview.totalDebts.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};