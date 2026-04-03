"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getTrialItems, createTrialItem, returnTrialItem, consumeTrialItem } from "../actions";
import { getAllSparePartsForDropdown } from "../../inventory/actions";
import { getWorkersWithBalance } from "../../workers/actions";

export function useTrials() {
  const [trials, setTrials] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ workerId: "", sparePartId: "", qty: "1", notes: "" });

  const fetchData = async () => {
    setIsLoading(true);
    const [trialsRes, workersRes, partsRes] = await Promise.all([
      getTrialItems(), getWorkersWithBalance(), getAllSparePartsForDropdown()
    ]);
    if (trialsRes.success) setTrials(trialsRes.data || []);
    if (workersRes) setWorkers(workersRes);
    if (partsRes.success) setParts(partsRes.data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createTrialItem({
      workerId: formData.workerId,
      sparePartId: formData.sparePartId,
      qty: Number(formData.qty),
      notes: formData.notes
    });

    if (res.success) {
      toast.success("تم تسليم العهدة بنجاح وخصمها من المخزن");
      setIsModalOpen(false);
      setFormData({ workerId: "", sparePartId: "", qty: "1", notes: "" });
      fetchData();
    } else toast.error(res.error || "خطأ");
    setIsSubmitting(false);
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
    formData, setFormData, isSubmitting, 
    actions: { handleAddTrial, handleReturn, handleConsume } 
  };
}