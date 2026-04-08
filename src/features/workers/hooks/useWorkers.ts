"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { registerWorker, getWorkersWithBalance, addWorkerTransaction, deleteWorker } from "@/src/server/actions/workers.actions";
import { TypesWorkerTransaction } from "@prisma/client";
import { AddWorkerValues, WorkerTxValues } from "../validations/validations";

export function useWorkers() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // حالات النوافذ المنبثقة
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [txModal, setTxModal] = useState<{ isOpen: boolean; userId: string; type: TypesWorkerTransaction | null }>({ 
    isOpen: false, userId: "", type: null 
  });

  const loadWorkers = useCallback(async () => {
    setIsLoading(true);
    const data = await getWorkersWithBalance();
    setWorkers(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => { loadWorkers(); }, [loadWorkers]);

  const handleAddWorker = async (data: AddWorkerValues) => {
    const res = await registerWorker({ ...data, baseSalary: data.baseSalary?.toString() });
    if (res.success) {
      toast.success("تم تسجيل الفني بنجاح");
      setIsAddModalOpen(false);
      loadWorkers();
      return true;
    }
    toast.error(res.error || "حدث خطأ");
    return false;
  };

  const handleAddTx = async (data: WorkerTxValues, userId: string) => {
    const typeLabel = data.type === 'STAKE' ? 'استحقاق/راتب' : data.type === 'ADVANCE' ? 'سلفة/سحب' : data.type === 'BONUS' ? 'مكافأة' : 'خصم';
    const finalDesc = `${typeLabel}${data.notes ? ` - ${data.notes}` : ''}`;

    const res = await addWorkerTransaction({
      userId,
      amount: data.amount,
      type: data.type,
      description: finalDesc
    });

    if (res.success) {
      toast.success("تم تسجيل العملية بنجاح");
      setTxModal({ isOpen: false, userId: "", type: null }); // إغلاق النافذة
      loadWorkers();
      return true;
    } 
    toast.error(res.error || "فشل تسجيل العملية");
    return false;
  };

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الفني (${name}) نهائياً؟`)) return;
    const res = await deleteWorker(userId);
    if (res.success) { 
      toast.success("تم الحذف"); 
      loadWorkers(); 
    } else { 
      toast.error(res.error || "لا يمكن الحذف لوجود حركات مالية"); 
    }
  };

  return { 
    workers, isLoading, 
    isAddModalOpen, setIsAddModalOpen, 
    txModal, setTxModal, 
    actions: { handleAddWorker, handleAddTx, handleDelete } 
  };
}