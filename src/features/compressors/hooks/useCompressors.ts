"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { getCompressors, addCompressor, updateCompressorStatus, deleteCompressor } from "../actions";

export function useCompressors() {
  const [compressors, setCompressors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    serialNumber: "",
    model: "",
    buildCost: "",
    sellingPrice: "",
    description: "",
    imageUrl: ""
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const res = await getCompressors();
    if (res.success) {
      setCompressors(res.data || []);
    } else {
      toast.error(res.error || "خطأ في الجلب");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const res = await addCompressor({
      modelName: formData.model, // الربط مع modelName في السكيما
      serialNumber: formData.serialNumber.trim() || undefined,
      productionCost: Number(formData.buildCost), // الربط مع productionCost في السكيما
      sellingPrice: Number(formData.sellingPrice),
      description: formData.description
    });

    if (res.success) {
      toast.success("تمت إضافة الكمبريسور للمخزون");
      setIsModalOpen(false);
      setFormData({ serialNumber: "", model: "", buildCost: "", sellingPrice: "", description: "", imageUrl: "" });
      await fetchData(); // تحديث فوري
    } else {
      toast.error(res.error || "خطأ");
    }
    setIsSubmitting(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const res = await updateCompressorStatus(id, status);
    if (res.success) {
      toast.success("تم تحديث الحالة");
      await fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const res = await deleteCompressor(id);
    if (res.success) {
      toast.success("تم الحذف");
      await fetchData();
    }
  };

  return { 
    compressors, isLoading, isModalOpen, setIsModalOpen, 
    formData, setFormData, isSubmitting, fetchData,
    actions: { handleAdd, handleStatusChange, handleDelete } 
  };
}