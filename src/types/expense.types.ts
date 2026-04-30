import { PurchaseInvoice, SupplierPayment, Supplier } from "@prisma/client";

export type PurchaseInvoiceWithSupplier = PurchaseInvoice & { supplier: { name: string } };
export type SupplierPaymentWithSupplier = SupplierPayment & { supplier: { name: string } };

export type FinancialOverview = { totalExpenses: number; totalPurchases: number; totalDebts: number; };

export type SupplierStatementData = Supplier & {
  invoices: PurchaseInvoice[];
  payments: SupplierPayment[];
};

export interface PaginationMetadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface SparePartDropdownOption {
  id: string;
  name: string;
  sellingPrice: number;
  quantity: number;
}