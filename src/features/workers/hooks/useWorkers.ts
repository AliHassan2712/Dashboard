"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { registerWorker, getWorkersWithBalance, addWorkerTransaction, deleteWorker } from "@/src/server/actions/workers.actions";
import { TypesWorkerTransaction } from "@prisma/client";
import { AddWorkerValues, WorkerTxValues } from "../validations/validations";
import { WorkerWithCurrentBalance } from "@/src/types/worker.types";

const fetchWorkers = async () => {
  const res = await getWorkersWithBalance();
  return res as WorkerWithCurrentBalance[];
};

export function useWorkers() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [txModal, setTxModal] = useState<{ isOpen: boolean; userId: string; type: TypesWorkerTransaction | null }>({ 
    isOpen: false, userId: "", type: null 
  });

  const { data: workersRes, isLoading, mutate } = useSWR("workers-list", fetchWorkers, { revalidateOnFocus: false });

  const handleAddWorker = useCallback(async (data: AddWorkerValues) => {
    const res = await registerWorker({ ...data, baseSalary: data.baseSalary?.toString() });
    if (res.success) {
      toast.success("تم تسجيل الفني بنجاح");
      setIsAddModalOpen(false);
      mutate();
      return true;
    }
    toast.error(res.error || "حدث خطأ");
    return false;
  }, [mutate]);

  const handleAddTx = useCallback(async (data: WorkerTxValues, userId: string) => {
    const typeLabel = data.type === 'STAKE' ? 'استحقاق/راتب' : data.type === 'ADVANCE' ? 'سلفة/سحب' : data.type === 'BONUS' ? 'مكافأة' : 'خصم';
    const finalDesc = `${typeLabel}${data.notes ? ` - ${data.notes}` : ''}`;

    const res = await addWorkerTransaction({ userId, amount: data.amount, type: data.type, description: finalDesc });

    if (res.success) {
      toast.success("تم تسجيل العملية بنجاح");
      setTxModal({ isOpen: false, userId: "", type: null }); 
      mutate();
      return true;
    } 
    toast.error(res.error || "فشل تسجيل العملية");
    return false;
  }, [mutate]);

  const handleDelete = useCallback(async (userId: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الفني (${name}) نهائياً؟`)) return;
    const res = await deleteWorker(userId);
    if (res.success) { toast.success("تم الحذف"); mutate(); } 
    else { toast.error(res.error || "لا يمكن الحذف لوجود حركات مالية"); }
  }, [mutate]);

  return { 
    workers: workersRes || [], isLoading, 
    isAddModalOpen, setIsAddModalOpen, 
    txModal, setTxModal, 
    actions: { handleAddWorker, handleAddTx, handleDelete } 
  };
}