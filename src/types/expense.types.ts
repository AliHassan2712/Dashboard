import { PurchaseInvoice, SupplierPayment, Expense, Supplier, SparePart } from "@prisma/client";

export type PurchaseInvoiceWithSupplier = PurchaseInvoice & { supplier: { name: string } };
export type SupplierPaymentWithSupplier = SupplierPayment & { supplier: { name: string } };

export type FinancialOverview = { totalExpenses: number; totalPurchases: number; totalDebts: number; };

export type SupplierStatementData = Supplier & {
  invoices: PurchaseInvoice[];
  payments: SupplierPayment[];
};

export interface ExpensesState {
  activeTab: "expenses" | "purchases" | "payments";
  overview: FinancialOverview;
  expenses: Expense[];
  purchases: PurchaseInvoiceWithSupplier[];
  suppliers: Supplier[];
  spareParts: SparePart[]; 
  payments: SupplierPaymentWithSupplier[];
  isLoading: boolean;
  isSubmitting: boolean;
  modals: { expense: boolean; purchase: boolean; supplier: boolean; payment: boolean; ledger: boolean; editPayment: boolean; };
  ledgerSupplierId: string | null; 
  editingPaymentId: string | null;
}