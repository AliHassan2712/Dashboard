export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SETTINGS: "/settings",
  
  TICKETS: "/tickets",
  NEW_TICKET: "/tickets/new",
  
  INVENTORY: "/inventory",
  TRANSACTIONS: "/transactions",
  EXPENSES: "/expenses",
  QUOTATIONS: "/quotations",
  REPORTS: "/reports",
  COMPRESSORS: "/compressors",
  TRIALS: "/trials",
  WORKERS: "/workers",

  TICKET_DETAILS: (id: string) => `/tickets/${id}`,
  WORKER_STATEMENT: (id: string) => `/workers/${id}/statement`,
} as const;