export interface TransactionRecord {
  id: string;
  date: Date;
  type: "IN" | "OUT";
  category: string;
  desc: string;
  amount: number;
}

export interface TransactionsSummary {
  totalIn: number;
  totalOut: number;
  net: number;
}