"use client";

import { TrendingDown, Plus, Wallet, Receipt, Truck, History, Loader2 } from "lucide-react";
import { useExpenses } from "@/src/features/expenses/hooks/useExpenses";

// المكونات المفصولة
import { FinancialStats } from "@/src/features/expenses/components/FinancialStats";
import { ExpensesModals } from "@/src/features/expenses/components/ExpensesModals";
import { ExpensesTable, PaymentsTable, PurchasesTable } from "@/src/features/expenses/components/ExpensesTable";

export default function ExpensesPage() {
  const { state, dispatch, actions } = useExpenses();

  const updateForm = (form: any, field: string, value: any) => {
    dispatch({ type: "UPDATE_FORM", form, field, value });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. الترويسة وأزرار التحكم */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-rose-500" /> إدارة المصاريف والمشتريات
          </h1>
          <p className="text-gray-500 text-sm mt-1">تابع التدفقات المالية، المشتريات، وتسديد دفعات التجار</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button onClick={() => dispatch({ type: "OPEN_MODAL", payload: "payment" })} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-md">
            <Wallet className="w-5 h-5" /> تسديد دفعة للتاجر
          </button>
          <button onClick={() => dispatch({ type: "OPEN_MODAL", payload: state.activeTab === "expenses" ? "expense" : "purchase" })} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition shadow-md">
            <Plus className="w-5 h-5" /> {state.activeTab === "expenses" ? "مصروف جديد" : "فاتورة مشتريات"}
          </button>
        </div>
      </div>

      {/* 2. الإحصائيات العلوية */}
      <FinancialStats overview={state.overview} />

      {/* 3. منطقة الجداول والتبويبات */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* أزرار التبويبات */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-2 overflow-x-auto">
          <button onClick={() => dispatch({ type: "SET_TAB", payload: "expenses" })} className={`whitespace-nowrap flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${state.activeTab === "expenses" ? "bg-white text-rose-600 shadow-sm border border-gray-200" : "text-gray-500 hover:bg-gray-100"}`}><Receipt className="w-5 h-5" /> المصاريف التشغيلية</button>
          <button onClick={() => dispatch({ type: "SET_TAB", payload: "purchases" })} className={`whitespace-nowrap flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${state.activeTab === "purchases" ? "bg-white text-indigo-600 shadow-sm border border-gray-200" : "text-gray-500 hover:bg-gray-100"}`}><Truck className="w-5 h-5" /> فواتير المشتريات</button>
          <button onClick={() => dispatch({ type: "SET_TAB", payload: "payments" })} className={`whitespace-nowrap flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${state.activeTab === "payments" ? "bg-white text-emerald-600 shadow-sm border border-gray-200" : "text-gray-500 hover:bg-gray-100"}`}><History className="w-5 h-5" /> سجل دفعات الموردين</button>
        </div>

        {/* محتوى الجداول */}
        <div className="p-0">
          {state.isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : state.activeTab === "expenses" ? (
            <ExpensesTable expenses={state.expenses} onDelete={actions.handleDeleteExpense} />
          ) : state.activeTab === "purchases" ? (
            <PurchasesTable purchases={state.purchases} />
          ) : (
            <PaymentsTable payments={state.payments} />
          )}
        </div>
      </div>

      {/* 4. النوافذ المنبثقة (Modals) */}
      <ExpensesModals state={state} dispatch={dispatch} actions={actions} updateForm={updateForm} />

    </div>
  );
}