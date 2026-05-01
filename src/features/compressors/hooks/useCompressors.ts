"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { Compressor } from "@prisma/client";
import { getPaginatedCompressors, addCompressor, updateCompressorStatus, deleteCompressor } from "@/src/server/actions/compressors.actions";
import { getAllSparePartsForDropdown } from "@/src/server/actions/inventory.actions"; 
import { CompressorFormValues } from "../validations/validations";
import { PaginationMetadata, SparePartDropdownOption } from "@/src/types/expense.types";

const compressorsFetcher = async ([_, page, search]: [string, number, string]) => {
  const res = await getPaginatedCompressors(page, 9, search);
  if ("error" in res) throw new Error(String(res.error));
  return res;
};

// 💡 إضافة Fetcher مخصص للقائمة المنسدلة لمعالجة نوع الخطأ
const partsFetcher = async () => {
  const res = await getAllSparePartsForDropdown();
  if ("error" in res) throw new Error(String(res.error));
  return res.data;
};

export function useCompressors(currentPage: number, searchQuery: string) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: compRes, isLoading, mutate: mutateCompressors } = useSWR(
    ["compressors-list", currentPage, searchQuery], 
    compressorsFetcher, 
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const { data: inventory } = useSWR("parts-dropdown", partsFetcher, { revalidateOnFocus: false });

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

    if ("error" in res) {
      toast.error(String(res.error));
      return false;
    }
    
    toast.success("تمت إضافة الكمبريسور للمخزون وخصم القطع بنجاح");
    setIsModalOpen(false); 
    mutateCompressors(); 
    return true;           
  }, [mutateCompressors]);

  const handleStatusChange = useCallback(async (id: string, status: string) => {
    const res = await updateCompressorStatus(id, status);
    if ("error" in res) {
      toast.error(String(res.error));
    } else {
      toast.success("تم تحديث الحالة");
      mutateCompressors();
    }
  }, [mutateCompressors]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const res = await deleteCompressor(id);
    if ("error" in res) {
      toast.error(String(res.error));
    } else {
      toast.success("تم الحذف");
      mutateCompressors();
    }
  }, [mutateCompressors]);

  return { 
    compressors: (compRes?.data as Compressor[]) || [],
    metadata: (compRes?.metadata as PaginationMetadata) || { totalItems: 0, totalPages: 1, currentPage: 1 },
    inventory: (inventory as SparePartDropdownOption[]) || [], 
    isLoading, 
    isModalOpen, 
    setIsModalOpen, 
    fetchData: mutateCompressors, 
    actions: { handleAdd, handleStatusChange, handleDelete } 
  };
}