"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { TypesWorkerTransaction, WorkerTransaction } from "@prisma/client";
import { getWorkerDetails, addWorkerTransaction, getPaginatedWorkerTransactions } from "@/src/server/actions/workers.actions";
import { WorkerDetailsData } from "@/src/types/worker.types";
import { PaginationMetadata } from "@/src/types/expense.types";

const workerFetcher = async (workerId: string) => {
  const res = await getWorkerDetails(workerId);
  if ("error" in res) throw new Error(String(res.error));
  return res.data as WorkerDetailsData;
};

const txFetcher = async ([_, workerId, page]: [string, string, number]) => {
  const res = await getPaginatedWorkerTransactions(workerId, page, 10);
  if ("error" in res) throw new Error(String(res.error));
  return res;
};

export function useWorkerStatement(workerId: string, currentPage: number) {
  const { data: workerData, mutate: mutateWorker } = useSWR(["worker-details", workerId], () => workerFetcher(workerId), { revalidateOnFocus: false });
  const { data: txRes, isLoading, mutate: mutateTx } = useSWR(["worker-txs", workerId, currentPage], fetcher => txFetcher(fetcher), { keepPreviousData: true });

  const handleAddTransaction = useCallback(async (amount: number, type: TypesWorkerTransaction, description: string) => {
    const res = await addWorkerTransaction({ userId: workerId, amount, type, description });
    if ("error" in res) {
      toast.error(String(res.error));
      return false;
    }
    toast.success("تم تسجيل العملية بنجاح");
    mutateWorker(); 
    mutateTx();     
    return true;
  }, [workerId, mutateWorker, mutateTx]);

  return { 
    worker: workerData || null, 
    transactions: (txRes?.data as WorkerTransaction[]) || [],
    metadata: (txRes?.metadata as PaginationMetadata) || { totalItems: 0, totalPages: 1, currentPage: 1 },
    isLoading, 
    actions: { handleAddTransaction } 
  };
}