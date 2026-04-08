"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Expense } from "@prisma/client";
import { FinancialOverview } from "@/src/types";
import { getExpenses, addExpense, deleteExpense, getFinancialOverview } from "@/src/server/actions/expenses.actions";
import { ExpenseFormValues } from "../validations/validations";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [overview, setOverview] = useState<FinancialOverview>({ totalExpenses: 0, totalPurchases: 0, totalDebts: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const [expRes, ovRes] = await Promise.all([getExpenses(), getFinancialOverview()]);
    if (expRes.success) setExpenses((expRes.data as Expense[]) || []);
    if (ovRes.success) setOverview(ovRes.data as FinancialOverview);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async (data: ExpenseFormValues) => {
    const res = await addExpense({ title: data.title, amount: data.amount, category: data.category, notes: data.notes || "" });
    if (res.success) { 
      toast.success("تم تسجيل المصروف"); 
      setIsModalOpen(false);
      fetchData(); 
      return true; 
    }
    toast.error(res.error || "خطأ في التسجيل"); 
    return false;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("تأكيد الحذف؟")) return;
    const res = await deleteExpense(id);
    if (res.success) { toast.success("تم الحذف"); fetchData(); }
  };

  return { expenses, overview, isLoading, isModalOpen, setIsModalOpen, actions: { handleAdd, handleDelete, refresh: fetchData } };
}