"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getSpareParts, createSparePart, updateSparePart, deleteSparePart } from "../actions";
import { SparePart } from "@prisma/client"; //  استيراد النوع الجاهز من قاعدة البيانات

export function useInventory() {
  //  تحديد نوع المصفوفة بشكل دقيق
  const [parts, setParts] = useState<SparePart[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // حالات المودال (النافذة المنبثقة)
  const [isModalOpen, setIsModalOpen] = useState(false);
  //  تحديد أن القطعة إما أن تكون من نوع SparePart أو null
  const [editingPart, setEditingPart] = useState<SparePart | null>(null); 
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const result = await getSpareParts();
    setParts((result?.data as SparePart[]) || []);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // فلترة ذكية
  const filteredParts = parts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // الأكشنز
  const handleSave = async (formData: any) => { 
    setIsSaving(true);
    const result = editingPart 
      ? await updateSparePart(editingPart.id, formData) 
      : await createSparePart(formData);
    
    if (result.success) {
      toast.success(editingPart ? "تم التحديث بنجاح" : "تمت الإضافة بنجاح");
      setIsModalOpen(false);
      loadData();
    } else {
      toast.error(result.error as string);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه القطعة؟")) return;
    const result = await deleteSparePart(id);
    if (result.success) {
      toast.success("تم الحذف بنجاح");
      loadData();
    } else {
      toast.error(result.error as string);
    }
  };

  const openModal = (part: SparePart | null = null) => {
    setEditingPart(part);
    setIsModalOpen(true);
  };

  return {
    parts: filteredParts, isLoading, searchTerm, setSearchTerm,
    isModalOpen, setIsModalOpen, editingPart, isSaving,
    actions: { handleSave, handleDelete, openModal }
  };
}