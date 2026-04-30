"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { getPaginatedTickets, updateTicket, deleteTicket } from "@/src/server/actions/tickets.actions";
import { TicketListItem } from "@/src/types";
import { UpdateTicketFormValues } from "../validations/validations";

const fetcher = async ([_, page, search, status]: [string, number, string, string]) => {
  const res = await getPaginatedTickets({ page, limit: 10, search, status });
  if ("error" in res) throw new Error(String(res.error));
  return res;
};

export function useTicketsManager(currentPage: number, searchQuery: string, statusFilter: string) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketListItem | null>(null);

  const { data, isLoading, mutate } = useSWR(
    ["tickets-data", currentPage, searchQuery, statusFilter], 
    fetcher, 
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف تذكرة الزبون (${name}) نهائياً؟`)) {
      const res = await deleteTicket(id);
      if ("error" in res) {
        toast.error(String(res.error));
      } else {
        toast.success("تم حذف التذكرة بنجاح");
        mutate();
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
    if ("error" in res) {
      toast.error(String(res.error));
      return false;
    }
    toast.success("تم التعديل بنجاح");
    setIsEditModalOpen(false);
    setEditingTicket(null);
    mutate();
    return true;
  }, [editingTicket, mutate]);

  return {
    tickets: (data?.data as TicketListItem[]) || [],
    metadata: data?.metadata || { totalPages: 1, currentPage: 1, totalItems: 0 },
    isLoading, isEditModalOpen, setIsEditModalOpen, editingTicket, openEditModal, handleEditSubmit, handleDelete
  };
}