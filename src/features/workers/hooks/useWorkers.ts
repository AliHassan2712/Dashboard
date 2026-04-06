"use client";

import { useReducer, useEffect, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { registerWorker, getWorkersWithBalance, addWorkerTransaction, deleteWorker } from "@/src/server/actions/workers.actions";
import { Action, initialState } from "@/src/constants/worker";
import { WorkersState } from "@/src/types";
import { TypesWorkerTransaction } from "@prisma/client";

function reducer(state: WorkersState, action: Action): WorkersState {
  switch (action.type) {
    case "SET_LOADING": return { ...state, isLoading: action.payload };
    case "SET_SUBMITTING": return { ...state, isSubmitting: action.payload };
    case "SET_WORKERS": return { ...state, workers: action.payload, isLoading: false };
    case "OPEN_TX_MODAL": return { ...state, txModal: { isOpen: true, ...action.payload } };
    case "CLOSE_TX_MODAL": return { ...state, txModal: initialState.txModal, txData: initialState.txData };
    case "UPDATE_TX_DATA": return { ...state, txData: { ...state.txData, [action.field]: action.value } };
    case "UPDATE_WORKER_FORM": return { ...state, workerForm: { ...state.workerForm, [action.field]: action.value } };
    case "RESET_FORMS": return { ...state, workerForm: initialState.workerForm, txData: initialState.txData };
    default: return state;
  }
}

export function useWorkers() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadWorkers = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    const data = await getWorkersWithBalance();
    dispatch({ type: "SET_WORKERS", payload: data });
  };

  useEffect(() => { loadWorkers(); }, []);

  const handleAddWorker = async (e: FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_SUBMITTING", payload: true });
    const res = await registerWorker(state.workerForm);
    if (res.success) {
      toast.success("تم تسجيل الفني بنجاح");
      dispatch({ type: "RESET_FORMS" });
      loadWorkers();
    } else toast.error(res.error || "حدث خطأ");
    dispatch({ type: "SET_SUBMITTING", payload: false });
  };

  const handleConfirmTx = async () => {
    if (!state.txData.amount || isNaN(Number(state.txData.amount))) {
      return toast.error("يرجى إدخال مبلغ صحيح");
    }
    dispatch({ type: "SET_SUBMITTING", payload: true });
    
    const typeLabel = state.txModal.type === 'STAKE' ? 'استحقاق' : state.txModal.type === 'ADVANCE' ? 'سلفة' : 'تصفية';
    const finalDesc = `${typeLabel} - ${state.txData.method}${state.txData.notes ? `: ${state.txData.notes}` : ''}`;

    const res = await addWorkerTransaction({
      userId: state.txModal.userId,
      amount: Number(state.txData.amount),
      type: state.txModal.type as TypesWorkerTransaction,
      description: finalDesc
    });

    if (res.success) {
      toast.success("تم تسجيل العملية بنجاح");
      dispatch({ type: "CLOSE_TX_MODAL" });
      loadWorkers();
    } else {
      toast.error(res.error || "فشل تسجيل العملية");
    }
    dispatch({ type: "SET_SUBMITTING", payload: false });
  };

  const handleDelete = async (userId: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف الفني (${name}) نهائياً؟`)) {
      const res = await deleteWorker(userId);
      if (res.success) { toast.success("تم الحذف"); loadWorkers(); }
      else { toast.error(res.error || "لا يمكن الحذف لوجود حركات مالية"); }
    }
  };

  return { state, dispatch, actions: { handleAddWorker, handleConfirmTx, handleDelete } };
}