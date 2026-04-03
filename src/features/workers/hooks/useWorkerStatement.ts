"use client";

import { useState, useEffect, useCallback } from "react";
import { getWorkerDetails, addWorkerTransaction } from "../actions";
import { toast } from "react-hot-toast";

export function useWorkerStatement(workerId: string) {
  const [worker, setWorker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const res = await getWorkerDetails(workerId);
    if (res.success) {
      setWorker(res.data);
    } else {
      toast.error(res.error || "فشل جلب بيانات العامل");
    }
    setIsLoading(false);
  }, [workerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddTransaction = async (amount: number, type: any, description: string) => {
    const res = await addWorkerTransaction({ userId: workerId, amount, type, description });
    if (res.success) {
      toast.success("تم تسجيل العملية بنجاح");
      fetchData(); // تحديث البيانات فوراً
      return true;
    } else {
      toast.error(res.error || "فشل التسجيل");
      return false;
    }
  };

  return { worker, isLoading, handleAddTransaction, refresh: fetchData };
}