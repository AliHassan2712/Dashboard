"use client";

import { useState, useMemo, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { deleteTicket, updateTicket } from "@/src/server/actions/tickets.actions";
import { TicketListItem, UpdateTicketInput } from "@/src/types";

export function useTicketsManager(initialTickets: TicketListItem[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketListItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. نظام البحث (يحدث تلقائياً عند الكتابة)
  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return initialTickets;
    const query = searchQuery.toLowerCase();
    return initialTickets.filter(t => 
      t.customerName.toLowerCase().includes(query) ||
      t.customerPhone.includes(query) ||
      t.id.toLowerCase().includes(query) ||
      (t.compressorModel && t.compressorModel.toLowerCase().includes(query))
    );
  }, [initialTickets, searchQuery]);

  // 2. الحذف
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف تذكرة الزبون (${name}) نهائياً؟`)) {
      const res = await deleteTicket(id);
      if (res.success) {
        toast.success("تم حذف التذكرة بنجاح");
      } else {
        toast.error(res.error || "خطأ في الحذف");
      }
    }
  };

  // 3. فتح نافذة التعديل
  const openEditModal = (ticket: TicketListItem) => {
    setEditingTicket(ticket);
    setIsEditModalOpen(true);
  };

  // 4. حفظ التعديلات
  const handleEditSubmit = async (e: FormEvent, formData: UpdateTicketInput) => {
    e.preventDefault();
    if (!editingTicket) return;
    
    setIsSubmitting(true);
    const res = await updateTicket(editingTicket.id, formData);
    
    if (res.success) {
      toast.success("تم تعديل بيانات التذكرة بنجاح");
      setIsEditModalOpen(false);
      setEditingTicket(null);
    } else {
      toast.error(res.error || "خطأ في التعديل");
    }
    setIsSubmitting(false);
  };

  return {
    searchQuery, setSearchQuery,
    filteredTickets,
    handleDelete,
    isEditModalOpen, setIsEditModalOpen,
    editingTicket, openEditModal,
    handleEditSubmit, isSubmitting
  };
}