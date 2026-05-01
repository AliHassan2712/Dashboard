"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { SparePart } from "@prisma/client";
import { getPaginatedParts, addSparePart, updateSparePart, deleteSparePart, sellPartDirectly } from "@/src/server/actions/inventory.actions";
import { SparePartFormValues } from "../validations/validations";

const fetcher = async ([_, page, search]: [string, number, string]) => {
  const res = await getPaginatedParts({ page, limit: 12, search, category: "ALL" });
  if ("error" in res) throw new Error(String(res.error));
  return res;
};

export function useInventory(currentPage: number, searchQuery: string) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);
  const [sellModal, setSellModal] = useState<{ isOpen: boolean; part: SparePart | null }>({ isOpen: false, part: null });

  const { data, isLoading, mutate } = useSWR(
    ["inventory-data", currentPage, searchQuery], 
    fetcher, 
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const handleSellPart = useCallback(async (sparePartId: string, quantity: number, price: number) => {
    const res = await sellPartDirectly(sparePartId, quantity, price);
    if ("error" in res) {
      toast.error(String(res.error));
      return false;
    }
    toast.success("تم البيع وخصم القطعة من المخزن بنجاح");
    setSellModal({ isOpen: false, part: null });
    mutate(); 
    return true;
  }, [mutate]);

  const handleSavePart = useCallback(async (data: SparePartFormValues) => {
    const res = editingPart ? await updateSparePart(editingPart.id, data) : await addSparePart(data);
    if ("error" in res) {
      toast.error(String(res.error));
      return false;
    }
    toast.success(editingPart ? "تم التعديل بنجاح" : "تمت الإضافة بنجاح");
    setIsModalOpen(false);
    setEditingPart(null);
    mutate();
    return true;
  }, [editingPart, mutate]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف القطعة (${name}) نهائياً؟`)) {
      const res = await deleteSparePart(id);
      if ("error" in res) {
        toast.error(String(res.error));
      } else {
        toast.success("تم الحذف");
        mutate();
      }
    }
  }, [mutate]);

  const openAddModal = useCallback(() => { setEditingPart(null); setIsModalOpen(true); }, []);
  const openEditModal = useCallback((part: SparePart) => { setEditingPart(part); setIsModalOpen(true); }, []);
  const openSellModal = useCallback((part: SparePart) => { setSellModal({ isOpen: true, part }); }, []);

  return {
    parts: data?.data || [],
    metadata: data?.metadata || { totalPages: 1, currentPage: 1, totalItems: 0 },
    isLoading, isModalOpen, setIsModalOpen, editingPart, sellModal, setSellModal, 
    actions: { handleSavePart, handleDelete, openAddModal, openEditModal, handleSellPart, openSellModal }
  };
}