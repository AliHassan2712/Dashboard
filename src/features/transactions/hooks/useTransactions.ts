"use client";

import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import { getTransactionsData } from "@/src/server/actions/transactions.actions";
import { TransactionRecord, TransactionsSummary } from "@/src/types";
import { PaginationMetadata } from "@/src/types/expense.types";

const fetcher = async ([_, page, startDate, endDate]: [string, number, string, string]) => {
  const res = await getTransactionsData(page, 10, { startDate, endDate });
  if ("error" in res) throw new Error(String(res.error));
  return res;
};

export function useTransactions(currentPage: number, setCurrentPage: (page: number) => void) {
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [debouncedFilters, setDebouncedFilters] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      if (filters.startDate !== debouncedFilters.startDate || filters.endDate !== debouncedFilters.endDate) {
        setCurrentPage(1); 
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, setCurrentPage, debouncedFilters.startDate, debouncedFilters.endDate]);

  const { data: resData, isLoading } = useSWR(
    ["transactions-list", currentPage, debouncedFilters.startDate, debouncedFilters.endDate],
    fetcher,
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const handleReset = useCallback(() => {
    setFilters({ startDate: "", endDate: "" });
    setCurrentPage(1);
  }, [setCurrentPage]);

  return { 
    transactions: (resData?.data as TransactionRecord[]) || [], 
    summary: (resData?.summary as TransactionsSummary) || { totalIn: 0, totalOut: 0, net: 0 },
    metadata: (resData?.metadata as PaginationMetadata) || { totalItems: 0, totalPages: 1, currentPage: 1 },
    exportData: (resData?.allDataForExport as TransactionRecord[]) || [],
    isLoading, filters, setFilters, handleReset 
  };
}