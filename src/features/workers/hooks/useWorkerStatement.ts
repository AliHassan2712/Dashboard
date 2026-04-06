"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { getWorkerDetails, addWorkerTransaction } from "@/src/server/actions/workers.actions";
import { WorkerWithTransactions } from "@/src/types";
import { TypesWorkerTransaction } from "@prisma/client";

export function useWorkerStatement(workerId: string) {
  const [worker, setWorker] = useState<WorkerWithTransactions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const res = await getWorkerDetails(workerId);
    if (res.success && res.data) {
      setWorker(res.data as WorkerWithTransactions);
    } else {
      toast.error(res.error || "فشل جلب بيانات العامل");
    }
    setIsLoading(false);
  }, [workerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddTransaction = async (amount: number, type: TypesWorkerTransaction, description: string) => {
    const res = await addWorkerTransaction({ userId: workerId, amount, type, description });
    if (res.success) {
      toast.success("تم تسجيل العملية بنجاح");
      fetchData(); 
      return true;
    } else {
      toast.error(res.error || "فشل التسجيل");
      return false;
    }
  };

  return { worker, isLoading, handleAddTransaction, refresh: fetchData };
}