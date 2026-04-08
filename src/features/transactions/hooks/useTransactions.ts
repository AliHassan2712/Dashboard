"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllTransactions } from "@/src/server/actions/transactions.actions";

export type TransactionRecord = {
  id: string;
  date: Date;
  type: string;
  category: string;
  desc: string;
  amount: number;
};

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });

  const fetchData = useCallback(async (currentFilters: { startDate?: string; endDate?: string } = {}) => {
    setIsLoading(true);
    const res = await getAllTransactions(currentFilters);
    if (res.success && res.data) {
      setTransactions(res.data as TransactionRecord[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = () => fetchData(filters);
  
  const handleReset = () => {
    setFilters({ startDate: "", endDate: "" });
    fetchData({});
  };

  return { transactions, isLoading, filters, setFilters, handleFilter, handleReset };
}