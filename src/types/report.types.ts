export interface ReportPeriodData {
  startDate?: string;
  endDate?: string;
  revenue: number;
  expenses: number;
  purchasesPaid: number;
  workerPayments: number;
  netCash: number;
}

export interface FinancialReportData {
  totalAssets: number;
  inventoryCost: number;
  totalCustomerDebts: number;
  totalSupplierDebts: number;
  totalNetCashAllTime: number;
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  period: ReportPeriodData;
  ticketsRevenue: number;
  compressorsRevenue: number;
  generalExpenses: number;
  workersPayments: number;
  purchasesCosts: number;
}