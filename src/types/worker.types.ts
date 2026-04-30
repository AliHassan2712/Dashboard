import { User, WorkerTransaction } from "@prisma/client";

// تعريف العامل مع رصيده الحالي للقائمة الرئيسية
export type WorkerWithCurrentBalance = User & {
  currentBalance: number;
};

// تعريف تفاصيل العامل لكشف الحساب
export type WorkerDetailsData = User & {
  currentBalance: number;
};

// واجهات حالة الـ UI (إن احتجتها)
export interface WorkersState {
  workers: WorkerWithCurrentBalance[];
  isLoading: boolean;
  isSubmitting: boolean;
  txModal: { isOpen: boolean; userId: string; type: string; name: string };
  txData: { amount: string; method: string; notes: string };
}