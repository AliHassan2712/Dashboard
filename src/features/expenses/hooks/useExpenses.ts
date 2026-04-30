"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { Expense } from "@prisma/client";
import { FinancialOverview, PaginationMetadata } from "@/src/types/expense.types";
import { getPaginatedExpenses, addExpense, deleteExpense, getFinancialOverview } from "@/src/server/actions/expenses.actions";
import { ExpenseFormValues } from "../validations/validations";

const overviewFetcher = async () => {
  const res = await getFinancialOverview();
  if ("error" in res) throw new Error(String(res.error));
  return res.data as FinancialOverview;
};

const expensesFetcher = async (page: number) => {
  const res = await getPaginatedExpenses(page, 10);
  if ("error" in res) throw new Error(String(res.error));
  return res;
};

export function useExpenses(currentPage: number) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: overview, mutate: mutateOverview } = useSWR("financial-overview", overviewFetcher, { revalidateOnFocus: false });
  const { data: expensesRes, isLoading, mutate: mutateExpenses } = useSWR(["expenses-list", currentPage], () => expensesFetcher(currentPage), { keepPreviousData: true });

  const handleAdd = useCallback(async (data: ExpenseFormValues) => {
    const res = await addExpense({ title: data.title, amount: data.amount, category: data.category, notes: data.notes || "" });
    if ("error" in res) { 
      toast.error(String(res.error)); 
      return false;
    }
    toast.success("تم تسجيل المصروف"); 
    setIsModalOpen(false);
    mutateExpenses(); 
    mutateOverview();
    return true; 
  }, [mutateExpenses, mutateOverview]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("تأكيد الحذف؟")) return;
    const res = await deleteExpense(id);
    if ("error" in res) {
      toast.error(String(res.error));
    } else {
      toast.success("تم الحذف"); 
      mutateExpenses(); 
      mutateOverview(); 
    }
  }, [mutateExpenses, mutateOverview]);

  return { 
    expenses: (expensesRes?.data as Expense[]) || [], 
    metadata: (expensesRes?.metadata as PaginationMetadata) || { totalItems: 0, totalPages: 1, currentPage: 1 },
    overview: overview || { totalExpenses: 0, totalPurchases: 0, totalDebts: 0 }, 
    isLoading, isModalOpen, setIsModalOpen, 
    actions: { handleAdd, handleDelete, refresh: () => { mutateExpenses(); mutateOverview(); } } 
  };
}