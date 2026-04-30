"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { Compressor } from "@prisma/client";
import { getPaginatedCompressors, addCompressor, updateCompressorStatus, deleteCompressor } from "@/src/server/actions/compressors.actions";
import { getAllSparePartsForDropdown } from "@/src/server/actions/inventory.actions"; 
import { CompressorFormValues } from "../validations/validations";
import { PaginationMetadata, SparePartDropdownOption } from "@/src/types/expense.types";

// دالة الجلب المخصصة لـ SWR
const compressorsFetcher = async ([_, page, search]: [string, number, string]) => {
  const res = await getPaginatedCompressors(page, 9, search); // 9 أجهزة لكل صفحة لتناسب الـ Grid
  if (res.error) throw new Error(res.error);
  return res;
};

export function useCompressors(currentPage: number, searchQuery: string) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // جلب الكمبريسورات المفلترة والمقسمة
  const { data: compRes, isLoading, mutate: mutateCompressors } = useSWR(
    ["compressors-list", currentPage, searchQuery], 
    compressorsFetcher, 
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  // جلب قطع الغيار للقائمة المنسدلة بدون any
  const { data: invRes } = useSWR("parts-dropdown", getAllSparePartsForDropdown, { revalidateOnFocus: false });

  const handleAdd = useCallback(async (data: CompressorFormValues) => {
    const res = await addCompressor({
      modelName: data.modelName, 
      serialNumber: data.serialNumber?.trim() || undefined,
      productionCost: data.productionCost, 
      sellingPrice: data.sellingPrice,
      description: data.description,
      imageUrl: data.imageUrl,
      parts: data.parts || [] 
    });

    if (res.success) {
      toast.success("تمت إضافة الكمبريسور للمخزون وخصم القطع بنجاح");
      setIsModalOpen(false); 
      mutateCompressors(); 
      return true;           
    } else {
      toast.error(res.error || "فشل الإضافة");
      return false;
    }
  }, [mutateCompressors]);

  const handleStatusChange = useCallback(async (id: string, status: string) => {
    const res = await updateCompressorStatus(id, status);
    if (res.success) {
      toast.success("تم تحديث الحالة");
      mutateCompressors();
    } else {
      toast.error(res.error || "فشل التحديث");
    }
  }, [mutateCompressors]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const res = await deleteCompressor(id);
    if (res.success) {
      toast.success("تم الحذف");
      mutateCompressors();
    } else {
      toast.error(res.error || "فشل الحذف");
    }
  }, [mutateCompressors]);

  return { 
    compressors: (compRes?.data as Compressor[]) || [],
    metadata: (compRes?.metadata as PaginationMetadata) || { totalItems: 0, totalPages: 1, currentPage: 1 },
    inventory: (invRes?.data as SparePartDropdownOption[]) || [], 
    isLoading, 
    isModalOpen, 
    setIsModalOpen, 
    fetchData: mutateCompressors, 
    actions: { handleAdd, handleStatusChange, handleDelete } 
  };
}