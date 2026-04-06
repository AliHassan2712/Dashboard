import { PurchaseInvoice, SupplierPayment, Expense, Supplier, ExpenseCategory, SparePart } from "@prisma/client";

export type PurchaseInvoiceWithSupplier = PurchaseInvoice & { supplier: { name: string } };
export type SupplierPaymentWithSupplier = SupplierPayment & { supplier: { name: string } };

export type FinancialOverview = { totalExpenses: number; totalPurchases: number; totalDebts: number; };

export interface PurchaseItemForm {
  sparePartId: string;
  isNew?: boolean;
  newItemName?: string;
  newItemSellingPrice?: string;
  quantity: string;
  unitCost: string;
  notes?: string;
}

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
  forms: {
    expense: { title: string; amount: string; category: ExpenseCategory; notes: string };
    purchase: { supplierId: string; paidAmount: string; notes: string; items: PurchaseItemForm[] };    supplier: { name: string; phone: string };
    payment: { supplierId: string; amount: string; notes: string };
  };
}