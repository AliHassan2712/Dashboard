"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { SparePart } from "@prisma/client";
import { getPaginatedParts, addSparePart, updateSparePart, deleteSparePart, sellPartDirectly } from "@/src/server/actions/inventory.actions";
import { SparePartFormValues } from "../validations/validations";

// دالة جلب البيانات مع التقسيم (SWR Fetcher)
const fetcher = async ([_, page, search]: [string, number, string]) => {
  const res = await getPaginatedParts({ page, limit: 12, search, category: "ALL" });
  if (res.error) throw new Error(res.error);
  return res;
};

export function useInventory(currentPage: number, searchQuery: string) {
  // حالات النوافذ (حافظنا عليها كما هي في كودك الأصلي)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);
  const [sellModal, setSellModal] = useState<{ isOpen: boolean; part: SparePart | null }>({ isOpen: false, part: null });

  // السحر هنا: SWR تجلب البيانات وتضعها في الكاش
  const { data, isLoading, mutate } = useSWR(
    ["inventory-data", currentPage, searchQuery], 
    fetcher, 
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const handleSellPart = useCallback(async (sparePartId: string, quantity: number, price: number) => {
    const res = await sellPartDirectly(sparePartId, quantity, price);
    if (res.success) {
      toast.success("تم البيع وخصم القطعة من المخزن بنجاح");
      setSellModal({ isOpen: false, part: null });
      mutate(); // تحديث صامت
      return true;
    } else {
      toast.error(res?.error || "حدث خطأ أثناء البيع");
      return false;
    }
  }, [mutate]);

  const handleSavePart = useCallback(async (data: SparePartFormValues) => {
    let res;
    if (editingPart) {
      res = await updateSparePart(editingPart.id, data);
    } else {
      res = await addSparePart(data);
    }

    if (res.success) {
      toast.success(editingPart ? "تم التعديل بنجاح" : "تمت الإضافة بنجاح");
      setIsModalOpen(false);
      setEditingPart(null);
      mutate();
      return true;
    } else {
      toast.error(res.error || "حدث خطأ أثناء الحفظ");
      return false;
    }
  }, [editingPart, mutate]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف القطعة (${name}) نهائياً؟`)) {
      const res = await deleteSparePart(id);
      if (res.success) {
        toast.success("تم الحذف");
        mutate();
      } else {
        toast.error(res.error || "حدث خطأ أثناء الحذف");
      }
    }
  }, [mutate]);

  const openAddModal = useCallback(() => { setEditingPart(null); setIsModalOpen(true); }, []);
  const openEditModal = useCallback((part: SparePart) => { setEditingPart(part); setIsModalOpen(true); }, []);
  const openSellModal = useCallback((part: SparePart) => { setSellModal({ isOpen: true, part }); }, []);

  return {
    parts: data?.data || [],
    metadata: data?.metadata || { totalPages: 1, currentPage: 1, totalItems: 0 },
    isLoading,
    isModalOpen, setIsModalOpen, editingPart,
    sellModal, setSellModal, 
    actions: { handleSavePart, handleDelete, openAddModal, openEditModal, handleSellPart, openSellModal }
  };
}