import { Ticket, TicketPart, SparePart, Payment, TicketStatus } from "@prisma/client";

export type TicketPartWithDetails = TicketPart & {
  sparePart: SparePart;
};

export type TicketWithDetails = Ticket & {
  worker: { name: string } | null;
  partsUsed: TicketPartWithDetails[];
  payments: Payment[];
};

export type TicketListItem = Ticket & {
  worker: { name: string } | null;
  partsUsed: TicketPart[];
};

export type UpdateTicketInput = {
  customerName?: string;
  customerPhone?: string;
  compressorModel?: string;
  issueDescription?: string;
  advancePayment?: number;
  status?: TicketStatus; 
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