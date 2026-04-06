import { ExpensesState } from "@/src/types";
import { ExpenseCategory } from "@prisma/client";

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
  modals: { expense: false, purchase: false, supplier: false, payment: false },
  forms: {
    expense: { title: "", amount: "", category: ExpenseCategory.STANDARD, notes: "" },
    purchase: { supplierId: "", paidAmount: "", items: [] }, 
    supplier: { name: "", phone: "" },
    payment: { supplierId: "", amount: "", notes: "" },
  },
};

export type Action =
  | { type: "SET_TAB"; payload: ExpensesState["activeTab"] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_DATA"; payload: Partial<ExpensesState> }
  | { type: "OPEN_MODAL"; payload: keyof ExpensesState["modals"] }
  | { type: "CLOSE_MODALS" }
  | { 
      type: "UPDATE_FORM"; 
      form: keyof ExpensesState["forms"]; 
      field: string; 
      value: string | { sparePartId: string; quantity: string; unitCost: string }[]; 
    };