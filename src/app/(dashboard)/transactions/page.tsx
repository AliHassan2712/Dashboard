"use client";

import { useState } from "react";
import { Calculator, Loader2, X, Filter } from "lucide-react";
import { useTransactions } from "@/src/features/transactions/hooks/useTransactions";
import { TransactionsStats } from "@/src/features/transactions/components/TransactionsStats";
import { TransactionsTable } from "@/src/features/transactions/components/TransactionsTable";
import { Input } from "@/src/components/ui/Input";
import { ExportButton } from "@/src/components/shared/ExportButton";
import { Pagination } from "@/src/components/shared/Pagination";
import { TransactionRecord } from "@/src/types";

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    transactions, summary, metadata, exportData, isLoading, 
    filters, setFilters, handleReset 
  } = useTransactions(currentPage, setCurrentPage);

  // تجهيز البيانات للإكسل (باستخدام القائمة الكاملة الخاصة بالتصدير وليس صفحة الـ 10 عناصر)
  const excelData = exportData.map((tx: TransactionRecord) => ({
    "التاريخ": new Date(tx.date).toLocaleDateString('ar-EG'),
    "النوع": tx.type === "IN" ? "إيراد (+)" : "مصروف (-)",
    "التصنيف": tx.category,
    "البيان": tx.desc,
    "المبلغ (₪)": tx.amount
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-app-card-light dark:bg-app-card-dark p-6 rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-app-text-primary-light dark:text-app-text-primary-dark">السجل المالي الشامل</h1>
            <p className="text-sm text-app-text-secondary-light dark:text-app-text-secondary-dark font-medium mt-1">تتبع دقيق لكل قرش يدخل أو يخرج من الورشة</p>
          </div>
        </div>
        <ExportButton data={excelData} fileName={`السجل_المالي_${filters.startDate || 'شامل'}`} />
      </div>

      <TransactionsStats summary={summary} />

      <div className="bg-app-card-light dark:bg-app-card-dark rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm overflow-hidden">
        <div className="p-4 border-b border-app-border-light dark:border-app-border-dark bg-zinc-50 dark:bg-zinc-900 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input type="date" label="من تاريخ" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="bg-app-card-light dark:bg-app-card-dark" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input type="date" label="إلى تاريخ" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="bg-app-card-light dark:bg-app-card-dark" />
          </div>
          <button className="bg-brand-600 hover:bg-indigo-700 text-white px-6 h-[42px] rounded-xl font-bold flex items-center gap-2 transition cursor-default">
            <Filter className="w-4 h-4" /> تصفية تلقائية
          </button>
          {(filters.startDate || filters.endDate) && (
            <button onClick={handleReset} className="bg-danger-50 dark:bg-danger-900/20 hover:bg-rose-100 text-danger-600 dark:text-danger-500 px-4 h-[42px] rounded-xl font-bold flex items-center transition" title="إلغاء التصفية">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {isLoading && transactions.length === 0 ? (
          <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600 dark:text-brand-400" /></div>
        ) : (
          <>
            <TransactionsTable transactions={transactions} />
            <div className="pb-4">
               <Pagination currentPage={metadata.currentPage} totalPages={metadata.totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </div>

    </div>
  );
}