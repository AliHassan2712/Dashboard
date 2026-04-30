"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { getAllSparePartsForDropdown } from "@/src/server/actions/inventory.actions";
import { getWorkersWithBalance } from "@/src/server/actions/workers.actions";
import { TrialItemData, WorkerOption, PartOption } from "@/src/types";
import { getPaginatedTrialItems, createTrialItem, returnTrialItem, consumeTrialItem } from "@/src/server/actions/trials.actions";
import { TrialFormValues } from "../validations/validations";
import { PaginationMetadata, SparePartDropdownOption } from "@/src/types/expense.types";

const trialsFetcher = async (page: number) => {
  const res = await getPaginatedTrialItems(page, 10);
  if (res.error) throw new Error(res.error);
  return res;
};

export function useTrials(currentPage: number) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // جلب البيانات مع التقسيم والتكييش
  const { data: trialsRes, isLoading, mutate: mutateTrials } = useSWR(["trials-list", currentPage], () => trialsFetcher(currentPage), { keepPreviousData: true });
  const { data: workersRes } = useSWR("workers-list", getWorkersWithBalance, { revalidateOnFocus: false });
  const { data: partsRes } = useSWR("parts-dropdown", getAllSparePartsForDropdown, { revalidateOnFocus: false });

  const handleAddTrial = useCallback(async (data: TrialFormValues) => {
    const res = await createTrialItem({
      workerId: data.workerId,
      sparePartId: data.sparePartId,
      qty: data.qty,
      notes: data.notes || ""
    });

    if (res.success) {
      toast.success("تم تسليم العهدة بنجاح وخصمها من المخزن");
      setIsModalOpen(false);
      mutateTrials(); 
      return true; 
    }
    toast.error(res.error || "خطأ");
    return false;
  }, [mutateTrials]);

  const handleReturn = useCallback(async (id: string) => {
    if (!confirm("هل أنت متأكد من إرجاع هذه القطعة للمخزن؟")) return;
    const res = await returnTrialItem(id);
    if (res.success) { toast.success("تم إرجاع القطعة للمخزن"); mutateTrials(); }
    else toast.error(res.error || "خطأ");
  }, [mutateTrials]);

  const handleConsume = useCallback(async (id: string) => {
    if (!confirm("هل تم استهلاك/تلف هذه القطعة نهائياً؟ (لن تعود للمخزن)")) return;
    const res = await consumeTrialItem(id);
    if (res.success) { toast.success("تم تسجيل الاستهلاك"); mutateTrials(); }
    else toast.error(res.error || "خطأ");
  }, [mutateTrials]);

  return {
    trials: (trialsRes?.data as TrialItemData[]) || [], 
    metadata: (trialsRes?.metadata as PaginationMetadata) || { totalItems: 0, totalPages: 1, currentPage: 1 },
    workers: (workersRes as unknown as WorkerOption[]) || [], 
    parts: (partsRes?.data as SparePartDropdownOption[]) || [], 
    isLoading,
    isModalOpen, 
    setIsModalOpen,
    actions: { handleAddTrial, handleReturn, handleConsume }
  };
}