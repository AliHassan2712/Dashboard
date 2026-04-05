import {
  Ticket,
  TicketPart,
  SparePart,
  User,
  Payment,
  WorkerTransaction,
   PurchaseInvoice, 
   SupplierPayment,
   Expense,
   Supplier,
   ExpenseCategory

} from "@prisma/client";


// ==========================================
// 1. أنواع نظام التذاكر (Tickets)
// ==========================================

// نوع يمثل القطعة المستهلكة داخل التذكرة مع تفاصيل القطعة من المخزون
export type TicketPartWithDetails = TicketPart & {
  sparePart: SparePart;
};

// نوع يمثل التذكرة الكاملة مع كل علاقاتها (العمال، القطع، الدفعات)
export type TicketWithDetails = Ticket & {
  worker: { name: string } | null;
  partsUsed: TicketPartWithDetails[];
  payments: Payment[];
};

// ==========================================
// 2. أنواع نظام العمال (Workers & Finance)
// ==========================================

// نوع يمثل العامل مع سجل معاملاته المالية
export type WorkerWithTransactions = User & {
  transactions: WorkerTransaction[];
  currentBalance: number; // حقل إضافي نقوم بحسابه برمجياً
};

// ==========================================
// 3. أنواع الإحصائيات (Dashboard)
// ==========================================

export type DashboardStats = {
  totalTickets: number;
  totalDebts: number;
  totalExpectedRevenue: number;
  todaysCash: number;
  statusCounts: {
    OPEN: number;
    IN_PROGRESS: number;
    WAITING_FOR_PARTS: number;
    COMPLETED: number;
  };
  lowStockParts: SparePart[];
  lowStockCount: number;
  chartData: { name: string; "التذاكر": number }[];
  recentTickets: {
    id: string;
    customerName: string;
    status: string;
    createdAt: Date;
  }[];

  todaysExpenses: number;
  netCash: number;
  totalSupplierDebts: number;
};



// ==========================================
// 4. أنواع المصاريف والمشتريات (Expenses & Purchases)
// ==========================================

// نوع فاتورة المشتريات مدمج مع اسم التاجر
export type PurchaseInvoiceWithSupplier = PurchaseInvoice & {
  supplier: { name: string };
};

// نوع الدفعة مدمج مع اسم التاجر
export type SupplierPaymentWithSupplier = SupplierPayment & {
  supplier: { name: string };
};

// نوع ملخص الإحصائيات العلوية
export type FinancialOverview = {
  totalExpenses: number;
  totalPurchases: number;
  totalDebts: number;
};






export interface ExpensesState {
  activeTab: "expenses" | "purchases" | "payments";
  overview: FinancialOverview;
  expenses: Expense[];
  purchases: PurchaseInvoiceWithSupplier[];
  suppliers: Supplier[];
  spareParts: any[]; 
  payments: SupplierPaymentWithSupplier[];
  isLoading: boolean;
  isSubmitting: boolean;
  modals: { expense: boolean; purchase: boolean; supplier: boolean; payment: boolean; };
  forms: {
    expense: { title: string; amount: string; category: ExpenseCategory; notes: string };
    purchase: { supplierId: string; paidAmount: string; items: { sparePartId: string; quantity: string; unitCost: string }[] };
    supplier: { name: string; phone: string };
    payment: { supplierId: string; amount: string; notes: string };
  };
}




export interface InventoryState {
  parts: SparePart[];
  searchQuery: string;
  isLoading: boolean;
  isSubmitting: boolean;
  modals: { addEdit: boolean };
  editingId: string | null;
  forms: {
    part: { name: string; quantity: string; averageCost: string; sellingPrice: string; lowStockAlert: string };
  };
}





export interface WorkersState {
  workers: WorkerWithTransactions[];
  isLoading: boolean;
  isSubmitting: boolean;
  txModal: { isOpen: boolean; userId: string; type: string; name: string };
  txData: { amount: string; method: string; notes: string };
  workerForm: { name: string; phone: string; password: string };
}




export type UpdateTicketInput = {
  customerName?: string;
  customerPhone?: string;
  compressorModel?: string;
  issueDescription?: string;
  advancePayment?: number;
  status?: "OPEN" | "IN_PROGRESS" | "WAITING_FOR_PARTS" | "COMPLETED";
  laborCost?: number;
  discount?: number;
  invoiceImageUrl?: string;
};



export interface FinanceData {
  partsTotal: number;
  subTotal: number;
  discountAmount: number;
  grandTotal: number;
  totalPaid: number;
  remainingAmount: number;
}
