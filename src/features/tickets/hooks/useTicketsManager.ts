"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { getPaginatedTickets, updateTicket, deleteTicket } from "@/src/server/actions/tickets.actions";
import { TicketListItem } from "@/src/types";
import { UpdateTicketFormValues } from "../validations/validations";

// دالة الجلب التي تعتمد عليها SWR
const fetcher = async ([_, page, search, status]: [string, number, string, string]) => {
  const res = await getPaginatedTickets({ page, limit: 10, search, status });
  if (res.error) throw new Error(res.error);
  return res;
};

export function useTicketsManager(currentPage: number, searchQuery: string, statusFilter: string) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketListItem | null>(null);

  //  SWR تجلب البيانات، تكيسها، وتعيد التحميل صامتاً في الخلفية
  const { data, isLoading, mutate } = useSWR(
    ["tickets-data", currentPage, searchQuery, statusFilter], 
    fetcher, 
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  // استخدمنا useCallback لمنع React من إعادة إنشاء الدالة في كل مرة مما يسرع الأداء
  const handleDelete = useCallback(async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف تذكرة الزبون (${name}) نهائياً؟`)) {
      const res = await deleteTicket(id);
      if (res.success) {
        toast.success("تم حذف التذكرة بنجاح");
        mutate(); // تحديث الجدول فوراً بدون Refresh للصفحة
      } else {
        toast.error(res.error || "خطأ في الحذف");
      }
    }
  }, [mutate]);

  const openEditModal = useCallback((ticket: TicketListItem) => {
    setEditingTicket(ticket);
    setIsEditModalOpen(true);
  }, []);

  const handleEditSubmit = useCallback(async (formData: UpdateTicketFormValues) => {
    if (!editingTicket) return false;
    const res = await updateTicket(editingTicket.id, formData);
    if (res.success) {
      toast.success("تم التعديل بنجاح");
      setIsEditModalOpen(false);
      setEditingTicket(null);
      mutate();
      return true;
    }
    toast.error(res.error || "خطأ في التعديل");
    return false;
  }, [editingTicket, mutate]);

  return {
    tickets: data?.data || [],
    metadata: data?.metadata || { totalPages: 1, currentPage: 1, totalItems: 0 },
    isLoading,
    isEditModalOpen, setIsEditModalOpen, editingTicket, openEditModal, handleEditSubmit, handleDelete
  };
}