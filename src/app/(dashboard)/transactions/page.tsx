"use client";

import { Calculator, Loader2, Filter, X } from "lucide-react";
import { useTransactions } from "@/src/features/transactions/hooks/useTransactions";
import { TransactionsStats } from "@/src/features/transactions/components/TransactionsStats";
import { TransactionsTable } from "@/src/features/transactions/components/TransactionsTable";
import { Input } from "@/src/components/ui/Input";
import { ExportButton } from "@/src/components/shared/ExportButton";

export default function TransactionsPage() {
  const { transactions, isLoading, filters, setFilters, handleFilter, handleReset } = useTransactions();

  // تجهيز البيانات للإكسل
  const excelData = transactions.map(tx => ({
    "التاريخ": new Date(tx.date).toLocaleDateString('ar-EG'),
    "النوع": tx.type === "IN" ? "إيراد (+)" : "مصروف (-)",
    "التصنيف": tx.category,
    "البيان": tx.desc,
    "المبلغ (₪)": tx.amount
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* الترويسة */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">السجل المالي الشامل</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">تتبع دقيق لكل قرش يدخل أو يخرج من الورشة</p>
          </div>
        </div>
        <ExportButton data={excelData} fileName={`السجل_المالي_${filters.startDate || 'شامل'}`} />
      </div>

      {/* ملخص الإحصائيات السريعة */}
      <TransactionsStats transactions={transactions} />

      {/* الفلتر والجدول */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input type="date" label="من تاريخ" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="bg-white" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input type="date" label="إلى تاريخ" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="bg-white" />
          </div>
          <button onClick={handleFilter} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 h-[42px] rounded-xl font-bold flex items-center gap-2 transition">
            <Filter className="w-4 h-4" /> تصفية
          </button>
          {(filters.startDate || filters.endDate) && (
            <button onClick={handleReset} className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 h-[42px] rounded-xl font-bold flex items-center transition">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : (
          <TransactionsTable transactions={transactions} />
        )}
      </div>

    </div>
  );
}