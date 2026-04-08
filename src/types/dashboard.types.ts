import { SparePart, TicketStatus } from "@prisma/client";

export type DashboardStats = {
  totalTickets: number;
  totalExpectedRevenue: number;
  totalDebts: number;
  statusCounts: {
    OPEN: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    CANCELED: number;
  };
  lowStockParts: SparePart[];
  lowStockCount: number;
  recentTickets: {
    id: string;
    customerName: string;
    status: TicketStatus; 
    createdAt: Date;
  }[];
  chartData: { name: string; revenue: number; expenses: number }[];
  todaysCash: number;
  todaysExpenses: number;
  netCash: number;
  totalSupplierDebts: number;
};

export type WorkerDashboardStats = {
  openTicketsCount: number;
  balance: number;
  activeTrials: number;
};