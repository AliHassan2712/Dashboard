import { User, WorkerTransaction } from "@prisma/client";

export type WorkerWithTransactions = User & {
  transactions: WorkerTransaction[];
  currentBalance: number; 
};

export interface WorkersState {
  workers: WorkerWithTransactions[];
  isLoading: boolean;
  isSubmitting: boolean;
  txModal: { isOpen: boolean; userId: string; type: string; name: string };
  txData: { amount: string; method: string; notes: string };
}