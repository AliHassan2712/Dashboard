"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getAllSparePartsForDropdown } from "@/src/server/actions/inventory.actions";
import { getWorkersWithBalance } from "@/src/server/actions/workers.actions";
import { TrialItemData, WorkerOption, PartOption } from "@/src/types";
import { getTrialItems, createTrialItem, returnTrialItem, consumeTrialItem } from "@/src/server/actions/trials.actions";
import { TrialFormValues } from "../validations/validations";

export function useTrials() {
  const [trials, setTrials] = useState<TrialItemData[]>([]);
  const [workers, setWorkers] = useState<WorkerOption[]>([]);
  const [parts, setParts] = useState<PartOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const [trialsRes, workersRes, partsRes] = await Promise.all([
      getTrialItems(), getWorkersWithBalance(), getAllSparePartsForDropdown()
    ]);
    if (trialsRes.success && trialsRes.data) setTrials(trialsRes.data as TrialItemData[]);
    if (workersRes) setWorkers(workersRes as WorkerOption[]);
    if (partsRes.success && partsRes.data) setParts(partsRes.data as PartOption[]);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddTrial = async (data: TrialFormValues) => {
    const res = await createTrialItem({
      workerId: data.workerId,
      sparePartId: data.sparePartId,
      qty: data.qty,
      notes: data.notes || ""
    });

    if (res.success) {
      toast.success("تم تسليم العهدة بنجاح وخصمها من المخزن");
      setIsModalOpen(false);
      fetchData();
      return true; // لإخبار النافذة بتصفير الحقول
    }
    toast.error(res.error || "خطأ");
    return false;
  };

  const handleReturn = async (id: string) => {
    if (!confirm("هل أنت متأكد من إرجاع هذه القطعة للمخزن؟")) return;
    const res = await returnTrialItem(id);
    if (res.success) { toast.success("تم إرجاع القطعة للمخزن"); fetchData(); }
    else toast.error(res.error || "خطأ");
  };

  const handleConsume = async (id: string) => {
    if (!confirm("هل تم استهلاك/تلف هذه القطعة نهائياً؟ (لن تعود للمخزن)")) return;
    const res = await consumeTrialItem(id);
    if (res.success) { toast.success("تم تسجيل الاستهلاك"); fetchData(); }
    else toast.error(res.error || "خطأ");
  };
  return {
    trials, workers, parts, isLoading,
    isModalOpen, setIsModalOpen,
    actions: { handleAddTrial, handleReturn, handleConsume }
  };
}
