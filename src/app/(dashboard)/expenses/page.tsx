"use client";

import { TrendingDown, Plus, Wallet, Receipt, Truck, History, Loader2 } from "lucide-react";
import { useExpenses } from "@/src/features/expenses/hooks/useExpenses";
import { FinancialStats } from "@/src/features/expenses/components/FinancialStats";
import { ExpenseModal } from "@/src/features/expenses/components/modals/ExpenseModal";
import { PurchaseModal } from "@/src/features/expenses/components/modals/PurchaseModal";
import { SupplierModal } from "@/src/features/expenses/components/modals/SupplierModal";
import { PaymentModal } from "@/src/features/expenses/components/modals/PaymentModal";
import { SupplierLedgerModal } from "@/src/features/expenses/components/modals/SupplierLedgerModal";
import { ExpensesTable } from "@/src/features/expenses/components/tables/ExpensesTable";
import { PaymentsTable } from "@/src/features/expenses/components/tables/PaymentsTable";
import { PurchasesTable } from "@/src/features/expenses/components/tables/PurchasesTable";


export default function ExpensesPage() {
  const { state, dispatch, actions } = useExpenses();



  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
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

      <FinancialStats overview={state.overview} />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-2 overflow-x-auto">
          <button onClick={() => dispatch({ type: "SET_TAB", payload: "expenses" })} className={`whitespace-nowrap flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${state.activeTab === "expenses" ? "bg-white text-rose-600 shadow-sm border border-gray-200" : "text-gray-500 hover:bg-gray-100"}`}><Receipt className="w-5 h-5" /> المصاريف التشغيلية</button>
          <button onClick={() => dispatch({ type: "SET_TAB", payload: "purchases" })} className={`whitespace-nowrap flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${state.activeTab === "purchases" ? "bg-white text-indigo-600 shadow-sm border border-gray-200" : "text-gray-500 hover:bg-gray-100"}`}><Truck className="w-5 h-5" /> فواتير المشتريات</button>
          <button onClick={() => dispatch({ type: "SET_TAB", payload: "payments" })} className={`whitespace-nowrap flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${state.activeTab === "payments" ? "bg-white text-emerald-600 shadow-sm border border-gray-200" : "text-gray-500 hover:bg-gray-100"}`}><History className="w-5 h-5" /> سجل دفعات الموردين</button>
        </div>

        <div className="p-0">
          {state.isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : state.activeTab === "expenses" ? (
            <ExpensesTable expenses={state.expenses} onDelete={actions.handleDeleteExpense} />
          ) : state.activeTab === "purchases" ? (
            <PurchasesTable purchases={state.purchases} onOpenLedger={actions.openLedger} />
          ) : (
            <PaymentsTable payments={state.payments} onEdit={actions.openEditPayment} onDelete={actions.handleDeletePayment} />
          )}
        </div>
      </div>

      <ExpenseModal
        isOpen={state.modals.expense}
        onClose={() => dispatch({ type: "CLOSE_MODALS" })}
        onSave={actions.handleAddExpense}
      />
      <PurchaseModal
        isOpen={state.modals.purchase}
        onClose={() => dispatch({ type: "CLOSE_MODALS" })}
        suppliers={state.suppliers}
        spareParts={state.spareParts}
        onSave={actions.handleAddInvoice}
        onOpenSupplierModal={() => {
          // إغلاق نافذة المشتريات مؤقتاً وفتح نافذة التاجر
          dispatch({ type: "CLOSE_MODALS" });
          setTimeout(() => dispatch({ type: "OPEN_MODAL", payload: "supplier" }), 100);
        }}
      /><SupplierModal
        isOpen={state.modals.supplier}
        onClose={() => dispatch({ type: "CLOSE_MODALS" })}
        onBack={() => dispatch({ type: "OPEN_MODAL", payload: "purchase" })}
        onSave={actions.handleAddSupplier}
      />

      <PaymentModal
        isOpen={state.modals.payment || state.modals.editPayment}
        onClose={() => dispatch({ type: "CLOSE_MODALS" })}
        suppliers={state.suppliers}
        onSave={actions.handleSavePayment}
        editData={
          state.editingPaymentId
            ? (() => {
              const p = state.payments.find(pay => pay.id === state.editingPaymentId);
              return p ? { supplierId: p.supplierId, amount: p.amount, notes: p.notes || "" } : null;
            })()
            : null
        }
      />
      <SupplierLedgerModal isOpen={state.modals.ledger} onClose={() => dispatch({ type: "CLOSE_MODALS" })} supplierId={state.ledgerSupplierId} />
    </div>
  );
}