import { ExpensesState } from "@/src/types";

export const initialState: ExpensesState = {
  activeTab: "expenses",
  overview: { totalExpenses: 0, totalPurchases: 0, totalDebts: 0 },
  expenses: [], 
  purchases: [], 
  suppliers: [], 
  spareParts: [], 
  payments: [],
  isLoading: true, 
  isSubmitting: false,
  modals: { expense: false, purchase: false, supplier: false, payment: false, ledger: false, editPayment: false },
  ledgerSupplierId: null,
  editingPaymentId: null,
};

export type Action =
  | { type: "SET_TAB"; payload: ExpensesState["activeTab"] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_DATA"; payload: Partial<ExpensesState> }
  | { type: "OPEN_MODAL"; payload: keyof ExpensesState["modals"] }
  | { type: "CLOSE_MODALS" };
  // 💡 تم مسح UPDATE_FORM لأنه لم يعد مستخدماً