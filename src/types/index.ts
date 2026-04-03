import { 
  Ticket, 
  TicketPart, 
  SparePart, 
  User, 
  Payment, 
  WorkerTransaction 
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