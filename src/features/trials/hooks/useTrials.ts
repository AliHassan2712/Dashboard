"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { getAllSparePartsForDropdown } from "@/src/server/actions/inventory.actions";
import { getWorkersWithBalance } from "@/src/server/actions/workers.actions";
import { TrialItemData, WorkerOption } from "@/src/types";
import { getPaginatedTrialItems, createTrialItem, returnTrialItem, consumeTrialItem } from "@/src/server/actions/trials.actions";
import { TrialFormValues } from "../validations/validations";
import { PaginationMetadata, SparePartDropdownOption } from "@/src/types/expense.types";

const trialsFetcher = async (page: number) => {
  const res = await getPaginatedTrialItems(page, 10);
  if ("error" in res) throw new Error(String(res.error));
  return res;
};

// 💡 إضافة Fetcher مخصص لقطع الغيار
const partsFetcher = async () => {
  const res = await getAllSparePartsForDropdown();
  if ("error" in res) throw new Error(String(res.error));
  return res.data;
};

// 💡 إضافة Fetcher مخصص للعمال
const workersFetcher = async () => {
  const res = await getWorkersWithBalance();
  // التأكد من عدم وجود خطأ (في حال تم إرجاعه ككائن بدل مصفوفة)
  if (!Array.isArray(res) && (res as any).error) throw new Error(String((res as any).error));
  return Array.isArray(res) ? res : [];
};

export function useTrials(currentPage: number) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: trialsRes, isLoading, mutate: mutateTrials } = useSWR(["trials-list", currentPage], () => trialsFetcher(currentPage), { keepPreviousData: true });
  // استخدام الـ Fetchers المخصصة
  const { data: workersRes } = useSWR("workers-list", workersFetcher, { revalidateOnFocus: false });
  const { data: partsRes } = useSWR("parts-dropdown", partsFetcher, { revalidateOnFocus: false });

  const handleAddTrial = useCallback(async (data: TrialFormValues) => {
    const res = await createTrialItem({
      workerId: data.workerId, sparePartId: data.sparePartId, qty: data.qty, notes: data.notes || ""
    });
    if ("error" in res) {
      toast.error(String(res.error));
      return false;
    }
    toast.success("تم تسليم العهدة بنجاح وخصمها من المخزن");
    setIsModalOpen(false);
    mutateTrials(); 
    return true; 
  }, [mutateTrials]);

  const handleReturn = useCallback(async (id: string) => {
    if (!confirm("هل أنت متأكد من إرجاع هذه القطعة للمخزن؟")) return;
    const res = await returnTrialItem(id);
    if ("error" in res) toast.error(String(res.error));
    else { toast.success("تم إرجاع القطعة للمخزن"); mutateTrials(); }
  }, [mutateTrials]);

  const handleConsume = useCallback(async (id: string) => {
    if (!confirm("هل تم استهلاك/تلف هذه القطعة نهائياً؟ (لن تعود للمخزن)")) return;
    const res = await consumeTrialItem(id);
    if ("error" in res) toast.error(String(res.error));
    else { toast.success("تم تسجيل الاستهلاك"); mutateTrials(); }
  }, [mutateTrials]);

  return {
    trials: (trialsRes?.data as TrialItemData[]) || [], 
    metadata: (trialsRes?.metadata as PaginationMetadata) || { totalItems: 0, totalPages: 1, currentPage: 1 },
    workers: (workersRes as WorkerOption[]) || [], 
    parts: (partsRes as SparePartDropdownOption[]) || [], 
    isLoading, isModalOpen, setIsModalOpen,
    actions: { handleAddTrial, handleReturn, handleConsume }
  };
}