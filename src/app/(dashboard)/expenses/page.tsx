"use client";

import { useState } from "react";
import { TrendingDown, Plus, Wallet, Receipt, Truck, History, Loader2 } from "lucide-react";

import { useExpenses } from "@/src/features/expenses/hooks/useExpenses";
import { usePurchases } from "@/src/features/expenses/hooks/usePurchases";
import { useSuppliers } from "@/src/features/expenses/hooks/useSuppliers";

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
  const [activeTab, setActiveTab] = useState<"expenses" | "purchases" | "payments">("expenses");

  const exp = useExpenses();
  const pur = usePurchases();
  const sup = useSuppliers();

  // مدمج حالات التحميل
  const isAnyLoading = exp.isLoading || pur.isLoading || sup.isLoading;

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
          <button onClick={() => sup.setPaymentModal({ isOpen: true, editingId: null })} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-md">
            <Wallet className="w-5 h-5" /> تسديد دفعة للتاجر
          </button>
          <button onClick={() => activeTab === "expenses" ? exp.setIsModalOpen(true) : pur.setIsModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition shadow-md">
            <Plus className="w-5 h-5" /> {activeTab === "expenses" ? "مصروف جديد" : "فاتورة مشتريات"}
          </button>
        </div>
      </div>

      <FinancialStats overview={exp.overview} />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-2 overflow-x-auto">
          <button onClick={() => setActiveTab("expenses")} className={`whitespace-nowrap flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "expenses" ? "bg-white text-rose-600 shadow-sm border border-gray-200" : "text-gray-500 hover:bg-gray-100"}`}><Receipt className="w-5 h-5" /> المصاريف التشغيلية</button>
          <button onClick={() => setActiveTab("purchases")} className={`whitespace-nowrap flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "purchases" ? "bg-white text-indigo-600 shadow-sm border border-gray-200" : "text-gray-500 hover:bg-gray-100"}`}><Truck className="w-5 h-5" /> فواتير المشتريات</button>
          <button onClick={() => setActiveTab("payments")} className={`whitespace-nowrap flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "payments" ? "bg-white text-emerald-600 shadow-sm border border-gray-200" : "text-gray-500 hover:bg-gray-100"}`}><History className="w-5 h-5" /> سجل دفعات الموردين</button>
        </div>

        <div className="p-0">
          {isAnyLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : activeTab === "expenses" ? (
            <ExpensesTable expenses={exp.expenses} onDelete={exp.actions.handleDelete} />
          ) : activeTab === "purchases" ? (
            <PurchasesTable purchases={pur.purchases} onOpenLedger={sup.setLedgerSupplierId} />
          ) : (
            <PaymentsTable payments={sup.payments} onEdit={(pay) => sup.setPaymentModal({ isOpen: true, editingId: pay.id })} onDelete={sup.actions.handleDeletePayment} />
          )}
        </div>
      </div>

      {/* النوافذ المنبثقة */}
      <ExpenseModal isOpen={exp.isModalOpen} onClose={() => exp.setIsModalOpen(false)} onSave={exp.actions.handleAdd} />
      
      <PurchaseModal 
        isOpen={pur.isModalOpen} 
        onClose={() => pur.setIsModalOpen(false)} 
        suppliers={pur.suppliers} 
        spareParts={pur.spareParts} 
        onSave={async (data) => {
          const success = await pur.actions.handleAddInvoice(data);
          if (success) { sup.actions.refresh(); exp.actions.refresh(); } // تحديث الإحصائيات والدفعات
          return success;
        }} 
        onOpenSupplierModal={() => {
          pur.setIsModalOpen(false);
          setTimeout(() => sup.setIsSupplierModalOpen(true), 100);
        }} 
      />

      <SupplierModal 
        isOpen={sup.isSupplierModalOpen} 
        onClose={() => sup.setIsSupplierModalOpen(false)} 
        onBack={() => {
          sup.setIsSupplierModalOpen(false);
          setTimeout(() => pur.setIsModalOpen(true), 100);
        }} 
        onSave={async (data) => {
          const success = await sup.actions.handleAddSupplier(data);
          if (success) { pur.actions.refresh(); } // تحديث قائمة التجار في المشتريات
          return success;
        }} 
      />

      <PaymentModal 
        isOpen={sup.paymentModal.isOpen} 
        onClose={() => sup.setPaymentModal({ isOpen: false, editingId: null })} 
        suppliers={sup.suppliers} 
        onSave={sup.actions.handleSavePayment} 
        editData={sup.paymentModal.editingId ? (() => {
          const p = sup.payments.find(pay => pay.id === sup.paymentModal.editingId);
          return p ? { supplierId: p.supplierId, amount: p.amount, notes: p.notes || "" } : null;
        })() : null} 
      />

      <SupplierLedgerModal isOpen={!!sup.ledgerSupplierId} onClose={() => sup.setLedgerSupplierId(null)} supplierId={sup.ledgerSupplierId} />
    </div>
  );
}