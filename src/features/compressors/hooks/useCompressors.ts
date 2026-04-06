"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { Compressor } from "@prisma/client"; 
import { CompressorFormData } from "@/src/types"; 
import { getCompressors, addCompressor, updateCompressorStatus, deleteCompressor } from "@/src/server/actions/compressors.actions";

export function useCompressors() {
  const [compressors, setCompressors] = useState<Compressor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CompressorFormData>({
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
      setCompressors((res.data as Compressor[]) || []);
    } else {
      toast.error(res.error || "خطأ في الجلب");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const res = await addCompressor({
      modelName: formData.model, 
      serialNumber: formData.serialNumber.trim() || undefined,
      productionCost: Number(formData.buildCost), 
      sellingPrice: Number(formData.sellingPrice),
      description: formData.description,
      imageUrl: formData.imageUrl || undefined
    });

    if (res.success) {
      toast.success("تمت إضافة الكمبريسور للمخزون");
      setIsModalOpen(false);
      setFormData({ serialNumber: "", model: "", buildCost: "", sellingPrice: "", description: "", imageUrl: "" });
      await fetchData(); 
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
    } else {
      toast.error(res.error || "فشل التحديث");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const res = await deleteCompressor(id);
    if (res.success) {
      toast.success("تم الحذف");
      await fetchData();
    } else {
      toast.error(res.error || "فشل الحذف");
    }
  };

  return { 
    compressors, isLoading, isModalOpen, setIsModalOpen, 
    formData, setFormData, isSubmitting, fetchData,
    actions: { handleAdd, handleStatusChange, handleDelete } 
  };
}