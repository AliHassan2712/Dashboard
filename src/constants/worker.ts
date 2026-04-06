import { WorkersState, WorkerWithTransactions } from "@/src/types";

export const initialState: WorkersState = {
  workers: [],
  isLoading: true,
  isSubmitting: false,
  txModal: { isOpen: false, userId: '', type: '', name: '' },
  txData: { amount: '', method: 'كاش', notes: '' },
  workerForm: { name: '', phone: '', password: '' }
};

export type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_WORKERS"; payload: WorkerWithTransactions[] }
  | { type: "OPEN_TX_MODAL"; payload: { userId: string; type: string; name: string } }
  | { type: "CLOSE_TX_MODAL" }
  | { type: "UPDATE_TX_DATA"; field: keyof WorkersState["txData"]; value: string }
  | { type: "UPDATE_WORKER_FORM"; field: keyof WorkersState["workerForm"]; value: string }
  | { type: "RESET_FORMS" };